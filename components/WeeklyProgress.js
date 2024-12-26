import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import * as Progress from 'react-native-progress';
import { useNavigation } from '@react-navigation/native';

const ProgressCard = ({ progress, goal, label, color }) => {
  const percentage = Math.min((progress / goal) * 100, 100).toFixed(1); // Ensure it does not exceed 100%

  return (
    <View style={styles.progressCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.progressCardLabel}>{label}</Text>
      </View>
      <Progress.Circle
        size={150}
        progress={progress / goal}
        color={color}
        unfilledColor="#E0E0E0"
        borderWidth={0}
        thickness={10}
        showsText
        formatText={() => `${percentage}%`}
        textStyle={styles.progressText}
      />
      <Text style={styles.progressDetails}>{`${progress} / ${goal}`}</Text>
    </View>
  );
};

const WeeklyProgress = () => {
  const navigation = useNavigation();

  // Example Data
  const weeklyProgress = 12; // Weekly distance covered in km
  const totalDistance = 50; // Total distance covered in the month in km
  const goalDistance = 20; // Weekly goal distance in km

  const handleViewMore = () => {
    navigation.navigate('ListOfProgress');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Weekly & Overall Progress</Text>
        <TouchableOpacity onPress={handleViewMore}>
          <Text style={styles.viewMore}>View More</Text>
        </TouchableOpacity>
      </View>

      {/* Weekly Progress */}
      <ProgressCard
        progress={weeklyProgress}
        goal={goalDistance}
        label="Weekly Progress"
        color="#059669"
      />

      {/* Total Distance Progress */}
      <ProgressCard
        progress={totalDistance}
        goal={goalDistance * 4} // Assuming a monthly goal
        label="Total Distance (This Month)"
        color="#1E90FF"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 15,
    // Remove the backgroundColor property
    backgroundColor: 'transparent',  // Ensures no color background
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FAF9F6',
  },
  viewMore: {
    fontSize: 14,
    color: '#1E90FF',
    textDecorationLine: 'underline',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    alignItems: 'center',
  },
  cardHeader: {
    marginBottom: 10,
  },
  progressCardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  progressDetails: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default WeeklyProgress;
