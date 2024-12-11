import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, Alert, TouchableOpacity, StyleSheet, Button, ActivityIndicator, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker'; // Image Picker for profile upload

const profileOptions = [
  { title: 'Language', icon: 'globe-outline' },
  { title: 'Location', icon: 'location-outline' },
  { title: 'Notifications', icon: 'notifications-outline' },  // New Option
  { title: 'Privacy Settings', icon: 'lock-closed-outline' }, // New Option
  { title: 'Subscription', icon: 'card-outline' },
  { title: 'Log Out', icon: 'log-out-outline' },
];

const Profile = () => {
  const [loading, setLoading] = useState(true); // Loading state
  const [profilePic, setProfilePic] = useState(require('../assests/images/avatar.jpg')); // Default profile pic
  const [fadeAnim] = useState(new Animated.Value(0)); // Animation value
  const navigation = useNavigation();

  useEffect(() => {
    // Simulating data fetch and animation
    setTimeout(() => setLoading(false), 300);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogOut = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", onPress: () => navigation.navigate('Login') }
    ]);
  };

  const pickImage = async () => {
    // Request permission for image picker
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    // Let user pick image
    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.canceled) {
      setProfilePic({ uri: pickerResult.assets[0].uri });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        if (item.title === 'Log Out') {
          handleLogOut();
        }
      }}
    >
      <View style={styles.itemContent}>
        <Ionicons name={item.icon} size={24} color="#000" />
        <Text style={styles.itemText}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            style={styles.avatar}
            source={profilePic}
          />
        </TouchableOpacity>
        <Text style={styles.nameText}>Iman Baha</Text>
        <Text style={styles.emailText}>mhdnurimanbaha@gmail.com</Text>
        <Button title="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
      </View>

      <View style={styles.profileStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>45</Text>
          <Text style={styles.statLabel}>Total Runs</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>120 km</Text>
          <Text style={styles.statLabel}>Distance</Text>
        </View>
      </View>

      <FlatList
        data={profileOptions}
        keyExtractor={(item) => item.title}
        renderItem={renderItem}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F4F6FF',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 25,
    marginTop: 38,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emailText: {
    color: 'gray',
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 18,
    marginLeft: 10,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'gray',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Profile;
