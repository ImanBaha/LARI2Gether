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
    <View style={styles.card}>
      {/* Title */}
      <Text style={styles.title}>{note.title || "No Title"}</Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Description */}
      <Text style={styles.description}>{
        note.description || "No Description"
      }</Text>

      {/* Rating */}
      {note.rating && (
        <View style={styles.infoRow}>
          <Ionicons name="star-outline" size={18} color="#FFD700" />
          <Text style={styles.rating}>{note.rating}</Text>
        </View>
      )}

      {/* Buttons */}
      <View style={styles.buttonContainer}>

        {/* Update Button */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("UpdateNote", { id: note.id })}
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
  rating: {
    fontSize: 14,
    color: "#333",
    marginLeft: 5,
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

export default NotesCard;
