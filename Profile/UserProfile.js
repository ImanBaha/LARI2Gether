import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Avatar from '../components/Avatar'; // Import the Avatar component
import { Ionicons } from "@expo/vector-icons";

const UserProfile = () => {
  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error fetching user:', error);
          Alert.alert('Error', 'Failed to load user data.');
          return;
        }

        const user = data.user;
        if (user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('username, fullname, age, contact, gender, address, avatar')
            .eq('id', user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile data:', profileError);
            Alert.alert('Error', 'Failed to load profile details.');
          } else {
            setUserProfile(profileData);
            setProfilePic(profileData.avatar);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Something went wrong while fetching the profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#0066b2', '#ADD8E6', '#F0FFFF']} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header Section */}
        <View style={styles.headerSection}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-circle" size={38} color="#FFAC1C" />
        </TouchableOpacity>
          <Text style={styles.headerText}>User Profile</Text>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Avatar 
            userId={userProfile?.id}
            profilePic={profilePic}
            setProfilePic={setProfilePic}
          />
          <Text style={styles.username}>{userProfile?.username || 'User'}</Text>
        </View>

        {/* Profile Details Card */}
        <View style={styles.card}>
          {userProfile ? (
            <>
              <View style={styles.infoSection}>
                <View style={styles.profileRow}>
                  <Icon name="person" size={22} color="#0066b2" />
                  <View style={styles.textContainer}>
                    <Text style={styles.label}>Full Name</Text>
                    <Text style={styles.profileText}>{userProfile.fullname || 'N/A'}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.profileRow}>
                  <Icon name="calendar-outline" size={22} color="#0066b2" />
                  <View style={styles.textContainer}>
                    <Text style={styles.label}>Age</Text>
                    <Text style={styles.profileText}>{userProfile.age || 'N/A'}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.profileRow}>
                  <Icon name="call-outline" size={22} color="#0066b2" />
                  <View style={styles.textContainer}>
                    <Text style={styles.label}>Contact</Text>
                    <Text style={styles.profileText}>{userProfile.contact || 'N/A'}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.profileRow}>
                  <Icon name="male-female-outline" size={22} color="#0066b2" />
                  <View style={styles.textContainer}>
                    <Text style={styles.label}>Gender</Text>
                    <Text style={styles.profileText}>{userProfile.gender || 'N/A'}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.profileRow}>
                  <Icon name="home-outline" size={22} color="#0066b2" />
                  <View style={styles.textContainer}>
                    <Text style={styles.label}>Address</Text>
                    <Text style={styles.profileText}>{userProfile.address || 'N/A'}</Text>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <Text style={styles.profileText}>No profile data available.</Text>
          )}

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <LinearGradient
              colors={['#0066b2', '#0052cc']}
              style={styles.editButtonGradient}
            >
              <Icon name="pencil" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  headerSection: {
    paddingTop: 40,
    paddingBottom: 0,
    paddingHorizontal: 10,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#28282B',
    marginTop: 0,
    bottom: 10,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 0,
    bottom: 5,
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    color: '#28282B',
    marginTop: 0,
  },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 20,
    flex: 1,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: "100%",
    },
  infoSection: {
    marginTop: 5,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  profileText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 5,
  },
  editButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    elevation: 5,
  },
  editButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFAA33', // Changed to the requested color
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserProfile;