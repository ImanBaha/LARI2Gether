import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, Image, Dimensions, StyleSheet, TouchableOpacity, Linking, StatusBar } from "react-native";
import * as Animatable from 'react-native-animatable'; // Add this import
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DetailsCard from "../components/DetailsCard";


const { width } = Dimensions.get('window');

const NewCampusLoopDetails = ({ route }) => {
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

  const description = "The New Campus of UPSI in Proton City offers a picturesque 5+ km loop, perfect for runners looking to tackle longer distances. Set against the majestic backdrop of the Titiwangsa mountain range, the route provides breathtaking views of green mountains, creating a serene and calming atmosphere for every run.";

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
          onPress={() => openMap(3.726442,101.531040)}
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
            "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/new%20campus/view7.jpg",
            "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/new%20campus/nc8.jpg",
            "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/new%20campus/nc1.jpg",
            "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/new%20campus/nc7.jpg",
            "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/new%20campus/n6.jpg"
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
          additionalDescription="With its wide roads and open landscapes, the campus is ideal for LARI2Gether users aiming to build endurance or train for long-distance goals. Whether you're running solo or joining a community run, the expansive and scenic surroundings make every stride enjoyable and inspiring."
          location="Kampus Sultan Azlan Shah UPSI, Proton City"
          totalDistance="5 km per lap (Standard Track)"
          difficulty={4}
          safety={4}
          favLocation={5}
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
    opacity: 0.95,
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
    height: 270,
    marginTop: 0,
    overflow: 'hidden', // Add this to contain animations
  },
  mainImage: {
    width: width,
    height: 270,
    resizeMode: 'cover',
  },
});

export default NewCampusLoopDetails;
