import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';  // Import useNavigation

const CampusMapRoutes = () => {
  const navigation = useNavigation();  // Hook to access navigation
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [region, setRegion] = useState({
    latitude: 3.728,
    longitude: 101.532,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  const places = [
    { id: 1, name: 'Arena UPSI', latitude: 3.728856, longitude: 101.532560 },
    { id: 2, name: 'Old Campus', latitude: 3.685421, longitude: 101.527183 },
    { id: 3, name: 'Zaba College', latitude: 3.723245, longitude: 101.518724 },
    { id: 4, name: 'New Campus', latitude: 3.726442, longitude: 101.531040 },
  ];

  useEffect(() => {
    if (selectedPlace) {
      setRegion({
        latitude: selectedPlace.latitude,
        longitude: selectedPlace.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [selectedPlace]);

  const onPlacePress = (place) => {
    setSelectedPlace(place);

    // Static screen names for each place
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
    <View style={styles.container}>
      <Text style={styles.header}>Where to Jog: UPSI's Favorites</Text>

      <MapView
        style={styles.map}
        initialRegion={region}
        region={region}
      >
        {places.map((place) => (
          <Marker
            key={place.id}
            coordinate={{ latitude: place.latitude, longitude: place.longitude }}
            title={place.name}
            pinColor="blue"
          />
        ))}
      </MapView>

      <ScrollView style={styles.placeList} showsVerticalScrollIndicator={false}>
        {places.map((place) => (
          <TouchableOpacity
            key={place.id}
            style={[styles.placeCard, selectedPlace?.id === place.id && styles.activePlaceCard]}
            onPress={() => onPlacePress(place)}
          >
            <Text style={styles.placeText}>{place.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 15,
    marginVertical: 15,
    marginBottom: 110,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  map: {
    height: 250,
    borderRadius: 15,
    marginBottom: 15,
  },
  placeList: {
    flex: 1,
    marginTop: 10,
  },
  placeCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activePlaceCard: {
    backgroundColor: '#4A90F2',
  },
  placeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'center',
  },
});
 
export default CampusMapRoutes;
