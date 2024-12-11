// components/Card.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Card = ({ onPress, title, color }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, { backgroundColor: color }]}>
      <Text style={styles.cardText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    margin: 10,
    borderRadius: 10,
    elevation: 3, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center', // Center text in the card
  },
  cardText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default Card;
