import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const ViewCh = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params; // Get the challenge ID passed from the previous screen

  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      const { data, error } = await supabase
        .from("challenge")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching challenge:", error);
        Alert.alert("Error", "Could not fetch challenge details.");
      } else {
        setChallenge(data);
      }
    };

    fetchChallenge();
  }, [id]);

  if (!challenge) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading challenge details...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#0066b2', '#ff9900']} style={styles.gradient}>
  <ScrollView contentContainerStyle={styles.container}>
    
  {/* Go Back Button */}
  <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => navigation.goBack()}
        >
        <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

    {/* Image Display Container */}
    {challenge.image && (
      <View style={styles.imageContainer}>
        <Image source={{ uri: challenge.image }} style={styles.image} />
      </View>
    )}

    {/* Challenge Details Card */}
    <View style={styles.detailsCard}>
      <Text style={styles.title}>{challenge.title || "No Title"}</Text>
      <Text style={styles.description}>
        {challenge.description || "No Description Available"}
      </Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Location:</Text>
        <Text style={styles.infoText}>
          {challenge.location || "Not specified"}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Date:</Text>
        <Text style={styles.infoText}>
          {challenge.date || "No Date Provided"}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Time:</Text>
        <Text style={styles.infoText}>
          {challenge.time || "No Time Provided"}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Level:</Text>
        <Text style={styles.infoText}>
          {challenge.level || "Not specified"}
        </Text>
      </View>

        {/* Start Challenge Button */}
    <TouchableOpacity
      style={styles.startButton}
      onPress={() => navigation.navigate("Run")}
    >
      <MaterialCommunityIcons name="run-fast" size={24} color="#fff" />
      <Text style={styles.startButtonText}>Start Challenge</Text>
    </TouchableOpacity>
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
    padding: 10,
    paddingTop: 50, // Make room for the header
  },
  goBackButton: {
    position: "absolute",
    top: 53,
    left: 12,
    backgroundColor: "#36454F",
    padding: 10,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    zIndex: 10, // Ensure it stays above other content
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#28a745",
    paddingVertical: 10, // Reduced vertical padding for a smaller button
    paddingHorizontal: 20, // Adjusted horizontal padding for a more compact button
    borderRadius: 30, // Slightly more rounded corners for a modern feel
    shadowColor: "#000",
    shadowOpacity: 0.1, // Reduced shadow opacity for a more subtle effect
    shadowOffset: { width: 0, height: 2 }, // Reduced shadow offset for a softer shadow
    shadowRadius: 5, // Reduced shadow radius
    marginBottom: 20,
    marginTop: 10,
    elevation: 3, // Reduced Android shadow
    width: '80%', // Reduced width, so it's not too wide
    alignSelf: 'center', // Center the button horizontally
  },
  startButtonText: {
    marginLeft: 12,
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  imageContainer: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
  },
  image: {
    width: "100%",
    height: 230,
    borderRadius: 20,
  },
  detailsCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 40,
    
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 18,
    color: "#495057",
    
    marginBottom: 20,
    // lineHeight: 1.7,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 15,
  },
  infoLabel: {
    fontWeight: "bold",
    color: "#343a40",
    marginRight: 12,
    fontSize: 18,
  },
  infoText: {
    color: "#495057",
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6c757d",
  },
});

export default ViewCh;
