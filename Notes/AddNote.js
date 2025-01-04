import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { supabase } from "../lib/supabase"; // Your Supabase client instance
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons"; // For the back icon

const AddNote = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState("");
  const [formError, setFormError] = useState(null);

  const handleSubmit = async () => {
    if (!title || !description || !rating) {
      setFormError("Please fill in all the fields correctly.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("notes")
        .insert([{ title, description, rating: parseInt(rating, 10) }]);

      if (error) {
        console.error("Error inserting note:", error);
        setFormError("There was an issue creating the note.");
        Alert.alert("Error", "There was an issue creating the note.");
      } else {
        console.log("Insert successful:", data);
        setFormError(null);
        Alert.alert(
          "Success",
          "Note created successfully!",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setFormError("Unexpected error occurred.");
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient colors={["#0066b2", "#ff9900"]} style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.header}>Create New Note</Text>

      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputHeader}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter title"
            placeholderTextColor="#666"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputHeader}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter description"
            placeholderTextColor="#666"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputHeader}>Rating</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter rating (1-10)"
            placeholderTextColor="#666"
            value={rating}
            onChangeText={setRating}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.buttonGroup}>
          <Button title="Create Note" onPress={handleSubmit} color="#0066b2" />
          <Button title="Cancel" onPress={handleCancel} color="#e74c3c" />
        </View>

        {formError && <Text style={styles.error}>{formError}</Text>}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 15,
    zIndex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#fff",
    marginTop: 23,
  },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  error: {
    color: "#e74c3c",
    textAlign: "center",
    marginTop: 15,
    fontSize: 16,
    fontStyle: "italic",
  },
});

export default AddNote;
