import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserData } from '../context/UserDataContext';

export default function LoadingPage() {
  const router = useRouter();
  const { updateUser } = useUserData();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 사용자 정보를 서버에서 가져오는 API 호출
        // const response = await fetch('http://172.30.1.3:8080/api/userdata', {
        const response = await fetch('http://localhost:8080/api/userdata', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();

        // 사용자 정보 업데이트
        if (data.name) {
          await updateUser({ name: data.name, userId: data.userId, familyRole: data.familyRole });
        }

        // family_role에 따라 페이지 라우팅
        if (data.familyRole === null) {
          router.replace('/userextra');
        } else {
          router.replace('/(main)');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        router.replace('/login');
      }
    };

    fetchUserData();
  }, [router, updateUser]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Loading...</Text>
    </View>
  );
}
