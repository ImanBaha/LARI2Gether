import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function ViewLeaderboard() {
  const navigation = useNavigation();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.95);

  useEffect(() => {
    loadLeaderboardData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isLoading]);

  const loadLeaderboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: userData } = await supabase.auth.getUser();
      const currentUserId = userData?.user?.id;

            const { data, error } = await supabase
        .from('runs')
        .select(`
            distance,
            profiles:userid (
            username,
            id
            )
        `);

      if (error) throw error;

      const userTotals = data.reduce((acc, run) => {
        const userId = run.profiles.id;
        const username = run.profiles.username;
        
        if (!acc[userId]) {
          acc[userId] = {
            userid: userId,
            username: username || 'Anonymous Runner',
            totalDistance: 0,
            runCount: 0,
            isCurrentUser: userId === currentUserId,
          };
        }
        acc[userId].totalDistance += parseFloat(run.distance);
        acc[userId].runCount += 1;
        return acc;
      }, {});

      const sortedData = Object.values(userTotals)
        .sort((a, b) => b.totalDistance - a.totalDistance)
        .map((user, index) => ({
          ...user,
          rank: index + 1,
          totalDistance: Math.round(user.totalDistance * 100) / 100,
        }));

      setLeaderboardData(sortedData);
      
      // Find current user's rank
      const currentUserRank = sortedData.find(user => user.isCurrentUser);
      setUserRank(currentUserRank);

    } catch (err) {
      console.error('Error loading leaderboard:', err);
      setError('Failed to load leaderboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTopRow}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Rankings</Text>
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerUnderline}
          />
        </View>
      </View>
      <Text style={styles.headerSubtitle}>Compete with other runners in UPSI!</Text>
      
      {userRank && (
        <View style={styles.userRankCard}>
          <Text style={styles.userRankTitle}>Your Current Position</Text>
          <View style={styles.userRankInfo}>
            <Text style={styles.userRankNumber}>#{userRank.rank}</Text>
            <View style={styles.userRankStats}>
              <Text style={styles.userRankDistance}>{userRank.totalDistance} km</Text>
              <Text style={styles.userRankSubtext}>
                {userRank.rank === 1 
                  ? "You're leading the pack! 🏆" 
                  : `${userRank.rank === 2 ? 'Just ' : ''}${(leaderboardData[0].totalDistance - userRank.totalDistance).toFixed(1)} km to reach the top!`}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  const renderLeaderboardItem = ({ item, index }) => {
    const itemOpacity = fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <Animated.View
        style={[
          styles.leaderboardItem,
          {
            opacity: itemOpacity,
            transform: [{ scale: scaleAnim }],
          },
          item.isCurrentUser && styles.currentUserItem,
        ]}
      >
        <View style={[styles.rankContainer, item.rank <= 3 && styles[`rank${item.rank}Container`]]}>
          {item.rank <= 3 ? (
            <Icon
              name="crown"
              size={20}
              color={item.rank === 1 ? '#FFD700' : item.rank === 2 ? '#C0C0C0' : '#CD7F32'}
            />
          ) : (
            <Text style={styles.rankText}>#{item.rank}</Text>
          )}
        </View>

        <View style={styles.userInfoContainer}>
          <Text style={[
            styles.username,
            item.isCurrentUser && styles.currentUsername,
            item.rank <= 3 && styles.topThreeUsername
          ]}>
            {item.username}
            {item.isCurrentUser && ' (You)'}
          </Text>
          
          <View style={styles.statsContainer}>
            <Icon name="run-fast" size={16} color="#666" />
            <Text style={styles.statsText}>{item.runCount} runs</Text>
            <Icon name="map-marker-distance" size={16} color="#666" style={styles.distanceIcon} />
            <Text style={styles.statsText}>{item.totalDistance} km</Text>
          </View>
        </View>

        {item.rank <= 3 && (
          <View style={styles.medalContainer}>
            <Icon 
              name="medal"
              size={24}
              color={
                item.rank === 1 ? '#FFD700' :
                item.rank === 2 ? '#C0C0C0' :
                '#CD7F32'
              }
            />
          </View>
        )}
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#0066b2', '#ADD8E6', '#FFFFFF']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading rankings...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={['#0066b2', '#ADD8E6', '#F0FFFF']} style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={60} color="#fff" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadLeaderboardData}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0066b2', '#ADD8E6', '#FFFFFF']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          ListHeaderComponent={renderHeader}
          data={leaderboardData}
          renderItem={renderLeaderboardItem}
          keyExtractor={(item) => item.userid}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshing={isLoading}
          onRefresh={loadLeaderboardData}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="run" size={60} color="#fff" />
              <Text style={styles.emptyText}>Be the first to start the race!</Text>
              <Text style={styles.emptySubtext}>Record your first run to appear here</Text>
            </View>
          }
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'black',
    marginBottom: 20,
  },
  userRankCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  userRankTitle: {
    fontSize: 16,
    color: 'black',
    opacity: 0.9,
    marginBottom: 10,
  },
  userRankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userRankNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 15,
  },
  userRankStats: {
    flex: 1,
  },
  userRankDistance: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 4,
  },
  userRankSubtext: {
    fontSize: 14,
    color: 'black',
    opacity: 0.9,
  },
  listContent: {
    paddingBottom: 20,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentUserItem: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rank1Container: {
    backgroundColor: '#FFF7E6',
  },
  rank2Container: {
    backgroundColor: '#F5F5F5',
  },
  rank3Container: {
    backgroundColor: '#FFF1E6',
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  userInfoContainer: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  currentUsername: {
    color: '#000',
    fontWeight: 'bold',
  },
  topThreeUsername: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    marginRight: 12,
  },
  distanceIcon: {
    marginLeft: 8,
  },
  medalContainer: {
    marginLeft: 8,
    width: 32,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  headerUnderline: {
    height: 3,
    width: 100,
    borderRadius: 1.5,
    marginTop: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'black',
    marginBottom: 20,
    opacity: 0.8,
  },
});