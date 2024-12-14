// (profile)/_layout.tsx
import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="profileMain" options={{ title: '프로필 메인' }} />
      <Stack.Screen name="userinfo" options={{ title: '내 정보' }} />
      <Stack.Screen name="setNotification" options={{ title: '알림 설정' }} />
      <Stack.Screen name="familyLink" options={{ title: '가족 연동' }} />
    </Stack>
  );
}
