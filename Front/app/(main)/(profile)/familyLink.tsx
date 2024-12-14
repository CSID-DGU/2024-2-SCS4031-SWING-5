import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ActivityIndicator, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserData } from '../../../context/UserDataContext';

export default function FamilyLink() {
  const navigation = useNavigation();
  const { user } = useUserData();
  const [isLinked, setIsLinked] = useState(null); // 가족 연동 여부
  const [familyCode, setFamilyCode] = useState(''); // 가족 코드
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [inputFamilyCode, setInputFamilyCode] = useState(''); // 사용자 입력 가족 코드
  const [modalVisible, setModalVisible] = useState(false); // 모달 표시 여부
  const [modalMessage, setModalMessage] = useState(''); // 모달에 표시할 메시지
  const [error, setError] = useState(false);


  // 가족 연동 여부 확인
  const checkFamilyLink = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/family/code/${user.userId}`, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.text(); // "N" 또는 가족 코드 반환
      if (result === 'N') {
        setIsLinked(false); // 가족 연동되지 않은 상태
      } else {
        setIsLinked(true); // 가족 연동된 상태
        setFamilyCode(result); // 가족 코드 저장
      }
    } catch (error) {
      console.error('Error checking family link:', error);
    } finally {
      setLoading(false); // 로딩 해제
    }
  };

  // 가족 코드 발급
  const fetchFamilyCode = async () => {
    try {
      setLoading(true); // 로딩 상태 설정
      const response = await fetch(`http://localhost:8080/api/family/code`, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.text(); // 가족 코드 반환
      setFamilyCode(result); // 가족 코드 저장
      setIsLinked(true); // 연동된 상태로 변경
      Alert.alert('가족 코드 발급 완료', `발급된 가족 코드: ${result}`);
    } catch (error) {
      console.error('Error fetching family code:', error);
      Alert.alert('오류', '가족 코드 발급 중 문제가 발생했습니다.');
    } finally {
      setLoading(false); // 로딩 해제
    }
  };

  // 가족 연동 요청
  const handleFamilyLinkRequest = async () => {
    if (!inputFamilyCode.trim()) {
      setError(true); // 에러 상태 활성화
      return;
    }    
    try {
      setLoading(true); // 로딩 상태 설정
      const response = await fetch(`http://localhost:8080/api/code/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          familyCode: inputFamilyCode, // 사용자 입력 가족 코드
          requestUserId: user.userId, // 현재 사용자 ID
        }),
      });

      if (response.ok) {
        setModalMessage('가족 연동 요청을 보냈습니다!');
        setModalVisible(true); // 성공 모달 표시
        checkFamilyLink(); // 가족 연동 여부 다시 확인
      } else {
        setModalMessage('가족 코드가 잘못되었습니다!');
        setModalVisible(true); // 실패 모달 표시
      }
    } catch (error) {
      console.error('Error requesting family link:', error);
      setModalMessage('가족 코드가 잘못되었습니다!');
      setModalVisible(true); // 실패 모달 표시
    } finally {
      setLoading(false); // 로딩 해제
    }
  };

  // 가족 탈퇴 요청
  const handleFamilyUnlink = async () => {
    try {
      setLoading(true); // 로딩 상태 설정
      const response = await fetch(`http://localhost:8080/api/family/code/${user.userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        Alert.alert('탈퇴 성공', '가족 연동이 성공적으로 해제되었습니다.');
        setIsLinked(false); // 가족 연동 상태 해제
        setFamilyCode(''); // 가족 코드 초기화
      } else {
        const errorMessage = await response.text();
        Alert.alert('탈퇴 실패', errorMessage || '가족 탈퇴 요청에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error unlinking family:', error);
      Alert.alert('오류', '가족 탈퇴 중 문제가 발생했습니다.');
    } finally {
      setLoading(false); // 로딩 해제
    }
  };

  // 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
    checkFamilyLink();
  }, []);

  // 로딩 화면
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>가족 연동 상태 확인 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../../../assets/images/back.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>가족 연동</Text>
          <View style={styles.placeholder}></View>
        </View>

        {/* 가족 연동 여부에 따라 화면 구성 */}
        {!isLinked ? (
          // 가족 연동되지 않은 상태
          <View>
            <Text style={styles.infoText}>연동된 가족이 없습니다</Text>

            {/* 가족 코드 발급 버튼 */}
            <TouchableOpacity style={styles.button} onPress={fetchFamilyCode}>
              <Text style={styles.buttonText}>가족 코드 발급</Text>
            </TouchableOpacity>
            <Text style={styles.descriptionText}>
              첫 연동이라면 가족 코드를 발급받아 가족 구성원에게 알려주세요!
            </Text>

            <TextInput
              style={[
                styles.input,
                error && { borderColor: 'red' }, // 에러 시 테두리 빨간색
              ]}
              placeholder="가족 코드 입력"
              value={inputFamilyCode} // TextInput 값
              onChangeText={(text) => {
                setInputFamilyCode(text);
                setError(false); // 입력 시 에러 해제
              }}
            />
            {error && <Text style={styles.errorText}>가족 코드를 입력해주세요</Text>}
            <TouchableOpacity style={styles.button} onPress={handleFamilyLinkRequest}>
              <Text style={styles.buttonText}>가족 연동하기</Text>
            </TouchableOpacity>
            <Text style={styles.descriptionText}>
              가족 구성원이 알려준 코드를 입력해 가족과 연동해보세요!
            </Text>
          </View>
        ) : (
          // 가족 연동된 상태
          <View>
            <Text style={styles.familyCode}>{familyCode}</Text>
            <Text style={styles.descriptionText}>
              가족 코드를 가족 구성원에게 알려주세요!
            </Text>

            {/* 가족 탈퇴 버튼 */}
            <TouchableOpacity style={styles.deleteButton} onPress={handleFamilyUnlink}>
              <Text style={styles.deleteButtonText}>가족 탈퇴하기</Text>
            </TouchableOpacity>
            <Text style={styles.descriptionText}>
              가족 탈퇴를 하게 되면 가족 연동 정보와 <br />가족 코드 내역이 모두 사라집니다.
            </Text>
          </View>
        )}
      </View>
      <Modal
          animationType= 'none'
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{modalMessage}</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    padding: 10,
    marginTop: 15,
  },
  profileCard: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 5,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    justifyContent: 'space-between', 
    width: '100%',
    marginTop: 5,
  },
  backIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 20, // 오른쪽 여백
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    marginTop: 15,
  },
  button: {
    backgroundColor: '#AFB8DA',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 5,
    color: '#555',
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: '100%',
  },
  familyCode: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 15,
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: '#FF6F61',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
    marginTop: 30,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#AFB8DA',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});
