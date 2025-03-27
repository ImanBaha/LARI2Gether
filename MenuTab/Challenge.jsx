import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { filter } from 'lodash';
import { supabase } from '../lib/supabase';
import ChallengeCard from '../components/ChallengeCard';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import * as Animatable from 'react-native-animatable';

const Challenge = ({ navigation }) => {
  const [fetchError, setFetchError] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isDateSorted, setIsDateSorted] = useState(false);
  const [showJoinedOnly, setShowJoinedOnly] = useState(false);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchChallenges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('challenge')
        .select();

      if (error) {
        console.error('Error fetching challenges:', error.message);
        setFetchError('Could not fetch the challenges');
        setChallenges([]);
        setFilteredChallenges([]);
        return;
      }

      console.log('Fetched challenges:', data);
      const sortedData = isDateSorted ? sortChallengesByDate(data) : data;
      setChallenges(sortedData);
      
      // Filter challenges based on user participation
      if (showJoinedOnly) {
        const joinedChallenges = sortedData.filter(challenge => 
          challenge.participantsID && challenge.participantsID.includes(user.id)
        );
        setFilteredChallenges(joinedChallenges);
      } else {
        setFilteredChallenges(sortedData);
      }
      
      setFetchError(null);
    } catch (error) {
      console.error('Error in fetchChallenges:', error);
      setFetchError('Could not fetch the challenges');
    }
  };

  const sortChallengesByDate = (data) => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });
  };

  const filterChallenges = (challenges, query) => {
    if (!query) return challenges;
    
    return filter(challenges, challenge => {
      const searchTerm = query.toLowerCase();
      return (
        (challenge.title && challenge.title.toLowerCase().includes(searchTerm)) ||
        (challenge.description && challenge.description.toLowerCase().includes(searchTerm)) ||
        (challenge.location && challenge.location.toLowerCase().includes(searchTerm))
      );
    });
  };

  useEffect(() => {
    fetchChallenges();
  }, [isDateSorted, showJoinedOnly]);

  useEffect(() => {
    const applyFilters = async () => {
      let filtered = challenges;
      
      // Apply search filter
      if (searchQuery) {
        filtered = filterChallenges(filtered, searchQuery);
      }
      
      // Apply joined filter
      if (showJoinedOnly) {
        const { data: { user } } = await supabase.auth.getUser();
        filtered = filtered.filter(challenge => 
          challenge.participantsID && challenge.participantsID.includes(user.id)
        );
      }
      
      // Apply date sort
      if (isDateSorted) {
        filtered = sortChallengesByDate(filtered);
      }
      
      setFilteredChallenges(filtered);
    };

    applyFilters();
  }, [challenges, searchQuery, showJoinedOnly, isDateSorted]);

  const handleCreateChallenge = () => {
    navigation.navigate('AddCh');
  };

  const handleRunPress = () => {
    navigation.navigate('RunTracker');
  };

  const toggleDateSort = () => {
    setIsDateSorted(!isDateSorted);
  };

  const toggleJoinedFilter = () => {
    setShowJoinedOnly(!showJoinedOnly);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchChallenges();
    } catch (error) {
      console.error('Error refreshing challenges:', error);
    }
    setRefreshing(false);
  }, []);

  const searchBar = (
    <Animatable.View 
      animation="fadeIn" 
      duration={1000} 
      style={styles.searchContainer}
    >
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search challenges..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        ) : null}
      </View>
    </Animatable.View>
  );

  return (
    <LinearGradient colors={['#0066b2', '#ADD8E6', '#F0FFFF']} style={styles.gradient}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Image 
            source={require('../assests/images/L2G.png')} 
            style={styles.logo} 
            resizeMode="contain" 
          />
          <View style={styles.buttonContainer}>
            {/* Run Button */}
            <TouchableOpacity 
              style={[styles.iconButton, { marginRight: 10 }]} 
              onPress={handleRunPress}
            >
              <MaterialCommunityIcons name="run-fast" size={30} color="#fff" />
            </TouchableOpacity>

            {/* Joined Filter Button */}
            <TouchableOpacity 
              style={[styles.iconButton, { marginRight: 10 }]} 
              onPress={toggleJoinedFilter}
            >
              <MaterialCommunityIcons 
                name={showJoinedOnly ? "account-check" : "account-check-outline"} 
                size={25} 
                color="#fff" 
              />
            </TouchableOpacity>

            {/* Date Filter Button */}
            <TouchableOpacity 
              style={[styles.iconButton, { marginRight: 10 }]} 
              onPress={toggleDateSort}
            >
              <Ionicons 
                name={isDateSorted ? "funnel" : "funnel-outline"} 
                size={25} 
                color="#fff" 
              />
            </TouchableOpacity>

            {/* Create Button */}
            <TouchableOpacity 
              style={styles.createButton} 
              onPress={handleCreateChallenge}
            >
              <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        {searchBar}

        {/* Error Message */}
        {fetchError && <Text style={styles.error}>{fetchError}</Text>}

        {/* Challenge Cards */}
        {filteredChallenges.length > 0 ? (
          <FlashList
            data={filteredChallenges}
            renderItem={({ item }) => <ChallengeCard challenge={item} />}
            estimatedItemSize={200}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        ) : (
          <Text style={styles.noChallenges}>
            {showJoinedOnly ? "You haven't joined any challenges yet." : "No challenges available."}
          </Text>
        )}
      </View>
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
    padding: 10,
    marginBottom: 94,
    marginTop: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    marginBottom: 0,
  },
  logo: {
    width: 150,
    height: 75,
    right: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    right: 25,
  },
  iconButton: {
    backgroundColor: '#FFAA33',
    padding: 10,
    borderRadius: 50,
  },
  createButton: {
    backgroundColor: '#FFAA33',
    padding: 10,
    borderRadius: 50,
  },
  searchContainer: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
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