import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase'; // Ensure you have set up Supabase in this file

export default function PastRuns() {
  const route = useRoute();
  const navigation = useNavigation();
  const [pastRuns, setPastRuns] = useState([]);

  useEffect(() => {
    if (route.params?.pastRuns) {
      setPastRuns(route.params.pastRuns);
    } else {
      loadPastRuns();
    }
  }, [route.params]);

  const loadPastRuns = async () => {
    try {
      const storedRuns = await AsyncStorage.getItem('pastRuns');
      if (storedRuns !== null) {
        const parsedRuns = JSON.parse(storedRuns);
        const sortedRuns = parsedRuns.sort((a, b) => new Date(b.date) - new Date(a.date));
        setPastRuns(sortedRuns);
        await saveRunsToSupabase(sortedRuns); // Save only new runs to Supabase
      }
    } catch (error) {
      console.error('Error loading past runs:', error);
    }
  };

  const saveRunsToSupabase = async (runs) => {
    try {
      // Fetch existing runs from Supabase
      const { data: existingRuns, error: fetchError } = await supabase
        .from('runs')
        .select('date, distance, time, pace');
      if (fetchError) {
        console.error('Error fetching existing runs:', fetchError);
        return;
      }
  
      // Get the most recent run from the local runs array (from AsyncStorage)
      const latestRun = runs[0]; // Since runs are sorted in descending order, the first one is the latest
  
      // Check if the latest run already exists in Supabase
      const existingRun = existingRuns.find(
        (run) =>
          run.date === latestRun.date &&
          run.distance === latestRun.distance &&
          run.time === latestRun.time &&
          run.pace === latestRun.pace
      );
  
      if (!existingRun) {
        // If the latest run doesn't exist in Supabase, insert it
        const { error } = await supabase.from('runs').insert([latestRun]);
        if (error) {
          console.error('Error saving new run to Supabase:', error);
        } else {
          console.log('Latest run successfully saved to Supabase:', latestRun);
        }
      } else {
        console.log('Latest run already exists in Supabase. No update necessary.');
      }
    } catch (error) {
      console.error('Unexpected error saving runs to Supabase:', error);
    }
  };

  const deleteRun = async (index) => {
    Alert.alert(
      "Delete Run",
      "Are you sure you want to delete this run?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            const updatedRuns = pastRuns.filter((_, i) => i !== index);
            setPastRuns(updatedRuns);
            await AsyncStorage.setItem('pastRuns', JSON.stringify(updatedRuns));
            await saveRunsToSupabase(updatedRuns); // Update Supabase after deletion
          }
        }
      ]
    );
  };

  const renderRunItem = ({ item, index }) => (
    <View style={styles.runItem}>
      <Text style={styles.runText}>{`Date: ${new Date(item.date).toLocaleDateString()}`}</Text>
      <Text style={styles.runText}>{`Distance: ${item.distance} km`}</Text>
      <Text style={styles.runText}>{`Time: ${item.time}`}</Text>
      <Text style={styles.runText}>{`Pace: ${item.pace} km/h`}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteRun(index)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={['#0066b2', '#FFAA33']} style={styles.container}>
      <Text style={styles.title}>Recent Activity</Text>
      <FlatList
        data={pastRuns}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRunItem}
        contentContainerStyle={pastRuns.length === 0 ? styles.emptyContainer : null}
        ListEmptyComponent={<Text style={styles.emptyText}>No past runs available</Text>}
      />
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
    fontSize: 22,
    fontWeight: '700',
    color: '#FAF9F6',
    marginBottom: 15,
    textAlign: 'center',
    marginTop: 35,
  },
  runItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  runText: {
    fontSize: 16,
    color: '#333333',
    marginVertical: 4,
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
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
