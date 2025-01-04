import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

// Improved DetailsCard Component
const DetailsCard = ({
  description,
  additionalDescription,
  location,
  route,
  distance,
  elevation,
}) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Combined Description Section */}
      <View style={styles.section}>
        <Text style={styles.description}>{description}</Text>
        {additionalDescription && (
          <Text style={styles.additionalDescription}>{additionalDescription}</Text>
        )}
      </View>

      {/* Location and Other Details */}
      <View style={styles.detailSection}>
        <Text style={styles.detailTitle}>Location</Text>
        <Text style={styles.detailText}>{location}</Text>
      </View>
{/* 
      <View style={styles.detailSection}>
        <Text style={styles.detailTitle}>Route</Text>
        <Text style={styles.detailText}>{route}</Text>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.detailTitle}>Distance</Text>
        <Text style={styles.detailText}>{distance}</Text>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.detailTitle}>Elevation</Text>
        <Text style={styles.detailText}>{elevation}</Text>
      </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8F8F8",
    paddingBottom: 50,
  },
  section: {
    marginBottom: 20,
    width: 'Auto',
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  description: {
    fontSize: 16,
    color: "#0C215E",
    textAlign: "justify",
    lineHeight: 25,
    marginBottom: 10,
    padding: 13,
  },
  additionalDescription: {
    fontSize: 16,
    color: "#0C215E",
    lineHeight: 22,
    padding: 13,
    bottom: 20,
  },
  detailSection: {
    marginBottom: 15,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0C215E",
    marginBottom: 5,
  },
  detailText: {
    fontSize: 16,
    color: "#0C215E",
    lineHeight: 22,
  },
});

export default DetailsCard;
