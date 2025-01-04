import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, Image, Dimensions, StyleSheet, TouchableOpacity, Linking } from "react-native";
import DetailsCard from "../components/DetailsCard"; // Import your updated DetailsCard component
import { Ionicons } from "@expo/vector-icons"; // Import an icon library for the location icon

const { width } = Dimensions.get('window');

const OldCampusLoopDetails = ({ route }) => {
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

  const description = "The Old Campus of UPSI features a 1.4 km loop, perfect for morning and evening runs. This scenic route passes historic landmarks like Zaba House, the library, the museum, and the sculpture gallery, blending fitness with a touch of heritage. The green field adds a refreshing charm for runners.";

  return (
    <View style={styles.container}>
      <ScrollView>
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
            <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/old%20campus/oc11.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJvbGQgY2FtcHVzL29jMTEuanBnIiwiaWF0IjoxNzM1NTc3OTE1LCJleHAiOjE3NjcxMTM5MTV9.FDHZrZ2pzR7rw4tiNxnCbOtb1ZVHr1syNMrWTYwFVGI&t=2024-12-30T16%3A58%3A34.698Z" }} />
            <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/old%20campus/oc7.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJvbGQgY2FtcHVzL29jNy5qcGciLCJpYXQiOjE3MzU1Nzc5NDAsImV4cCI6MTc2NzExMzk0MH0.TfBjvJxP60LLRAdbhtOKOE8DLonB8IYXKhaSvskhgCg&t=2024-12-30T16%3A58%3A59.762Z" }} />
            <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/old%20campus/oc8.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJvbGQgY2FtcHVzL29jOC5qcGciLCJpYXQiOjE3MzU1Nzc5NTgsImV4cCI6MTc2NzExMzk1OH0.wj4LRHoJOADMbfM5B3zf10vhKmIKx0rx34fFAEaoJUI&t=2024-12-30T16%3A59%3A18.280Z" }} />
            <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/old%20campus/oc5.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJvbGQgY2FtcHVzL29jNS5qcGciLCJpYXQiOjE3MzU1Nzc5ODAsImV4cCI6MTc2NzExMzk4MH0.rKkg7kZsKax_1q80d8STOTrikdXpEja_nTQXNPaxVEM&t=2024-12-30T16%3A59%3A39.510Z" }} />
            <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/old%20campus/oc1.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJvbGQgY2FtcHVzL29jMS5qcGciLCJpYXQiOjE3MzU1NzgwMDUsImV4cCI6MTc2NzExNDAwNX0.YAOqLK4HoLi4Bl9PVgixL8gdLia6NcRPeVjuYs9HRUo&t=2024-12-30T17%3A00%3A04.756Z" }} />
          </ScrollView>
        </View>

        {/* Details Card Below Image Slider */}
        <DetailsCard
          title={name}
          image={require("../assests/images/avatar.jpg")} // Replace with your image
          description={description}
          additionalDescription="Ideal for LARI2Gether users, this loop offers a short, enjoyable run while exploring the unique architecture and rich history of UPSI. It’s a great spot for personal training or community runs in a nostalgic setting."
          location="Kampus Sultan Abdul Jalil Shah UPSI, Tanjong Malim"
          route="Main Arena, VIP Lounge, Courts"
          distance="Total Area: 10,000 sq meters"
          elevation="Multiple Elevated Seats for a panoramic view"
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

export default OldCampusLoopDetails;
