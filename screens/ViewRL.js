import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

const ViewRL = ({ route, navigation }) => {
  const { totaldistance } = route.params;

  let currentLevel = "Yellow";
  let nextLevel = "Orange";
  let nextLevelDistance = 50 - totaldistance;

  if (totaldistance >= 50 && totaldistance < 250) {
    currentLevel = "Orange";
    nextLevel = "Green";
    nextLevelDistance = 250 - totaldistance;
  } else if (totaldistance >= 250 && totaldistance < 600) {
    currentLevel = "Green";
    nextLevel = "Blue";
    nextLevelDistance = 600 - totaldistance;
  } else if (totaldistance >= 600 && totaldistance < 1500) {
    currentLevel = "Blue";
    nextLevel = "Purple";
    nextLevelDistance = 1500 - totaldistance;
  } else if (totaldistance >= 1500) {
    currentLevel = "Purple";
    nextLevel = "MAX Level";
    nextLevelDistance = 0;
  }

  const progressPercentage = totaldistance < 1500
    ? (totaldistance / (totaldistance + nextLevelDistance)) * 100
    : 100;

  const getLevelLogo = (level) => {
    switch (level) {
      case "Yellow":
        return "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/RunLevel/yellow.png";
      case "Orange":
        return "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/RunLevel/orange.png";
      case "Green":
        return "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/RunLevel/green.png";
      case "Blue":
        return "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/RunLevel/blue.png";
      case "Purple":
        return "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/RunLevel/purple.png";
      default:
        return null;
    }
  };

  const levels = [
    { level: "Yellow", range: "0 – 49.99 Kilometres", color: "#FFD700" },
    { level: "Orange", range: "50 – 249.99 Kilometres", color: "#FFA500" },
    { level: "Green", range: "250 – 599.99 Kilometres", color: "#32CD32" },
    { level: "Blue", range: "600 – 1499.99 Kilometres", color: "#1E90FF" },
    { level: "Purple", range: "1500 & More Kilometres", color: "#800080" },
  ];

  return (
    <LinearGradient 
      colors={['#0066b2', '#ADD8E6', '#F0FFFF']} 
      style={styles.gradientContainer}
    >
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-circle" size={32} color="#FFAC1C" />
          </TouchableOpacity>
          <Text style={styles.header}>Run Level</Text>
        </View>

        <View style={styles.currentLevelCard}>
          <Image
            source={{ uri: getLevelLogo(currentLevel) }}
            style={styles.mainLogo}
          />
          <Text style={styles.currentLevelText}>Current Level: {currentLevel}</Text>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.progressText}>
            {nextLevelDistance.toFixed(2)} km to {nextLevel}
          </Text>
          <View style={styles.progressBarContainer}>
            <LinearGradient
              colors={['#64b5f6', '#2196f3', '#1976d2']}
              style={[styles.progressBar, { width: `${progressPercentage}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
          <Text style={styles.progressPercentage}>
            {Math.round(progressPercentage)}% Complete
          </Text>
        </View>

        <Text style={styles.sectionTitle}>All Levels</Text>
        <View style={styles.levelCardsContainer}>
          {levels.map((item) => (
            <TouchableOpacity
              key={item.level}
              style={[
                styles.levelCard,
                currentLevel === item.level && styles.activeLevelCard,
              ]}
            >
              <LinearGradient
                colors={[item.color, item.color + '99']}
                style={styles.levelCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Image
                  source={{ uri: getLevelLogo(item.level) }}
                  style={styles.levelLogo}
                />
                <View style={styles.levelInfo}>
                  <Text style={styles.levelName}>{item.level}</Text>
                  <Text style={styles.levelRange}>{item.range}</Text>
                </View>
                {currentLevel === item.level && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>Current</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};
 
const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingTop: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    color: "black",
    flex: 1,
    textAlign: 'center',
    marginRight: 32, // Compensate for back button
  },
  backButton: {
    padding: 5,
  },
  currentLevelCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  mainLogo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 15,
  },
  currentLevelText: {
    fontSize: 20,
    fontWeight: "700",
    color: "black",
  },
  progressSection: {
    marginBottom: 30,
  },
  progressText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    color: "black",
    fontWeight: "600",
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    borderRadius: 6,
  },
  progressPercentage: {
    fontSize: 14,
    color: "black",
    textAlign: "right",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "black",
    marginBottom: 20,
  },
  levelCardsContainer: {
    gap: 15,
  },
  levelCard: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  activeLevelCard: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  levelCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  levelLogo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginRight: 15,
  },
  levelInfo: {
    flex: 1,
  },
  levelName: {
    fontSize: 18,
    fontWeight: "700",
    color: "black",
    marginBottom: 4,
  },
  levelRange: {
    fontSize: 14,
    color: "black",
    opacity: 0.9,
  },
  currentBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  currentBadgeText: {
    color: 'black',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ViewRL;