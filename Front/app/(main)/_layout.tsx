import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserData } from '@/context/UserDataContext';
import { Link, useRouter } from 'expo-router';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useUserData();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#595958',
          tabBarLabelStyle : {
            marginTop : -5,
            fontSize : 12,
          },

          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 0,
            height: 90, // 탭 바 높이 조정
            paddingBottom: 10, // 여백 조정
          },
          headerShown: true,
          headerStyle: { backgroundColor: '#AFB8DA' },
          headerTitleAlign: 'left',
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Text style={styles.familyRoleText}>{user?.familyRole || '사용자'}</Text>
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerRight}>
              <Link href="/notification">
                <Image
                  source={require('../../assets/images/notification.png')}
                  style={styles.headerIcon}
                />
              </Link>
              <Link href="/chat">
                <Image
                  source={require('../../assets/images/chat.png')}
                  style={styles.headerIcon}
                />
              </Link>
            </View>
          ),
        }}
      >
        {/* 하단바에 표시될 탭들 */}
        <Tabs.Screen
          name="index"
          options={{
            title: '홈',
            tabBarIcon: ({ focused }) => (
              <Image
                source={require('../../assets/images/home.png')}
                style={{
                  ...styles.tabIcon,
                  tintColor: focused ? '#595958' : '#aaa', // 활성 상태 색상
                  opacity: focused ? 1 : 0.5, // 활성 상태 투명도
                }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="medication"
          options={{
            title: '복약 관리',
            tabBarIcon: ({ focused }) => (
              <Image
                source={require('../../assets/images/medical-record.png')}
                style={{
                  ...styles.tabIcon,
                  tintColor: focused ? '#595958' : '#aaa',
                  opacity: focused ? 1 : 0.5,
                }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="registerOptions"
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  top: -10, // 중앙 버튼 위치 조정
                }}
                onPress={() => router.push('/(main)/registerOptions')}
              >
                <Image
                  source={require('../../assets/images/plus_button.png')}
                  style={{ width: 50, height: 50 }} // 중앙 버튼 크기 조정
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="health"
          options={{
            title: '건강 캘린더',
            tabBarIcon: ({ focused }) => (
              <Image
                source={require('../../assets/images/schedule.png')}
                style={{
                  ...styles.tabIcon,
                  tintColor: focused ? '#595958' : '#aaa',
                  opacity: focused ? 1 : 0.5,
                }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="(profile)"
          options={{
            title: '내 정보',
            tabBarIcon: ({ focused }) => (
              <Image
                source={require('../../assets/images/user.png')}
                style={{
                  ...styles.tabIcon,
                  tintColor: focused ? '#595958' : '#aaa',
                  opacity: focused ? 1 : 0.8,
                }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="notification"
          options={{
            href: null, 
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            href: null, 
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: 5,
  },
  familyRoleText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  headerIcon: {
    width: 24,
    height: 24,
    marginHorizontal: 10,
  },
  tabIcon: {
    width: 28, // 탭 아이콘 크기 조정
    height: 28,
    marginBottom: 5, // 여백 추가
  },
});
