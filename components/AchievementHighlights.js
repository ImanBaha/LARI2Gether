import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Animated, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Use Ionicons for trophy icon

// Sample achievements data
const achievements = [
  { id: 1, title: "10km in a Week", description: "Great job hitting 10km in one week!" },
  { id: 2, title: "Consistency is Key", description: "Logged runs every day for a week." },
  { id: 3, title: "Early Riser", description: "Completed your first early morning run." },
  { id: 4, title: "First Run with Friends", description: "Joined a group run. Keep connecting!" },
  { id: 5, title: "Night Owl Runner", description: "Completed a night run after 9 PM." },
  { id: 6, title: "Weekend Warrior", description: "Ran on both Saturday and Sunday!" },
  { id: 7, title: "Milestone Marathon", description: "Achieved a total of 42km over time." },
  { id: 8, title: "Top Speed", description: "Achieved a new highest pace!" },
  { id: 9, title: "Trailblazer", description: "Explored three unique routes." },
];

const AchievementHighlights = () => {
  const [achievementsToShow, setAchievementsToShow] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0)); // For fade-in animation
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    // Load achievements with animation
    setAchievementsToShow(achievements);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderAchievement = ({ item }) => (
    <TouchableWithoutFeedback
      onPressIn={() => setHovered(item.id)}
      onPressOut={() => setHovered(null)}
    >
      <Animated.View style={[styles.achievementCard, { opacity: fadeAnim }, hovered === item.id && styles.achievementCardHover]}>
        <Ionicons name="trophy" size={50} color="#F9C74F" style={styles.achievementIcon} />
        <View style={styles.textContainer}>
          <Text style={styles.achievementTitle}>{item.title}</Text>
          <Text style={styles.achievementDescription}>{item.description}</Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Achievement Highlights</Text>
      <FlatList
        data={achievementsToShow}
        renderItem={renderAchievement}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

export default AchievementHighlights;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    fontFamily: 'Roboto',
    color: '#FAF9F6',
    marginTop: 25,
  },
  flatListContainer: {
    paddingBottom: 10,
  },
  achievementCard: {
    backgroundColor: '#ffffff',  // Clean white background for the card
    borderRadius: 15,
    padding: 20,
    width: 250,
    marginRight: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    transition: 'transform 0.3s ease-in-out',
    marginBottom: 95,
    
  },
  achievementIcon: {
    marginBottom: 12,
  },
  textContainer: {
    alignItems: 'center',
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    fontFamily: 'Poppins',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Poppins',
    paddingHorizontal: 10,
  },
  achievementCardHover: {
    backgroundColor: '#F9F9F9',  // Slightly darker grey when hovered
    transform: [{ scale: 1.05 }],
    shadowColor: '#F9C74F',  // Subtle golden shadow on hover
    shadowRadius: 20,
    shadowOpacity: 0.3,
    elevation: 8,
    
  },
});
