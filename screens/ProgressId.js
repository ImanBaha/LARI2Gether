import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // For navigation
import { Ionicons } from '@expo/vector-icons'; // Back icon

const ProgressId = ({ route }) => {
  const { progressId, randomMessage } = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Back Icon */}
      <Ionicons
        name="arrow-back"
        size={30}
        color="#fff"
        onPress={() => navigation.goBack()}
        style={styles.backIcon}
      />

      <View style={styles.content}>
        <Text style={styles.header}>Week {progressId} Progress</Text>
        
        {/* Display Image */}
        <Image
          source={require("../assests/images/1.jpg")} // Replace with your image URL
          style={styles.image}
        />

        {/* Congratulatory Message */}
        <Text style={styles.message}>{randomMessage.message}</Text>

        {/* Go Back Button */}
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    position: 'absolute',
    left: 20,
    top: 40,
  },
  content: {
    backgroundColor: '#FFF',
    padding: 50,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 40,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75, // Circular image
    marginBottom: 25,
  },
  message: {
    fontSize: 16,
    marginTop: 20,
    color: '#333',
    textAlign: 'center',
  },
//  
});

export default ProgressId;
