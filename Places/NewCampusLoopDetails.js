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

  const description = "The New Campus of UPSI in Proton City offers a picturesque 5+ km loop, perfect for runners looking to tackle longer distances. Set against the majestic backdrop of the Titiwangsa mountain range, the route provides breathtaking views of green mountains, creating a serene and calming atmosphere for every run.";

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Location and Title Section */}
        <View style={styles.titleContainer}>
          <TouchableOpacity style={styles.locationIcon} onPress={() => openMap(3.726442,101.531040)}>
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
            <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/new%20campus/view7.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJuZXcgY2FtcHVzL3ZpZXc3LmpwZyIsImlhdCI6MTczNTU3ODE3NSwiZXhwIjoxNzY3MTE0MTc1fQ.Koq9IMesHCxcgIun2jHy1cvy7Gip7WpWMTWPRWCc0eg&t=2024-12-30T17%3A02%3A55.311Z" }} />
            <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/new%20campus/nc8.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJuZXcgY2FtcHVzL25jOC5qcGciLCJpYXQiOjE3MzU1NzgxOTAsImV4cCI6MTc2NzExNDE5MH0.HyPFbRrJ88r5JB-wSki4fPjDRW8NUNCQPnCaQdB_XOI&t=2024-12-30T17%3A03%3A09.986Z" }} />
            <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/new%20campus/nc1.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJuZXcgY2FtcHVzL25jMS5qcGciLCJpYXQiOjE3MzU1NzgyMTYsImV4cCI6MTc2NzExNDIxNn0.fxlt5AX080XlrZFEiKMD0BGYi0cLGoQnknYoWPwgADQ&t=2024-12-30T17%3A03%3A36.390Z" }} />
            <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/new%20campus/nc7.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJuZXcgY2FtcHVzL25jNy5qcGciLCJpYXQiOjE3MzU1NzgyMzMsImV4cCI6MTc2NzExNDIzM30.dJvXIINra7dZhvkckLvuK8xfW_VEnBi7F51pJL_o6KM&t=2024-12-30T17%3A03%3A53.292Z" }} />
            <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/new%20campus/n6.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJuZXcgY2FtcHVzL242LmpwZyIsImlhdCI6MTczNTU3ODI1MiwiZXhwIjoxNzY3MTE0MjUyfQ.H6LjYn84DawxybCaeT9dXO2nq669m-wgd260FdlRWLM&t=2024-12-30T17%3A04%3A11.605Z" }} />
          </ScrollView>
        </View>

        {/* Details Card Below Image Slider */}
        <DetailsCard
          title={name}
          image={require("../assests/images/avatar.jpg")} // Replace with your image
          description={description}
          additionalDescription="With its wide roads and open landscapes, the campus is ideal for LARI2Gether users aiming to build endurance or train for long-distance goals. Whether you’re running solo or joining a community run, the expansive and scenic surroundings make every stride enjoyable and inspiring."
          location="Kampus Sultan Azlan Shah UPSI, Proton City"
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

export default ArenaDetails;
