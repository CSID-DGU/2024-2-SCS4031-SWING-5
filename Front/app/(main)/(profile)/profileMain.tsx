// (profile)/profileMain.tsx
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserData } from '../../../context/UserDataContext';

export default function ProfileMain() {
  const router = useRouter();
  const { user, logout } = useUserData();

  useEffect(() => {
    if (!user) {
      router.replace('/login'); // user가 없으면 로그인 페이지로 이동
    }
  }, [user]);

  if (!user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Text style={styles.nameText}>
          {user.name} <Text style={styles.familyRoleText}>({user.familyRole})</Text>
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/userinfo')}
        >
          <View style={styles.buttonContent}>
            <Image
              source={require('../../../assets/images/userinfo.png')}
              style={styles.leftIcon}
            />
            <Text style={styles.buttonText}>내 정보</Text>
          </View>
          <Image
            source={require('../../../assets/images/next.png')}
            style={styles.rightIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/setNotification')}
        >
          <View style={styles.buttonContent}>
            <Image
              source={require('../../../assets/images/setnotify.png')}
              style={styles.leftIcon}
            />
            <Text style={styles.buttonText}>알림 설정</Text>
          </View>
          <Image
            source={require('../../../assets/images/next.png')}
            style={styles.rightIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/familyLink')}
        >
          <View style={styles.buttonContent}>
            <Image
              source={require('../../../assets/images/familylink.png')}
              style={styles.leftIcon}
            />
            <Text style={styles.buttonText}>가족 연동</Text>
          </View>
          <Image
            source={require('../../../assets/images/next.png')}
            style={styles.rightIcon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    padding: 10,
    marginTop: 15,
  },
  profileCard: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 5,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
    marginTop: 10,
  },
  familyRoleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  leftIcon: {
    width: 24,
    height: 24,
  },
  rightIcon: {
    width: 16,
    height: 16,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#ff8566',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  logoutButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
