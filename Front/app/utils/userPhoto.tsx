import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert, TouchableOpacity, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useFocusEffect } from 'expo-router';
import { useOCRWithParser } from '../../hooks/useOCRWithParser';


export default function UserPhoto() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [backendResponse, setBackendResponse] = useState<any>(null); // 백엔드 응답 상태 추가
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        pickImage();
      }, 500);
    }, [])
  );

  async function pickImage() {
    if (Platform.OS === 'web') {
      // 웹 환경에서 파일 선택 처리
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (event: any) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => setPhotoUri(reader.result as string); // Base64 이미지 데이터 설정
          reader.onerror = () => Alert.alert('오류', '이미지를 읽을 수 없습니다.');
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else {
      // 네이티브 환경
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('권한 필요', '앨범 접근 권한이 필요합니다.');
        router.push('/(main)/registerOptions');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled) {
        router.push('/(main)/registerOptions');
      } else if (result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    }
  }

  async function handleDetect() {
    if (!photoUri) return;

    setLoading(true);
    try {
      // useOCRWithParser를 호출하여 백엔드 응답 받기
      const backendData = await useOCRWithParser(photoUri);

      if (backendData === null) {
        Alert.alert('오류', '텍스트 인식에 실패했습니다.');
        setLoading(false);
        return;
      }

      // 디버깅용 로그 출력
      console.log('userPhoto.tsx backendData:', backendData);

      // backendResponse 상태 업데이트
      setBackendResponse(backendData);

      Alert.alert('인식 완료', 'OCR 인식이 완료되었습니다.');


      // OCRResult로 데이터 전달
      console.log('userPhoto.tsx - Navigating to OCRResult:', {
        photoUri: photoUri,
        registrationDate: backendData.registrationDate,
        medicineList: JSON.stringify(backendData.medicineList),
      });    
      
      
      // OCRResult로 데이터 전달
      router.push({
        pathname: '/utils/OCRResult',
        params: {
          photoUri: photoUri,
          registrationDate: backendData.registrationDate,
          medicineList: JSON.stringify(backendData.medicineList), // JSON 문자열로 변환
        },
      });
    } catch (error) {
      console.error('OCR 실패:', error);
      Alert.alert('오류', '텍스트 인식에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(main)/registerOptions')}>
        <Image source={require('../../assets/images/back.png')} style={styles.backButtonIcon} />
      </TouchableOpacity>

      {photoUri ? (
        <>
          <Image source={{ uri: photoUri }} style={styles.selectedPhoto} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.retakeButton} onPress={pickImage}>
              <Text style={styles.retakeButtonText}>다시 선택</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detectButton} onPress={handleDetect}>
              <Text style={styles.detectButtonText}>인식하기</Text>
            </TouchableOpacity>
          </View>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={styles.loadingText}>인식 중...</Text>
            </View>
          )}
        </>
      ) : (
        <Text style={styles.loadingText}> </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 80,
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  backButtonIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  selectedPhoto: {
    width: '100%',
    height: '60%',
    resizeMode: 'contain',
    marginTop: 80,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 30,
    width: '80%',
    alignSelf: 'center',
  },
  retakeButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    backgroundColor: 'rgba(108, 110, 140, 0.7)',
    borderRadius: 10,
    alignItems: 'center',
  },
  detectButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    backgroundColor: 'rgba(160, 164, 242, 0.7)',
    borderRadius: 10,
    alignItems: 'center',
  },
  retakeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  detectButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
