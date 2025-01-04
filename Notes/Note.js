import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import NotesCard from '../components/NotesCard';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const Note = ({ navigation }) => {
  const [fetchError, setFetchError] = useState(null);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
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

    fetchNotes();
  }, []);

  // Navigate to the AddNote screen
  const handleCreateNote = () => {
    navigation.navigate('AddNote');
  };

  // Go back to the previous screen
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient colors={['#0066b2', '#FFAA33']} style={styles.gradient}>
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.header}>Notes & Tips</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateNote}>
            <Ionicons name="add" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        {fetchError && <Text style={styles.error}>{fetchError}</Text>}

        {notes.length > 0 ? (
          <View style={styles.notesGrid}>
            {notes.map((note) => (
              <NotesCard key={note.id} note={note} />
            ))}
          </View>
        ) : (
          <Text style={styles.noNotes}>No notes available.</Text>
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
    marginBottom: 30,
    marginTop: 22,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
    color: '#fff',
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
