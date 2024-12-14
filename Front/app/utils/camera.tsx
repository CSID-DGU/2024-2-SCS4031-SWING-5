import React, { useState, useRef } from 'react';
import { 
  Image, StyleSheet, Text, TouchableOpacity, View, Animated, 
  Dimensions, ActivityIndicator, Alert 
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { PinchGestureHandler, GestureHandlerRootView, PinchGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Svg, { Rect } from 'react-native-svg'; // SVG 라이브러리로 박스 그리기
import { useOCRWithParser } from '../../hooks/useOCRWithParser';
import { PrescriptionInfo } from '../../types/types'; // 타입 불러오기

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [zoom, setZoom] = useState(0);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<PrescriptionInfo | null>({ prescription_date: "", medicineList: [] }); // OCR 결과로 위치 정보 포함
  const cameraRef = useRef(null);
  const flashAnimation = useRef(new Animated.Value(0)).current;

  const windowHeight = Dimensions.get('window').height;
  const tabBarHeight = 80;

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>카메라 사용 권한이 필요합니다</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>권한 승인</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function takePicture() {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const { uri } = await (cameraRef.current as any).takePictureAsync(options);
      setPhotoUri(uri);
      setOcrResult({ prescription_date: "", medicineList: [] }); // OCR 결과 초기화
    }
  }

  async function handleDetect() {
    if (!photoUri) return;

    setLoading(true);
    try {
      const result = await useOCRWithParser(photoUri); // OCR 및 위치 정보 추출
      setOcrResult(result || { prescription_date: "", medicineList: [] }); // OCR 결과와 위치 정보 저장
      console.log("전처리 결과:", JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("OCR 실패:", error);
      Alert.alert("오류", "텍스트 인식에 실패했습니다.");
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

              {/* OCR 텍스트 위치에 박스 그리기 */}
              {ocrResult && (
                <Svg style={styles.svgOverlay}>
                  {ocrResult.medicineList.map((medicine, index) => (
                    medicine.position ? ( // position 속성 유무 확인
                      <Rect
                        key={index}
                        x={medicine.position.x}
                        y={medicine.position.y}
                        width={medicine.position.width}
                        height={medicine.position.height}
                        stroke="red"
                        strokeWidth="2"
                        fill="none"
                      />
                    ) : null
                  ))}
                </Svg>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    width: '100%',
  },
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
  },
  innerCircle: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
  },
  capturedPhoto: {
    width: '100%',
    height: '100%',
  },
  flashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    opacity: 0,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: 'black',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignSelf: 'center',
  },
  retakeButton: {
    flex: 1,
    marginRight: 5,
    paddingVertical: 10,
    backgroundColor: 'rgba(108, 110, 140, 0.7)',
    borderRadius: 5,
    alignItems: 'center',
  },
  detectButton: {
    flex: 1,
    marginLeft: 5,
    paddingVertical: 10,
    backgroundColor: 'rgba(160, 164, 242, 0.7)',
    borderRadius: 5,
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
  svgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});