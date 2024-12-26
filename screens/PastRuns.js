import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';  // Import Ionicons

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
      }
    } catch (error) {
      console.error('Error loading past runs:', error);
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
    <LinearGradient colors={['#4A90F2', '#FAF9F6']} style={styles.container}>
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
    paddingHorizontal: 20, // Add padding to the sides
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2F3A4B',
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
    marginHorizontal: 1, // Ensure proper spacing from screen edges
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
    lineHeight: 24,
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
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 75, // Align with the run items
    marginTop: 10,
    marginBottom: 25,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  goBackButton: {
    paddingLeft: 10,
    marginTop:30,
  }
});
