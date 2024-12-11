import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CurrentRuns({ route }) {
  const navigation = useNavigation();

  // Extract data directly from the route parameters
  const { coordinates, distance, elapsedTime, pace } = route.params.currentRunData;

  const [currentElapsedTime, setCurrentElapsedTime] = useState(elapsedTime);
  const [currentDistance, setCurrentDistance] = useState(distance);
  const [currentPace, setCurrentPace] = useState(pace || 0); // Ensure initial value is a number
  const [isRunning, setIsRunning] = useState(true);

  // Handle elapsed time if continuing from pause
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setCurrentElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const stopRun = async () => {
    setIsRunning(false);

    const runData = {
      date: new Date(),
      distance: (currentDistance / 1000).toFixed(2), // Convert to km
      time: formatTime(currentElapsedTime),
      pace: typeof currentPace === 'number' ? currentPace.toFixed(2) : 'N/A', // Check if currentPace is defined
    };

    await saveRunData(runData);
    navigation.navigate('PastRuns'); // Navigate to PastRuns screen
  };

  const saveRunData = async (runData) => {
    try {
      const storedRuns = await AsyncStorage.getItem('pastRuns');
      const updatedRuns = storedRuns ? JSON.parse(storedRuns).concat(runData) : [runData];
      await AsyncStorage.setItem('pastRuns', JSON.stringify(updatedRuns));
    } catch (error) {
      console.error('Error saving run:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Run Data</Text>
      <Text style={styles.statText}>Elapsed Time: {formatTime(currentElapsedTime)}</Text>
      <Text style={styles.statText}>Distance: {(currentDistance / 1000).toFixed(2)} km</Text>
      <Text style={styles.statText}>Pace: {typeof currentPace === 'number' ? currentPace.toFixed(2) : 'N/A'} km/h</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.pauseButton} onPress={() => setIsRunning(!isRunning)}>
          <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Resume'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.stopButton} onPress={stopRun}>
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.recordsButton} onPress={() => navigation.navigate('PastRuns')}>
        <Text style={styles.buttonText}>Records</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  statText: {
    fontSize: 18,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  pauseButton: {
    backgroundColor: '#FF4500',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  stopButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    flex: 1,
  },
  recordsButton: {
    marginTop: 20,
    backgroundColor: '#008000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
  },
});
