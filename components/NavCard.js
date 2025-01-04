import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NavCard = ({ title }) => {
  const navigation = useNavigation();

  const handleViewMore = () => {
    navigation.navigate('Note');
  };

  return (
    <View style={styles.card}>
      {/* Static Image from local assets */}
      <Image source={require('../assests/images/n&t.png')} style={styles.image} />
      <TouchableOpacity style={styles.button} onPress={handleViewMore}>
        <Text style={styles.buttonText}>View More</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    card: {
      width: '100%',
      padding: 12,
      backgroundColor: '#fff',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      marginBottom: 10,
      alignSelf: 'center',
      position: 'relative', // Add position relative to position the button correctly
    },
    image: {
      width: '65%',
      height: 88,
      alignSelf: 'center',
      borderRadius: 8,
      marginBottom: 20, 
    },
    button: {
      backgroundColor: '#4CAF50',
      paddingVertical: 5, // Smaller padding for a smaller button
      paddingHorizontal: 10, // Adjusted for smaller button
      borderRadius: 6,
      position: 'absolute', // Position the button absolutely
      bottom: 10, // Place it 10 units from the bottom of the image
      right: 10, // Place it 10 units from the right of the image
    },
    buttonText: {
      color: '#fff',
      fontSize: 12, // Smaller font size
    },
  });
  
  

export default NavCard;
