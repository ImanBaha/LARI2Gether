import React, { useRef, useEffect, useState } from 'react';
import { Text, View, ScrollView, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import YouTubeVideo from '../components/YouTubeVideo';
import CampusMapRoutes from '../components/CampusMapRoutes';


const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 20; // Reduced side margins

const places = [
  {
    id: 1,
    name: 'Arena UPSI',
    image: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/random%20image/arena.jpg",
    latitude: 4.3601,
    longitude: 101.1449
  },
  {
    id: 2,
    name: 'Old Campus',
    image: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/random%20image/kk.jpg",
    latitude: 4.3602,
    longitude: 101.1450
  },
  {
    id: 3,
    name: 'Zaba College',
    image: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/zaba%20collage/111.jpg",
    latitude: 4.3603,
    longitude: 101.1451
  },
  {
    id: 4,
    name: 'New Campus',
    image: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/random%20image/2.jpg",
    latitude: 4.3604,
    longitude: 101.1452
  }
];

const Home = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % places.length;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * CARD_WIDTH,
        animated: true
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const onPlacePress = (place) => {
    switch (place.name) {
      case 'Arena UPSI':
        navigation.navigate('ArenaDetails', {
          name: place.name,
          latitude: place.latitude,
          longitude: place.longitude,
        });
        break;
      case 'Old Campus':
        navigation.navigate('OldCampusLoopDetails', {
          name: place.name,
          latitude: place.latitude,
          longitude: place.longitude,
        });
        break;
      case 'Zaba College':
        navigation.navigate('KZCollegeDetails', {
          name: place.name,
          latitude: place.latitude,
          longitude: place.longitude,
        });
        break;
      case 'New Campus':
        navigation.navigate('NewCampusLoopDetails', {
          name: place.name,
          latitude: place.latitude,
          longitude: place.longitude,
        });
        break;
      default:
        console.warn('No screen found for this place');
    }
  };

  return (
    <LinearGradient colors={['#0066b2', '#ADD8E6', '#F0FFFF']} style={styles.gradientContainer}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.mainImageContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            ref={scrollViewRef}
            pagingEnabled
            snapToInterval={CARD_WIDTH}
            decelerationRate="fast"
          >
            {places.map((place) => (
              <TouchableOpacity
                key={place.id}
                style={styles.placeContainer}
                onPress={() => onPlacePress(place)}
                activeOpacity={0.9}
              >
                <Image style={styles.mainImage} source={{ uri: place.image }} />
                <View style={styles.placeNameContainer}>
                  <Text style={styles.placeName}>{place.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.sectionTitle}>Campus Tour</Text>
        <YouTubeVideo videoId="ZbChJzaDbqg" />

      {/* Campus Map with Popular Routes */}
      <CampusMapRoutes />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 10,
    marginTop: 25,
  },
  mainImageContainer: {
    marginBottom: 10,
  },
  placeContainer: {
    position: 'relative',
    width: CARD_WIDTH,
    borderRadius: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    backgroundColor: '#fff',
  },
  mainImage: {
    width: CARD_WIDTH,
    height: 200,
    borderRadius: 15,
  },
  placeNameContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxWidth: '90%', // Ensure the container doesn't get too wide
  },
  placeName: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#ffffff',
  },
});

export default Home;