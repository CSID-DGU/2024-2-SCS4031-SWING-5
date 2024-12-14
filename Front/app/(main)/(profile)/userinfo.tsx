import React, { useEffect, useState } from 'react';
import { View, Text, TextInput,StyleSheet, TouchableOpacity, Button, ActivityIndicator, Image } from 'react-native';
import { useUserData } from '../../../context/UserDataContext';
import { useRouter } from 'expo-router';

export default function UserInfo({ useNavigation }) {
    const { user } = useUserData();
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
      familyRole: '',
      phoneNumber: '',
      gender: '',
      age: '',
    });

    const handleGoBack = () => {
      router.back(); // 이전 페이지로 이동
    };
  
    const fetchUserData = async (userId) => {
      try {
        const response = await fetch(`http://localhost:8080/api/mypage/update/${userId}`, {
          method: 'GET',
          credentials: 'include', // 쿠키 포함
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setEditData({
            familyRole: data.familyRole || '',
            phoneNumber: data.phoneNumber || '',
            gender: data.gender || '',
            age: data.age ? String(data.age) : '',
          });
        } else {
          console.error('Failed to fetch user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      if (user && user.userId) {
        fetchUserData(user.userId);
      }
    }, [user]);
  
    const handleInputChange = (name, value) => {
      setEditData({ ...editData, [name]: value });
    };
  
    const handleSave = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/mypage/update', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(editData),
        });
    
        if (response.ok) {
          // 업데이트 성공 시 변경된 데이터를 다시 요청
          if (user && user.userId) {
            await fetchUserData(user.userId); // 유저 정보 다시 가져오기
          }
          setIsEditing(false); // 수정 모드 종료
        } else {
          console.error('Failed to update user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    };
    
  
    if (!user || loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }
  
    if (!userData) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>사용자 데이터를 불러올 수 없습니다.</Text>
        </View>
      );
    }
  
    return (
      <View style={styles.container}>
        <View style={styles.profileCard}>
          <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Image
                    source={require('../../../assets/images/back.png')} 
                    style={styles.backIcon}
                    />
                </TouchableOpacity>
            <Text style={styles.headerTitle}>내 정보</Text>
            <View style={styles.placeholder}></View>
          </View>
  
          {isEditing ? (
            <>
            <Text style={styles.editTitle}>내 정보 수정하기</Text>
              <Text style={styles.labelText}>구성원 별명</Text>
              <TextInput
                style={styles.input}
                placeholder="구성원 별명을 입력해주세요"
                value={editData.familyRole}
                onChangeText={(value) => handleInputChange('familyRole', value)}
              />
              <Text style={styles.labelText}>전화 번호</Text>
              <TextInput
                style={styles.input}
                placeholder="전화번호를 입력해주세요"
                value={editData.phoneNumber}
                onChangeText={(value) => handleInputChange('phoneNumber', value)}
              />
              <Text style={styles.labelText}>성별</Text>
              <TextInput
                style={styles.input}
                placeholder="성별을 입력해주세요"
                value={editData.gender}
                onChangeText={(value) => handleInputChange('gender', value)}
              />
              <Text style={styles.labelText}>나이</Text>
              <TextInput
                style={styles.input}
                placeholder="나이를 입력해주세요"
                keyboardType="numeric"
                value={editData.age}
                onChangeText={(value) => handleInputChange('age', value)}
              />
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>수정 완료</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.nameText}>
                {user.name} <Text style={styles.familyRoleText}>({userData.familyRole})</Text>
              </Text>
              <Text style={styles.infoText}>전화번호: {userData.phoneNumber}</Text>
              <Text style={styles.infoText}>성별: {userData.gender}</Text>
              <Text style={styles.infoText}>나이: {userData.age}세</Text>
              <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                <Text style={styles.editButtonText}>수정</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
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
        paddingBottom: 30
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
        textAlign: 'center',
        flex: 1,
    },
    placeholder: {
        width: 20,
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 14,
        marginLeft: 2,
        marginTop: 13,
    },
    familyRoleText: {
      fontSize: 20,
      color: '#4CAF50',
    },
    infoText: {
      fontSize: 16,
      marginBottom: 5,
    },
    editButton: {
      marginTop: 20,
      backgroundColor: '#4CAF50',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    editButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    },
    loadingText: {
      fontSize: 18,
      marginTop: 10,
    },
    errorText: {
      fontSize: 18,
      color: 'red',
    },
    labelText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
    },
    editTitle: {
      fontSize: 20,
      alignItems: 'center',
      color: '#333',
      marginBottom: 20,
      marginTop: 15,
      fontWeight: 'bold'
    },
    saveButton: {
      backgroundColor: '#4CAF50', 
      paddingVertical: 10, 
      paddingHorizontal: 10, 
      borderRadius: 5, 
      alignItems: 'center', 
      marginTop: 20, 
    },
    saveButtonText: {
      color: '#fff', 
      fontSize: 16, 
      fontWeight: 'bold', 
    },
  });