import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const UserProfile = () => {
  const navigation = useNavigation();

  // State for user profile data
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch the current authenticated user from Supabase
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error fetching user:', error);
          Alert.alert('Error', 'Failed to load user data.');
          return;
        }

        const user = data.user;
        if (user) {
          // Fetch profile data from the 'profiles' table using user.id
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('username, fullname, age, contact, gender, address')
            .eq('id', user.id)  // Ensure the profile is fetched for the current user
            .single();  // Use single() since we expect only one result

          if (profileError) {
            console.error('Error fetching profile data:', profileError);
            Alert.alert('Error', 'Failed to load profile details.');
          } else {
            setUserProfile(profileData);  // Store the profile data
          }
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Something went wrong while fetching the profile.');
      } finally {
        setLoading(false);  // Stop loading once the fetch is done
      }
    };

    fetchUserProfile();  // Call the function to fetch the user profile
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#0066b2', '#FFAA33']} style={styles.container}>
      {/* Go Back Icon */}
      <TouchableOpacity style={styles.goBackIcon} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.headerText}>User Profile</Text>

      <View style={styles.card}>
        {userProfile ? (
          <>
            <View style={styles.profileRow}>
              <Icon name="person-outline" size={20} color="#0066b2" />
              <Text style={styles.label}>Username</Text>
            </View>
            <Text style={styles.profileText}>{userProfile.username || 'N/A'}</Text>

            <View style={styles.profileRow}>
              <Icon name="person" size={20} color="#0066b2" />
              <Text style={styles.label}>Full Name</Text>
            </View>
            <Text style={styles.profileText}>{userProfile.fullname || 'N/A'}</Text>

            <View style={styles.profileRow}>
              <Icon name="calendar-outline" size={20} color="#0066b2" />
              <Text style={styles.label}>Age</Text>
            </View>
            <Text style={styles.profileText}>{userProfile.age || 'N/A'}</Text>

            <View style={styles.profileRow}>
              <Icon name="call-outline" size={20} color="#0066b2" />
              <Text style={styles.label}>Contact</Text>
            </View>
            <Text style={styles.profileText}>{userProfile.contact || 'N/A'}</Text>

            <View style={styles.profileRow}>
              <Icon name="information-circle-outline" size={20} color="#0066b2" />
              <Text style={styles.label}>Gender</Text>
            </View>
            <Text style={styles.profileText}>{userProfile.gender || 'N/A'}</Text>

            <View style={styles.profileRow}>
              <Icon name="home-outline" size={20} color="#0066b2" />
              <Text style={styles.label}>Address</Text>
            </View>
            <Text style={styles.profileText}>{userProfile.address || 'N/A'}</Text>
          </>
        ) : (
          <Text style={styles.profileText}>No profile data available.</Text>
        )}

        {/* Edit button positioned at the bottom right of the card */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Icon name="pencil" size={24} color="#fff" />
        </TouchableOpacity>
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
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '600',
    color: '#cc',
    marginLeft: 10, // Added space for the icon
  },
  profileText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#cc',
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
    position: 'relative',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  editButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#3366FF',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserProfile;
