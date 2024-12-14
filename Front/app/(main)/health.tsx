import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useUserData } from '@/context/UserDataContext';
import MedicationList from '@/components/MedicationList';
import BloodPressure from '@/components/BloodPressure';
import BloodSugar from '@/components/BloodSugar';
import { LineChart } from 'react-native-chart-kit';
import Schedule from'@/components/Schedule';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';

const HealthCalendar = () => {
  const { user } = useUserData();
  const [selectedDate, setSelectedDate] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});

  // 현재 날짜 초기화
  useEffect(() => {
    const today = new Date();
    const formattedToday = formatDate(today);
    setSelectedDate(formattedToday); // 선택된 날짜를 오늘 날짜로 초기화
    setCurrentDate(formatMonth(today)); // 현재 연월을 초기화
  }, []);

  // 한 달 데이터를 가져오기 위한 API 요청
  useEffect(() => {
    if (!currentDate || !user?.userId) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/calendar/${user.userId}`,
          {
            params: { date: currentDate },
            withCredentials: true,
          }
        );

        const fetchedData = response.data || [];
        const marks = {};

        // 데이터를 기반으로 날짜 마킹
        fetchedData.forEach((item) => {
          item.target.forEach((target) => {
            const targetDate = target.targetMonth;
            if (!marks[targetDate]) {
              marks[targetDate] = { dots: [] };
            }
            // 점 색상 추가
            const color =
              item.calendarTargetCode === 'medicine'
                ? '#FF0000' // 빨간색
                : '#0000FF'; // 파란색

            // 중복 점 방지
            if (!marks[targetDate].dots.some((dot) => dot.color === color)) {
              marks[targetDate].dots.push({ color });
            }
          });
        });

        setMarkedDates(marks);
      } catch (error) {
        console.error('데이터 가져오기 실패: ', error);
        Alert.alert('데이터 오류', '캘린더 데이터를 가져오는 중 문제가 발생했습니다.');
      }
    };

    fetchData();
  }, [currentDate, user?.userId]);

  // 날짜 형식: YYYY-MM-DD
  const formatDate = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  // 월 형식: YYYY-MM
  const formatMonth = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

  // 사용자가 날짜를 선택했을 때 처리
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  // 월이 변경될 때 처리
  const handleMonthChange = (month) => {
    setCurrentDate(formatMonth(new Date(month.year, month.month - 1)));
  };

  return (
    <View style={styles.container}>
      {/* 캘린더 컴포넌트 */}
      <Calendar
        style={styles.calendar}
        current={selectedDate}
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
        markedDates={{
          ...markedDates,
          [selectedDate]: { selected: true, selectedColor: '#735BF2', ...(markedDates[selectedDate] || {}) },
        }}
        markingType={'multi-dot'} // 여러 점 표시를 위한 설정
        theme={{
          textMonthFontSize: 20,
          textMonthFontWeight: 'bold',
          calendarBackground: '#FFFFFF',
          textSectionTitleColor: '#000000',
          dayTextColor: '#000000',
          todayTextColor: '#735BF2',
        }}
        monthFormat={'yyyy년 MM월'}
        renderArrow={(direction) => (
          <Text
            style={{
              fontSize: 20,
              color: '#735BF2',
              fontWeight: 'bold',
            }}
          >
            {direction === 'left' ? '<' : '>'}
          </Text>
        )}
      />

      {/* 스크롤 가능한 하위 데이터 */}
      <View style={styles.scrollContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {user?.userId ? (
            <>
              <MedicationList userId={user.userId} selectedDate={selectedDate} />
              <BloodPressure selectedDate={selectedDate} userId={user.userId} />
              <BloodSugar selectedDate={selectedDate} userId={user.userId} />
              <Schedule selectedDate={selectedDate} userId={user.userId} />
            </>
          ) : (
            <Text>유저 정보를 불러오는 중입니다.</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#AFB8DA',
    padding: 10,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#AFB8DA',
    borderRadius: 10,
    marginTop: 0,
    padding: 0,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  calendar: {
    borderRadius: 10,
    margin: 10,
  },
});

export default HealthCalendar;

