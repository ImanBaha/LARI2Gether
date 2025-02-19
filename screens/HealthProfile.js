import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { supabase } from "../lib/supabase";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const HealthProfile = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    totalDistance: 0,
    challengesJoined: 0,
    ranking: 0,
    level: "Yellow",
  });

  const getLevelLogo = (level) => {
    switch (level) {
      case "Yellow":
        return "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/RunLevel/yellow.png";
      case "Orange":
        return "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/RunLevel/orange.png";
      case "Green":
        return "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/RunLevel/green.png";
      case "Blue":
        return "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/RunLevel/blue.png";
      case "Purple":
        return "https://adzrewydpoxhzrdmnmhm.supabase.co/storage/v1/object/public/RunLevel/purple.png";
      default:
        return null;
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Fetch total distance
      const { data: runsData, error: runsError } = await supabase
        .from('runs')
        .select('distance')
        .eq("userid", user.id);

      if (runsError) throw runsError;

      const totalDistance = runsData.reduce((sum, run) => sum + (run.distance || 0), 0);

      // Fetch challenges joined
      const { data: challengesData, error: challengesError } = await supabase
        .from('challenge')
        .select('participantsID');

      if (challengesError) throw challengesError;

      const challengesJoined = challengesData.filter(challenge => 
        challenge.participantsID && challenge.participantsID.includes(user.id)
      ).length;

      // Calculate level based on total distance
      let level = "Yellow";
      if (totalDistance >= 50 && totalDistance < 250) {
        level = "Orange";
      } else if (totalDistance >= 250 && totalDistance < 600) {
        level = "Green";
      } else if (totalDistance >= 600 && totalDistance < 1500) {
        level = "Blue";
      } else if (totalDistance >= 1500) {
        level = "Purple";
      }

      // Calculate ranking
      const { data: allUsers, error: usersError } = await supabase
        .from('runs')
        .select('userid, distance');

      if (usersError) throw usersError;

      const userTotals = allUsers.reduce((acc, run) => {
        acc[run.userid] = (acc[run.userid] || 0) + (run.distance || 0);
        return acc;
      }, {});

      const sortedUsers = Object.entries(userTotals)
        .sort(([, a], [, b]) => b - a);
      
      const ranking = sortedUsers.findIndex(([userid]) => userid === user.id) + 1;

      setProfileData({
        totalDistance,
        challengesJoined,
        ranking,
        level,
      });

    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066b2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <LinearGradient
        colors={['#0066b2', '#ADD8E6', '#F0FFFF']}
        style={styles.background}
      >
        <Animatable.View 
          animation="fadeIn" 
          duration={1000} 
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={28} color="black" />
            </TouchableOpacity>
            
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerSubtitle}>Welcome to your</Text>
              <Text style={styles.headerTitle}>Health Profile</Text>
            </View>
          </View>
        </Animatable.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            delay={300}
            style={styles.statsContainer}
          >
            {/* Level Logo */}
            <View style={styles.levelLogoContainer}>
              <Image
                source={{ uri: getLevelLogo(profileData.level) }}
                style={styles.levelLogo}
              />
            </View>

            {/* Stats Cards */}
            <View style={styles.statsGrid}>
              {[
                {
                  icon: "trophy",
                  title: "Ranking",
                  value: `#${profileData.ranking}`,
                  color: "#FFD700"
                },
                {
                  icon: "flag-checkered",
                  title: "Challenges",
                  value: profileData.challengesJoined,
                  color: "#FF4081"
                },
                {
                  icon: "run-fast",
                  title: "Total Distance",
                  value: `${profileData.totalDistance.toFixed(1)} km`,
                  color: "#4CAF50"
                },
                {
                  icon: "star",
                  title: "Achievement Rate",
                  value: `${((profileData.totalDistance / 1500) * 100).toFixed(1)}%`,
                  color: "#FF9800"
                }
              ].map((stat, index) => (
                <Animatable.View
                  key={index}
                  animation="zoomIn"
                  delay={600 + (index * 100)}
                  style={styles.statCard}
                >
                  <MaterialCommunityIcons
                    name={stat.icon}
                    size={30}
                    color={stat.color}
                  />
                  <Text style={styles.statTitle}>{stat.title}</Text>
                  <Text style={styles.statValue}>{stat.value}</Text>
                </Animatable.View>
              ))}
            </View>
          </Animatable.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: StatusBar.currentHeight + 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'black',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
  },
  levelLogoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  levelLogo: {
    width: 130,
    height: 140,
    resizeMode: 'contain',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  statsContainer: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 16,
    alignItems: "center",
    width: (width - 48) / 2,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginTop: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
});

export default HealthProfile;