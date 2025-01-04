import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons"; // For the back icon

const UpdateNote = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params; // Get the note ID passed from the previous screen

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState("");
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    // Fetch note data for the given ID
    const fetchNote = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching note:", error);
        Alert.alert("Error", "Failed to load note data.");
        navigation.goBack();
      }

      if (data) {
        setTitle(data.title);
        setDescription(data.description);
        setRating(data.rating);
      }
    };

    fetchNote();
  }, [id, navigation]);

  const handleSubmit = async () => {
    // Form validation
    if (!title || !description || !rating) {
      setFormError("Please fill in all the fields correctly.");
      return;
    }

    // Update the note
    const { data, error } = await supabase
      .from("notes")
      .update({ title, description, rating })
      .eq("id", id);

    if (error) {
      console.error("Error updating note:", error);
      setFormError("There was an issue updating the note.");
      Alert.alert("Error", "Failed to update note.");
    } else {
      setFormError(null);
      Alert.alert("Success", "Note updated successfully!");
      navigation.goBack(); // Navigate back after successful update
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

      <Text style={styles.header}>Update Note</Text>

      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputHeader}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter title"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputHeader}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputHeader}>Rating</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter rating (1-5)"
            value={rating}
            onChangeText={setRating}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.buttonGroup}>
          <Button title="Update Note" onPress={handleSubmit} color="#0066b2" />
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
    padding: 15,
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
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
    marginTop: 23,
  },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
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
  },
});

export default UpdateNote;
