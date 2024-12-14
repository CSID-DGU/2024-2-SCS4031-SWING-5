import React, { useState } from 'react';
import {Alert,  View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useUserData } from '@/context/UserDataContext';
import { Ionicons } from '@expo/vector-icons'; // 아이콘 사용

export default function Schedule() {
  const router = useRouter();
  const { user } = useUserData(); // 로그인한 사용자 정보 가져오기
  const [scheduleData, setScheduleData] = useState({
    measureTitle: '', // 예약 제목 (예: "정형외과 예약")
    Detail: '', // 예약 세부 내용 (예: "정형외과 1시 예약")
    date: '', // 날짜
  });
 
  const formatDateWithTime = (date) => {
    const currentTime = new Date().toISOString().split('T')[1]; // 현재 시간 가져오기
    return `${date}T${currentTime}`;
  };

  const handleSave = async () => {
    if (!scheduleData.measureTitle || !scheduleData.Detail || !scheduleData.date) {
      alert('모든 정보를 입력해주세요.');
      return;
    }

    const postData = [
      {
      userId: user.userId,
      type: 'schedule',
      registrationDate: formatDateWithTime(scheduleData.date),
      measureTitle: scheduleData.measureTitle,
      keyName: 'body',
      keyValue: scheduleData.Detail,
    },
    // {
    //   userId: user.userId,
    //   type: 'schedule',
    //   registrationDate: formatDateWithTime(scheduleData.date),
    //   measureTitle: scheduleData.measureTitle,
    //   keyName: 'keyValue',
    //   keyValue: scheduleData.Detail,
    // },
  ];
  console.log('POST 데이터:', postData);

    try {
      await axios.post('http://localhost:8080/api/healthcare', postData, {
      withCredentials: true, // 쿠키 포함해서 전송 
      });
      Alert.alert('성공', '스케줄이 성공적으로 저장되었습니다.');
      router.push('../(main)/registerOptions');
    } catch (error) {
      console.error('데이터 전송 실패:', error);
      Alert.alert('오류', '스케줄 저장 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('../(main)/registerOptions')} // 특정 페이지로 이동
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.header}>스케줄 등록</Text>

      <Text style={styles.label}>제목</Text>
      <TextInput
        style={styles.input}
        placeholder="제목 입력"
        value={scheduleData.measureTitle}
        onChangeText={(value) => setScheduleData({ ...scheduleData, measureTitle: value })}
      />

      <Text style={styles.label}>내용</Text>
      <TextInput
        style={styles.input}
        placeholder="내용 입력"
        value={scheduleData.Detail}
        onChangeText={(value) => setScheduleData({ ...scheduleData, Detail: value })}
      />

      <Text style={styles.label}>날짜</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={scheduleData.date}
        onChangeText={(value) => setScheduleData({ ...scheduleData, date: value })}
      />

      <Button title="저장" onPress={handleSave} color="#7686DB"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});
