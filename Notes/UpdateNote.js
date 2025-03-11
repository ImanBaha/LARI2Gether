import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
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
      .update({ title, description, rating: parseInt(rating, 10) })
      .eq("id", id);

    if (error) {
      console.error("Error updating note:", error);
      setFormError("There was an issue updating the note.");
      Alert.alert("Error", "Failed to update note.");
    } else {
      setFormError(null);
      Alert.alert("Success", "Note updated successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient colors={['#0066b2', '#ADD8E6', '#F0FFFF']} style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back-circle" size={34} color="#FFAC1C" />
      </TouchableOpacity>

      <Text style={styles.header}>Update Running Journal</Text>

      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputHeader}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter title"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputHeader}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter description"
            placeholderTextColor="#888"
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
            placeholderTextColor="#888"
            value={rating}
            onChangeText={setRating}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity onPress={handleSubmit} style={styles.updateButton}>
            <LinearGradient
              colors={["#4caf50", "#388e3c"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Update</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <LinearGradient
              colors={["#e53935", "#b71c1c"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    top: 45,
    left: 10,
    zIndex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "black",
    marginTop: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  textArea: {
    height: 250,
    textAlignVertical: "top",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  updateButton: {
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 10,
  },
  buttonGradient: {
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "#e74c3c",
    textAlign: "center",
    marginTop: 15,
    fontSize: 14,
    fontStyle: "italic",
  },
});

export default UpdateNote;
