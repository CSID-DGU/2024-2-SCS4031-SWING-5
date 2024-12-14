import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useUserData } from '@/context/UserDataContext'; // 전역 사용자 데이터

export default function Blood() {
  const router = useRouter();
  const { user } = useUserData(); // 로그인한 사용자의 정보를 가져옴
  const [selectedType, setSelectedType] = useState('혈압'); // 혈압 or 혈당
  const [timeOption, setTimeOption] = useState(''); 
  const [inputData, setInputData] = useState({
    highpressure: '', // 수축기 혈압(최고)
    lowpressure: '', // 이완기 혈압(최저)
    bloodSugar: '', // 혈당 수치
    date: '', // 날짜
  });

  // 날짜에 시간을 추가하는 함수
  const formatDateWithTime = (date) => {
    const currentTime = new Date().toISOString().split('T')[1]; // 현재 시간 가져오기
    return `${date}T${currentTime}`;
  };
  // 데이터 저장 처리
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
    // console.log('POST 데이터:', postData);

    try {
      await axios.post('http://localhost:8080/api/healthcare', postData, {
      withCredentials: true, // 쿠키 포함해서 전송 
    });
      alert('데이터가 성공적으로 저장되었습니다.');
      router.push('../(main)/registerOptions'); // 저장 후 이동
    } catch (error) {
      console.error('데이터 전송 실패:', error);
      alert('데이터 저장 중 문제가 발생했습니다.');
    }
  };

  return (
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
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={inputData.date}
        onChangeText={(value) => setInputData({ ...inputData, date: value })}
      />

      {/* 저장 버튼 */}
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
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 20,
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
    marginBottom: 20,
  },
  timeButton: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
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
  },
});

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   Platform,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { useUserData } from '@/context/UserDataContext';

// export default function Blood() {
//   const router = useRouter();
//   const { user } = useUserData(); // 사용자 데이터 가져오기

//   const [selectedType, setSelectedType] = useState('혈압');
//   const [timeOption, setTimeOption] = useState('');
//   const [inputData, setInputData] = useState({
//     highpressure: '',
//     lowpressure: '',
//     bloodSugar: '',
//     date: '',
//   });
//   const [showDatePicker, setShowDatePicker] = useState(false);

//   const formatDateWithTime = (date) => {
//     const currentTime = new Date().toISOString().split('T')[1];
//     return `${date}T${currentTime}`;
//   };

//   const handleSave = async () => {
//     if (!timeOption) {
//       Alert.alert('오류', '시간 옵션을 선택해주세요.');
//       return;
//     }
//     if (!inputData.date) {
//       Alert.alert('오류', '날짜를 입력해주세요.');
//       return;
//     }
//     if (
//       (selectedType === '혈압' && (!inputData.highpressure || !inputData.lowpressure)) ||
//       (selectedType === '혈당' && !inputData.bloodSugar)
//     ) {
//       Alert.alert('오류', `${selectedType} 정보를 모두 입력해주세요.`);
//       return;
//     }

//     const postData = selectedType === '혈압'
//       ? [
//           {
//             userId: user.userId,
//             type: 'bloodpresure',
//             registrationDate: formatDateWithTime(inputData.date),
//             measureTitle: timeOption,
//             keyName: 'highpressure',
//             keyValue: inputData.highpressure,
//           },
//           {
//             userId: user.userId,
//             type: 'bloodpresure',
//             registrationDate: formatDateWithTime(inputData.date),
//             measureTitle: timeOption,
//             keyName: 'lowpressure',
//             keyValue: inputData.lowpressure,
//           },
//         ]
//       : [
//           {
//             userId: user.userId,
//             type: 'bloodsugar',
//             registrationDate: formatDateWithTime(inputData.date),
//             measureTitle: timeOption,
//             keyName: 'bloodsugar',
//             keyValue: inputData.bloodSugar,
//           },
//         ];

//     try {
//       await fetch('http://localhost:8080/api/healthcare', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(postData),
//       });
//       Alert.alert('성공', '데이터가 성공적으로 저장되었습니다.');
//       router.push('../(main)/registerOptions');
//     } catch (error) {
//       console.error('데이터 전송 실패:', error);
//       Alert.alert('오류', '데이터 저장 중 문제가 발생했습니다.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={styles.backButton}
//         onPress={() => router.push('../(main)/registerOptions')}
//       >
//         <Ionicons name="arrow-back" size={24} color="black" />
//       </TouchableOpacity>

//       <Text style={styles.header}>혈압 및 혈당 등록</Text>

//       <View style={styles.radioGroup}>
//         <TouchableOpacity
//           onPress={() => setSelectedType('혈압')}
//           style={[
//             styles.radioButton,
//             selectedType === '혈압' && styles.radioButtonSelected,
//           ]}
//         >
//           <Text style={styles.radioLabel}>혈압</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => setSelectedType('혈당')}
//           style={[
//             styles.radioButton,
//             selectedType === '혈당' && styles.radioButtonSelected,
//           ]}
//         >
//           <Text style={styles.radioLabel}>혈당</Text>
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.subHeader}>시간 선택</Text>
//       <View style={styles.timeOptions}>
//         {(selectedType === '혈압'
//           ? ['아침', '점심', '저녁']
//           : ['공복', '식전', '식후']
//         ).map((option) => (
//           <TouchableOpacity
//             key={option}
//             onPress={() => setTimeOption(option)}
//             style={[
//               styles.timeButton,
//               timeOption === option && styles.timeButtonSelected,
//             ]}
//           >
//             <Text
//               style={timeOption === option ? styles.timeButtonTextSelected : styles.timeButtonText}
//             >
//               {option}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {selectedType === '혈압' ? (
//         <>
//           <Text style={styles.label}>혈압 (mmHg)</Text>
//           <View style={styles.row}>
//             <TextInput
//               style={styles.input}
//               placeholder="수축기 혈압"
//               keyboardType="numeric"
//               value={inputData.highpressure}
//               onChangeText={(value) =>
//                 setInputData({ ...inputData, highpressure: value })
//               }
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="이완기 혈압"
//               keyboardType="numeric"
//               value={inputData.lowpressure}
//               onChangeText={(value) =>
//                 setInputData({ ...inputData, lowpressure: value })
//               }
//             />
//           </View>
//         </>
//       ) : (
//         <>
//           <Text style={styles.label}>혈당 (mg/dL)</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="혈당 수치"
//             keyboardType="numeric"
//             value={inputData.bloodSugar}
//             onChangeText={(value) =>
//               setInputData({ ...inputData, bloodSugar: value })
//             }
//           />
//         </>
//       )}

//       <Text style={styles.label}>날짜</Text>
//       <TouchableOpacity
//         onPress={() => setShowDatePicker(true)}
//         style={styles.datePickerButton}
//       >
//         <Text style={styles.datePickerText}>
//           {inputData.date || '날짜 선택'}
//         </Text>
//       </TouchableOpacity>

//       {showDatePicker && (
//         <DateTimePicker
//           value={new Date()}
//           mode="date"
//           display="default"
//           onChange={(event, selectedDate) => {
//             setShowDatePicker(false);
//             if (selectedDate) {
//               const formattedDate = selectedDate.toISOString().split('T')[0];
//               setInputData({ ...inputData, date: formattedDate });
//             }
//           }}
//         />
//       )}

//       <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
//         <Text style={styles.saveButtonText}>저장</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: 'white',
//   },
//   backButton: {
//     position: 'absolute',
//     top: 10,
//     left: 10,
//     padding: 10,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     marginTop: 40,
//   },
//   radioGroup: {
//     flexDirection: 'row',
//     marginBottom: 20,
//   },
//   radioButton: {
//     flex: 1,
//     padding: 10,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     marginHorizontal: 5,
//   },
//   radioLabel: {
//         fontSize: 16,
//         marginLeft: 5,
//       },
//       subHeader: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 10,
//       },
//       timeOptions: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         marginBottom: 20,
//       },
//       timeButton: {
//         padding: 10,
//         margin: 5,
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 5,
//       },
//       timeButtonSelected: {
//         backgroundColor: '#7686DB',
//         borderColor: '#7686DB',
//       },
//       timeButtonText: {
//         fontSize: 14,
//         color: '#666',
//       },
//       timeButtonTextSelected: {
//         color: 'white',
//       },
//       label: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginVertical: 10,
//       },
//       row: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//       },
//       input: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 5,
//         padding: 10,
//         marginBottom: 20,
//         flex: 1,
//         marginHorizontal: 5,
//       },
//       radioButtonSelected: {
//         backgroundColor: '#7686DB',
//         borderColor: '#7686DB',
//       },
//       datePickerButton: {
//         padding: 12,
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 5,
//         alignItems: 'center',
//         marginVertical: 10,
//       },
//       datePickerText: {
//         fontSize: 16,
//         color: '#666',
//       },
//       saveButton: {
//         padding: 15,
//         backgroundColor: '#7686DB',
//         borderRadius: 8,
//         alignItems: 'center',
//         marginTop: 20,
//       },
//       saveButtonText: {
//         fontSize: 18,
//         color: '#fff',
//         fontWeight: 'bold',
//       },
//     });
