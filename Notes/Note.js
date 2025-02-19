import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { supabase } from '../lib/supabase';
import NotesCard from '../components/NotesCard';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';

const Note = ({ navigation }) => {
  const [fetchError, setFetchError] = useState(null);
  const [notes, setNotes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('notes') // Fetching data from your 'notes' table
      .select();

    if (error) {
      console.error('Error fetching notes:', error.message);
      setFetchError('Could not fetch the notes');
      setNotes([]);
    } else {
      console.log('Fetched notes:', data);
      setNotes(data);
      setFetchError(null);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateNote = () => {
    navigation.navigate('AddNote');
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      fetchNotes();
    } catch (error) {
      console.error('Error refreshing notes:', error);
    }
    setRefreshing(false);
  }, []);

  return (
    <LinearGradient colors={['#0066b2', '#ADD8E6', '#F0FFFF']} style={styles.gradient}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={30} color="#FFAC1C" />
          </TouchableOpacity>
          <Text style={styles.header}>Running Journal</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateNote}>
            <Ionicons name="add" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {fetchError && <Text style={styles.error}>{fetchError}</Text>}

        {/* Notes Cards */}
        {notes.length > 0 ? (
          <FlashList
            data={notes}
            renderItem={({ item }) => <NotesCard key={item.id} note={item} />}
            estimatedItemSize={200}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        ) : (
          <Text style={styles.noNotes}>No notes available.</Text>
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
    padding: 12,
    marginTop: 25,
    marginBottom: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goBackButton: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#28282B',
    flex: 1, // Center the header text
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
  notesGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  noNotes: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
  },
});

export default Note;
