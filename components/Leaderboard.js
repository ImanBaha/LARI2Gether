import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  SafeAreaView,
  Animated,
  TouchableOpacity,
  Pressable
} from 'react-native';
import { supabase } from '../lib/supabase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

export default function TopThreeLeaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fadeAnim = new Animated.Value(0);
  const navigation = useNavigation();
  
  useEffect(() => {
    loadLeaderboardData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading]);

  const loadLeaderboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('runs')
        .select(`
          distance,
          profiles:userid (
            username,
            id
          )
        `);

      if (error) throw error;

      // Check if data exists and is not empty
      if (!data || data.length === 0) {
        setLeaderboardData([]);
        return;
      }

      const userTotals = data.reduce((acc, run) => {
        // Validate that run and required properties exist
        if (!run || !run.profiles || !run.distance) return acc;

        const userId = run.profiles.id;
        const username = run.profiles.username;
        
        // Skip invalid entries
        if (!userId) return acc;
        
        if (!acc[userId]) {
          acc[userId] = {
            userid: userId,
            username: username || 'Anonymous User',
            totalDistance: 0,
            runCount: 0,
          };
        }

        // Ensure distance is a valid number
        const distance = parseFloat(run.distance);
        if (!isNaN(distance)) {
          acc[userId].totalDistance += distance;
          acc[userId].runCount += 1;
        }
        
        return acc;
      }, {});

      const sortedData = Object.values(userTotals)
        .filter(user => user.runCount > 0) // Only include users with valid runs
        .sort((a, b) => b.totalDistance - a.totalDistance)
        .map((user, index) => ({
          ...user,
          rank: index + 1,
          totalDistance: Math.round(user.totalDistance * 100) / 100,
        }))
        .slice(0, 3); // Only take top 3

      setLeaderboardData(sortedData);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
      setError('Failed to load leaderboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Top Runners</Text>
      <TouchableOpacity 
        onPress={() => navigation.navigate('ViewLeaderboard')}
        style={styles.crownButton}
      >
        <Icon name="crown" size={28} color="#FFD700" />
      </TouchableOpacity>
    </View>
  );

  const renderLeaderboardItem = ({ item }) => {
    const itemOpacity = fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const getGradientColors = (rank) => {
      switch (rank) {
        case 1:
          return ['#FFD700', '#FFA500']; // Gold gradient
        case 2:
          return ['#C0C0C0', '#A0A0A0']; // Silver gradient
        case 3:
          return ['#CD7F32', '#A0522D']; // Bronze gradient
        default:
          return ['#FFFFFF', '#FFFFFF'];
      }
    };

    return (
      <Animated.View
        style={[
          styles.leaderboardItem,
          { opacity: itemOpacity },
          styles[`rank${item.rank}Card`]
        ]}
      >
        <View style={[styles.rankContainer, styles[`rank${item.rank}Container`]]}>
          {item.rank === 1 ? (
            <Icon name="crown" size={24} color="#FFD700" />
          ) : (
            <Text style={[styles.rankText, styles[`rank${item.rank}Text`]]}>#{item.rank}</Text>
          )}
        </View>
        
        <View style={styles.userInfoContainer}>
          <Text style={[styles.userIdText, styles[`rank${item.rank}Username`]]}>
            {item.username}
          </Text>
          <View style={styles.statsRow}>
            <Icon name="run" size={16} color="#666" />
            <Text style={styles.statsText}> {item.runCount} runs</Text>
            <Text style={styles.statsText}> · </Text>
            <Icon name="map-marker-distance" size={16} color="#666" />
            <Text style={styles.statsText}> {item.totalDistance} km</Text>
          </View>
        </View>
        
        <View style={styles.medalContainer}>
          <Icon 
            name="medal" 
            size={28} 
            color={
              item.rank === 1 ? '#FFD700' : 
              item.rank === 2 ? '#C0C0C0' : 
              '#CD7F32'
            }
          />
        </View>
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={60} color="#FF5733" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Handle empty leaderboard
  if (leaderboardData.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No runs recorded yet.</Text>
          <Text style={styles.emptySubText}>Be the first to start running!</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      {leaderboardData.map((item) => (
        <Pressable 
          key={item.userid}
          onPress={() => {}} // Add any onPress handler if needed
        >
          {renderLeaderboardItem({ item })}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  crownButton: {
    padding: 8,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 7,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  rank1Card: {
    backgroundColor: '#FFF9E6',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  rank2Card: {
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#C0C0C0',
  },
  rank3Card: {
    backgroundColor: '#FDF5E6',
    borderWidth: 2,
    borderColor: '#CD7F32',
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rank1Container: {
    backgroundColor: '#FFF9E6',
  },
  rank2Container: {
    backgroundColor: '#F5F5F5',
  },
  rank3Container: {
    backgroundColor: '#FDF5E6',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rank1Text: {
    color: '#FFD700',
  },
  rank2Text: {
    color: '#C0C0C0',
  },
  rank3Text: {
    color: '#CD7F32',
  },
  userInfoContainer: {
    flex: 1,
  },
  userIdText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  rank1Username: {
    color: '#B8860B',
  },
  rank2Username: {
    color: '#808080',
  },
  rank3Username: {
    color: '#8B4513',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    color: '#666',
  },
  medalContainer: {
    marginLeft: 8,
    width: 32,
    alignItems: 'center',
  },
  loadingContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF5733',
    textAlign: 'center',
    marginTop: 10,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});