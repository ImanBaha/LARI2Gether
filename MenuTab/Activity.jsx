import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from 'react-native-elements';
import AchievementHighlights from '../components/AchievementHighlights';
import WeeklyProgress from '../components/WeeklyProgress';
import { LinearGradient } from 'expo-linear-gradient';
import RunLevel from '../components/RunLevel';

const Activity = () => {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);

  const pastRuns = [
    { date: '2024-12-10', distance: 5 },
    { date: '2024-12-11', distance: 8 },
    { date: '2024-12-12', distance: 6 },
  ];

  const goalDistance = 50;


  useEffect(() => {
    const totalDistance = pastRuns.reduce((sum, run) => sum + run.distance, 0);
    const calculatedProgress = Math.min(totalDistance / goalDistance, 1);
    setProgress(calculatedProgress);
  }, [pastRuns]);

  const handleCardPress = () => {
    navigation.navigate('ActivityChart');
  };

  return (
    <LinearGradient colors={['#0066b2', '#FFAA33']} style={styles.gradient}>
      <ScrollView style={styles.container}>
        <Image 
          source={require('../assests/images/view4.jpg')} 
          style={styles.headerImage}
        />
        <TouchableOpacity style={styles.chartButton} onPress={handleCardPress}>
          <Ionicons name="stats-chart" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.recordButton}
          onPress={() => navigation.navigate('PastRuns')}
        >
          <Icon name="albums-outline" type="ionicon" size={24} color="#FFF" />
        </TouchableOpacity>

        <RunLevel/>
        <WeeklyProgress 
          progress={progress} 
          totalDistance={pastRuns.reduce((sum, run) => sum + run.distance, 0)} 
          goalDistance={goalDistance} 
        />

        <AchievementHighlights />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Ensure background is transparent to show gradient
  },
  headerImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  chartButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#059669',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButton: {
    position: 'absolute',
    top: 100,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default Activity;
