import React from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const ViewRL = ({ route }) => {
  // Retrieve the totaldistance passed from the previous screen
  const { totaldistance } = route.params;

  // Determine next level and distance to next level
  let currentLevel = "Yellow";
  let nextLevel = "Orange";
  let nextLevelDistance = 50 - totaldistance;

  if (totaldistance >= 50 && totaldistance < 250) {
    currentLevel = "Orange";
    nextLevel = "Green";
    nextLevelDistance = 250 - totaldistance;
  } else if (totaldistance >= 250 && totaldistance < 1000) {
    currentLevel = "Green";
    nextLevel = "Blue";
    nextLevelDistance = 1000 - totaldistance;
  } else if (totaldistance >= 1000 && totaldistance < 2500) {
    currentLevel = "Blue";
    nextLevel = "Purple";
    nextLevelDistance = 2500 - totaldistance;
  } else if (totaldistance >= 2500) {
    currentLevel = "Purple";
    nextLevel = "MAX Level";
    nextLevelDistance = 0; // Already at max level
  }

  // Progress calculation
  const progressPercentage =
    Math.min((totaldistance / (totaldistance + nextLevelDistance)) * 100, 100);

  // Data for levels
  const levels = [
    { level: "Yellow", range: "0–49.99 Kilometres" },
    { level: "Orange", range: "50.00–249.9 Kilometres" },
    { level: "Green", range: "250.0–999.9 Kilometres" },
    { level: "Blue", range: "1,000–2,499 Kilometres" },
    { level: "Purple", range: "2,500–4,999 Kilometres" },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Run Levels</Text>

      {/* Current Level Image Placeholder */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../assests/images/background.png')}
          style={styles.image}
        />
      </View>

      {/* Progress Bar */}
      <Text style={styles.progressText}>
        {nextLevelDistance.toFixed(2)} km to {nextLevel}
      </Text>
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${progressPercentage}%` },
          ]}
        />
      </View>

      {/* Levels List */}
      <FlatList
        data={levels}
        keyExtractor={(item) => item.level}
        renderItem={({ item }) => (
          <View style={styles.levelItem}>
            <LinearGradient
              colors={
                item.level === "Yellow"
                  ? ["#FFD700", "#FFC107"]
                  : item.level === "Orange"
                  ? ["#FFA500", "#FF8C00"]
                  : item.level === "Green"
                  ? ["#32CD32", "#228B22"]
                  : item.level === "Blue"
                  ? ["#1E90FF", "#4169E1"]
                  : ["#800080", "#4B0082"]
              }
              style={styles.levelBadge}
            />
            <View style={styles.levelInfo}>
              <Text style={styles.levelName}>{item.level}</Text>
              <Text style={styles.levelRange}>{item.range}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  progressText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    color: "#555",
  },
  progressBarContainer: {
    height: 10,
    width: "100%",
    backgroundColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FFA500",
  },
  levelItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    elevation: 2,
  },
  levelBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  levelInfo: {
    flex: 1,
  },
  levelName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  levelRange: {
    fontSize: 14,
    color: "#555",
  },
});

export default ViewRL;
