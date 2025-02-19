import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { supabase } from '../lib/supabase'; // Make sure to import your Supabase client

const RunLevel = () => {
  const navigation = useNavigation();
  const [totaldistance, setTotalDistance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTotalDistance();
  }, []);

  const fetchTotalDistance = async () => {
    try {
      const userid = (await supabase.auth.getUser()).data.user.id
      // Fetch the sum of all distances from the runs table
      const { data, error } = await supabase
        .from('runs')
        .select('distance').eq("userid", userid);

      if (error) {
        console.error('Error fetching runs:', error.message);
        setIsLoading(false);
        return;
      }

      if (data) {
        // Calculate the sum of all distances
        const total = data.reduce((sum, run) => sum + (run.distance || 0), 0);
        setTotalDistance(total);
      }
      
      setIsLoading(false);

    } catch (error) {
      console.error('Error:', error.message);
      setIsLoading(false);
    }
  };

  // Determine card color based on distance
  let levelColor = "yellow";
  if (totaldistance >= 50 && totaldistance < 250) {
    levelColor = "orange";
  } else if (totaldistance >= 250 && totaldistance < 600) {
    levelColor = "green";
  } else if (totaldistance >= 600 && totaldistance < 1500) {
    levelColor = "blue";
  } else if (totaldistance >= 1500) {
    levelColor = "purple";
  }

  // Calculate distance to the next level
  const nextLevelDistance =
    totaldistance < 50
      ? 50 - totaldistance
      : totaldistance < 250
      ? 250 - totaldistance
      : totaldistance < 600
      ? 600 - totaldistance
      : totaldistance < 1500
      ? 1500 - totaldistance
      : 1000 - totaldistance;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={
          levelColor === "yellow"
            ? ["#FFD700", "#FFC107"]
            : levelColor === "orange"
            ? ["#FFA500", "#FF8C00"]
            : levelColor === "green"
            ? ["#32CD32", "#228B22"]
            : levelColor === "blue"
            ? ["#1E90FF", "#4169E1"]
            : ["#800080", "#4B0082"]
        }
        style={styles.card}
      >
        <Image
          source={{ uri: "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/RunLevel/white.png" }}
          style={styles.image}
        />

        <Text style={styles.title}>{levelColor.toUpperCase()}</Text>
        <Text style={styles.distance}>{totaldistance.toFixed(1)}</Text>
        <Text style={styles.totalKilometers}>Total Kilometres</Text>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.min(
                  (totaldistance / (totaldistance + nextLevelDistance)) * 100,
                  100
                )}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.nextLevelText}>
          {nextLevelDistance.toFixed(2)} km to next level
        </Text>
      </LinearGradient>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ViewRL", { totaldistance })}
      >
        <Text style={styles.buttonText}>View Run Level</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  card: {
    width: "100%",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    position: "relative",
  },
  image: { 
    width: 70,
    height: 70,
    position: "absolute",
    top: 20,
    right: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
  },
  distance: {
    fontSize: 33,
    fontWeight: "900",
    color: "#333",
    marginVertical: 8,
  },
  totalKilometers: {
    fontSize: 13,
    color: "black",
    marginBottom: 10,
  },
  progressBarContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "black",
  },
  nextLevelText: {
    marginTop: 10,
    color: "black",
    fontSize: 13,
  },
  button: {
    backgroundColor: "#f8f8f8",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    bottom: 12,
  },
  buttonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});

export default RunLevel;