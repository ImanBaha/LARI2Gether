import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function PastRuns() {
  const route = useRoute();
  const navigation = useNavigation();
  const [localRuns, setLocalRuns] = useState([]);
  const [supabaseRuns, setSupabaseRuns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('local');
  const [isSync, setIsSync] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (route.params?.pastRuns) {
      setLocalRuns(route.params.pastRuns);
    }
  }, [route.params]);

  const loadAllData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Auth error:', authError);
        setError('Authentication error');
        setIsLoading(false);
        return;
      }

      if (!user) {
        console.error('No user found');
        setError('No authenticated user found');
        setIsLoading(false);
        return;
      }

      // Load both local and Supabase data
      try {
        await Promise.all([
          loadLocalRuns(),
          loadSupabaseRuns(user.id)
        ]);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Error loading runs');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const loadLocalRuns = async () => {
    try {
      const storedRuns = await AsyncStorage.getItem('pastRuns');
      if (storedRuns) {
        const parsedRuns = JSON.parse(storedRuns);
        const processedRuns = parsedRuns.map(run => ({
          date: run.date,
          distance: run.distance,
          time: run.time,
          pace: run.pace,
        }));
        setLocalRuns(processedRuns);
      }
    } catch (error) {
      console.error('Error loading local runs:', error);
      throw error;
    }
  };

  const loadSupabaseRuns = async (userId) => {
    try {
      console.log('Loading Supabase runs for user:', userId);
      const { data, error } = await supabase
        .from('runs')
        .select('*')
        .eq('userid', userId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log('Loaded Supabase runs:', data);
      setSupabaseRuns(data || []);
    } catch (error) {
      console.error('Error in loadSupabaseRuns:', error);
      throw error;
    }
  };


  const syncWithSupabase = async (runs) => {
    if (!runs || runs.length === 0) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        return;
      }

      // Get the most recent run
      const latestRun = runs[0];
      
      // Check if this run already exists in Supabase for this user
      const { data: existingRuns, error: fetchError } = await supabase
        .from('runs')
        .select('*')
        .eq('userid', user.id)  // Add user ID check
        .eq('date', latestRun.date)
        .eq('distance', latestRun.distance)
        .eq('time', latestRun.time)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking existing run:', fetchError);
        return;
      }

      // If run doesn't exist, insert it with user ID
      if (!existingRuns) {
        const runToInsert = {
          date: latestRun.date,
          distance: latestRun.distance,
          time: latestRun.time,
          pace: latestRun.pace,
          userid: user.id  // Add user ID to new records
        };

        const { error: insertError } = await supabase
          .from('runs')
          .insert([runToInsert]);

        if (insertError) {
          console.error('Error saving new run to Supabase:', insertError);
        } else {
          console.log('Latest run successfully saved to Supabase');
        }
      } else {
        console.log('Run already exists in Supabase, skipping insert');
      }
    } catch (error) {
      console.error('Unexpected error during Supabase sync:', error);
    }
  };

  const deleteRun = async (index, source) => {
    Alert.alert(
      "Delete Run",
      "Are you sure you want to delete this run?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) {
                console.error('No authenticated user found');
                return;
              }

              if (source === 'local') {
                const runToDelete = localRuns[index];
                const updatedRuns = localRuns.filter((_, i) => i !== index);
                setLocalRuns(updatedRuns);
                await AsyncStorage.setItem('pastRuns', JSON.stringify(updatedRuns));

                // Delete from Supabase if it exists there for this user
                const { error } = await supabase
                  .from('runs')
                  .delete()
                  .match({
                    userid: user.id,  // Add user ID check
                    date: runToDelete.date,
                    distance: runToDelete.distance,
                    time: runToDelete.time
                  });

                if (error) {
                  console.error('Error deleting run from Supabase:', error);
                }
              } else {
                const runToDelete = supabaseRuns[index];
                const { error } = await supabase
                  .from('runs')
                  .delete()
                  .match({
                    userid: user.id,  // Add user ID check
                    date: runToDelete.date,
                    distance: runToDelete.distance,
                    time: runToDelete.time
                  });

                if (error) {
                  console.error('Error deleting run from Supabase:', error);
                } else {
                  setSupabaseRuns(supabaseRuns.filter((_, i) => i !== index));
                }
              }
            } catch (error) {
              console.error('Error during run deletion:', error);
            }
          }
        }
      ]
    );
  };

  const renderRunItem = ({ item, index }) => (
    <LinearGradient colors={['#E3F2FD', '#BBDEFB']} style={styles.runItem}>
      <View style={styles.runItemHeader}>
        <Icon 
          name={activeTab === 'local' ? "run" : "cloud"} 
          size={24} 
          color="#1976D2" 
          style={styles.runIcon} 
        />
        <Text style={styles.runTitle}>
          {activeTab === 'local' ? 'Local Run' : 'Cloud Run'}
        </Text>
      </View>
      <View style={styles.runDetails}>
        <Icon name="calendar" size={20} color="#424242" />
        <Text style={styles.runText}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <View style={styles.runDetails}>
        <Icon name="map-marker-distance" size={20} color="#424242" />
        <Text style={styles.runText}>{`${item.distance} km`}</Text>
      </View>
      <View style={styles.runDetails}>
        <Icon name="clock-outline" size={20} color="#424242" />
        <Text style={styles.runText}>{item.time}</Text>
      </View>
      <View style={styles.runDetails}>
        <Icon name="speedometer" size={20} color="#424242" />
        <Text style={styles.runText}>{`${item.pace} km/h`}</Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => deleteRun(index, activeTab === 'local' ? 'local' : 'cloud')}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </LinearGradient>
  );

  return (
    <LinearGradient colors={['#0066b2', '#ADD8E6', '#F0FFFF']} style={styles.container}>
      <Text style={styles.title}>Recent Activity</Text>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'local' && styles.activeTab]}
          onPress={() => setActiveTab('local')}
        >
          <Icon name="phone" size={20} color={activeTab === 'local' ? '#1976D2' : '#757575'} />
          <Text style={[styles.tabText, activeTab === 'local' && styles.activeTabText]}>
            Local ({localRuns.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'cloud' && styles.activeTab]}
          onPress={() => setActiveTab('cloud')}
        >
          <Icon name="cloud" size={20} color={activeTab === 'cloud' ? '#1976D2' : '#757575'} />
          <Text style={[styles.tabText, activeTab === 'cloud' && styles.activeTabText]}>
            Cloud ({supabaseRuns.length})
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1976D2" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={60} color="#FF5733" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={loadAllData}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={activeTab === 'local' ? localRuns : supabaseRuns}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderRunItem}
          contentContainerStyle={
            (activeTab === 'local' ? localRuns : supabaseRuns).length === 0 
              ? styles.emptyContainer 
              : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="emoticon-sad-outline" size={60} color="#9E9E9E" />
              <Text style={styles.emptyText}>
                No {activeTab === 'local' ? 'local' : 'cloud'} runs available
              </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.continueButton} onPress={() => navigation.goBack()}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#FAF9F6',
      marginBottom: 15,
      textAlign: 'center',
      marginTop: 35,
      textShadowColor: '#000',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 5,
    },
    runItem: {
      borderRadius: 15,
      paddingVertical: 20,
      paddingHorizontal: 25,
      marginBottom: 20,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },
    runItemHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    runIcon: {
      marginRight: 10,
    },
    runTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1976D2',
    },
    runDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 4,
    },
    runText: {
      fontSize: 16,
      color: '#333',
      marginLeft: 10,
    },
    deleteButton: {
      backgroundColor: '#FF5733',
      borderRadius: 8,
      alignSelf: 'flex-start',
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginTop: 15,
    },
    deleteButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    emptyContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 30,
    },
    emptyText: {
      fontSize: 18,
      color: '#9E9E9E',
      fontStyle: 'italic',
    },
    continueButton: {
      backgroundColor: '#0096FF',
      borderRadius: 25,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 75,
      marginTop: 10,
      marginBottom: 25,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    continueButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '700',
    },
    tabContainer: {
      flexDirection: 'row',
      marginBottom: 20,
      paddingHorizontal: 20,
    },
    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      backgroundColor: '#FFFFFF50',
      marginHorizontal: 5,
      borderRadius: 25,
    },
    activeTab: {
      backgroundColor: '#FFFFFF',
    },
    tabText: {
      marginLeft: 5,
      color: '#757575',
      fontWeight: '600',
    },
    activeTabText: {
      color: '#1976D2',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    errorText: {
      fontSize: 18,
      color: '#FF5733',
      textAlign: 'center',
      marginTop: 10,
      marginBottom: 20,
    },
    retryButton: {
      backgroundColor: '#1976D2',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    retryButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });
 