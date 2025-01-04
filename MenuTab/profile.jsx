import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';
import Avatar from '../components/Avatar'; // Import Avatar component

const profileOptions = [
  { title: 'User Profile', icon: 'person-outline' },  // New option
  { title: 'Settings', icon: 'settings-outline' },
  { title: 'Achievements', icon: 'medal-outline' },
  { title: 'Leaderboard', icon: 'podium-outline' },
  { title: 'Terms and Conditions', icon: 'document-outline' },
  { title: 'Log Out', icon: 'log-out-outline' },
];

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('Error fetching user:', userError);
          setLoading(false);
          return;
        }
        setUser(user);
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('avatar')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile data:', profileError);
        } else {
          setProfilePic(profileData?.avatar || null);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogOut = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        onPress: async () => {
          await supabase.auth.signOut();
          navigation.navigate('Login');
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        if (item.title === 'Log Out') {
          handleLogOut();
        } else if (item.title === 'User Profile') {
          navigation.navigate('UserProfile');  // Navigate to UserProfile screen
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
        <Avatar userId={user?.id} profilePic={profilePic} setProfilePic={setProfilePic} />
        <Text style={styles.nameText}>{user?.email || 'User'}</Text>
        <Text style={styles.emailText}>Welcome back!</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="create-outline" size={16} color="#fff" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </Animated.View>

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
    marginBottom: 10,
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
  listContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
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
