import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import Linear Gradient
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/FontAwesome';

const ListOfProgress = ({ navigation }) => {
  const progressData = [
    { id: '1', label: 'Week 1', progress: 20, goal: 50 },
    { id: '2', label: 'Week 2', progress: 35, goal: 50 },
    { id: '3', label: 'Week 3', progress: 50, goal: 50 },
    { id: '4', label: 'Week 4', progress: 40, goal: 50 },
  ];

  const motivationalMessages = [
    { id: 1, message: "Great job! Keep pushing, you're doing amazing!" },
    { id: 2, message: "You're crushing it! Keep up the great work!" },
    { id: 3, message: "Awesome progress! Stay strong and keep going!" },
    { id: 4, message: "Well done! You've made fantastic progress, keep it up!" },
    { id: 5, message: "You're on fire! Keep this momentum going!" },
  ];

  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    return motivationalMessages[randomIndex];
  };

  const totalDistance = progressData.reduce((acc, curr) => acc + curr.progress, 0);
  const totalGoal = progressData.length * 50; // Assuming each week has a 50 km goal
  const totalPercentage = Math.round((totalDistance / totalGoal) * 100);

  const renderProgressItem = ({ item }) => {
    const percentage = Math.round((item.progress / item.goal) * 100);

    return (
      <View style={styles.progressItem}>
        <View style={styles.itemDetails}>
          <Text style={styles.label}>{item.label}</Text>
          <Progress.Circle
            progress={item.progress / item.goal}
            size={95}
            strokeWidth={10}
            showsText={false}
            color="#059669"
            unfilledColor="#E0E0E0"
            borderWidth={1}
            borderColor="#B3B3B3"
            borderRadius={5}
          />
          <Text style={styles.percentage}>{`${percentage}% (${item.progress} km / ${item.goal} km)`}</Text>
          <TouchableOpacity
            style={styles.viewMoreButton}
            onPress={() => navigation.navigate('ProgressId', {
              progressId: item.id,
              randomMessage: getRandomMessage(),
            })}
          >
            <Icon name="trophy" size={24} color="#FFD700" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
    colors={['#A7F3D0', '#F0FDF4']}
      style={styles.container}
    >
      {/* Back Icon */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#333" />
        
      </TouchableOpacity>

      {/* Total Distance Progress for the Month */}
      <Text style={styles.totalDistanceHeader}>Total Distance (This Month)</Text>
      <Progress.Bar
        progress={totalDistance / totalGoal}
        width={null}
        height={12}
        color="#059669"
        unfilledColor="#E0E0E0"
        borderWidth={2}
        borderColor="#B3B3B3"
        borderRadius={5}
      />
      <Text style={styles.percentage}>
        {`${totalPercentage}% (${totalDistance} km / ${totalGoal} km)`}
      </Text>

      <FlatList
        data={progressData}
        keyExtractor={(item) => item.id}
        renderItem={renderProgressItem}
        contentContainerStyle={styles.listContainer}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 0,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    size: 35,
    marginTop: 15,
  },
  totalDistanceHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
    marginTop: 20,
  },
  progressItem: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    alignItems: 'center',
  },
  itemDetails: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  percentage: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
  viewMoreButton: {
    backgroundColor: '#059669',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ListOfProgress;
