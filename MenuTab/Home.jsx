import React, { useRef, useEffect, useState } from 'react';
import { Text, View, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import DailyMotivation from '../components/DailyMotivation'; // Import the DailyMotivation component
import CampusMapRoutes from '../components/CampusMapRoutes';
import YouTubeVideo from '../components/YouTubeVideo'; // Import the YouTubeVideo component
import NavCard from '../components/NavCard';

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

  return (
    <LinearGradient colors={['#0066b2', '#FFAA33']} style={styles.gradientContainer}>
    <ScrollView style={styles.scrollView}>
      <View style={styles.headerMain}>
        <View style={styles.headerRowMain}>
          <Image style={styles.profileImageMain} source={require("../assests/images/L2G.png")} />
          {/* Wrap 'LARI2Gether' inside a Text component */}
          <Text style={styles.headerTextMain}>LARI2Gether</Text>
        </View>
      </View>
  
      {/* Other components */}
      <DailyMotivation />
  
      <View style={styles.mainImageContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={scrollViewRef}
          pagingEnabled
        >
          <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/random%20image/1.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyYW5kb20gaW1hZ2UvMS5qcGciLCJpYXQiOjE3MzU1NzczNjQsImV4cCI6MTc2NzExMzM2NH0.LTKkk7meSrCDcYz-QOU5YNIfDTkYfiIsZ4J7WjyuI9o&t=2024-12-30T16%3A49%3A24.010Z" }} />
          <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/random%20image/2.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyYW5kb20gaW1hZ2UvMi5qcGciLCJpYXQiOjE3MzU1Nzc0MDAsImV4cCI6MTc2NzExMzQwMH0._7D6_YmjIVkGqsvIjxkWsZ1yQ2lJNvKHgIEzb85gOIo&t=2024-12-30T16%3A49%3A59.497Z" }} />
          <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/random%20image/3.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyYW5kb20gaW1hZ2UvMy5qcGciLCJpYXQiOjE3MzU1Nzc0MTgsImV4cCI6MTc2NzExMzQxOH0.wse2NAcKfyfQt4H8GU0Rnr711dkNGIOTHmiunqN7zso&t=2024-12-30T16%3A50%3A18.099Z" }} />
          <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/random%20image/4.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyYW5kb20gaW1hZ2UvNC5qcGciLCJpYXQiOjE3MzU1Nzc0MzMsImV4cCI6MTc2NzExMzQzM30.-DGRMSgTb7lL0ghQNoDEUT3A2cZE-_wRUvzlXhCIEcs&t=2024-12-30T16%3A50%3A32.693Z" }} />
          <Image style={styles.mainImage} source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/sign/random%20image/5.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyYW5kb20gaW1hZ2UvNS5qcGciLCJpYXQiOjE3MzU1Nzc0NTYsImV4cCI6MTc2NzExMzQ1Nn0.7KdfP28rpirnvODCQ8ZpzBkm_awziskm2_n_akQouW0&t=2024-12-30T16%3A50%3A56.057Z" }} />
        </ScrollView>
      </View>
  

      <NavCard/>
  
      {/* Campus Map with Popular Routes */}
      <CampusMapRoutes />
  
      {/* YouTube Video Section */}
      {/* Wrap 'Featured Video' inside a Text component */}
      <Text style={styles.sectionTitle}>Campus Tour</Text>
      <YouTubeVideo videoId="ZbChJzaDbqg" />
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
    marginBottom: 2,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#ffffff',
  },
});
