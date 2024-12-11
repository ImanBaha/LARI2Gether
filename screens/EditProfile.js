import React, { useState } from 'react';
import { View, TextInput, Button, Image, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook

const EditProfile = () => {
  const navigation = useNavigation(); // Access navigation

  const [firstName, setFirstName] = useState('Iman');
  const [lastName, setLastName] = useState('Baha');
  const [phoneNumber, setPhoneNumber] = useState('+06 107149008');
  const [email, setEmail] = useState('mhdnurimanbaha@gmail.com');
  const [gender, setGender] = useState('Male');

  const saveProfile = () => {
    // Implement saving logic here
    Alert.alert('Profile saved');
    navigation.goBack(); // Go back to the previous screen
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Edit Profile</Text>

      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatar}
          source={require('../assests/images/avatar.jpg')} // Replace with a real image URL or local image
        />
      </View>

      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        placeholder="Enter your first name"
        onChangeText={setFirstName}
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        placeholder="Enter your last name"
        onChangeText={setLastName}
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        placeholder="Enter your phone number"
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        placeholder="Enter your email"
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Gender</Text>
      <TextInput
        style={styles.input}
        value={gender}
        placeholder="Select your gender"
        onChangeText={setGender}
      />

      <View style={styles.buttonContainer}>
        <Button title="Save Profile" onPress={saveProfile} color="#3366FF" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F6FF',
  },
  headerText: {
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
    fontSize: 28,
    fontWeight: 'bold',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '600',
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
});

export default EditProfile;
