import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the back icon
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import AddChallengeModal from '../components/AddChallengeModal';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListOfChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigation = useNavigation(); // Use navigation hook

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const storedChallenges = await AsyncStorage.getItem('challenges');
        if (storedChallenges) {
          setChallenges(JSON.parse(storedChallenges));
        }
      } catch (error) {
        console.error('Error loading challenges from AsyncStorage:', error);
      }
    };

    loadChallenges();
  }, []);

  const saveChallengesToStorage = async (challenges) => {
    try {
      await AsyncStorage.setItem('challenges', JSON.stringify(challenges));
    } catch (error) {
      console.error('Error saving challenges to AsyncStorage:', error);
    }
  };

  const handleAddChallenge = (newChallenge, isUpdate = false) => {
    let updatedChallenges;

    if (isUpdate) {
      updatedChallenges = challenges.map((item) =>
        item.id === editingId ? { ...item, ...newChallenge } : item
      );
    } else {
      const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      updatedChallenges = [...challenges, { id: newId, ...newChallenge }];
    }

    setChallenges(updatedChallenges);
    saveChallengesToStorage(updatedChallenges);

    setIsModalVisible(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEditChallenge = (challenge) => {
    setIsEditing(true);
    setEditingId(challenge.id);
    setIsModalVisible(true);
  };

  const handleDeleteChallenge = (id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this challenge?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updatedChallenges = challenges.filter((item) => item.id !== id);
          setChallenges(updatedChallenges);
          saveChallengesToStorage(updatedChallenges);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4A90F2', '#FAF9F6']} style={styles.gradientContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.header}>List of Challenges</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setIsEditing(false);
              setIsModalVisible(true);
            }}
          >
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={challenges}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.challenge}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.status}>{item.status}</Text>
              <Text style={styles.date}>{moment(item.date).format('MMMM Do YYYY')}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditChallenge(item)}
                >
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteChallenge(item.id)}
                >
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </LinearGradient>

      <AddChallengeModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAdd={handleAddChallenge}
        isEditing={isEditing}
        existingChallenge={challenges.find((item) => item.id === editingId)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  gradientContainer: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop:25,
  },
  goBackButton: {
    marginRight: 15,
    zIndex: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#059669',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  challenge: {
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  status: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#FBBF24',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    padding: 8,
    borderRadius: 5,
  },
  actionText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default ListOfChallenges;
