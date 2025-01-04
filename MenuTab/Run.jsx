import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import haversine from 'haversine';
import Icon from 'react-native-vector-icons/Ionicons';
import Pin from '../components/Pin';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RunTracker() {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [distance, setDistance] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pace, setPace] = useState(0);
  const [pastRuns, setPastRuns] = useState([]);
  const [watchSubscription, setWatchSubscription] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(currentLocation);
      setCoordinates((prev) => [
        ...prev,
        {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        },
      ]);
    })();

    loadPastRuns();
  }, []);

  useEffect(() => {
    let timer;
    if (isRunning && !isPaused) {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, isPaused]);

  const startRunning = async () => {
    setIsRunning(true);
    setIsPaused(false);
    const subscription = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 1 },
      (newLocation) => {
        const { latitude, longitude } = newLocation.coords;
        setCoordinates((prev) => [...prev, { latitude, longitude }]);

        if (coordinates.length > 1) {
          const previousCoord = coordinates[coordinates.length - 1];
          const newDistance = haversine(previousCoord, { latitude, longitude }, { unit: 'meter' });
          setDistance((prevDistance) => prevDistance + newDistance);

          const timeInHours = elapsedTime / 3600;
          const newPace = (distance / 1000) / timeInHours || 0;
          setPace(newPace);
        }
        setLocation(newLocation);
      }
    );
    setWatchSubscription(subscription);
  };

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

  const saveRunRecord = async () => {
    const runData = {
      date: new Date(),
      distance: (distance / 1000).toFixed(2),
      time: formatTime(elapsedTime),
      pace: pace.toFixed(2),
    };

    const updatedRuns = [...pastRuns, runData];
    setPastRuns(updatedRuns);

    try {
      await AsyncStorage.setItem('pastRuns', JSON.stringify(updatedRuns));
    } catch (error) {
      console.error('Error saving run:', error);
    }
  };

  const loadPastRuns = async () => {
    try {
      const storedRuns = await AsyncStorage.getItem('pastRuns');
      if (storedRuns !== null) {
        setPastRuns(JSON.parse(storedRuns));
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
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: location?.coords.latitude || 3.1390,
          longitude: location?.coords.longitude || 101.6869,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}
        showsUserLocation={true}
      >
        <Polyline coordinates={coordinates} strokeColor="#007AFF" strokeWidth={5} />
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Position"
          >
            <Pin />
          </Marker>
        )}
      </MapView>

      <TouchableOpacity
        style={styles.recordButton}
        onPress={() => navigation.navigate('PastRuns')}
      >
        <Icon name="albums-outline" size={24} color="#FFF" />
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.runButton}
          onPress={isRunning ? pauseRunning : startRunning}
        >
          <Icon name={isRunning && !isPaused ? "pause-outline" : "play-outline"} size={30} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.stopButton}
          onPress={stopRunning}
        >
          <Icon name="stop-outline" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.timerText}>Running Time: {formatTime(elapsedTime)}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Icon name="walk-outline" size={24} color="#FF4500" />
            <Text style={styles.statText}>{(distance / 1000).toFixed(2)} km</Text>
          </View>
          <View style={styles.stat}>
            <Icon name="speedometer-outline" size={24} color="#FF4500" />
            <Text style={styles.statText}>{pace.toFixed(2)} km/h</Text>
          </View>
        </View>
      </View>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2DFD2',
    marginBottom: '28%'
  },
  map: {
    flex: 1,
  },
  recordButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 5,
    top: 10,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 18,
    marginLeft: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: '10%',
    marginBottom: -70,
    zIndex: 50,
    bottom: 63,
    left: 110,
  },
  runButton: {
    width:55,
    height: 55,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
    // marginBottom:160,
    // marginLeft:290,
  },
  stopButton: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: '#FF4500',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
  },
});
