import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../lib/supabase";

const NotesCard = ({ note }) => {
  const navigation = useNavigation();

  const handleDelete = async () => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("notes")
              .delete()
              .eq("id", note.id);

            if (error) {
              console.error("Error deleting note:", error);
              Alert.alert("Error", "Failed to delete note.");
            } else {
              Alert.alert("Success", "Note deleted successfully!");
            }
          },
        },
      ]
    );
  };

  return (
  
    <View style={styles.container}>
  <View style={styles.card}>
    <View style={styles.contentContainer}>
      {/* Header with Title */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.label}>Title</Text>
          <Text style={styles.title}>{note.title || "No Title"}</Text>
        </View>

        {/* Rating Section - Simplified */}
        {note.rating && (
          <View style={styles.ratingSection}>
            <Ionicons name="star" size={18} color="#FFD700" />
            <Text style={styles.rating}>{note.rating}</Text>
          </View>
        )}
      </View>

      {/* Description Section */}
      <View style={styles.descriptionSection}>
        <Text style={styles.label}>Description</Text>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            {note.description || "No Description"}
          </Text>
        </View>
      </View>

      {/* Created & Updated Timestamps
      {(note.created_at || note.updated_at) && (
        <View style={styles.timestampsSection}>
          {note.created_at && (
            <Text style={styles.timestamp}>
              Created: {new Date(note.created_at).toLocaleDateString()}
            </Text>
          )}
          {note.updated_at && (
            <Text style={styles.timestamp}>
              Updated: {new Date(note.updated_at).toLocaleDateString()}
            </Text>
          )}
        </View>
      )} */}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate("UpdateNote", { id: note.id })}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</View>

   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Adjusts vertical alignment
    alignItems: "center",    // Adjusts horizontal alignment
    marginTop: 5, 
    // marginVertical: 5,           // Adds spacing around the card
    marginBottom: 15,
  },
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    
  },

  contentContainer: {
    padding: 16,
    gap: 16,
    
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  titleContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666666",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontSize: 22,
    color: "#333333",
    fontWeight: "500",
  },
  descriptionSection: {
    width: "100%",
  },
  descriptionContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
  },
  description: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
  },
  timestampsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  timestamp: {
    fontSize: 12,
    color: "#666666",
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  editButton: {
    backgroundColor: "#4A90E2",
  },
  deleteButton: {
    backgroundColor: "#FF4757",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default NotesCard;