import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const RunLevel = () => {
  const navigation = useNavigation();

  // Directly set the totaldistance value
  const totaldistance = 23.8;

  // Determine card color based on distance
  let levelColor = "yellow";
  if (totaldistance >= 50 && totaldistance < 150) {
    levelColor = "orange";
  } else if (totaldistance >= 150 && totaldistance < 300) {
    levelColor = "green";
  } else if (totaldistance >= 300 && totaldistance < 450) {
    levelColor = "blue";
  } else if (totaldistance >= 500) {
    levelColor = "purple";
  }

  // Calculate distance to the next level
  const nextLevelDistance =
    totaldistance < 50
      ? 50 - totaldistance
      : totaldistance < 150
      ? 150 - totaldistance
      : totaldistance < 300
      ? 300 - totaldistance
      : totaldistance < 450
      ? 450 - totaldistance
      : 1000 - totaldistance;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={
          levelColor === "yellow"
            ? ["#FFD700", "#FFC107"]
            : levelColor === "orange"
            ? ["#FFA500", "#FF8C00"]
            : levelColor === "green"
            ? ["#32CD32", "#228B22"]
            : levelColor === "blue"
            ? ["#1E90FF", "#4169E1"]
            : ["#800080", "#4B0082"]
        }
        style={styles.card}
      >
        <Text style={styles.title}>{levelColor.toUpperCase()}</Text>
        <Text style={styles.distance}>{totaldistance.toFixed(1)}</Text>
        <Text style={styles.totalKilometers}>Total Kilometres</Text>
        <View style={styles.progressBarContainer}>
        <View
            style={[
            styles.progressBar,
            {
                width: `${Math.min(
                (totaldistance / (totaldistance + nextLevelDistance)) * 100,
                100
                )}%`,
            },
            ]}
        />
        </View>
        <Text style={styles.nextLevelText}>
        {nextLevelDistance.toFixed(2)} km to next level
        </Text>
      </LinearGradient>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ViewRL", { totaldistance })}
      >
        <Text style={styles.buttonText}>View Run Levels</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 10 },
    card: { width: "100%", borderRadius: 10, padding: 20, marginBottom: 20 },
    title: { fontSize: 15, fontWeight: "bold", color: "black" },
    distance: { 
        fontSize: 33,           // Adjusted size to be smaller
        fontWeight: "900",      // Lighter weight for a more elegant look
        color: "#333",          // Slightly lighter color for better readability
        marginVertical: 8,      // Reduced vertical margin for balance
      },
    totalKilometers: { fontSize: 13, color: "black", marginBottom: 10 },
    progressBarContainer: { width: "100%", height: 10, backgroundColor: "#ddd", borderRadius: 5, overflow: "hidden" },
    progressBar: { height: "100%", backgroundColor: "black" },
    nextLevelText: { marginTop: 10, color: "black", fontSize: 13 },
    button: { 
        backgroundColor: "#f8f8f8",     // Subtle off-white color for a clean, modern look
        paddingVertical: 15,             // Vertical padding for better balance
        paddingHorizontal: 30,           // Horizontal padding to adjust text size
        borderRadius: 25,               // Rounded corners
        width: "100%",                  // Full width
        alignItems: "center",           // Horizontally center the text
        justifyContent: "center",       // Vertically center the text
        elevation: 5,                   // Slightly stronger shadow for Android
        shadowColor: "#000",            // Shadow color (for iOS)
        shadowOffset: { width: 0, height: 3 },  // Slightly deeper shadow for iOS
        shadowOpacity: 0.15,            // Slight shadow opacity for a clean effect (iOS)
        shadowRadius: 5,                // Shadow radius (iOS)
        bottom: 12,
      },
      
      buttonText: { 
        color: "#333",                 // Dark gray text color for better contrast
        fontWeight: "bold",             // Make text bold
        fontSize: 18,                   // Text size
        textAlign: "center",            // Ensure text is centered
      }
  });

export default RunLevel;
