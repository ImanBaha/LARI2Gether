// components/CampusMapRoutes.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const CampusMapRoutes = () => {
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Sample coordinates for popular routes
  const popularRoutes = [
    {
      id: 1,
      name: 'Main Entrance to Stadium',
      coordinates: [
        { latitude: 3.7296, longitude: 101.5150 },
        { latitude: 3.7278, longitude: 101.5172 }, // Sample path
      ],
    },
    {
      id: 2,
      name: 'Library Loop',
      coordinates: [
        { latitude: 3.6844, longitude: 101.5223 },
        { latitude: 3.6825, longitude: 101.5200 }, // Sample path
      ],
    },
  ];

  // Set the selected route when a route is clicked
  const onRoutePress = (route) => {
    setSelectedRoute(route);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Popular Campus Routes</Text>
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
            coordinates={route.coordinates}
            strokeColor="#FF6347" // Customize route color
            strokeWidth={4}
          />
        ))}

        {/* Display a marker for the selected route */}
        {selectedRoute && (
          <Marker
            coordinate={selectedRoute.coordinates[0]}
            title={selectedRoute.name}
          />
        )}
      </MapView>

      {/* List of routes */}
      <View style={styles.routeList}>
        {popularRoutes.map((route) => (
          <TouchableOpacity
            key={route.id}
            style={styles.routeItem}
            onPress={() => onRoutePress(route)}
          >
            <Text style={styles.routeText}>{route.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 15,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  map: {
    height: 200,
    borderRadius: 10,
  },
  routeList: {
    marginTop: 10,
  },
  routeItem: {
    paddingVertical: 5,
  },
  routeText: {
    fontSize: 14,
    color: '#555',
  },
});

export default CampusMapRoutes;
