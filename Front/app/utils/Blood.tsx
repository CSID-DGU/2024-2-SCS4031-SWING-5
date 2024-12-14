import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import OCRLayout from './OCRLayout';
import { useUserData } from '@/context/UserDataContext';

export default function Blood() {
  const router = useRouter();
  const { user } = useUserData();
  const [selectedType, setSelectedType] = useState('혈압');
  const [timeOption, setTimeOption] = useState('');
  const [inputData, setInputData] = useState({
    highpressure: '',
    lowpressure: '',
    bloodSugar: '',
    date: '', // 초기 날짜를 빈 문자열로 설정
  });

  useEffect(() => {
    // 현재 날짜를 기본값으로 설정
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
    setInputData((prevData) => ({ ...prevData, date: today }));
  }, []);

  const formatDateWithTime = (date) => {
    const currentTime = new Date().toISOString().split('T')[1];
    return `${date}T${currentTime}`;
  };

  const handleSave = async () => {
    if (!timeOption) {
      alert('시간 옵션을 선택해주세요.');
      return;
    }

    if (!inputData.date) {
      alert('날짜를 입력해주세요.');
      return;
    }

    if (
      (selectedType === '혈압' && (!inputData.highpressure || !inputData.lowpressure)) ||
      (selectedType === '혈당' && !inputData.bloodSugar)
    ) {
      alert(`${selectedType} 정보를 모두 입력해주세요.`);
      return;
    }

    const postData = selectedType === '혈압'
      ? [
          {
            userId: user.userId,
            type: 'bloodpresure',
            registrationDate: formatDateWithTime(inputData.date),
            measureTitle: timeOption,
            keyName: 'highpressure',
            keyValue: inputData.highpressure,
          },
          {
            userId: user.userId,
            type: 'bloodpresure',
            registrationDate: formatDateWithTime(inputData.date),
            measureTitle: timeOption,
            keyName: 'lowpressure',
            keyValue: inputData.lowpressure,
          },
        ]
      : [
          {
            userId: user.userId,
            type: 'bloodsugar',
            registrationDate: formatDateWithTime(inputData.date),
            measureTitle: timeOption,
            keyName: 'bloodsugar',
            keyValue: inputData.bloodSugar,
          },
        ];

    try {
      await axios.post('http://localhost:8080/api/healthcare', postData, {
        withCredentials: true,
      });
      alert('데이터가 성공적으로 저장되었습니다.');
      router.push('../(main)/registerOptions');
    } catch (error) {
      console.error('데이터 전송 실패:', error);
      alert('데이터 저장 중 문제가 발생했습니다.');
    }
  };

  const renderDateInput = () => {
    if (Platform.OS === 'web') {
      return (
        <input
          type="date"
          value={inputData.date}
          onChange={(e) => setInputData({ ...inputData, date: e.target.value })}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            padding: 10,
            marginBottom: 20,
            width: '100%',
            fontSize: 16,
          }}
        />
      );
    }
    return (
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={inputData.date}
        onChangeText={(value) => setInputData({ ...inputData, date: value })}
      />
    );
  };

  return (
    <OCRLayout>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('../(main)/registerOptions')}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.header}>혈압 및 혈당 등록</Text>

        {/* 혈압/혈당 선택 */}
        <View style={styles.radioGroup}>
          <TouchableOpacity onPress={() => setSelectedType('혈압')} style={styles.radioButton}>
            <Ionicons
              name={selectedType === '혈압' ? 'radio-button-on' : 'radio-button-off'}
              size={24}
              color="black"
            />
            <Text style={styles.radioLabel}>혈압</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedType('혈당')} style={styles.radioButton}>
            <Ionicons
              name={selectedType === '혈당' ? 'radio-button-on' : 'radio-button-off'}
              size={24}
              color="black"
            />
            <Text style={styles.radioLabel}>혈당</Text>
          </TouchableOpacity>
        </View>

        {/* 시간 선택 */}
        <Text style={styles.subHeader}>시간 선택</Text>
        <View style={styles.timeOptions}>
          {(selectedType === '혈압'
            ? ['아침', '점심', '저녁']
            : [
                '공복',
                '아침 식전',
                '아침 식후',
                '점심 식전',
                '점심 식후',
                '저녁 식전',
                '저녁 식후',
                '자기전',
              ]
          ).map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => setTimeOption(option)}
              style={[
                styles.timeButton,
                timeOption === option && styles.timeButtonSelected,
              ]}
            >
              <Text
                style={timeOption === option ? styles.timeButtonTextSelected : styles.timeButtonText}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 입력 필드 */}
        {selectedType === '혈압' ? (
          <>
            <Text style={styles.label}>혈압 (mmHg)</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.input}
                placeholder="수축기 혈압"
                keyboardType="numeric"
                value={inputData.highpressure}
                onChangeText={(value) => setInputData({ ...inputData, highpressure: value })}
              />
              <TextInput
                style={styles.input}
                placeholder="이완기 혈압"
                keyboardType="numeric"
                value={inputData.lowpressure}
                onChangeText={(value) => setInputData({ ...inputData, lowpressure: value })}
              />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.label}>혈당 (mg/dL)</Text>
            <TextInput
              style={styles.input}
              placeholder="혈당 수치"
              keyboardType="numeric"
              value={inputData.bloodSugar}
              onChangeText={(value) => setInputData({ ...inputData, bloodSugar: value })}
            />
          </>
        )}

        <Text style={styles.label}>날짜</Text>
        {renderDateInput()}

        <Button title="저장" onPress={handleSave} color="#7686DB" />
      </View>
    </OCRLayout>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    justifyContent: 'space-between', // 추가 상하 정렬 조정
    backgroundColor: 'white',  // 추가 
  },
  backButton: {
    position: 'absolute',
    top: 2,
    left: 2,
    padding: 2,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
    //textAlign: 'center', // 제목을 화면 중앙에 정렬
  },
  content: {
    flex: 1, // 콘텐츠 영역이 화면 남은 공간을 채우도록 설정
    justifyContent: 'center', // 상하 중앙 정렬
    alignItems: 'center', // 좌우 중앙 정렬
    width: '100%', // 콘텐츠가 화면 너비에 맞춰 확장
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 20,
    //justifyContent: 'center', // 라디오 버튼 중앙 정렬
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioLabel: {
    fontSize: 16,
    marginLeft: 5,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    //justifyContent: 'center', // 시간 선택 버튼 중앙 정렬

  },
  timeButton: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    //alignSelf: 'center', // 버튼을 개별적으로 중앙에 배치

  },
  timeButtonSelected: {
    backgroundColor: '#7686DB',
    borderColor: '#7686DB',
  },
  timeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  timeButtonTextSelected: {
    color: 'white',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    flex: 1,
    marginHorizontal: 5,
    width: '90%', // 입력 필드의 너비를 화면 비율에 맞춤
    alignSelf: 'center', // 입력 필드 중앙 정렬
  },
});
