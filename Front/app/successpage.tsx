// import React, { useEffect } from 'react';
// import { View, Text } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useUserData } from '../context/UserDataContext';

// export default function SuccessPage() {
//   const router = useRouter();
//   const { updateUser } = useUserData();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch('http://localhost:8080/api/userdata', {
//           method: 'GET',
//           credentials: 'include',
//         });
//         const data = await response.json();

//         // 사용자 정보 업데이트
//         if (data.name) {
//           await updateUser({ name: data.name, familyRole: data.familyRole });
//         }

//         // family_role에 따라 페이지 라우팅
//         if (data.familyRole === null) {
//           router.replace('/userextra');
//         } else {
//           router.replace('/(main)');
//         }
//       } catch (error) {
//         console.error('Error fetching user info:', error);
//         router.replace('/login');
//       }
//     };

//     fetchUserData();
//   }, [router, updateUser]);

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Loading...</Text>
//     </View>
//   );
// }

import React from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';

export default function SuccessPage() {
  const router = useRouter();

  const handleAppRedirect = () => {
    if (Platform.OS === 'web') {
      // 웹에서는 웹 경로로 리디렉션
      router.push('/loadingpage'); // 웹 환경에서는 /loadingpage로 리디렉션
    } else {
      // 모바일 앱에서는 딥링크로 리디렉션
      Linking.openURL('myapp://loadingpage'); // 모바일 앱에서는 딥링크 사용
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>로그인이 완료되었습니다!</Text>
      <Button title="앱으로 돌아가기" onPress={handleAppRedirect} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
