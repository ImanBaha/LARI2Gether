import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, Image, Dimensions, StyleSheet, TouchableOpacity, Linking, StatusBar } from "react-native";
import * as Animatable from 'react-native-animatable'; // Add this import
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DetailsCard from "../components/DetailsCard";


const { width } = Dimensions.get('window');

const ArenaDetails = ({ route }) => {
  const { name } = route.params;
  const navigation = useNavigation(); // Get the navigation object

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
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>

        {/* Animated Back Button */}
        {/* <Animatable.View 
          animation="fadeOut"
          duration={1000}
        > */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back-circle" size={38} color="#FFAC1C" />
          </TouchableOpacity>
        {/* </Animatable.View> */}

        {/* Animated Location and Title Section */}
        <Animatable.View 
          style={styles.titleContainer}
          animation="slideInRight"
          duration={1000}
          delay={300}
        >
          <TouchableOpacity 
            style={styles.locationIcon} 
            onPress={() => openMap(3.728856, 101.532560)}
          >
            <Ionicons name="location-sharp" size={26} color="white" />
          </TouchableOpacity>
          <Animatable.View 
            style={styles.titleCard}
            animation="fadeIn"
            duration={800}
            delay={500}
          >
            <Text style={styles.titleText}>{name}</Text>
          </Animatable.View>
        </Animatable.View>

        {/* Animated Image Slider */}
        <Animatable.View 
          style={styles.mainImageContainer}
          animation="fadeIn"
          duration={1000}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            ref={scrollViewRef}
            pagingEnabled
          >
            {/* Wrap each Image in Animatable.View */}
            {[
              "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/arena%20UPSI/au1.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhcmVuYSBVUFNJL2F1MS5qcGciLCJpYXQiOjE3MzY0ODY2NDgsImV4cCI6MjA1MTg0NjY0OH0.wIBHDgNag4-919g9JF-Crg8czQTNFdTHhMs9oycOLlw",
              "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/arena%20UPSI/au2.jpg",
              "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/arena%20UPSI/au3.jpg",
              "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/arena%20UPSI/au8.jpg",
              "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/arena%20UPSI/au9.jpg"
            ].map((uri, index) => (
              <Animatable.View
                key={index}
                animation="fadeIn"
                duration={1000}
                delay={index * 200}
              >
                <Image style={styles.mainImage} source={{ uri }} />
              </Animatable.View>
            ))}
          </ScrollView>
        </Animatable.View>

        {/* Animated Details Card */}
        <Animatable.View
          animation="slideInUp"
          duration={1000}
          delay={600}
        >
          <DetailsCard
            title={name}
            description={description}
            additionalDescription="With its accessible location and community-focused design, Arena UPSI supports runners in building endurance, staying active, and connecting through group runs and challenges, aligning perfectly with LARI2Gether's mission to foster a vibrant running community."
            location="Kampus Sultan Azlan Shah UPSI, Proton City"
            totalDistance="400m per lap (Standard Track)"
            difficulty={2}
            safety={4}
            favLocation={4}
          />
        </Animatable.View>
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
    opacity: 0.95, // Add slight transparency for better visual effect
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 5,
    zIndex: 20,
    // backgroundColor: "#0096FF",
    padding: 10,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  locationIcon: {
    backgroundColor: "#FFAC1C",
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
    transform: [{ scale: 1 }],
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0C215E",
  },
  mainImageContainer: {
    height: 270, // Set a fixed height for the slider
    marginTop: 0,
    overflow: 'hidden',
  },
  mainImage: {
    width: width,
    height: 270,
    resizeMode: 'cover',
  },
});

export default ArenaDetails;
