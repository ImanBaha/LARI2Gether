import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';

// Replace with your OpenWeather API key
const API_KEY = '0f47ec7446f959c6b90d2da414e334c3';

export default function WeatherScreen() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Coordinates for the weather API
    const lat = 33.44;
    const lon = -94.04;
    fetchWeatherData(lat, lon);
  }, []);

  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${'0f47ec7446f959c6b90d2da414e334c3'}&units=metric&exclude=minutely,hourly`
      );
      const data = await response.json();

      console.log("Weather API response:", data); // Log the API response

      // Check for current weather data
      if (data && data.current) {
        setWeather(data.current);
      } else {
        Alert.alert("Error", "Unexpected weather data format.");
        console.log("Unexpected data format:", data); // Log unexpected data format
      }
    } catch (error) {
      Alert.alert("Error", "Unable to fetch weather data.");
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ padding: 20 }}>
      {weather ? (
        <>
          <Text>Temperature: {weather.temp} °C</Text>
          <Text>Weather: {weather.weather[0].description}</Text>
          <Text>Humidity: {weather.humidity}%</Text>
          <Text>Wind Speed: {weather.wind_speed} m/s</Text>
        </>
      ) : (
        <Text>Weather data not available</Text>
      )}
    </View>
  );
}
