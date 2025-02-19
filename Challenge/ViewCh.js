import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";

const { width } = Dimensions.get("window");

const ViewCh = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participantCount, setParticipantCount] = useState(0);
  const [hasJoined, setHasJoined] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Fetch challenge data and check if current user has joined
  useEffect(() => {
    fetchChallengeAndStatus();
  }, [id]);

  const fetchChallengeAndStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: challengeData, error: challengeError } = await supabase
        .from("challenge")
        .select("*")
        .eq("id", id)
        .single();

      if (challengeError) throw challengeError;
      
      const { data: participantsData, error: participantsError } = await supabase
        .from("challenge")
        .select('participantsID')
        .eq('id', id)
        .single();

      if (participantsError) throw participantsError;

      const participants = participantsData.participantsID || [];
      
      setChallenge(challengeData);
      setParticipantCount(participants.length);
      setHasJoined(participants.includes(user.id));

    } catch (error) {
      console.error("Error fetching challenge:", error);
      Alert.alert("Error", "Failed to load challenge information");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinToggle = async () => {
    try {
      setProcessing(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert("Error", "Please login to continue");
        return;
      }

      // Get current participants array
      const { data: challengeData, error: challengeError } = await supabase
        .from("challenge")
        .select("participantsID")
        .eq("id", id)
        .single();

      if (challengeError) throw challengeError;

      let currentParticipants = challengeData.participantsID || [];
      let newParticipants;
      
      if (hasJoined) {
        // Remove user from participants
        newParticipants = currentParticipants.filter(pid => pid !== user.id);
      } else {
        // Add user to participants
        newParticipants = [...currentParticipants, user.id];
      }

      // Update participants array
      const { error: updateError } = await supabase
        .from("challenge")
        .update({
          participantsID: newParticipants
        })
        .eq("id", id);

      if (updateError) throw updateError;

      setHasJoined(!hasJoined);
      setParticipantCount(newParticipants.length);
      
      Alert.alert(
        "Success", 
        hasJoined 
          ? "You have left the challenge" 
          : "You have successfully joined the challenge!"
      );

    } catch (error) {
      console.error("Error toggling challenge participation:", error);
      Alert.alert("Error", "Failed to process your request");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066b2" />
      </View>
    );
  }

  return (
    <LinearGradient 
      colors={['#0066b2', '#ADD8E6', '#F0FFFF',]} 
      style={styles.gradient}
    >
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-circle" size={32} color="#FFAC1C" />
        </TouchableOpacity>

        <Animatable.View 
          animation="fadeInUp" 
          duration={1000} 
          style={styles.card}
        >
          {challenge?.image && (
            <Image 
              source={{ uri: challenge.image }} 
              style={styles.image}
              resizeMode="cover"
            />
          )}

          <View style={styles.contentContainer}>
            <Animatable.Text 
              animation="fadeInDown" 
              style={styles.title}
            >
              {challenge?.title || "Challenge Title"}
            </Animatable.Text>
            
            <TouchableOpacity 
  style={styles.participantsContainer}
  onPress={() => navigation.navigate("ViewParticipants", { 
    challengeId: id,
    participantIds: challenge?.participantsID || []
  })}
>
  <MaterialCommunityIcons 
    name="run-fast" 
    size={24} 
    color="#0066b2" 
  />
  <Text style={styles.participantsText}>
    {participantCount} Runner{participantCount !== 1 ? 's' : ''} Joined
  </Text>
</TouchableOpacity>
            
            <View style={styles.divider} />
            
            <Text style={styles.description}>
              {challenge?.description || "No description available"}
            </Text>

            <View style={styles.infoSection}>
              {[
                {
                  icon: "location",
                  value: challenge?.location,
                  default: "Location not specified"
                },
                {
                  icon: "calendar",
                  value: challenge?.date,
                  default: "Date not specified"
                },
                {
                  icon: "time",
                  value: challenge?.time,
                  default: "Time not specified"
                },
                {
                  icon: "signal",
                  value: challenge?.level,
                  default: "Level not specified",
                  customIcon: true
                }
              ].map((item, index) => (
                <Animatable.View 
                  key={index}
                  animation="fadeInRight"
                  delay={index * 200}
                  style={styles.infoItem}
                >
                  {item.customIcon ? (
                    <MaterialCommunityIcons 
                      name={item.icon} 
                      size={24} 
                      color="#0066b2" 
                    />
                  ) : (
                    <Ionicons 
                      name={item.icon} 
                      size={24} 
                      color="#0066b2" 
                    />
                  )}
                  <Text style={styles.infoText}>
                    {item.value || item.default}
                  </Text>
                </Animatable.View>
              ))}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  hasJoined ? styles.unjoinButton : styles.joinButton,
                  processing && styles.processingButton
                ]}
                onPress={handleJoinToggle}
                disabled={processing}
              >
                <MaterialCommunityIcons 
                  name={hasJoined ? "account-remove" : "account-plus"} 
                  size={24} 
                  color="#fff" 
                />
                <Text style={styles.buttonText}>
                  {processing 
                    ? "Processing..." 
                    : hasJoined 
                      ? "Leave Challenge" 
                      : "Join Challenge"
                  }
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.startButton]}
                onPress={() => navigation.navigate("RunTracker")}
                disabled={!hasJoined}
              >
                <MaterialCommunityIcons 
                  name="run-fast" 
                  size={24} 
                  color="#fff" 
                />
                <Text style={styles.buttonText}>
                  Start Challenge
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animatable.View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
    padding: 12,
    paddingTop: 60,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    padding: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  image: {
    width: "100%",
    height: 230,
  },
  contentContainer: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a237e",
    textAlign: "center",
    marginBottom: 8,
    bottom: 15,
  },
  divider: {
    height: 2,
    backgroundColor: "#e0e0e0",
    marginVertical: 15,
    width: "100%",
    borderRadius: 1,
  },
  description: {
    fontSize: 16,
    color: "#424242",
    lineHeight: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  infoSection: {
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#424242",
    flex: 1,
    fontWeight: "500",
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 20,
  },
  participantsText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#0066b2',
    fontWeight: '700',
  },
  buttonContainer: {
    gap: 14,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  joinButton: {
    backgroundColor: "#2e7d32",
  },
  unjoinButton: {
    backgroundColor: "#c62828",
  },
  startButton: {
    backgroundColor: "#0066b2",
  },
  processingButton: {
    backgroundColor: "#9e9e9e",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
});

export default ViewCh;