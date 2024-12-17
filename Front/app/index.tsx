
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
            // 가족 정보 가져오기
            const familyMembers = await fetchFamilyMembers(user.userId);
            // 가족 정보가 없으면 빈 배열로 초기화
            setFamilyMembers(familyMembers || []);
  
            router.replace('/(main)'); 
          } catch (error) {
            console.error('Error initializing app:', error);
            router.replace('/(main)'); 
          }
        } else {
          router.replace('/login');
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
