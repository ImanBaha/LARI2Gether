import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Picker } from '@react-native-picker/picker';

const UpdateCh = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [level, setLevel] = useState("");
  const [image, setImage] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
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

  const levelOptions = [
    'Easy Run',
    'Brisk Walk',
    'Interval Run',
    'Long Run',
    'Recovery Run'
  ];

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

  const deleteOldImage = async (oldImageUrl) => {
    try {
      const oldFilePath = oldImageUrl.split('/').pop();
      
      if (oldFilePath) {
        const { error } = await supabase.storage
          .from('Challenges')
          .remove([oldFilePath]);
          
        if (error) {
          console.error('Error deleting old image:', error);
        }
      }
    } catch (error) {
      console.error('Error in deleteOldImage:', error);
    }
  };

  const uploadImageToSupabase = async (uri) => {
    try {
      setUploading(true);
      
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpeg';
      const filename = `challenge_${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from('Challenges')
        .upload(filename, byteArray.buffer, {
          contentType: "image/jpeg"
        });

      if (uploadError) {
        throw new Error('Failed to upload image to Supabase.');
      }

      const { data: publicUrlData, error: urlError } = supabase.storage
        .from('Challenges')
        .getPublicUrl(data.path);

      if (urlError) {
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
    if (!title || !description || !location || !date || !time || !level) {
      setFormError("Please fill in all the fields correctly.");
      return;
    }

    try {
      let imageUrl = image;

      if (imageUri) {
        const newImageUrl = await uploadImageToSupabase(imageUri);
        if (newImageUrl) {
          await deleteOldImage(image);
          imageUrl = newImageUrl;
        } else {
          setFormError('Image upload failed. Please try again.');
          return;
        }
      }

      const formattedDate = date.toISOString().split("T")[0];

      const { error } = await supabase
        .from("challenge")
        .update({
          title,
          description,
          location,
          date: formattedDate,
          time,
          level,
          image: imageUrl
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      Alert.alert(
        "Success",
        "Challenge updated successfully!",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error("Error updating challenge:", error);
      setFormError("There was an issue updating the challenge.");
      Alert.alert("Error", "Failed to update challenge.");
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={['#0066b2', '#ADD8E6', '#F0FFFF']}
      style={styles.gradient}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>

        <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back-circle" size={36} color="#FFAC1C" />
      </TouchableOpacity>

          <Text style={styles.header}>Update Challenge</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputHeader}>Image</Text>
            <TouchableOpacity 
              style={styles.uploadButton} 
              onPress={pickImage}
              activeOpacity={0.8}
            >
              <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
              <Text style={styles.uploadButtonText}>Change Image</Text>
            </TouchableOpacity>
            {imageUri ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
                <TouchableOpacity 
                  style={styles.changeImageButton}
                  onPress={pickImage}
                >
                  <Text style={styles.changeImageText}>Change Image</Text>
                </TouchableOpacity>
              </View>
            ) : image ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.previewImage} />
                <TouchableOpacity 
                  style={styles.changeImageButton}
                  onPress={pickImage}
                >
                  <Text style={styles.changeImageText}>Change Image</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <Ionicons name="images-outline" size={40} color="#999" />
                <Text style={styles.placeholder}>No image selected</Text>
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputHeader}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter title"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputHeader}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter description"
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputHeader}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter location"
              placeholderTextColor="#999"
              value={location}
              onChangeText={setLocation}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputHeader}>Date</Text>
            <TouchableOpacity 
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#0066b2" />
              <Text style={styles.dateText}>
                {date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputHeader}>Time (HH:MM)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter time"
              placeholderTextColor="#999"
              value={time}
              onChangeText={setTime}
            />
          </View>

          <View style={styles.inputGroup}>
    <Text style={styles.inputHeader}>Level</Text>
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={level}
        onValueChange={(itemValue) => setLevel(itemValue)}
        style={styles.picker}
        mode="dropdown"
      >
        {levelOptions.map((option) => (
          <Picker.Item 
            key={option} 
            label={option} 
            value={option}
            style={styles.pickerItem}
          />
        ))}
      </Picker>
    </View>
  </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.button, styles.submitButton]} 
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              {uploading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Save</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={handleCancel}
              activeOpacity={0.8}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>

          {formError && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={20} color="#e74c3c" />
              <Text style={styles.error}>{formError}</Text>
            </View>
          )}
        </View>
      </ScrollView>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 13,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 0,
  },
  backButton: {
    padding: 5,
    marginLeft: 0,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
    flex: 1,
    textAlign: "center",
    right: 10,
  },
  headerRight: {
    width: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  uploadButton: {
    backgroundColor: "#0066b2",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 8,
  },
  changeImageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  placeholderContainer: {
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
},
placeholder: {
    marginTop: 10,
    color: "#999",
    fontSize: 14,
},
datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    height: 50,
},
dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
},
buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
},
button: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
},
submitButton: {
    backgroundColor: "#0066b2",
},
cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e74c3c",
},
buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
},
cancelButtonText: {
    color: "#e74c3c",
},
errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
},
error: {
    color: "#e74c3c",
    marginLeft: 8,
    fontSize: 14,
},
pickerContainer: {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 10,
  backgroundColor: '#fff',
  overflow: 'hidden',
},
picker: {
  height: 50,
  width: '100%',
  backgroundColor: 'transparent',
},
pickerItem: {
  fontSize: 16,
  color: '#333',
},
});

export default UpdateCh;