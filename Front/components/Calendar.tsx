import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import dayjs from 'dayjs';

const Calendar = ({ selectedDate, onDateChange, style }) => {
  const [weekDates, setWeekDates] = useState([]);

  // 선택된 날짜를 기준으로 일주일 날짜 목록을 계산하는 함수
  const generateWeekDates = (centerDate) => {
    const week = [];
    for (let i = -3; i <= 3; i++) {
      week.push(dayjs(centerDate).add(i, 'day').format('YYYY-MM-DD'));
    }
    return week;
  };

  // 초기 로드 및 날짜 변경 시 일주일 날짜 업데이트
  useEffect(() => {
    setWeekDates(generateWeekDates(selectedDate));
  }, [selectedDate]);

  // 날짜를 선택했을 때
  const handleDateSelect = (date) => {
    onDateChange(date); // 부모 컴포넌트에 날짜 전달
  };

  // 전주로 이동
  const handlePrevWeek = () => {
    const newCenterDate = dayjs(selectedDate).subtract(7, 'day').format('YYYY-MM-DD');
    onDateChange(newCenterDate); // 부모 컴포넌트에 전달
  };

  // 다음 주로 이동
  const handleNextWeek = () => {
    const newCenterDate = dayjs(selectedDate).add(7, 'day').format('YYYY-MM-DD');
    onDateChange(newCenterDate); // 부모 컴포넌트에 전달
  };

  return (
    <View style={[styles.container, style]}>
      {/* 상단에 현재 선택된 날짜 표시 */}
      <Text style={styles.selectedDateText}>
        {dayjs(selectedDate).format('MM월 DD일 (ddd)')}
      </Text>

      {/* 일주일 날짜 표시 */}
      <View style={styles.weekContainer}>
        <TouchableOpacity onPress={handlePrevWeek} style={styles.arrowButton}>
          <Text style={styles.arrowText}>〈</Text>
        </TouchableOpacity>

        {weekDates.map((date) => (
          <TouchableOpacity
            key={date}
            onPress={() => handleDateSelect(date)}
            style={[
              styles.dateButton,
              date === selectedDate && styles.selectedDateButton,
            ]}
          >
            <Text
              style={[
                styles.dateText,
                date === selectedDate && styles.selectedDateText,
              ]}
            >
              {dayjs(date).format('D')}
            </Text>
            <Text style={styles.dayText}>{dayjs(date).format('dd')}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={handleNextWeek} style={styles.arrowButton}>
          <Text style={styles.arrowText}>〉</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#AFB8DA',
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  weekContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowButton: {
    paddingHorizontal: 10,
  },
  arrowText: {
    fontSize: 20,
    color: '#333',
  },
  dateButton: {
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 15,
    marginHorizontal: 3,
  },
  selectedDateButton: {
    backgroundColor: '#6c5ce7',
  },
  dateText: {
    fontSize: 18,
    color: '#333',
  },
  selectedDateText: {
    color: '#fff',
  },
  dayText: {
    fontSize: 12,
    color: '#333',
  },
});

export default Calendar;
