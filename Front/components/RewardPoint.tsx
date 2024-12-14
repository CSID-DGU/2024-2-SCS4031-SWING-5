import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useUserData } from '@/context/UserDataContext';

const fetchRewardPoints = async (userId) => {
  try {
    const response = await fetch(`http://localhost:8080/api/reward/${userId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch reward points: ${response.status}`);
    }

    const points = await response.json();
    return points;
  } catch (error) {
    // console.error('Error fetching reward points:', error);
    return 0;
  }
};

export default function RewardPoints({ refreshKey }) {
  const [points, setPoints] = useState(0);
  const { user, isLoading } = useUserData();

  useEffect(() => {
    const getPoints = async () => {
      if (user && user.userId) {
        const points = await fetchRewardPoints(user.userId);
        setPoints(points);
      }
    };
    getPoints();
  }, [user, refreshKey]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>적립 포인트</Text>
      </View>
      <View style={styles.contentContainer}>
        <Image source={require('../assets/images/dollar.png')} style={styles.image} />
        <Text style={styles.points}>{points} 포인트</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF', // 전체 컨테이너 흰색 배경
    borderRadius: 10,
    padding: 0,
    marginVertical: 5,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  titleContainer: {
    backgroundColor: '#7686DB', // 보라색 배경
    width: '100%',
    paddingVertical: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // 흰색 폰트
  },
  contentContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  points: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

