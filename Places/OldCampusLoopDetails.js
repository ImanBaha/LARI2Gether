import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, Image, Dimensions, StyleSheet, TouchableOpacity, Linking } from "react-native";
import DetailsCard from "../components/DetailsCard"; // Import your updated DetailsCard component
import { Ionicons } from "@expo/vector-icons"; // Import an icon library for the location icon
import { useNavigation } from "@react-navigation/native"; // Import the useNavigation hook


const { width } = Dimensions.get('window');

const OldCampusLoopDetails = ({ route }) => {
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

  const description = "The Old Campus of UPSI features a 1.4 km loop, perfect for morning and evening runs. This scenic route passes historic landmarks like Zaba House, the library, the museum, and the sculpture gallery, blending fitness with a touch of heritage. The green field adds a refreshing charm for runners.";

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Back Button */}
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                          <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
        {/* Location and Title Section */}
        <View style={styles.titleContainer}>
          <TouchableOpacity style={styles.locationIcon} onPress={() => openMap(3.685421,101.527183)}>
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
            <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/old%20campus/oc11.jpg" }} />
            <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/old%20campus/oc8.jpg" }} />
            <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/old%20campus/oc7.jpg" }} />
            <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/old%20campus/oc5.jpg" }} />
            <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/old%20campus/oc1.jpg" }} />
          </ScrollView>
        </View>

        {/* Details Card Below Image Slider */}
        <DetailsCard
          title={name}
          description={description}
          additionalDescription="Ideal for LARI2Gether users, this loop offers a short, enjoyable run while exploring the unique architecture and rich history of UPSI. It’s a great spot for personal training or community runs in a nostalgic setting."
          location="Kampus Sultan Abdul Jalil Shah UPSI, Tanjong Malim"
          totalDistance="1.2km per lap (Standard Track)"
          difficulty={3}
          safety={4}
          favLocation={4}
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
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    zIndex: 20,
    backgroundColor: "#0096FF",
    padding: 10,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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

export default OldCampusLoopDetails;
