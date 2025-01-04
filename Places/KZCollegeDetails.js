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

  const description = "Zaba College is a vibrant spot at UPSI, offering a range of activities for fitness enthusiasts and social gatherings. It features bicycle rentals, making it easy to explore the area, and a variety of sports facilities, including futsal, volleyball, and badminton courts. The location is particularly popular in the evenings, with students enjoying the beautiful sunset views and a lively, interactive atmosphere.";

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Location and Title Section */}
        <View style={styles.titleContainer}>
          <TouchableOpacity style={styles.locationIcon} onPress={() => openMap(3.723245,101.518724)}>
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
            <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/zaba%20collage/zc1.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ6YWJhIGNvbGxhZ2UvemMxLmpwZyIsImlhdCI6MTczNTU3ODMyMSwiZXhwIjoxNzY3MTE0MzIxfQ.cM95xVOYxqmQGOoFQWbNe0ivKjnC4KdOD7Gn82cEfVo&t=2024-12-30T17%3A05%3A20.620Z" }} />
            <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/zaba%20collage/zc2.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ6YWJhIGNvbGxhZ2UvemMyLmpwZyIsImlhdCI6MTczNTU3ODMzNCwiZXhwIjoxNzY3MTE0MzM0fQ.CJjcDHpS1id1Uqgzan7152lhPFOuVhu3p-RsjlNwfNs&t=2024-12-30T17%3A05%3A33.622Z" }} />
            <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/zaba%20collage/zc3.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ6YWJhIGNvbGxhZ2UvemMzLmpwZyIsImlhdCI6MTczNTU3ODM0OSwiZXhwIjoxNzY3MTE0MzQ5fQ.bv_s6i6JBgznlSFEiibrNxk2dNxL3J4B1nBHfjR_WuM&t=2024-12-30T17%3A05%3A48.904Z" }} />
            <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/zaba%20collage/zc4%20.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ6YWJhIGNvbGxhZ2UvemM0IC5qcGciLCJpYXQiOjE3MzU1NzgzNjQsImV4cCI6MTc2NzExNDM2NH0.6F2w9LXAHpB-otMCqQooM8xWNytvGnQUiym18KnHpxs&t=2024-12-30T17%3A06%3A04.004Z" }}/>
            <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/zaba%20collage/zc5.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ6YWJhIGNvbGxhZ2UvemM1LmpwZyIsImlhdCI6MTczNTU3ODM4MywiZXhwIjoxNzY3MTE0MzgzfQ.DgdNBu9qZkDUMxUXSN4hwL2I1eXOn0mcHF6VjFH1ud4&t=2024-12-30T17%3A06%3A23.256Z" }} />
          </ScrollView>
        </View>

        {/* Details Card Below Image Slider */}
        <DetailsCard
          title={name}
          description={description}
          additionalDescription="For LARI2Gether users, Zaba College is more than just a hangout spot. It’s a great place to warm up with light activities before a run or to cool down and socialize post-run. The blend of sports facilities and community vibes makes it a perfect hub for group activities and fostering connections among runners."
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
