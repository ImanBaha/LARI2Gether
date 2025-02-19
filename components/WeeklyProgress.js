import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Animated,
} from 'react-native';
import * as Progress from 'react-native-progress';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');



const ProgressCard = ({ progress, goal, label, color, icon }) => {
  // Ensure progress and goal are valid numbers, defaulting to 0 if not
  const safeProgress = isNaN(progress) ? 0 : progress;
  const safeGoal = isNaN(goal) || goal <= 0 ? 1 : goal; // Prevent division by zero
  
  // Calculate percentage safely
  const percentage = Math.min((safeProgress / safeGoal) * 100, 100).toFixed(1);
  const [scaleValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.progressCard,
        {
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name={icon} size={24} color={color} />
          <Text style={styles.progressCardLabel}>{label}</Text>
        </View>
        <Progress.Circle
          size={160}
          progress={safeProgress / safeGoal}
          color={color}
          unfilledColor="#E8EDF1"
          borderWidth={0}
          thickness={12}
          showsText
          formatText={() => `${percentage}%`}
          textStyle={[styles.progressText, { color }]}
          strokeCap="round"
        />
        <View style={styles.statsContainer}>
          <Text style={styles.progressStats}>
            <Text style={[styles.currentProgress, { color }]}>
              {safeProgress.toFixed(1)}
            </Text>
            <Text style={styles.statsLabel}> / {safeGoal.toFixed(1)} km</Text>
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const WeeklyProgress = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [goalDistance, setGoalDistance] = useState(10); // Set a default goal
  const [tempGoal, setTempGoal] = useState('');
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Function to get the start of week date
  const getStartOfWeek = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0); // Reset time to start of day
    startOfWeek.setDate(now.getDate() - now.getDay()); // Go to Sunday
    return startOfWeek.toISOString();
  };

  // Function to get the start of month date
  const getStartOfMonth = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    return startOfMonth.toISOString();
  };


  // Update fetchWeeklyData to handle empty data
  const fetchWeeklyData = async () => {
    try {
      const startOfWeek = getStartOfWeek();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No authenticated user found');
        return 0;
      }

      const { data: weekData, error: weekError } = await supabase
        .from('runs')
        .select('distance, created_at')
        .eq('userid', user.id)
        .gte('created_at', startOfWeek)
        .order('created_at', { ascending: false });

      if (weekError) {
        console.error('Error fetching weekly distance:', weekError.message);
        return 0;
      }

      if (weekData && weekData.length > 0) {
        const weeklyTotal = weekData.reduce((sum, run) => {
          const distance = parseFloat(run.distance) || 0;
          return sum + distance;
        }, 0);
        return weeklyTotal;
      }

      return 0;
    } catch (error) {
      console.error("Error in fetchWeeklyData:", error);
      return 0;
    }
  };

  // Update fetchMonthlyData to handle empty data
  const fetchMonthlyData = async () => {
    try {
      const startOfMonth = getStartOfMonth();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No authenticated user found');
        return 0;
      }

      const { data: monthData, error: monthError } = await supabase
        .from('runs')
        .select('distance')
        .eq('userid', user.id)
        .gte('created_at', startOfMonth);

      if (monthError) {
        console.error('Error fetching monthly distance:', monthError.message);
        return 0;
      }

      if (monthData && monthData.length > 0) {
        const monthlyTotal = monthData.reduce((sum, run) => {
          const distance = parseFloat(run.distance) || 0;
          return sum + distance;
        }, 0);
        return monthlyTotal;
      }

      return 0;
    } catch (error) {
      console.error("Error in fetchMonthlyData:", error);
      return 0;
    }
  };

   // Update loadGoalAndDistances to handle initial goal
   const loadGoalAndDistances = async () => {
    setIsLoading(true);
    try {
      // Load goal from AsyncStorage with default value
      const savedGoal = await AsyncStorage.getItem('goalDistance');
      const initialGoal = savedGoal !== null ? Number(savedGoal) : 10;
      setGoalDistance(initialGoal);
      setTempGoal(initialGoal.toString());

      // Fetch weekly and monthly data
      const [weeklyTotal, monthlyTotal] = await Promise.all([
        fetchWeeklyData(),
        fetchMonthlyData()
      ]);

      setWeeklyProgress(weeklyTotal || 0);
      setTotalDistance(monthlyTotal || 0);
      setLastRefresh(new Date());

    } catch (error) {
      console.error("Error loading data:", error);
      // Set default values in case of error
      setGoalDistance(10);
      setWeeklyProgress(0);
      setTotalDistance(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadGoalAndDistances();
  }, []);

  // Set up real-time subscription to runs table
  useEffect(() => {
    const subscription = supabase
      .channel('runs_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'runs' 
        }, 
        () => {
          loadGoalAndDistances();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Add a refresh function
  const handleRefresh = () => {
    loadGoalAndDistances();
  };

  const handleSetGoal = async () => {
    const newGoal = parseFloat(tempGoal);
    if (isNaN(newGoal) || newGoal <= 0) {
      alert("Please enter a valid distance goal.");
      return;
    }

    try {
      await AsyncStorage.setItem('goalDistance', newGoal.toString());
      setGoalDistance(newGoal);
      setShowGoalInput(false);
      alert(`Monthly goal updated to ${newGoal} km`);
    } catch (error) {
      console.error("Failed to save goal", error);
      alert("Failed to save goal. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Progress.Circle size={50} indeterminate color="#FFAC1C" />
      </View>
    );
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Running Progress</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
          >
            <MaterialCommunityIcons 
              name="refresh" 
              size={24} 
              color="#FFAC1C" 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setShowGoalInput(!showGoalInput)}
          >
            <MaterialCommunityIcons 
              name="pencil-circle" 
              size={28} 
              color="#FFAC1C" 
            />
          </TouchableOpacity>
        </View>
      </View>

      {showGoalInput && (
        <View style={styles.goalInputContainer}>
          <TextInput
            style={styles.goalInput}
            value={tempGoal}
            keyboardType="numeric"
            placeholder="Enter monthly goal (km)"
            onChangeText={setTempGoal}
            placeholderTextColor="#FFAC1C"
          />
          <TouchableOpacity 
            style={styles.setGoalButton}
            onPress={handleSetGoal}
          >
            <Text style={styles.setGoalButtonText}>Set Goal</Text>
          </TouchableOpacity>
        </View>
      )}

      <ProgressCard
        progress={totalDistance}
        goal={goalDistance}
        label="Monthly Distance"
        color="#4A90E2"
        icon="run-fast"
      />

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="timer-outline" size={24} color="#FFAC1C" />
          <Text style={styles.statLabel}>Weekly Progress</Text>
          <Text style={styles.statValue}>{weeklyProgress.toFixed(1)} km</Text>
          <Text style={styles.lastUpdated}>
            Last updated: {lastRefresh.toLocaleTimeString()}
          </Text>
        </View>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="trophy-outline" size={24} color="#FFAC1C" />
          <Text style={styles.statLabel}>Monthly Goal</Text>
          <Text style={styles.statValue}>{goalDistance.toFixed(1)} km</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    marginBottom:82,
    bottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    letterSpacing: 0.5,
  }, 
  progressCard: {
    marginBottom: 5,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardGradient: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressCardLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A2138',
    marginLeft: 8,
  },
  progressText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    marginTop: 13,
    alignItems: 'center',
  },
  progressStats: {
    fontSize: 16,
  },
  currentProgress: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statsLabel: {
    color: '#8895A7',
    fontSize: 16,
  },
  goalInputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  goalInput: {
    fontSize: 16,
    borderColor: '#E8EDF1',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: '#1A2138',
  },
  setGoalButton: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  setGoalButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: (width - 56) / 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statLabel: {
    color: '#8895A7',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    color: '#1A2138',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  refreshButton: {
    padding: 4,
  },
  lastUpdated: {
    fontSize: 10,
    color: '#8895A7',
    marginTop: 4,
  },
});

export default WeeklyProgress;