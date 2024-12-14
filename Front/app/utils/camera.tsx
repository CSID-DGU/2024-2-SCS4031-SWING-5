import React, { useState, useRef } from 'react';
import { 
  Image, StyleSheet, Text, TouchableOpacity, View, Animated, 
  Dimensions, ActivityIndicator, Alert 
} from 'react-native';
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { PinchGestureHandler, GestureHandlerRootView, PinchGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { useOCRWithParser } from '../../hooks/useOCRWithParser';
import { useRouter } from 'expo-router';
import OCRLayout from './OCRLayout';


export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [zoom, setZoom] = useState(0);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<CameraView | null>(null); // CameraView 타입 지정
  const flashAnimation = useRef(new Animated.Value(0)).current;
  const router = useRouter(); // Router 사용
  const [backendResponse, setBackendResponse] = useState<any>(null); // 백엔드 응답 상태

  const windowHeight = Dimensions.get('window').height;
  const tabBarHeight = 80;

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <OCRLayout>
        <View style={styles.container}>
          <Text style={styles.message}>카메라 사용 권한이 필요합니다</Text>
          <TouchableOpacity onPress={requestPermission}>
            <Text>권한 승인</Text>
          </TouchableOpacity>
        </View>
      </OCRLayout>
    );
  }

  async function takePicture() {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const { uri } = await cameraRef.current.takePictureAsync(options);
      setPhotoUri(uri);
    }
  }

  async function handleDetect() {
    if (!photoUri) return;

    setLoading(true);
    try {
      // useOCRWithParser 호출하여 백엔드 응답 받기
      const backendData = await useOCRWithParser(photoUri);

      if (backendData === null) {
        Alert.alert('오류', '텍스트 인식에 실패했습니다.');
        setLoading(false);
        return;
      }

      // 디버깅용 로그 출력
      console.log('camera.tsx backendData:', backendData);

      // backendResponse 상태 업데이트
      setBackendResponse(backendData);

      Alert.alert('인식 완료', 'OCR 인식이 완료되었습니다.');

      // OCRResult로 데이터 전달
      console.log('camera.tsx - Navigating to OCRResult:', {
        photoUri: photoUri,
        registrationDate: backendData.registrationDate,
        medicineList: JSON.stringify(backendData.medicineList),
      });

      router.push({
        pathname: '/utils/OCRResult',
        params: {
          photoUri: photoUri,
          registrationDate: backendData.registrationDate,
          medicineList: JSON.stringify(backendData.medicineList),
        },
      });
    } catch (error) {
      console.error('OCR 실패:', error);
      Alert.alert('오류', '텍스트 인식에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  function animateShutter() {
    Animated.sequence([
      Animated.timing(flashAnimation, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(flashAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  }

  const handlePinch = (event: PinchGestureHandlerGestureEvent) => {
    const scaleChange = (event.nativeEvent.scale - 1) / 70;
    setZoom((prevZoom) => Math.min(Math.max(prevZoom + scaleChange, 0), 0.1));
  };

  return (
    <OCRLayout>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PinchGestureHandler onGestureEvent={handlePinch}>
          <View style={styles.container}>
            {photoUri ? (
              <View style={styles.container}>
                <Image source={{ uri: photoUri }} style={styles.capturedPhoto} />
                {loading && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.loadingText}>인식 중입니다...</Text>
                  </View>
                )}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.retakeButton} onPress={() => setPhotoUri(null)}>
                    <Text style={styles.retakeButtonText}>다시 촬영</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.detectButton} onPress={handleDetect}>
                    <Text style={styles.detectButtonText}>인식하기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <CameraView
                style={[styles.camera, { height: windowHeight - tabBarHeight }]}
                zoom={zoom}
                ref={cameraRef}
              >
                <Animated.View style={[styles.flashOverlay, { opacity: flashAnimation }]} />
                <TouchableOpacity
                  style={styles.shutterButton}
                  onPress={() => {
                    animateShutter();
                    takePicture();
                  }}
                >
                  <View style={styles.innerCircle} />
                </TouchableOpacity>
              </CameraView>
            )}
          </View>
        </PinchGestureHandler>
      </GestureHandlerRootView>
    </OCRLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  } as TextStyle,
  camera: {
    width: '100%',
    flex: 1,
  } as ViewStyle,
  shutterButton: {
    position: 'absolute',
    bottom: 80,
    left: '50%',
    transform: [{ translateX: -35 }],
    width: 70,
    height: 70,
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderWidth: 6,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  innerCircle: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
  } as ViewStyle,
  capturedPhoto: {
    width: '100%',
    height: '100%',
  } as ImageStyle,
  flashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    opacity: 0,
  } as ViewStyle,
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
  } as ViewStyle,
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: 'black',
  } as TextStyle,
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignSelf: 'center',
  } as ViewStyle,
  retakeButton: {
    backgroundColor: '#a9aabc', // 버튼 색상 변경
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25, // 둥근 모서리
    shadowColor: '#000', // 그림자 효과
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  } as ViewStyle,
  detectButton: {
    backgroundColor: '#82a3ff', // 버튼 색상 변경
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000', // 그림자 효과
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  } as ViewStyle,
  retakeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  } as TextStyle,
  detectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  } as TextStyle,
});
