import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const StarRating = ({ rating, maxRating = 5 }) => {
  return (
    <View style={styles.starContainer}>
      {[...Array(maxRating)].map((_, index) => (
        <Ionicons
          key={index}
          name={index < rating ? "star" : "star-outline"}
          size={20}
          color={index < rating ? "#FFD700" : "#BBC0C4"}
          style={styles.star}
        />
      ))}
    </View>
  );
};

const DetailsCard = ({
  description,
  additionalDescription,
  location,
  totalDistance,
  difficulty,
  safety,
  favLocation
}) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Location and Other Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>Location</Text>
          <Text style={styles.detailText}>{location}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>Total Distance</Text>
          <Text style={styles.detailText}>{totalDistance}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>Difficulty</Text>
          <StarRating rating={difficulty} />
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>Safety</Text>
          <StarRating rating={safety} />
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>Favorite Location</Text>
          <StarRating rating={favLocation} />
        </View>
      </View>

      {/* Description Sections */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{description}</Text>
        {additionalDescription && (
          <Text style={styles.additionalDescription}>{additionalDescription}</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8F8F8",
    paddingBottom: 50,
    gap: 20, // Add space between main sections
  },
  detailsContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  detailSection: {
    marginBottom: 20, // Increased spacing between sections
    paddingBottom: 10, // Added padding at bottom of each section
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0', // Light separator between sections
  },
  detailSection: {
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0C215E",
    marginBottom: 8, // Increased spacing between title and content
  },
  detailText: {
    fontSize: 16,
    color: "#0C215E",
    lineHeight: 22,
  },
  descriptionContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
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
    marginBottom: 20, // Added space between descriptions
  },
  additionalDescription: {
    fontSize: 16,
    color: "#0C215E",
    lineHeight: 22,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 4, // Increased spacing between stars
  },
});

export default DetailsCard;