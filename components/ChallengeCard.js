import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../lib/supabase";

const ChallengeCard = ({ challenge }) => {
  const navigation = useNavigation();

  const handleDelete = async () => {
    Alert.alert(
      "Delete Challenge",
      "Are you sure you want to delete this challenge?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("challenge")
              .delete()
              .eq("id", challenge.id);

            if (error) {
              console.error("Error deleting challenge:", error);
              Alert.alert("Error", "Failed to delete challenge.");
            } else {
              Alert.alert("Success", "Challenge deleted successfully!");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      {/* Image */}
      {challenge.image && (
        <Image source={{ uri: challenge.image }} style={styles.image} />
      )}

      {/* Title */}
      <Text style={styles.title}>{challenge.title || "No Title"}</Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Description */}
      <Text style={styles.description}>
        {challenge.description || "No Description"}
      </Text>

      {/* Location */}
      {challenge.location && (
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={18} color="#6c63ff" />
          <Text style={styles.location}>{challenge.location}</Text>
        </View>
      )}

      {/* Date & Time */}
      {(challenge.date || challenge.time) && (
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={18} color="#6c63ff" />
          <Text style={styles.dateTime}>
            {challenge.date ? challenge.date : ""}
            {challenge.date && challenge.time ? " • " : ""}
            {challenge.time ? challenge.time : ""}
          </Text>
        </View>
      )}

      {/* Level */}
      {challenge.level && (
        <View style={styles.levelContainer}>
          <Text style={styles.level}>{challenge.level}</Text>
        </View>
      )}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {/* View Button */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("ViewCh", { id: challenge.id })}
        >
          <Ionicons name="eye" size={24} color="#0066b2" />
        </TouchableOpacity>

        {/* Update Button */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("UpdateCh", { id: challenge.id })}
        >
          <Ionicons name="create-outline" size={24} color="#0066b2" />
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity style={styles.iconButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  location: {
    fontSize: 14,
    color: "#333",
    marginLeft: 5,
  },
  dateTime: {
    fontSize: 14,
    color: "#555",
    marginLeft: 5,
  },
  levelContainer: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#6c63ff",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  level: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold", 
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  iconButton: {
    marginHorizontal: 8,
  },
});

export default ChallengeCard;
