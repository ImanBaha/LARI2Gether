import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, Switch } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import { LinearGradient } from "expo-linear-gradient";

const ChallengeCard = ({ challenge }) => {
  const navigation = useNavigation();
  const [participantCount, setParticipantCount] = useState(0);
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchParticipantData();
  }, [challenge.id]);

  const fetchParticipantData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("challenge")
        .select('participantsID')
        .eq('id', challenge.id)
        .single();

      if (error) throw error;
      
      const participants = data.participantsID || [];
      setParticipantCount(participants.length);
      setIsJoined(participants.includes(user.id));
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  const handleToggleJoin = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error: fetchError } = await supabase
        .from("challenge")
        .select('participantsID')
        .eq('id', challenge.id)
        .single();

      if (fetchError) throw fetchError;

      let participants = data.participantsID || [];
      
      if (isJoined) {
        participants = participants.filter(id => id !== user.id);
      } else {
        participants = [...participants, user.id];
      }

      const { error: updateError } = await supabase
        .from("challenge")
        .update({ participantsID: participants })
        .eq('id', challenge.id);

      if (updateError) throw updateError;

      setIsJoined(!isJoined);
      setParticipantCount(participants.length);
    } catch (error) {
      console.error("Error toggling join status:", error);
      Alert.alert("Error", "Failed to update join status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Challenge",
      "Are you sure you want to delete this challenge?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("challenge")
              .delete()
              .eq("id", challenge.id);

            if (error) {
              console.error("Error deleting challenge:", error);
              Alert.alert("Error", "Failed to delete challenge.");
            } else {
              Alert.alert("Success", "Challenge deleted successfully!");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        {/* Image Container with Gradient Overlay */}
        <View style={styles.imageContainer}>
          {challenge.image ? (
            <Image source={{ uri: challenge.image }} style={styles.image} />
          ) : (
            <Image 
              source={require('../assests/images/notload.png')} 
              style={styles.image} 
            />
          )}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
          
          {/* Level Badge */}
          {challenge.level && (
            <View style={styles.levelContainer}>
              <MaterialCommunityIcons name="signal" size={14} color="#fff" />
              <Text style={styles.level}>{challenge.level}</Text>
            </View>
          )}
          
          {/* Participants Badge */}
          <View style={styles.participantsContainer}>
            <MaterialCommunityIcons name="account-group" size={16} color="#fff" />
            <Text style={styles.participantsText}>
              {participantCount} Runner{participantCount !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {challenge.title || "No Title"}
          </Text>

          <Text style={styles.description} numberOfLines={2}>
            {challenge.description || "No Description"}
          </Text>

          <View style={styles.infoContainer}>
            {challenge.location && (
              <View style={styles.infoItem}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.infoText} numberOfLines={1}>{challenge.location}</Text>
              </View>
            )}
            
            {(challenge.date || challenge.time) && (
              <View style={styles.infoItem}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.infoText}>
                  {challenge.date}{challenge.time ? ` • ${challenge.time}` : ''}
                </Text>
              </View>
            )}
          </View>

          {/* Action Buttons with Toggle Switch */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.viewButton]}
              onPress={() => navigation.navigate("ViewCh", { id: challenge.id })}
            >
              <Ionicons name="eye" size={20} color="#fff" />
              <Text style={styles.buttonText}>View</Text>
            </TouchableOpacity>

            <View style={styles.buttonGroup}>
              {/* Join Toggle Switch */}
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>Join</Text>
                <Switch
                  value={isJoined}
                  onValueChange={handleToggleJoin}
                  disabled={isLoading}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={isJoined ? '#0066b2' : '#f4f3f4'}
                />
              </View>

              <TouchableOpacity
                style={[styles.iconButton, styles.editButton]}
                onPress={() => navigation.navigate("UpdateCh", { id: challenge.id })}
              >
                <Ionicons name="create-outline" size={20} color="#0066b2" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.iconButton, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Ionicons name="trash-outline" size={20} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 4,
    marginVertical: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  levelContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(108, 99, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  level: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  participantsContainer: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  participantsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  infoContainer: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButton: {
    backgroundColor: '#0066b2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  editButton: {
    borderColor: '#0066b2',
  },
  deleteButton: {
    borderColor: '#e74c3c',
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 4,
  },
  joinedStatus: {
    backgroundColor: '#2e7d32',
  },
  notJoinedStatus: {
    backgroundColor: '#c62828',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  }
});

export default ChallengeCard;