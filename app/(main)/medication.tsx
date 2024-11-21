import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Calendar from '@/components/Calendar';
import MedicationManagement from '@/components/MedicaitonManagement';
import dayjs from 'dayjs';
import { useUserData } from '@/context/UserDataContext'; // UserDataContext 사용

export default function MedicationManagementTab() {
  const { user } = useUserData(); // UserDataContext에서 user 정보 가져오기
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD')); // 초기값: 오늘 날짜

  return (
    <View style={styles.container}>
      {/* 캘린더 컴포넌트에 날짜 상태와 변경 함수 전달 */}
      <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />

      {/* MedicationManagement 컴포넌트에 선택된 날짜와 userId 전달 */}
      {user && user.userId ? (
        <MedicationManagement selectedDate={selectedDate} userId={user.userId} />
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>유저 정보를 불러오는 중입니다.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FF',
    padding: 0,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});
