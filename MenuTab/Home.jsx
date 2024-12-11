import React, { useRef, useEffect, useState } from 'react';
import { Text, View, ScrollView, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DailyMotivation from '../components/DailyMotivation'; // Import the DailyMotivation component
import AchievementHighlights from '../components/AchievementHighlights';
import CampusMapRoutes from '../components/CampusMapRoutes';

const { width } = Dimensions.get('window');

// Sample review data
const reviews = [
  {
    id: 1,
    name: 'Iman',
    text: 'Mount Kinabalu is one of the most popular hiking destinations in Sabah.',
    likes: 458,
    image: require('../assests/images/avatar.jpg'),
  },
  {
    id: 2,
    name: 'Amir',
    text: 'A memorable experience, but it’s challenging and requires good preparation.',
    likes: 324,
    image: require('../assests/images/avatar.jpg'),
  },
  {
    id: 3,
    name: 'Aina',
    text: 'Perfect for nature lovers and adventure seekers. Highly recommended!',
    likes: 276,
    image: require('../assests/images/avatar.jpg'),
  },
];

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
    <View style={styles.containerMain}>
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
            <Image style={styles.mainImage} source={require("../assests/images/5.jpg")} />
          </ScrollView>
        </View>

        {/* Date and Time Display */}
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateTimeText}>{formatDateTime()}</Text>
        </View>

        {/* Daily Motivation Component */}
        <DailyMotivation />

         {/* Achievement Highlights */}
    <AchievementHighlights />

    {/* Campus Map with Popular Routes */}
    <CampusMapRoutes />

        <View style={styles.reviewContainerR}>
          <TouchableOpacity onPress={() => navigation.navigate("Review")}>
            <Text style={styles.reviewTitle}>Reviews</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Review")}>
            <Text style={styles.addReviewText}>View more</Text>
          </TouchableOpacity>
        </View>

        {/* Dynamically render each review from the reviews array */}
        {reviews.map(review => (
          <View key={review.id} style={styles.reviewContainer}>
            <View style={styles.reviewItem}>
              <Image style={styles.profileImage} source={review.image} />
              <View style={styles.textContainer}>
                <Text style={styles.reviewerName}>{review.name}</Text>
                <Text style={styles.reviewText}>{review.text}</Text>
              </View>
            </View>
            <Text style={styles.likeText}>❤️️ {review.likes} people liked this</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F9F9F9',
  },
  scrollView: {
    paddingHorizontal: 10,
  },
  headerMain: {
    width: '100%',
    height: 64,
    backgroundColor: '#0066b2',
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
  },
  mainImage: {
    width: width - 40,
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
  reviewContainerR: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addReviewText: {
    fontSize: 14,
    color: '#31997A',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  reviewContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewText: {
    fontSize: 14,
    color: '#555',
  },
  likeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});
