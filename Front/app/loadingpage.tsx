import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserData } from '../context/UserDataContext';
import { useFamilyContext } from '../context/FamilyContext';
import { fetchFamilyMembers } from '../api/familyApi';

export default function LoadingPage() {
  const router = useRouter();
  const { updateUser } = useUserData();
  const { setFamilyMembers } = useFamilyContext();

  useEffect(() => {
    const fetchUserDataAndFamily = async () => {
      try {
        // 사용자 정보 요청
        const userResponse = await fetch('https://www.parking-predict.site/api/userdata', {
          method: 'GET',
          credentials: 'include',
        });
        const userData = await userResponse.json();

        // 사용자 정보 업데이트
        if (userData.name) {
          await updateUser({
            name: userData.name,
            userId: userData.userId,
            familyRole: userData.familyRole,
          });
        }

        // 가족 정보 요청
        const familyMembers = await fetchFamilyMembers(userData.userId);
        setFamilyMembers(familyMembers || []);

        // family_role에 따라 페이지 라우팅
        if (userData.familyRole === null) {
          router.replace('/userextra');
        } else {
          router.replace('/(main)');
        }
      } catch (error) {
        console.error('Error fetching user or family info:', error);
        router.replace('/login');
      }
    };

    fetchUserDataAndFamily();
  }, [router, updateUser, setFamilyMembers]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Loading...</Text>
    </View>
  );
}
