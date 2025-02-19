import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { supabase } from '../lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../components/Avatar';

const EditProfile = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [age, setAge] = useState('');
  const [contact, setContact] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [userId, setUserId] = useState(null);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        throw error;
      }

      if (user) {
        setUserId(user.id);
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('username, fullname, age, contact, gender, address, avatar')
          .eq('id', user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        if (data) {
          setUsername(data.username || '');
          setFullname(data.fullname || '');
          setAge(data.age ? data.age.toString() : '');
          setContact(data.contact || '');
          setGender(data.gender || '');
          setAddress(data.address || '');
          setProfilePic(data.avatar);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Error loading profile data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (!username || !fullname) {
        setFormError('Username and full name are required.');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          fullname,
          age: age ? parseInt(age) : null,
          contact,
          gender,
          address,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      Alert.alert(
        'Success',
        'Profile updated successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      setFormError('Error updating profile.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066b2" />
      </View>
    );
  }

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
            <Ionicons name="arrow-back" size={24} color="#FFAC1C" />
          </TouchableOpacity>
          <Text style={styles.header}>Edit Profile</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.card}>
          <View style={styles.avatarSection}>
            <Avatar
              userId={userId}
              profilePic={profilePic}
              setProfilePic={setProfilePic}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputHeader}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter username"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputHeader}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter full name"
              placeholderTextColor="#999"
              value={fullname}
              onChangeText={setFullname}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputHeader}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter age"
              placeholderTextColor="#999"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputHeader}>Contact</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter contact number"
              placeholderTextColor="#999"
              value={contact}
              onChangeText={setContact}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputHeader}>Gender</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter gender"
              placeholderTextColor="#999"
              value={gender}
              onChangeText={setGender}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputHeader}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter address"
              placeholderTextColor="#999"
              value={address}
              onChangeText={setAddress}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.button, styles.submitButton]} 
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={() => navigation.goBack()}
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditProfile;