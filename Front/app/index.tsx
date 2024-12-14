
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserData } from '../context/UserDataContext';
import { useFamilyContext } from '../context/FamilyContext';
import { fetchFamilyMembers } from '../api/familyApi';

export default function Index() {
  const router = useRouter();
  const { user, isLoading } = useUserData();
  const { setFamilyMembers } = useFamilyContext();


  useEffect(() => {
    const initializeApp = async () => {
      if (!isLoading) {
        if (user) {
          try {
            // fetchFamilyMembers를 호출하여 가족 데이터 가져오기
            const familyMembers = await fetchFamilyMembers(user.userId);
            setFamilyMembers(familyMembers);

            router.replace('/(main)'); // 메인 페이지로 이동
          } catch (error) {
            console.error('Error initializing app:', error);
            router.replace('/login'); // 에러 발생 시 로그인 페이지로 이동
          }
        } else {
          router.replace('/login'); // 로그인되지 않은 경우 로그인 페이지로 이동
        }
      }
    };

    initializeApp();
  }, [isLoading, user, router, setFamilyMembers]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Loading...</Text>
    </View>
  );
}
