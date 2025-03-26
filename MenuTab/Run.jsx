import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import haversine from 'haversine';
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

const { width, height } = Dimensions.get('window');

export default function RunTracker() {
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [distance, setDistance] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pace, setPace] = useState(0);
  const [pastRuns, setPastRuns] = useState([]);
  const [watchSubscription, setWatchSubscription] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [speedBuffer, setSpeedBuffer] = useState([]);
  
  const [isSyncing, setIsSyncing] = useState(false);

  // Function to sync run with Supabase
  const syncRunToSupabase = async (runData) => {
    try {
      setIsSyncing(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('Auth error:', authError);
        return false;
      }

  // Format the run data for Supabase - omitting coordinates
  const runToInsert = {
    userid: user.id,
    date: runData.date,
    distance: parseFloat(runData.distance),
    time: runData.time,
    pace: parseFloat(runData.pace)
  };
      // Check if run already exists
    const { data: existingRun, error: fetchError } = await supabase
    .from('runs')
    .select('*')
    .eq('userid', user.id)
    .eq('date', runData.date)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error checking existing run:', fetchError);
    return false;
  }

  if (!existingRun) {
    const { error: insertError } = await supabase
      .from('runs')
      .insert([runToInsert]);

    if (insertError) {
      console.error('Error saving run to Supabase:', insertError);
      return false;
    }
    
    return true;
  }

  return true;
} catch (error) {
  console.error('Error syncing to Supabase:', error);
  return false;
} finally {
  setIsSyncing(false);
}
};

  // Improved accuracy constants
  const ACCURACY_THRESHOLD = 15; // Reduced from 20 to 15 meters for better accuracy
  const SPEED_BUFFER_SIZE = 5;
  const MIN_DISTANCE_FILTER = 5; // Increased from 2 to 5 meters to reduce noise
  const MAX_SPEED = 25; // Maximum realistic speed in km/h
  const MIN_SPEED = 0.3; // Minimum speed in km/h to count as movement
  const LOCATION_INTERVAL = 2000; // Increase time interval to 2 seconds

    // Add new state for location filtering
    const [lastValidLocation, setLastValidLocation] = useState(null);

  useEffect(() => {
    initializeLocation();
    loadPastRuns();
    return () => {
      if (watchSubscription) {
        watchSubscription.remove();
      }
    };
  }, []);

  const initializeLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      // Add delay after requesting permissions
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
    await new Promise(resolve => setTimeout(resolve, 1000));
      
    let currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
      // Add timeout and maximum age
      timeInterval: 2000,
      distanceInterval: 1,
    });
      
      if (currentLocation.coords.accuracy <= ACCURACY_THRESHOLD) {
        setLocation(currentLocation);
        setAccuracy(currentLocation.coords.accuracy);
        setCoordinates([{
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          timestamp: currentLocation.timestamp,
        }]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get location');
      console.error(error);
    }
  };

  useEffect(() => {
    let timer;
    if (isRunning && !isPaused) {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, isPaused]);

  const calculatePace = (newDistance, timeInSeconds) => {
    if (timeInSeconds === 0) return 0;
    
    const timeInHours = timeInSeconds / 3600;
    const distanceInKm = newDistance / 1000;
    const instantPace = distanceInKm / timeInHours;
    
    // Update speed buffer for smoothing
    setSpeedBuffer(prev => {
      const newBuffer = [...prev, instantPace].slice(-SPEED_BUFFER_SIZE);
      // Return average of buffer for smoother pace updates
      return newBuffer;
    });
    
    // Calculate average pace from buffer
    const averagePace = speedBuffer.reduce((a, b) => a + b, 0) / speedBuffer.length;
    return averagePace || instantPace;
  };

  // Enhanced isValidCoordinate function
  const isValidCoordinate = (coord, lastCoord) => {
    if (!lastCoord) return coord.accuracy <= ACCURACY_THRESHOLD;
    
    const distance = haversine(lastCoord, coord, { unit: 'meter' });
    const timeDiff = (coord.timestamp - lastCoord.timestamp) / 1000; // seconds
    const speedKmH = (distance / timeDiff) * 3.6; // Convert m/s to km/h
    
    // Enhanced validation criteria
    const isAccurate = coord.accuracy <= ACCURACY_THRESHOLD;
    const isReasonableDistance = distance >= MIN_DISTANCE_FILTER;
    const isReasonableSpeed = speedKmH <= MAX_SPEED && speedKmH >= MIN_SPEED;
    const hasMinimumTimeDiff = timeDiff >= 1; // Minimum 1 second between points
    
    return isAccurate && isReasonableDistance && isReasonableSpeed && hasMinimumTimeDiff;
  };

// Enhanced startRunning function with better location tracking
const startRunning = async () => {
  setIsRunning(true);
  setIsPaused(false);
  
  const subscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.BestForNavigation,
      distanceInterval: MIN_DISTANCE_FILTER,
      timeInterval: LOCATION_INTERVAL,
    },
    (newLocation) => {
      const newCoord = {
        latitude: newLocation.coords.latitude,
        longitude: newLocation.coords.longitude,
        accuracy: newLocation.coords.accuracy,
        timestamp: newLocation.timestamp,
      };

      setLocation(newLocation);
      setAccuracy(newLocation.coords.accuracy);

      setCoordinates(prev => {
        const lastCoord = prev[prev.length - 1];
        
        // Enhanced location filtering
        if (!isValidCoordinate(newCoord, lastCoord)) {
          return prev;
        }

        // Additional moving average filter for locations
        if (lastCoord && lastValidLocation) {
          const avgLat = (lastValidLocation.latitude + newCoord.latitude) / 2;
          const avgLong = (lastValidLocation.longitude + newCoord.longitude) / 2;
          
          newCoord.latitude = avgLat;
          newCoord.longitude = avgLong;
        }

        setLastValidLocation(newCoord);

        if (lastCoord && !isPaused) {
          const newDistance = haversine(lastCoord, newCoord, { unit: 'meter' });
          setDistance(prevDistance => prevDistance + newDistance);
          setPace(calculatePace(distance + newDistance, elapsedTime));
        }

        return [...prev, newCoord];
      });

      // Smooth map animation
      if (mapRef.current && !isPaused) {
        mapRef.current.animateToRegion({
          latitude: newCoord.latitude,
          longitude: newCoord.longitude,
          latitudeDelta: 0.0005,
          longitudeDelta: 0.0005,
        }, 1000);
      }
    }
  );
  
  setWatchSubscription(subscription);
};

  // Rest of your existing functions remain the same
  const pauseRunning = () => {
    setIsPaused(!isPaused);
  };

  const stopRunning = async () => {
    Alert.alert(
      'End Run',
      'Are you sure you want to end the run?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'End', 
          onPress: async () => {
            if (watchSubscription) {
              watchSubscription.remove();
            }
            await saveRunRecord();
            resetRun();
          }
        }
      ],
      { cancelable: false }
    );
  };

 // Modified saveRunRecord function to handle different storage formats
const saveRunRecord = async () => {
  try {
    // Create full run data including coordinates for local storage
    const fullRunData = {
      date: new Date().toISOString(),
      distance: (distance / 1000).toFixed(2),
      time: formatTime(elapsedTime),
      pace: pace.toFixed(2),
      coordinates: coordinates // Keep coordinates for local storage only
    };

     // Save to local storage with full data
     const updatedRuns = [...pastRuns, fullRunData];
     setPastRuns(updatedRuns);
     await AsyncStorage.setItem('pastRuns', JSON.stringify(updatedRuns));

    // Sync to Supabase (without coordinates)
    const syncSuccess = await syncRunToSupabase(fullRunData);
    
    if (!syncSuccess) {
      Alert.alert(
        'Sync Warning',
        'Run saved locally but failed to sync with cloud. It will sync automatically when connection is restored.'
      );
    }

     // Navigate to PastRuns with updated data
     navigation.navigate('PastRuns', { pastRuns: updatedRuns });
    } catch (error) {
      console.error('Error saving run:', error);
      Alert.alert('Error', 'Failed to save run data');
    }
  };

// Modified loadPastRuns function
const loadPastRuns = async () => {
  try {
    // Load from local storage
    const storedRuns = await AsyncStorage.getItem('pastRuns');
    const localRuns = storedRuns ? JSON.parse(storedRuns) : [];
    setPastRuns(localRuns);

    // Attempt to sync any unsynced runs
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      localRuns.forEach(async (run) => {
        // When syncing to Supabase, we'll only send the necessary fields
        const runDataForSync = {
          date: run.date,
          distance: run.distance,
          time: run.time,
          pace: run.pace
        };
        await syncRunToSupabase(runDataForSync);
      });
    }
  } catch (error) {
    console.error('Error loading past runs:', error);
  }
};

  const resetRun = () => {
    setDistance(0);
    setElapsedTime(0);
    setCoordinates([]);
    setPace(0);
    setIsRunning(false);
    setIsPaused(false);
    setSpeedBuffer([]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: location?.coords.latitude || 3.41083,
          longitude: location?.coords.longitude || 101.31330,
          latitudeDelta: 0.0015,
          longitudeDelta: 0.0015,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={isRunning}
        loadingEnabled={true}
        moveOnMarkerPress={false}
      >
        <Polyline 
          coordinates={coordinates.map(coord => ({
            latitude: coord.latitude,
            longitude: coord.longitude,
          }))} 
          strokeColor="#FF4500" 
          strokeWidth={5} 
        />
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Position"
          >
            {/* <Pin /> */}
          </Marker>
        )}
      </MapView>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back-circle" size={32} color="white" />
      </TouchableOpacity>


      {/* Floating Container */}
      <View style={styles.floatingContainer}>
        {isSyncing && (
          <View style={styles.syncIndicator}>
            <Text style={styles.syncText}>Syncing...</Text>
          </View>
        )}

        {/* Stats Container */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{(distance / 1000).toFixed(2)}</Text>
            <Text style={styles.statLabel}>Distance (km)</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatTime(elapsedTime)}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{pace.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Pace (km/h)</Text>
          </View>
        </View>

        {/* Control Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.controlButton, styles.secondaryButton]}
            onPress={stopRunning}
          >
            <Icon name="stop-outline" size={30} color="#FF4500" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, styles.primaryButton]}
            onPress={isRunning ? pauseRunning : startRunning}
          >
            <Icon 
              name={isRunning && !isPaused ? "pause-outline" : "play-outline"} 
              size={30} 
              color="#FFF" 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFAC1C',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floatingContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  primaryButton: {
    backgroundColor: '#FF4500',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FF4500',
  },
  syncIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 5,
  },
  syncText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
});