import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ScrollView, ActivityIndicator, Image, Platform } from "react-native";
import { supabase } from "../lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";




const AddCh = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [level, setLevel] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);


  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };


  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'Permission to access media library is required.');
        return;
      }


      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });


      if (result.canceled || !result.assets || result.assets.length === 0) {
        Alert.alert('Cancelled', 'Image selection was cancelled.');
        return;
      }


      const selectedImage = result.assets[0];
      setImageUri(selectedImage.uri);
    } catch (error) {
      console.error('Image picking error:', error);
      Alert.alert('Error', 'Something went wrong while selecting the image.');
    }
  };


  const uploadImageToSupabase = async (uri) => {
    try {
      setUploading(true);
      console.log('Uploading image from URI:', uri);

            // Read the file from the given URI as base64
            const base64 = await FileSystem.readAsStringAsync(uri, {
              encoding: FileSystem.EncodingType.Base64,
            });

                  // Convert the base64 to ArrayBuffer
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) { 
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
  
        
      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpeg';
      const filename = `challenge_${Date.now()}.${fileExt}`;
            
      // Upload the blob to Supabase storage with correct content type
      const { data, error: uploadError } = await supabase.storage
        .from('Challenges')
        .upload(filename, byteArray.buffer, {
          contentType: "image/jpeg"
        });
  
      if (uploadError) {
        console.error('Supabase Upload Error:', uploadError);
        throw new Error('Failed to upload image to Supabase.');
      }
  
      // Fetch the public URL of the uploaded image
      const { data: publicUrlData, error: urlError } = supabase.storage
        .from('Challenges')
        .getPublicUrl(data.path);

      if (urlError) {
        console.error('Supabase Public URL Error:', urlError);
        throw new Error('Failed to retrieve public URL from Supabase.');
      }
  
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      Alert.alert('Error', 'Image upload failed.');
      return null;
    } finally {
      setUploading(false);
    }
  };


  const handleSubmit = async () => {
    if (!title || !description || !location || !date || !time || !level || !imageUri) {
      setFormError('Please fill in all the fields correctly.');
      return;
    }


    const formattedDate = date.toISOString().split('T')[0];
    const uploadedImageUrl = await uploadImageToSupabase(imageUri);


    if (!uploadedImageUrl) {
      setFormError('Image upload failed. Please try again.');
      return;
    }


    try {
      const { data, error } = await supabase
        .from('challenge')
        .insert([{ title, description, location, date: formattedDate, time, level, image: uploadedImageUrl }]);


      if (error) {
        console.error('Insert error:', error);
        setFormError('There was an issue creating the challenge.');
        Alert.alert("Error", "There was an issue creating the challenge.");
      } else {
        setFormError(null);
        Alert.alert(
          "Success",
          "Challenge created successfully!",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setFormError('Unexpected error occurred.');
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };


  const handleCancel = () => {
    navigation.goBack();
  };


  return (
    <LinearGradient
      colors={['#0066b2', '#ff9900']}
      style={styles.gradient}
    >
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>


        <Text style={styles.header}>Create New Challenge</Text>


        <View style={styles.card}>
          <View style={styles.inputGroup}>

          <View style={styles.inputGroup}>
            <Text style={styles.inputHeader}>Image</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadButtonText}>Upload Image</Text>
            </TouchableOpacity>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <Text style={styles.placeholder}>No image selected</Text>
            )}
          </View> 
          
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
            <Text style={styles.inputHeader}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter location"
              placeholderTextColor="#666"
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
              placeholderTextColor="#666"
              value={time}
              onChangeText={setTime}
            />
          </View>


          <View style={styles.inputGroup}>
            <Text style={styles.inputHeader}>Level</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter level"
              placeholderTextColor="#666"
              value={level}
              onChangeText={setLevel}
            />
          </View>


         


          <View style={styles.buttonGroup}>
            <Button title="Create Challenge" onPress={handleSubmit} color="#0066b2" />
            <Button title="Cancel" onPress={handleCancel} color="#e74c3c" />
          </View>


          {uploading && <ActivityIndicator size="large" color="#0066b2" />}
          {formError && <Text style={styles.error}>{formError}</Text>}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};


const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  backButton: {
    position: "absolute",
    top: 25,
    left: 12,
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
    marginBottom: 30,
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
  datePickerContainer: {
    marginTop: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  uploadButton: {
    backgroundColor: "#0066b2",
    padding: 6, // Reduced padding
    borderRadius: 4, // Slightly smaller radius
    alignItems: "center",
    width: 100,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  previewImage: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  placeholder: {
    marginTop: 10,
    color: "#888",
    fontStyle: "italic",
  },
  error: {
    color: "#e74c3c",
    textAlign: "center",
    marginTop: 15,
    fontSize: 16,
    fontStyle: "italic",
  },
});


export default AddCh;
