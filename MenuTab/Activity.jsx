// Activity.js
import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import ColorList from '../components/ColorList';
import Card from '../components/Card';

const Activity = () => {
  const navigation = useNavigation();

  const handleCardPress = () => {
    navigation.navigate('ActivityChart'); // Navigate to ActivityChart screen
  };

  return (
    <View style={styles.container}>
      {/* <ColorList color="#059669" /> */}
      <Card 
        title="View Activity Chart" 
        color="#059669" 
        onPress={handleCardPress} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FF', // Set background color for visibility
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
});

export default Activity;
