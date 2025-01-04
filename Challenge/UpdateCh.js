import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons"; // For the back icon

const UpdateCh = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params; // Get the challenge ID passed from the previous screen

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [level, setLevel] = useState("");
  const [image, setImage] = useState("");
  const [formError, setFormError] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    // Fetch challenge data for the given ID
    const fetchChallenge = async () => {
      const { data, error } = await supabase
        .from("challenge")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching challenge:", error);
        Alert.alert("Error", "Failed to load challenge data.");
        navigation.goBack();
      }

      if (data) {
        setTitle(data.title);
        setDescription(data.description);
        setLocation(data.location);
        setDate(new Date(data.date));
        setTime(data.time);
        setLevel(data.level);
        setImage(data.image);
      }
    };

    fetchChallenge();
  }, [id, navigation]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    // Form validation
    if (!title || !description || !location || !date || !time || !level || !image) {
      setFormError("Please fill in all the fields correctly.");
      return;
    }

    // Format the date
    const formattedDate = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD

    // Update the challenge
    const { data, error } = await supabase
      .from("challenge")
      .update({ title, description, location, date: formattedDate, time, level, image })
      .eq("id", id);

    if (error) {
      console.error("Error updating challenge:", error);
      setFormError("There was an issue updating the challenge.");
      Alert.alert("Error", "Failed to update challenge.");
    } else {
      setFormError(null);
      Alert.alert("Success", "Challenge updated successfully!");
      navigation.goBack(); // Navigate back after successful update
    }

    const handleCancel = () => {
      navigation.goBack();
    }; 
  };

  return (
    <LinearGradient
      colors={["#0066b2", "#ff9900"]}
       style={styles.gradient}
          >
            <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.header}>Update Challenge</Text>

      <View style={styles.card}>
        <View style={styles.inputGroup}>

        <View style={styles.inputGroup}>
          <Text style={styles.inputHeader}>Image URL</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter image URL"
            value={image}
            onChangeText={setImage}
          />
        </View>

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
          <Text style={styles.inputHeader}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter location"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputHeader}>Date</Text>
          <View style={styles.datePickerContainer}>
            <Button title="Pick Date" onPress={() => setShowDatePicker(true)} />
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputHeader}>Time (HH:MM)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter time"
            value={time}
            onChangeText={setTime}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputHeader}>Level</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter level"
            value={level}
            onChangeText={setLevel}
          />
        </View>

        

        <Button title="Update Challenge" onPress={handleSubmit} />

        {formError && <Text style={styles.error}>{formError}</Text>}
      </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  // Reuse the styles from AddCh or adjust as necessary
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 15,
  },
  backButton: {
    position: "absolute",
    top: 25,
    left: 12,
    zIndex: 1, 
  },
  header: {
    fontSize: 20,
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
    marginBottom: 30,
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
  datePickerContainer: {
    marginTop: 10,
  },
  error: {
    color: "#e74c3c",
    textAlign: "center",
    marginTop: 15,
    fontSize: 16,
  },
  
});

export default UpdateCh;
