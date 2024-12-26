import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UpcomingChallenges = () => {
  const [timers, setTimers] = useState([]);
  const [currentChallenges, setCurrentChallenges] = useState([]);
  const navigation = useNavigation();

  // Fetch challenges from AsyncStorage
  const loadChallenges = async () => {
    try {
      const storedChallenges = await AsyncStorage.getItem('challenges');
      if (storedChallenges) {
        const parsedChallenges = JSON.parse(storedChallenges);
        const upcomingChallenges = parsedChallenges.filter(
          challenge => new Date(challenge.date) > new Date()
        );
        setCurrentChallenges(upcomingChallenges);
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
    }
  };

  // Save challenges to AsyncStorage
  const saveChallenges = async challenges => {
    try {
      await AsyncStorage.setItem('challenges', JSON.stringify(challenges));
      setCurrentChallenges(challenges);
    } catch (error) {
      console.error('Error saving challenges:', error);
    }
  };

  // Simulate adding default challenges if none exist
  useEffect(() => {
    const initializeChallenges = async () => {
      const storedChallenges = await AsyncStorage.getItem('challenges');
      if (!storedChallenges) {
        const defaultChallenges = [
          { title: '10k Run Challenge', date: '2024-12-31T10:00:00Z' },
          { title: 'New Year Sprint', date: '2025-01-01T08:00:00Z' },
          { title: 'Past Challenge', date: '2024-12-01T10:00:00Z' }, // Example past challenge
        ];
        saveChallenges(defaultChallenges);
      }
    };
    initializeChallenges();
    loadChallenges(); // Load challenges on mount
  }, []);

  // Update countdown timers
  useEffect(() => {
    const updateTimers = () => {
      const updatedTimers = currentChallenges.map(challenge => {
        const timeRemaining = Math.max(
          new Date(challenge.date).getTime() - new Date().getTime(),
          0
        );
        return timeRemaining;
      });
      setTimers(updatedTimers);
    };

    updateTimers(); // Initial calculation
    const interval = setInterval(updateTimers, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [currentChallenges]);

  const formatTime = ms => {
    if (ms <= 0) return 'Challenge Started!';
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Upcoming Challenges</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ListOfChallenges')}>
          <Text style={styles.viewMore}>View More</Text>
        </TouchableOpacity>
      </View>
      {currentChallenges.map((challenge, index) => (
        <TouchableOpacity
          key={index}
          style={styles.challenge}
          onPress={() =>
            navigation.navigate('ListOfChallenges', {
              selectedChallenge: challenge,
            })
          }
        >
          <Ionicons name="trophy-outline" size={20} color="#059669" style={styles.icon} />
          <View style={styles.details}>
            <Text style={styles.title}>{challenge.title}</Text>
            <Text style={styles.date}>{formatTime(timers[index] || 0)}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FAF9F6',
  },
  viewMore: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E90FF',
  },
  challenge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
});

export default UpcomingChallenges;
