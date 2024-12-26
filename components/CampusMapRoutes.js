import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

// Function to generate curved points using a Bezier curve
const getCurvedRoute = (start, end) => {
  const midpoint = {
    latitude: (start.latitude + end.latitude) / 2 + 0.002, // Adjust for curve height
    longitude: (start.longitude + end.longitude) / 2 - 0.002,
  };

  const points = [];
  for (let t = 0; t <= 1; t += 0.01) {
    const latitude =
      (1 - t) * (1 - t) * start.latitude +
      2 * (1 - t) * t * midpoint.latitude +
      t * t * end.latitude;
    const longitude =
      (1 - t) * (1 - t) * start.longitude +
      2 * (1 - t) * t * midpoint.longitude +
      t * t * end.longitude;
    points.push({ latitude, longitude });
  }
  return points;
};

const CampusMapRoutes = () => {
  const [selectedRoute, setSelectedRoute] = useState(null);

  const popularRoutes = [
    {
      id: 1,
      name: 'Arena UPSI',
      coordinates: [
        { latitude: 3.7296, longitude: 101.5150 },
        { latitude: 3.7278, longitude: 101.5172 },
      ],
    },
    {
      id: 2,
      name: 'Old Campus Loop',
      coordinates: [
        { latitude: 3.6844, longitude: 101.5223 },
        { latitude: 3.6825, longitude: 101.5200 },
      ],
    },
    {
      id: 3,
      name: 'KZ College',
      coordinates: [
        { latitude: 3.7267, longitude: 101.5190 },
        { latitude: 3.7282, longitude: 101.5230 },
      ],
    },
    {
      id: 4,
      name: 'New Campus Loop',
      coordinates: [
        { latitude: 3.7285, longitude: 101.5155 },
        { latitude: 3.7300, longitude: 101.5180 },
      ],
    },
  ];

  const onRoutePress = (route) => {
    setSelectedRoute(route);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Explore UPSI Routes</Text>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 3.729,
          longitude: 101.909,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        region={
          selectedRoute
            ? {
                latitude: selectedRoute.coordinates[0].latitude,
                longitude: selectedRoute.coordinates[0].longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }
            : undefined
        }
      >
        {popularRoutes.map((route) => (
          <Polyline
            key={route.id}
            coordinates={getCurvedRoute(route.coordinates[0], route.coordinates[1])}
            strokeColor="#FF4500"
            strokeWidth={4}
          />
        ))}

        {selectedRoute &&
          selectedRoute.coordinates.map((coord, index) => (
            <Marker
              key={index}
              coordinate={coord}
              title={`Point ${index + 1}`}
              pinColor={index === 0 ? 'green' : 'red'}
            />
          ))}
      </MapView>

      {/* Vertical list of routes */}
      <ScrollView style={styles.routeList} showsVerticalScrollIndicator={false}>
        {popularRoutes.map((route) => (
          <TouchableOpacity
            key={route.id}
            style={[
              styles.routeCard,
              selectedRoute?.id === route.id && styles.activeRouteCard,
            ]}
            onPress={() => onRoutePress(route)}
          >
            <Text style={styles.routeText}>{route.name}</Text>
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
  routeList: {
    flex: 1,
    marginTop: 10,
  },
  routeCard: {
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
  activeRouteCard: {
    backgroundColor: '#4A90F2',
  },
  routeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'center',
  },
});

export default CampusMapRoutes;
