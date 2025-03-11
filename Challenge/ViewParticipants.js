import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

const ViewParticipants = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { challengeId, participantIds } = route.params;
  
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      if (!participantIds?.length) {
        setParticipants([]);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar, fullname')
        .in('id', participantIds);

      if (error) throw error;

      setParticipants(data || []);
    } catch (error) {
      console.error('Error fetching participants:', error);
      Alert.alert('Error', 'Failed to load participants');
    } finally {
      setLoading(false);
    }
  };

  const renderParticipant = ({ item, index }) => (
    <Animatable.View 
      animation="fadeInUp" 
      delay={index * 100}
      style={styles.participantCard}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate('ViewHP', { userId: item.id })}
        style={styles.cardTouchable}
      >
        <LinearGradient
          colors={['#ffffff', '#f8f9fa']}
          style={styles.cardGradient}
        >
          <View style={styles.avatarContainer}>
            {item.avatar ? (
              <Image 
                source={{ uri: item.avatar }} 
                style={styles.avatar}
              />
            ) : (
              <LinearGradient
                colors={['#0066b2', '#0099ff']}
                style={[styles.avatar, styles.avatarPlaceholder]}
              >
                <Text style={styles.avatarText}>
                  {(item.fullname || item.username || '?')[0].toUpperCase()}
                </Text>
              </LinearGradient>
            )}
            <View style={styles.statusDot} />
          </View>
  
          <View style={styles.participantInfo}>
            <Text style={styles.participantName}>
              {item.fullname || 'Anonymous Runner'}
            </Text>
            <View style={styles.usernameContainer}>
              <MaterialCommunityIcons name="at" size={16} color="#666" />
              <Text style={styles.participantUsername}>
                {item.username || 'username'}
              </Text>
            </View>
          </View>
  
          <TouchableOpacity style={styles.moreButton}>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#0066b2" />
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );

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
      <Animatable.View 
        animation="fadeIn"
        style={styles.container}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-circle" size={36} color="#FFAC1C" />
        </TouchableOpacity>

        <Animatable.View 
          animation="fadeInDown"
          style={styles.headerContainer}
        >
          <Text style={styles.title}>Challenge Participants</Text>
          <View style={styles.participantCount}>
            <MaterialCommunityIcons name="account-group" size={20} color="#fff" />
            <Text style={styles.countText}>{participants.length} Runners</Text>
          </View>
        </Animatable.View>
        
        {participants.length === 0 ? (
          <Animatable.View 
            animation="fadeIn"
            delay={300}
            style={styles.emptyContainer}
          >
            <MaterialCommunityIcons name="run" size={64} color="#fff" />
            <Text style={styles.emptyText}>No participants yet</Text>
            <Text style={styles.emptySubtext}>Be the first to join this challenge!</Text>
          </Animatable.View>
        ) : (
          <FlatList
            data={participants}
            renderItem={renderParticipant}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Animatable.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 60,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  participantCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  countText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    padding: 3,
  },
  backButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 27,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    paddingTop: 4,
  },
  participantCard: {
    marginBottom: 16, // Increased from 12 to 16
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginHorizontal: 4, // Added horizontal margin
  },
  cardTouchable: {
    borderRadius: 16,
    overflow: 'hidden', // Ensures the gradient stays within borders
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15, // Increased from 16 to 20
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20, // Increased from 16 to 20
  },
  avatar: {
    width: 60, // Increased from 56 to 60
    height: 60, // Increased from 56 to 60
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  participantInfo: {
    flex: 1,
    paddingVertical: 4, // Added vertical padding
  },
  participantName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a237e',
    marginBottom: 6, // Increased from 4 to 6
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantUsername: {
    fontSize: 14,
    color: '#666',
    marginLeft: 2,
  },
  moreButton: {
    padding: 10, // Increased from 8 to 10
    marginLeft: 8, // Added left margin
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
  },
  
});

export default ViewParticipants;