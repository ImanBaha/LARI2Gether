import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, Alert, TouchableOpacity, StyleSheet, ActivityIndicator, Animated, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker'; // Image Picker for profile upload
import { LinearGradient } from 'expo-linear-gradient';

const profileOptions = [
  { title: 'Language', icon: 'globe-outline' },
  { title: 'Location', icon: 'location-outline' },
  { title: 'Notifications', icon: 'notifications-outline' },
  { title: 'Privacy Settings', icon: 'lock-closed-outline' },
  { title: 'Subscription', icon: 'card-outline' },
  { title: 'Log Out', icon: 'log-out-outline' },
];

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(require('../assests/images/avatar.jpg'));
  const [fadeAnim] = useState(new Animated.Value(0));
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => setLoading(false), 300);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogOut = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', onPress: () => navigation.navigate('Login') },
    ]);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }
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
        <Ionicons name={item.icon} size={24} color="#4A90E2" />
        <Text style={styles.itemText}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#0066b2', '#FFAA33']} style={styles.container}>
      <Animated.View style={[styles.profileHeader, { opacity: fadeAnim }]}>
        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
          <Image style={styles.avatar} source={profilePic} />
        </TouchableOpacity>
        <Text style={styles.nameText}>Iman Baha</Text>
        <Text style={styles.emailText}>mhdnurimanbaha@gmail.com</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="create-outline" size={16} color="#fff" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </Animated.View>

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
        contentContainerStyle={styles.listContainer}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  emailText: {
    color: '#f0f0f0',
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#3366FF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    marginLeft: 8,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  statLabel: {
    color: 'gray',
  },
  listContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  listItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#4A90E2',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Profile;
