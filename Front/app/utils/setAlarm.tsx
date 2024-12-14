import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import OCRLayout from './OCRLayout';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUserData } from '../../context/UserDataContext';

export default function SetAlarm() {
  const router = useRouter(); // router 초기화
  const { user } = useUserData(); // 컨텍스트에서 user 가져오기

  const params = useLocalSearchParams();
  const medicineList = Array.isArray(params.medicineList)
    ? params.medicineList[0]
    : params.medicineList || '[]';
  const registrationDate = Array.isArray(params.registrationDate)
    ? params.registrationDate[0]
    : params.registrationDate || '';

  const [editableMedicineList, setEditableMedicineList] = useState(
    JSON.parse(medicineList)
  );

  const [selectedTimes, setSelectedTimes] = useState<Set<string>>(new Set());
  const [alarmTimes, setAlarmTimes] = useState({
    morning: new Date(2024, 9, 4, 9, 0),
    lunch: new Date(2024, 9, 4, 13, 0),
    dinner: new Date(2024, 9, 4, 18, 0),
    beforeSleep: new Date(2024, 9, 4, 22, 0),
  });
  const [showTimePicker, setShowTimePicker] = useState<{
    field: string | null;
    visible: boolean;
  }>({ field: null, visible: false });
  const [hidden, setHidden] = useState<boolean | null>(null);
  const [medicineBagTitle, setMedicineBagTitle] = useState('');

  useEffect(() => {
    const initializeCheckboxes = () => {
      const updatedList = editableMedicineList.map((medicine) => {
        const { frequencyIntake } = medicine;
        const defaultTimeboxes = {
          morningTimebox: false,
          lunchTimebox: false,
          dinnerTimebox: false,
          beforeSleepTimebox: false,
        };

        if (frequencyIntake >= 1) defaultTimeboxes.morningTimebox = true;
        if (frequencyIntake >= 2) defaultTimeboxes.dinnerTimebox = true;
        if (frequencyIntake >= 3) defaultTimeboxes.lunchTimebox = true;
        if (frequencyIntake >= 4) defaultTimeboxes.beforeSleepTimebox = true;

        return {
          ...medicine,
          ...defaultTimeboxes,
        };
      });

      setEditableMedicineList(updatedList);
      updateSelectedTimes(updatedList);
    };

    initializeCheckboxes();
  }, []);

  const updateSelectedTimes = (medicineList: any[]) => {
    const times = new Set<string>();

    medicineList.forEach((medicine) => {
      ['morning', 'lunch', 'dinner', 'beforeSleep'].forEach((time) => {
        if (medicine[`${time}Timebox`]) {
          times.add(time);
        }
      });
    });

    setSelectedTimes(times);
  };

  const handleCheckboxPress = (index: number, time: string) => {
    const updatedList = [...editableMedicineList];
    updatedList[index][`${time}Timebox`] = !updatedList[index][`${time}Timebox`];
    setEditableMedicineList(updatedList);
    updateSelectedTimes(updatedList);
  };

  const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
    if (showTimePicker.field && selectedTime) {
      setAlarmTimes((prev) => ({
        ...prev,
        [showTimePicker.field as keyof typeof alarmTimes]: selectedTime,
      }));
    }
    setShowTimePicker({ field: null, visible: false });
  };

  const formatDateTime = (date: Date, registrationDate: string) => {
    const [year, month, day] = registrationDate.split('-');

    const localDate = new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      date.getHours(),
      date.getMinutes()
    );

    const formattedDate = `${localDate.getFullYear()}-${String(
      localDate.getMonth() + 1
    ).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}T${String(
      localDate.getHours()
    ).padStart(2, '0')}:${String(localDate.getMinutes()).padStart(2, '0')}:${String(
      localDate.getSeconds()
    ).padStart(2, '0')}`;

    return formattedDate;
  };

  const handleRegister = async () => {
    const validationErrors = [];

    editableMedicineList.forEach((medicine) => {
      const selectedCheckboxCount = ['morning', 'lunch', 'dinner', 'beforeSleep']
        .filter((time) => medicine[`${time}Timebox`])
        .length;
  
      if (!medicineBagTitle.trim()) {
        validationErrors.push('약봉투 이름을 입력해주세요.');
      }
  
      if (selectedCheckboxCount !== medicine.frequencyIntake) {
        validationErrors.push(
          `약물 "${medicine.medicineName}"의 체크박스 선택 개수가 잘못되었습니다. (${medicine.frequencyIntake}개를 선택해야 합니다)`
        );
      }
    });
  
    if (hidden === null) {
      validationErrors.push('연동 가족 공개 여부를 선택해주세요.');
    }
  
    if (validationErrors.length > 0) {
      const errorMessage = validationErrors.join('\n');
  
      // 환경에 따른 경고 메시지 처리
      if (Platform.OS === 'web' || Platform.OS === 'windows') {
        window.alert(errorMessage);
      } else {
        Alert.alert('유효성 검사 실패', errorMessage);
      }
      return;
    }
  
    const maxDurationIntake = Math.max(
      ...editableMedicineList.map((medicine) => medicine.durationIntake || 0)
    );

    const [year, month, day] = registrationDate.split('-').map(Number);
    const calculatedEndDate = new Date(year, month - 1, day);
    calculatedEndDate.setDate(calculatedEndDate.getDate() + maxDurationIntake - 1);

    const formattedEndDate = `${calculatedEndDate.getFullYear()}-${String(
      calculatedEndDate.getMonth() + 1
    ).padStart(2, '0')}-${String(calculatedEndDate.getDate()).padStart(2, '0')}`;

    const selectedAlarms = Array.from(selectedTimes).reduce((acc, timeKey) => {
      acc[`${timeKey}Time`] = formatDateTime(alarmTimes[timeKey], registrationDate);
      return acc;
    }, {});

    const payload = {
      userId: user?.userId,
      registrationDate,
      endDate: formattedEndDate,
      medicineBagTitle,
      hidden: !!hidden,
      type: 'M',
      medicineList: editableMedicineList,
      ...selectedAlarms,
    };

    console.log('등록된 데이터:', payload);

    try {
      const response = await fetch('http://localhost:8080/api/medicine', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      console.log('Response Text:', responseText);

      if (response.ok) {
        if (Platform.OS === 'web') {
          window.alert(responseText || '데이터 전송이 성공적으로 완료되었습니다.');
          router.push('/(main)/medication');
        } else {
          Alert.alert('알림', responseText || '데이터 전송이 성공적으로 완료되었습니다.', [
            {
              text: '확인',
              onPress: () => router.push('/(main)/medication'),
            },
          ]);
        }
      } else {
        throw new Error(`HTTP 오류: ${responseText}`);
      }
    } catch (error) {
      console.error('데이터 전송 실패:', error);

      if (Platform.OS === 'web') {
        window.alert(`데이터 전송 실패: ${error.message}`);
      } else {
        Alert.alert('오류', `데이터 전송 실패: ${error.message}`);
      }
    }
  };

  return (
    <OCRLayout>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>알림 세부 설정 하기</Text>
        <Text style={styles.subTitle}>
          복용 횟수 별 알림 시간 및 연동 가족 여부를 설정하세요!
        </Text>

        <View style={styles.medicineBagContainer}>
          <Text style={styles.label}>약봉투 이름</Text>
          <TextInput
            style={styles.inputBox}
            value={medicineBagTitle}
            onChangeText={setMedicineBagTitle}
            placeholder="복약 관리 화면 및 알림 시 전달받을 이름"
          />
        </View>

        {editableMedicineList.map((medicine, index) => (
          <View key={index} style={styles.medicineItem}>
            <Text style={styles.medicineTitle}>
              {medicine.medicineName} ({medicine.frequencyIntake}회)
            </Text>
            <View style={styles.checkboxRow}>
              {['morning', 'lunch', 'dinner', 'beforeSleep'].map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.checkbox,
                    medicine[`${time}Timebox`]
                      ? styles.checkboxSelected
                      : styles.checkboxUnselected,
                  ]}
                  onPress={() => handleCheckboxPress(index, time)}
                >
                  <Text
                    style={{
                      color: medicine[`${time}Timebox`]
                        ? '#fff'
                        : '#7c7c7c',
                    }}
                  >
                    {time === 'morning'
                      ? '아침'
                      : time === 'lunch'
                      ? '점심'
                      : time === 'dinner'
                      ? '저녁'
                      : '취침전'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>연동 가족 공개 여부</Text>
          <View style={styles.toggleButtons}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                hidden === false
                  ? styles.toggleSelected
                  : styles.checkboxUnselected,
              ]}
              onPress={() => setHidden(false)}
            >
              <Text style={{ color: hidden === false ? '#fff' : '#7c7c7c' }}>
                공개
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                hidden === true
                  ? styles.toggleSelected
                  : styles.checkboxUnselected,
              ]}
              onPress={() => setHidden(true)}
            >
              <Text style={{ color: hidden === true ? '#fff' : '#7c7c7c' }}>
                비공개
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.alarmTimeContainer}>
          <Text style={styles.label}>알림 시간</Text>
          {Array.from(selectedTimes)
            .sort((a, b) =>
              ['morning', 'lunch', 'dinner', 'beforeSleep'].indexOf(a) -
              ['morning', 'lunch', 'dinner', 'beforeSleep'].indexOf(b)
            )
            .map((timeKey) => (
              <View key={timeKey} style={styles.timePickerRow}>
                <Text style={styles.timePickerLabel}>
                  {timeKey === 'morning'
                    ? '아침'
                    : timeKey === 'lunch'
                    ? '점심'
                    : timeKey === 'dinner'
                    ? '저녁'
                    : '취침전'}
                </Text>
                {Platform.OS === 'web' ? (
                  <input
                    type="time"
                    value={
                      alarmTimes[timeKey]
                        ? `${String(alarmTimes[timeKey].getHours()).padStart(
                            2,
                            '0'
                          )}:${String(alarmTimes[timeKey].getMinutes()).padStart(
                            2,
                            '0'
                          )}`
                        : ''
                    }
                    onChange={(e) => {
                      const newTime = e.target.value.split(':');
                      setAlarmTimes((prev) => ({
                        ...prev,
                        [timeKey]: new Date(
                          prev[timeKey]?.getFullYear() || new Date().getFullYear(),
                          prev[timeKey]?.getMonth() || new Date().getMonth(),
                          prev[timeKey]?.getDate() || new Date().getDate(),
                          parseInt(newTime[0], 10),
                          parseInt(newTime[1], 10),
                          0
                        ),
                      }));
                    }}
                    style={styles.timeInput}
                  />
                ) : (
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() =>
                      setShowTimePicker({ field: timeKey, visible: true })
                    }
                  >
                    <Text style={styles.timeText}>
                      {alarmTimes[timeKey]?.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      }) || '시간 설정'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}

          {showTimePicker.visible && (
            <DateTimePicker
              value={
                alarmTimes[showTimePicker.field as keyof typeof alarmTimes] ||
                new Date()
              }
              mode="time"
              is24Hour
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerText}>등록 완료</Text>
        </TouchableOpacity>
      </ScrollView>
    </OCRLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  medicineBagContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputBox: {
    padding: 12,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
  },
  medicineItem: {
    marginBottom: 20,
  },
  medicineTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkbox: {
    padding: 10,
    borderRadius: 8,
  },
  checkboxSelected: {
    backgroundColor: '#a0a4f2',
  },
  checkboxUnselected: {
    backgroundColor: '#f4f4f4',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleButtons: {
    flexDirection: 'row',
  },
  toggleButton: {
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleSelected: {
    backgroundColor: '#f99',
  },
  checkboxText: {
    fontSize: 14,
  },
  alarmTimeContainer: {
    marginBottom: 20,
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timePickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  timeInput: {
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#7c7c7c',
    borderRadius: 5,
    padding: 5,
    textAlign: 'center',
    flex: 1,
    maxWidth: 120,
    color: '#7c7c7c',
  },
  timeButton: {
    flex: 1,
    maxWidth: 120,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#7c7c7c',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#7c7c7c',
  },
  registerButton: {
    padding: 15,
    backgroundColor: '#7686DB',
    borderRadius: 8,
    alignItems: 'center',
  },
  registerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
