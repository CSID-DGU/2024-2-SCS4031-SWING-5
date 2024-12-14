// components/Memo.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

export default function Schedule({ selectedDate, userId }) {
  const [schedules, setSchedules] = useState([]); // 스케줄 데이터 상태
  const [loading, setLoading] = useState(false); // 로딩 상태

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!selectedDate || !userId) {
        setSchedules([]); // 날짜나 유저 ID가 없을 경우 초기화
        return;
      }

      setLoading(true); // 로딩 시작
      setSchedules([]); // 기존 데이터 초기화

      try {
        const response = await axios.get(`http://localhost:8080/api/calendar/day/${userId}`, {
          params: { date: selectedDate },
          withCredentials: true,
        });

        const scheduleData = response.data.find((item) => item.type === 'schedule');
        setSchedules(scheduleData?.measurements || []); // 데이터가 없으면 빈 배열 설정
      } catch (error) {
        console.error('스케줄 데이터 가져오기 실패:', error.message);
        setSchedules([]); // 에러 발생 시 상태 초기화
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchSchedules();
  }, [selectedDate, userId]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>스케줄</Text>
      </View>
      {loading ? (
        <View style={styles.contentContainer}>
          <ActivityIndicator size="large" color="#7686DB" />
          <Text style={styles.loadingText}>데이터를 불러오는 중입니다...</Text>
        </View>
      ) : schedules.length > 0 ? (
        <View style={styles.contentContainer}>
          {schedules.map((schedule, index) => (
            <View key={index} style={styles.scheduleContainer}>
              <Text style={styles.scheduleTitle}>{schedule.measureTitle}</Text>
              <Text style={styles.scheduleValue}>{schedule.body}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <Text style={styles.noData}>해당 날짜의 스케줄이 없습니다.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  titleContainer: {
    backgroundColor: '#7686DB',
    paddingVertical: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contentContainer: {
    padding: 10,
  },
  scheduleContainer: {
    marginBottom: 10,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scheduleValue: {
    fontSize: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  noData: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});
