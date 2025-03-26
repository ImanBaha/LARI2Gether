import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, Image, Dimensions, StyleSheet, TouchableOpacity, Linking, StatusBar } from "react-native";
import * as Animatable from 'react-native-animatable'; // Add this import
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DetailsCard from "../components/DetailsCard";

const { width } = Dimensions.get('window');

const KZCollegeDetails = ({ route }) => {
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

  const description = "Zaba College is a vibrant spot at UPSI, offering a range of activities for fitness enthusiasts and social gatherings. It features bicycle rentals, making it easy to explore the area, and a variety of sports facilities, including futsal, volleyball, and badminton courts. The location is particularly popular in the evenings, with students enjoying the beautiful sunset views and a lively, interactive atmosphere.";

  return (
    <View style={styles.container}>
      <ScrollView>
         {/* Back Button */}
                <TouchableOpacity
                           style={styles.backButton}
                           onPress={() => navigation.goBack()}
                         >
                           <Ionicons name="chevron-back-circle" size={38} color="#FFAC1C" />
                         </TouchableOpacity>

        {/* Animated Location and Title Section */}
      <Animatable.View 
        style={styles.titleContainer}
        animation="slideInRight"
        duration={1000}
        delay={300}
      >
        <TouchableOpacity 
          style={styles.locationIcon} 
          onPress={() => openMap(3.723245,101.518724)}
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
          {[
            "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/zaba%20collage/zc1.jpg",
            "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/zaba%20collage/zc2.jpg",
            "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/zaba%20collage/zc3.jpg",
            "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/zaba%20collage/zc4%20.jpg",
            "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/zaba%20collage/zc5.jpg"
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
          additionalDescription="For LARI2Gether users, Zaba College is more than just a hangout spot. It's a great place to warm up with light activities before a run or to cool down and socialize post-run. The blend of sports facilities and community vibes makes it a perfect hub for group activities and fostering connections among runners."
          location="Kampus Sultan Azlan Shah UPSI, Proton City"
          totalDistance="1.2 km per lap (Standard Track)"
          difficulty={3}
          safety={3}
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
    left: 10,
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
  },
  mainImage: {
    width: width,
    height: 270,
    resizeMode: 'cover',
    overflow: 'hidden',
  },
});

export default KZCollegeDetails;
