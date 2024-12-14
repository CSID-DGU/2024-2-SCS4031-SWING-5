import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Medicine } from '../../types/types';
import OCRLayout from './OCRLayout';

const OCRResult: React.FC = () => {
  const router = useRouter();
  const { photoUri, registrationDate, medicineList } = useLocalSearchParams<{
    photoUri: string;
    registrationDate: string;
    medicineList: string; // JSON string
  }>();

  const [editableMedicineList, setEditableMedicineList] = useState<Medicine[]>(
    medicineList
      ? JSON.parse(medicineList).map((medicine: any) => ({
          ...medicine,
          dosagePerIntake: parseInt(medicine.dosagePerIntake.match(/\d+/)?.[0] || '0', 10),
          frequencyIntake: parseInt(medicine.frequencyIntake.match(/\d+/)?.[0] || '0', 10),
          durationIntake: parseInt(medicine.durationIntake.match(/\d+/)?.[0] || '0', 10),
        }))
      : []
  );
  const [editableDate, setEditableDate] = useState<string>(registrationDate || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (index: number, field: keyof Medicine, value: string) => {
    setEditableMedicineList((prevList) => {
      const updatedList = [...prevList];
      if (field === 'medicineName') {
        updatedList[index].medicineName = value;
      } else if (field === 'dosagePerIntake' || field === 'frequencyIntake' || field === 'durationIntake') {
        const numericValue = parseInt(value, 10);
        updatedList[index][field] = isNaN(numericValue) ? 0 : numericValue;
      }
      return updatedList;
    });
  };

  const toggleEditing = () => setIsEditing(!isEditing);

  const handleAddMedicine = () => {
    const newMedicine: Medicine = {
      medicineName: '',
      dosagePerIntake: 0,
      frequencyIntake: 0,
      durationIntake: 0,
      morningTimebox: false,
      lunchTimebox: false,
      dinnerTimebox: false,
      beforeSleepTimebox: false,
    };
    setEditableMedicineList((prevList) => [...prevList, newMedicine]);
  };

  const handleDeleteMedicine = (index: number) => {
    const updatedList = [...editableMedicineList];
    updatedList.splice(index, 1);
    setEditableMedicineList(updatedList);
  };

  const handleRegister = () => {
    if (!editableDate.trim()) {
      Alert.alert('유효성 검사 실패', '조제일자를 입력해주세요.');
      return;
    }

    const validationErrors: string[] = [];

    editableMedicineList.forEach((medicine, index) => {
      if (!medicine.medicineName.trim()) {
        validationErrors.push(`약물 ${index + 1}의 이름을 입력해주세요.`);
      }
      if (!medicine.dosagePerIntake) {
        validationErrors.push(`약물 ${medicine.medicineName || index + 1}의 복용량을 입력해주세요.`);
      }
      if (!medicine.frequencyIntake) {
        validationErrors.push(`약물 ${medicine.medicineName || index + 1}의 복용 횟수를 입력해주세요.`);
      }
      if (!medicine.durationIntake) {
        validationErrors.push(`약물 ${medicine.medicineName || index + 1}의 복용 기간을 입력해주세요.`);
      }
    });

    if (validationErrors.length > 0) {
      Alert.alert('유효성 검사 실패', validationErrors.join('\n'));
      return;
    }

    // 등록 시 로그 출력
    console.log('조제일자:', editableDate);
    console.log('약물 리스트:', editableMedicineList);

    router.push({
      pathname: '../utils/setAlarm',
      params: {
        medicineList: JSON.stringify(editableMedicineList),
        registrationDate: editableDate,
      },
    });
  };

  return (
    <OCRLayout>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ScrollView>
            {photoUri ? (
              <Image source={{ uri: photoUri }} resizeMode="contain" style={styles.image} />
            ) : (
              <Text style={styles.errorText}>이미지가 없습니다.</Text>
            )}

            <View style={styles.dateContainer}>
              <Text style={styles.dateLabel}>조제일자:</Text>
              {Platform.OS === 'web' ? (
                <input
                  type="date"
                  value={editableDate}
                  onChange={(e) => setEditableDate(e.target.value)}
                  style={{
                    fontSize: 16,
                    border: '1px solid #6c75bd',
                    borderRadius: 5,
                    padding: 5,
                    backgroundColor: isEditing ? '#f4f4f4' : '#F1F1FA',
                    textAlign: 'center',
                    marginLeft: 10,
                  }}
                  disabled={!isEditing}
                />
              ) : (
                <TextInput
                  style={[styles.dateInput, isEditing && styles.editModeInput]}
                  value={editableDate}
                  editable={isEditing}
                  onChangeText={setEditableDate}
                />
              )}
            </View>

            {editableMedicineList.map((medicine, index) => (
              <View key={index} style={styles.medicineContainer}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteMedicine(index)}
                >
                  <Image
                    source={require('../../assets/images/delete.png')}
                    style={styles.deleteIcon}
                  />
                </TouchableOpacity>

                <TextInput
                  style={[styles.medicineNameInput, isEditing && styles.editModeInput]}
                  value={medicine.medicineName}
                  editable={isEditing}
                  onChangeText={(value) => handleInputChange(index, 'medicineName', value)}
                />

                <View style={styles.row}>
                  <TextInput
                    style={[styles.input, isEditing && styles.editModeInput]}
                    value={medicine.dosagePerIntake.toString()}
                    editable={isEditing}
                    onChangeText={(value) =>
                      handleInputChange(index, 'dosagePerIntake', value)
                    }
                    keyboardType="numeric"
                  />
                  <Text style={styles.unitText}>정</Text>
                  <TextInput
                    style={[styles.input, isEditing && styles.editModeInput]}
                    value={medicine.frequencyIntake.toString()}
                    editable={isEditing}
                    onChangeText={(value) =>
                      handleInputChange(index, 'frequencyIntake', value)
                    }
                    keyboardType="numeric"
                  />
                  <Text style={styles.unitText}>회</Text>
                  <TextInput
                    style={[styles.input, isEditing && styles.editModeInput]}
                    value={medicine.durationIntake.toString()}
                    editable={isEditing}
                    onChangeText={(value) =>
                      handleInputChange(index, 'durationIntake', value)
                    }
                    keyboardType="numeric"
                  />
                  <Text style={styles.unitText}>일</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.addButton} onPress={handleAddMedicine}>
              <Text style={styles.addButtonText}>추가 등록</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.editButton} onPress={toggleEditing}>
              <Text style={styles.editButtonText}>{isEditing ? '수정 완료' : '수정하기'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>등록하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </OCRLayout>
  );
};



const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 17,
    right: 10,
  },
  deleteIcon: {
    width: 20,
    height: 20,
    shadowColor: '#000', // 그림자 효과
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  container: {
    flex: 1,
    padding: 20, // 더 넓은 내부 여백
    backgroundColor: '#F7F9FC', // 전체 배경 색상 변경
  },
  image: {
    width: '100%',
    height: 180, // 이미지 높이를 살짝 줄임
    marginBottom: 20, // 이미지와 조제일자 간격 조정
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0', // 은은한 테두리 색상
  },
  dateContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10, // 텍스트와 입력 필드 간격 추가
  },
  dateInput: {
    fontSize: 16,
    fontWeight: 'bold',
    borderWidth: 2, // 테두리 두께 조정
    borderColor: '#AFB8DA',
    borderRadius: 5,
    padding: 5,
    backgroundColor: '#F1F1FA',
    textAlign: 'center',
    width: 120, // 날짜 입력 상자 크기 조정
  },
  registrationDate: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  medicineContainer: {
    marginVertical: 8, // 블록 간격 축소
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D9E6', // 더 밝은 테두리 색상
    borderRadius: 10,
    backgroundColor: '#F9FAFB', // #F9FAFB
    shadowColor: '#000', // 그림자 추가
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, // 안드로이드 그림자
  },
  medicineNameInput: {
    fontSize: 16,
    fontWeight: '600', // 기존 'bold' 대신 조금 더 얇은 스타일
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#D1D9E6',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    // width: '80%', // 가로폭을 줄이기
    // alignSelf: 'center', // 중앙 정렬
    // maxWidth: 250, // 최대 폭 제한
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8, // 블록 간격 추가
  },
  input: {
    fontSize: 16,
    padding: 5,
    borderWidth: 1,
    borderColor: '#6c75bd',
    borderRadius: 5,
    marginHorizontal: 5,
    textAlign: 'center',
    width: 40, // 가로 폭 조정 (2자리 숫자 크기)
  },
  editModeInput: {
    backgroundColor: '#f4f4f4',
  },
  unitText: {
    fontSize: 16,
    fontWeight: '400', // 기본 글꼴로 변경
    marginHorizontal: 5,
    color: '#424242', // 더 부드러운 텍스트 색상
  },
  noMedicineText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  scrollContent: {
    paddingBottom: 100, // 추가등록 버튼 아래 여백 추가
  },
  addButton: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#42A5F5',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#42A5F5',
    fontSize: 16,
    fontWeight: 'bold',
  },
  webInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#6c75bd',
    borderRadius: 5,
    padding: 5,
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: '#90CAF9', // 버튼 색상 변경
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25, // 둥근 모서리
    shadowColor: '#000', // 그림자 효과
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#42A5F5', // 버튼 색상 변경
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000', // 그림자 효과
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OCRResult;
