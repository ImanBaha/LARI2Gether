import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import ChallengeCard from '../components/ChallengeCard';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const Challenge = ({ navigation }) => {
  const [fetchError, setFetchError] = useState(null);
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      const { data, error } = await supabase
        .from('challenge')
        .select();

      if (error) {
        console.error('Error fetching challenges:', error.message);
        setFetchError('Could not fetch the challenges');
        setChallenges([]);
      } else {
        console.log('Fetched challenges:', data);
        setChallenges(data);
        setFetchError(null);
      }
    };

    fetchChallenges();
  }, []);

  const handleCreateChallenge = () => {
    navigation.navigate('AddCh');
  }; 

  return (
    <LinearGradient colors={['#0066b2', '#FFAA33']} style={styles.gradient}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Challenges</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateChallenge}>
            <Ionicons name="add" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {fetchError && <Text style={styles.error}>{fetchError}</Text>}

        {/* Challenge Cards */}
        {challenges.length > 0 ? (
          <View style={styles.challengeGrid}>
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </View>
        ) : (
          <Text style={styles.noChallenges}>No challenges available.</Text>
        )}
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
    backgroundColor: 'transparent',
    padding: 15,
    marginBottom: 105,
    marginTop: 22,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  createButton: {
    backgroundColor: '#FFAA33',
    padding: 10,
    borderRadius: 50,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  challengeGrid: {
    flexDirection: 'column',
  },
  noChallenges: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
  },
});

export default Challenge;
