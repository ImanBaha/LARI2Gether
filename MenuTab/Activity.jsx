import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { FlashList } from '@shopify/flash-list';
import WeeklyProgress from '../components/WeeklyProgress';
import RunLevel from '../components/RunLevel';
import Leaderboard from '../components/Leaderboard';

const Activity = () => {
  const navigation = useNavigation();

  const components = [
    { id: '1', component: <Leaderboard /> },
    { id: '2', component: <RunLevel /> },
    { id: '3', component: <WeeklyProgress /> },
  ];

  return (
    <LinearGradient colors={['#0066b2', '#ADD8E6', '#F0FFFF']} style={styles.gradient}>
      <FlashList
        data={components}
        renderItem={({ item }) => <View style={styles.itemContainer}>{item.component}</View>}
        estimatedItemSize={200}  // Add this prop - estimate the average height of your items
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 0,
    marginTop: 13,
  },
  itemContainer: {
    marginBottom: 0,
  },
});

export default Activity;