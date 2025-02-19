import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';
import Avatar from '../components/Avatar';


const profileOptions = [
  { title: 'User Profile', icon: 'person-outline' },
  { title: 'Health Profile', icon: 'heart-outline' },
  { title: 'Leaderboard', icon: 'podium-outline' },
  { title: 'Runs History', icon: 'timer-outline' },
  { title: 'Running Journal', icon: 'document-outline' },
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
          navigation.navigate('UserProfile');
        } else if (item.title === 'Leaderboard') {
          navigation.navigate('ViewLeaderboard');
        } else if (item.title === 'Runs History') {
          navigation.navigate('PastRuns');
        } else if (item.title === 'Health Profile') {
          navigation.navigate('HealthProfile');
        } else if (item.title === 'Running Journal') {
          navigation.navigate('Note');
        }
      }}
    >
      <View style={styles.itemContent}>
        <View style={styles.iconWrapper}>
          <Ionicons name={item.icon} size={24} color="#4A90E2" />
        </View>
        <Text style={styles.itemText}>{item.title}</Text>
        <Ionicons name="chevron-forward" size={20} color="#4A90E2" style={styles.chevron} />
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
    <LinearGradient colors={['#0066b2', '#ADD8E6', '#F0FFFF']} style={styles.container}>
      <Animated.View style={[styles.profileHeader, { opacity: fadeAnim }]}>
        <View style={styles.avatarContainer}>
          <Avatar userId={user?.id} profilePic={profilePic} setProfilePic={setProfilePic} />
        </View>
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

      <View style={styles.menuWrapper}>
        <FlatList
          data={profileOptions}
          keyExtractor={(item) => item.title}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12, // Reduced from 16
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 15, // Reduced from 20
    paddingTop: 15, // Reduced from 20
  },
  avatarContainer: {
    marginBottom: 0, // Reduced from 15
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#28282B',
    marginBottom: 4, // Reduced from 5
  },
  emailText: {
    fontSize: 16,
    color: '#28282B',
    marginBottom: 12, // Reduced from 15
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#3366FF',
    borderRadius: 20,
    paddingHorizontal: 18, // Reduced from 20
    paddingVertical: 7, // Reduced from 8
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  editButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  menuWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12, // Reduced from 15
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  listContainer: {
    padding: 10, // Reduced from 8
  },
  listItem: {
    marginBottom: 2,
    backgroundColor: '#fff',
    borderRadius: 8, // Reduced from 10
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12, // Reduced from 15
  },
  iconWrapper: {
    width: 36, // Reduced from 40
    height: 36, // Reduced from 40
    borderRadius: 18, // Reduced from 20
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12, // Reduced from 15
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  chevron: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Profile;