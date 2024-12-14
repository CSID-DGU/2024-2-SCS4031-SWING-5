import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserData } from '@/context/UserDataContext';

export default function OCRLayout({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const { user } = useUserData();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 상단바 */}
      <View style={styles.header}>
        <Text style={styles.familyRoleText}>{user?.familyRole || '사용자'}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => router.push('/notification')}>
            <TabBarIcon name="notifications" color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/chat')}>
            <TabBarIcon name="chatbubbles" color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 페이지 내용 */}
      <View style={styles.content}>{children}</View>

      {/* 하단바 */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.tabButton}>
          <TabBarIcon name="home-outline" color="#595958" />
          <Text style={styles.tabLabel}>홈</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/medication')} style={styles.tabButton}>
          <TabBarIcon name="medkit-outline" color="#595958" />
          <Text style={styles.tabLabel}>복약 관리</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/(main)/registerOptions')}
          style={styles.plusButton}
        >
          <Image source={require('../../assets/images/plus_button.png')} style={styles.plusIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/health')} style={styles.tabButton}>
          <TabBarIcon name="heart-outline" color="#595958" />
          <Text style={styles.tabLabel}>건강 캘린더</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/profile')} style={styles.tabButton}>
          <TabBarIcon name="person-outline" color="#595958" />
          <Text style={styles.tabLabel}>내 정보</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 75,
    backgroundColor: '#AFB8DA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  familyRoleText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  footer: {
    height: 75,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  tabButton: {
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    color: '#595958',
  },
  plusButton: {
    top: -20,
    alignItems: 'center',
  },
  plusIcon: {
    width: 60,
    height: 60,
  },
});
