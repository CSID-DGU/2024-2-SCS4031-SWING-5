import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useUserData } from '@/context/UserDataContext';

const NotificationPage = () => {
  const { user, isLoading: isUserLoading } = useUserData();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.userId) return;

    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/notification?userId=${user.userId}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (!response.ok) {
          throw new Error('알림이 존재하지 않습니다.');
        }

        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user?.userId]);

  const handleResponse = async (requestId, acceptOrReject) => {
    try {
      const body = {
        requestUserId: user.userId, // 현재 로그인한 유저의 ID
        responseUserId: requestId, // 알림에서 받은 requestId를 responseUserId로 사용
        acceptOrReject, // true(승인) 또는 false(거부)
      };

      const response = await fetch('http://localhost:8080/api/code/request/result', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('요청 처리에 실패했습니다.');
      }

      Alert.alert('성공', acceptOrReject ? '가족 요청을 승인했습니다.' : '가족 요청을 거부했습니다.');
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.requestId !== requestId)
      );
    } catch (err) {
      Alert.alert('오류', err.message);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const body = { notificationId };

      const response = await fetch('http://localhost:8080/api/notification', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('알림 삭제에 실패했습니다.');
      }

      Alert.alert('성공', '알림이 삭제되었습니다.');
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.notificationId !== notificationId)
      );
    } catch (err) {
      Alert.alert('오류', err.message);
    }
  };

  if (isUserLoading || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading notifications...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>알림이 존재하지 않습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>알림</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.notificationId.toString()}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <View style={styles.notificationTypeContainer}>
            <Text style={styles.notificationMessage}>{item.message}</Text>
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => handleDeleteNotification(item.notificationId)}
            >
              <Text style={styles.closeButtonText}>지우기</Text>
            </TouchableOpacity>
            </View>
            <Text style={styles.notificationType}>{item.type}</Text>
            {item.type === '가족 요청 알림' && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.approveButton}
                  onPress={() => handleResponse(item.requestId, true)} // 승인 버튼
                >
                  <Text style={styles.buttonText}>승인</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => handleResponse(item.requestId, false)} // 거부 버튼
                >
                  <Text style={styles.buttonText}>거부</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>알림이 존재하지 않습니다.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  notificationTypeContainer: {
    flexDirection: 'row', // 가로 정렬
    justifyContent: 'space-between', // 좌우로 공간 배분
    alignItems: 'center', // 세로 중앙 정렬
  },
  notificationMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    flex:1,
  },
  notificationType: {
    fontSize: 16,
    color: '#555',
    flex: 1
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  approveButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 20,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#FF4D4D',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#FF4D4D',
    borderRadius: 10,
    width: 50,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  closeButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default NotificationPage;
