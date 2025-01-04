import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { supabase } from '../lib/supabase'; // Ensure you have configured the Supabase client
import { LinearGradient } from 'expo-linear-gradient'; // Importing Expo Linear Gradient

const EditProfile = () => {
  const navigation = useNavigation();

  // State for the new fields
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [age, setAge] = useState('');
  const [contact, setContact] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    // Fetch the current profile data from the "profiles" table
    const fetchProfile = async () => {
      try {
        // Get the user ID from auth
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch user profile data from "profiles" table based on the user ID
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id) // Assuming the profile table has a reference to the user ID
            .single(); // Assuming only one profile exists per user

          if (error) {
            console.error("Error fetching profile data:", error);
            Alert.alert("Error", "Failed to load profile data.");
            return;
          }

          // Set profile data to state
          setUsername(data.username || '');
          setFullname(data.fullname || '');
          setAge(data.age || '');
          setContact(data.contact || '');
          setGender(data.gender || '');
          setAddress(data.address || '');
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        Alert.alert("Error", "Failed to load profile data.");
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    // Validate form inputs
    if (!username || !fullname || !age || !contact || !gender || !address) {
      setFormError("Please fill in all the fields.");
      return;
    }

    // Prepare the update data (sending user profile fields)
    const updateData = {
      username,
      fullname,
      age,
      contact,
      gender,
      address,
    };

    // Update user profile in the "profiles" table (not in auth user metadata)
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', (await supabase.auth.getUser()).data.user.id); // Update based on user ID

    if (error) {
      console.error("Error updating profile:", error);
      setFormError("There was an issue updating your profile.");
      Alert.alert("Error", "Failed to update profile.");
    } else {
      setFormError(null);
      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack(); // Navigate back after successful update
    }
  };

  return (
    <LinearGradient colors={['#0066b2', '#FFAA33']} style={styles.container}>
      {/* Go Back Icon */}
      <TouchableOpacity style={styles.goBackIcon} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.headerText}>Update Your Information</Text>

      {formError && <Text style={styles.errorText}>{formError}</Text>}

      <View style={styles.card}>
        {/* Header for the input form */}

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          placeholder="Enter your username"
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullname}
          placeholder="Enter your full name"
          onChangeText={setFullname}
        />

        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={age}
          placeholder="Enter your age"
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Contact</Text>
        <TextInput
          style={styles.input}
          value={contact}
          placeholder="Enter your contact number"
          onChangeText={setContact}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderButtonsContainer}>
          <TouchableOpacity
            style={[styles.genderButton, gender === 'Male' && styles.selectedGenderButton]}
            onPress={() => setGender('Male')}
          >
            <Text style={styles.genderButtonText}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderButton, gender === 'Female' && styles.selectedGenderButton]}
            onPress={() => setGender('Female')}
          >
            <Text style={styles.genderButtonText}>Female</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          placeholder="Enter your address"
          onChangeText={setAddress}
        />

        <View style={styles.buttonContainer}>
          <Button title="Save Profile" onPress={handleSubmit} color="#3366FF" />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  goBackIcon: {
    position: 'absolute',
    top: 30,
    left: 15,
    zIndex: 10,
  },
  headerText: {
    textAlign: 'center',
    marginBottom: 45,
    marginTop: 30,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  formHeader: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '600',
    color: '#cc',
  },
  input: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  genderButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  genderButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  selectedGenderButton: {
    backgroundColor: '#3366FF',
  },
  genderButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EditProfile;
