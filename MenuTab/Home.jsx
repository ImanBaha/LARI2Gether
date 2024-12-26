import React, { useRef, useEffect, useState } from 'react';
import { Text, View, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import DailyMotivation from '../components/DailyMotivation'; // Import the DailyMotivation component
import CampusMapRoutes from '../components/CampusMapRoutes';
import UpcomingChallenges from '../components/UpcomingChallenges';

const { width } = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [dateTime, setDateTime] = useState(new Date());
  let scrollValue = 0;
  let scrolled = 0;

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
    }, 2500); // Slide every 2.5 seconds for a smoother experience

    // Update date and time every second
    const dateTimeInterval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(dateTimeInterval);
    };
  }, []);

  // Format the date to show only the day, month, time, and AM/PM
  const formatDateTime = () => {
    return dateTime.toLocaleString('en-GB', {
      day: 'numeric',   // Day of the month
      month: 'long',    // Full month name (e.g., November)
      hour: 'numeric',  // Hour (12-hour format)
      minute: 'numeric', // Minutes
      second: 'numeric', // Seconds
      hour12: true,      // AM/PM format
    });
  };

  return (
    <LinearGradient colors={['#0066b2', '#FFAA33']} style={styles.gradientContainer}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerMain}>
          <View style={styles.headerRowMain}>
            <Image style={styles.profileImageMain} source={require("../assests/images/L2G.png")} />
            <Text style={styles.headerTextMain}>LARI2Gether</Text>
          </View>
        </View>

        <View style={styles.mainImageContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            ref={scrollViewRef}
            pagingEnabled
          >
            <Image style={styles.mainImage} source={require("../assests/images/1.jpg")} />
            <Image style={styles.mainImage} source={require("../assests/images/2.jpg")} />
            <Image style={styles.mainImage} source={require("../assests/images/view3.jpg")} />
            <Image style={styles.mainImage} source={require("../assests/images/view1.jpg")} />
            <Image style={styles.mainImage} source={require("../assests/images/view2.jpg")} />
          </ScrollView>
        </View>

        {/* Date and Time Display */}
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateTimeText}>{formatDateTime()}</Text>
        </View>

        {/* Daily Motivation Component */}
        <DailyMotivation />

        <UpcomingChallenges />

        {/* Campus Map with Popular Routes */}
        <CampusMapRoutes />
      </ScrollView>
    </LinearGradient>
  );
};

export default Home;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 10,
  },
  headerMain: {
    width: '100%',
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 25,
  },
  headerRowMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageMain: {
    width: 70,
    height: 57,
    borderRadius: 10,
    marginTop: 12,
  },
  headerTextMain: {
    marginLeft: 12,
    fontSize: 21,
    fontWeight: 'bold',
    color: '#fff',
  },
  mainImageContainer: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center', // Center the image horizontally
  },
  mainImage: {
    width: width - 25,
    height: 200,
    borderRadius: 12,
    marginHorizontal: 10,
  },
  dateTimeContainer: {
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: '90%',
    alignSelf: 'center',
    marginTop: 0,
  },
  dateTimeText: {
    fontSize: 16, // Slightly larger font size
    fontWeight: '700', // Bold weight for more power
    color: '#1C1C1C', // Darker shade for contrast
    letterSpacing: 1, // Increased letter spacing for a clean, modern look
    textTransform: 'uppercase', // Making the text uppercase for added emphasis
    shadowColor: '#000', // Adding shadow for a bit of depth
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3, // For Android shadow
  },
});
