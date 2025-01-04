import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, Image, Dimensions, StyleSheet, TouchableOpacity, Linking } from "react-native";
import DetailsCard from "../components/DetailsCard"; // Import your updated DetailsCard component
import { Ionicons } from "@expo/vector-icons"; // Import an icon library for the location icon

const { width } = Dimensions.get('window');

const ArenaDetails = ({ route }) => {
  const { name } = route.params;

  const [dateTime, setDateTime] = useState(new Date());
  const scrollViewRef = useRef(null);
  let scrollValue = 0;
  let scrolled = 0;

  // Open Google Maps with given coordinates
  const openMap = (latitude, longitude) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.error("Can't open URL:", url);
        }
      })
      .catch((err) => console.error("Failed to open Google Maps", err));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      scrolled++;
      if (scrolled < 5) {
        scrollValue += width;
      } else {
        scrollValue = 0;
        scrolled = 0;
      }
      scrollViewRef.current?.scrollTo({ x: scrollValue, animated: true });
    }, 2500); // Slide every 2.5 seconds for smoother experience

    // Update date and time every second
    const dateTimeInterval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(dateTimeInterval);
    };
  }, []);

  const description = "Arena UPSI is the perfect training ground for LARI2Gether users. Its stadium track is ideal for improving pace and achieving running goals, while additional facilities like a swimming pool, gym, and courts for squash, futsal, and badminton offer excellent cross-training opportunities.";

  return (
    <View style={styles.container}>
      <ScrollView>
        
        {/* Location and Title Section */}
        <View style={styles.titleContainer}>
          <TouchableOpacity style={styles.locationIcon} onPress={() => openMap(3.728856, 101.532560)}>
            <Ionicons name="location-sharp" size={30} color="white" />
          </TouchableOpacity>
          <View style={styles.titleCard}>
            <Text style={styles.titleText}>{name}</Text>
          </View>
        </View>

        {/* Image Slider */}
        <View style={styles.mainImageContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            ref={scrollViewRef}
            pagingEnabled
          >
            <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/arena%20UPSI/au1.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhcmVuYSBVUFNJL2F1MS5qcGciLCJpYXQiOjE3MzU1Nzc2MDMsImV4cCI6MTc2NzExMzYwM30.obDzkl4Z3aKdoAyTC1ToEe6cRqxkZcUQQzErXWeuqiY&t=2024-12-30T16%3A53%3A22.986Z" }} />
            <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/arena%20UPSI/au2.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhcmVuYSBVUFNJL2F1Mi5qcGciLCJpYXQiOjE3MzU1Nzc2MjIsImV4cCI6MTc2NzExMzYyMn0.AaOrXLCZJY7vZDahy3amywq4Gc1t-aHXWccG8_cHFLY&t=2024-12-30T16%3A53%3A42.068Z" }} />
            <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/arena%20UPSI/au3.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhcmVuYSBVUFNJL2F1My5qcGciLCJpYXQiOjE3MzU1Nzc2NDIsImV4cCI6MTc2NzExMzY0Mn0.6HfIogVEYQ1pgJbH0zz6F60fUr-N464Xir8i4-nepjg&t=2024-12-30T16%3A54%3A02.327Z" }} />
            <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/arena%20UPSI/au8.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhcmVuYSBVUFNJL2F1OC5qcGciLCJpYXQiOjE3MzU1Nzc2NTksImV4cCI6MTc2NzExMzY1OX0.uwhFqY9WAxmtaygrLQ4MsJPxz2gO9CYxseOyZPj8xNs&t=2024-12-30T16%3A54%3A19.430Z" }} />
            <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/arena%20UPSI/au9.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhcmVuYSBVUFNJL2F1OS5qcGciLCJpYXQiOjE3MzU1Nzc2ODgsImV4cCI6MTc2NzExMzY4OH0.0r31dIOX7wySJ6lsIf-W4BayKyVe4bkb1jQzmlbtrso&t=2024-12-30T16%3A54%3A47.922Z" }} />
          </ScrollView>
        </View>

        {/* Details Card Below Image Slider */}
        <DetailsCard
          title={name}
          image={require("../assests/images/avatar.jpg")} // Replace with your image
          description={description}
          additionalDescription="With its accessible location and community-focused design, Arena UPSI supports runners in building endurance, staying active, and connecting through group runs and challenges, aligning perfectly with LARI2Gether's mission to foster a vibrant running community."
          location="Kampus Sultan Azlan Shah UPSI, Proton City"
          // route="Main Arena, VIP Lounge, Courts"
          // distance="Total Area: 10,000 sq meters"
          // elevation="Multiple Elevated Seats for a panoramic view"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 210,
    right: 20,
    left: 20,
    zIndex: 10,
  },
  locationIcon: {
    backgroundColor: "#0096FF",
    padding: 10,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  titleCard: {
    backgroundColor: "white",
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0C215E",
  },
  mainImageContainer: {
    height: 270, // Set a fixed height for the slider
    marginTop: 0,
  },
  mainImage: {
    width: width,
    height: 270,
    resizeMode: 'cover',
  },
});

export default ArenaDetails;
