import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    <View style={styles.container}>
      <Text style={styles.title}>Recent Activity</Text>
      <FlatList
        data={pastRuns}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRunItem}
        contentContainerStyle={pastRuns.length === 0 ? styles.emptyContainer : null}
        ListEmptyComponent={<Text style={styles.emptyText}>No past runs available</Text>}
      />
      <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('Run')}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
    textAlign: 'center',
    marginTop:15,
  },
  runItem: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  runText: {
    fontSize: 16,
    color: '#333333',
    marginVertical: 2,
  },
  deleteButton: {
    backgroundColor: '#FF5252',
    borderRadius: 8,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#999999',
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
