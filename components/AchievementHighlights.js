// AchievementHighlights.js

import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Animated, FlatList, TouchableWithoutFeedback } from 'react-native';

// Sample achievements data
const achievements = [
  { id: 1, title: "10km in a Week", description: "Great job hitting 10km in one week!", icon: require('../assests/images/slide1.png') },
  { id: 2, title: "First 5K Without Stopping", description: "Impressive! You completed a 5K without a break.", icon: require('../assests/images/slide1.png') },
  { id: 3, title: "Consistency is Key", description: "Logged runs every day for a week.", icon: require('../assests/images/slide1.png') },
  { id: 4, title: "Early Riser", description: "Completed your first early morning run.", icon: require('../assests/images/slide1.png') },
  { id: 5, title: "First Run with Friends", description: "Joined a group run. Keep connecting!", icon: require('../assests/images/slide1.png') },
  { id: 6, title: "Night Owl Runner", description: "Completed a night run after 9 PM.", icon: require('../assests/images/slide1.png') },
  { id: 7, title: "Weekend Warrior", description: "Ran on both Saturday and Sunday!", icon: require('../assests/images/slide1.png') },
  { id: 8, title: "Milestone Marathon", description: "Achieved a total of 42km over time.", icon: require('../assests/images/slide1.png') },
  { id: 9, title: "Top Speed", description: "Achieved a new highest pace!", icon: require('../assests/images/slide1.png') },
  { id: 10, title: "Trailblazer", description: "Explored three unique routes.", icon: require('../assests/images/slide1.png') },
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
        <Image source={item.icon} style={styles.achievementIcon} />
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
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingLeft: 15,
    fontFamily: 'Roboto',
  },
  flatListContainer: {
    paddingLeft: 15,
  },
  achievementCard: {
    backgroundColor: '#1E88E5',  // Fresh blue background for the card
    borderRadius: 20,
    padding: 25,
    width: 220,
    marginRight: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    transform: [{ scale: 1 }],
    transition: 'transform 0.3s ease-in-out',
  },
  achievementIcon: {
    width: 70,
    height: 70,
    marginBottom: 12,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
  },
  textContainer: {
    alignItems: 'center',
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
    fontFamily: 'Poppins',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins',
    paddingHorizontal: 10,
  },
  achievementCardHover: {
    backgroundColor: '#1D8FE6',  // Slightly lighter blue when hovered
    transform: [{ scale: 1.05 }],
    shadowColor: '#1D8FE6',
    shadowRadius: 20,
    shadowOpacity: 0.5,
    elevation: 10,
  },
});
