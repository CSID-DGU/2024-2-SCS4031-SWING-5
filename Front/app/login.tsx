
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, Platform } from 'react-native';
import * as Linking from 'expo-linking';

export default function Login() {
  // 환경에 따라 다른 URL 설정
  const backendUrl = Platform.OS === 'web' ? 'http://localhost:8080' : 'http://172.30.1.24:8080';

  const handleButtonClickKaKao = () => {
    const kakaoUrl = `${backendUrl}/oauth2/authorization/kakao?redirect_uri=myapp://loadingpage`;
    if (Platform.OS === 'web') {
      window.location.href = kakaoUrl; // 웹 환경에서는 현재 창에서 링크 열기
    } else {
      Linking.openURL(kakaoUrl); // 모바일 환경에서는 외부 브라우저에서 링크 열기
    }
  };

  const handleButtonClickNaver = () => {
    const naverUrl = `${backendUrl}/oauth2/authorization/naver?redirect_uri=myapp://loadingpage`;
    if (Platform.OS === 'web') {
      window.location.href = naverUrl; // 웹 환경에서는 현재 창에서 링크 열기
    } else {
      Linking.openURL(naverUrl); // 모바일 환경에서는 외부 브라우저에서 링크 열기
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WIN;C</Text>

      <Pressable onPress={handleButtonClickKaKao} style={styles.button}>
        <Image source={require('../assets/images/kakao_login.png')} style={styles.buttonImage} />
      </Pressable>

      <Pressable onPress={handleButtonClickNaver} style={styles.button}>
        <Image source={require('../assets/images/naver_login.png')} style={styles.buttonImage} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  button: {
    marginBottom: 20,
  },
  buttonImage: {
    width: 200,
    height: 50,
  },
});

// import React, { useState } from 'react';
// import { View, Text, Image, Pressable, StyleSheet, Modal, Platform } from 'react-native'; // Platform 임포트
// import { WebView } from 'react-native-webview';
// import { useRouter } from 'expo-router'; // Expo Router 사용

// export default function Login() {
//   const [webViewVisible, setWebViewVisible] = useState(false);
//   const [webViewUrl, setWebViewUrl] = useState('');
//   const router = useRouter(); // 화면 전환을 위한 라우터

//   const backendUrl = Platform.OS === 'web' ? 'http://localhost:8080' : 'http://172.30.1.3:8080';

//   // WebView 열기
//   const openWebView = (url) => {
//     setWebViewUrl(url);
//     setWebViewVisible(true);
//   };

//   // 카카오 로그인 버튼 클릭
//   const handleButtonClickKaKao = () => {
//     const kakaoUrl = `${backendUrl}/oauth2/authorization/kakao?redirect_uri=myapp://loadingpage`;
//     openWebView(kakaoUrl);
//   };

//   // 네이버 로그인 버튼 클릭
//   const handleButtonClickNaver = () => {
//     const naverUrl = `${backendUrl}/oauth2/authorization/naver?redirect_uri=myapp://loadingpage`;
//     openWebView(naverUrl);
//   };

//   // WebView 내 URL 감지
//   const handleWebViewNavigationStateChange = (event) => {
//     const successUrl = 'http://172.30.1.3:8081/successpage'; // 감지할 URL
//     if (event.url.startsWith(successUrl)) {
//       console.log('Redirected to:', event.url);
//       setWebViewVisible(false); // WebView 닫기
//       router.push('/loadingpage'); // 앱 내 successpage로 이동
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>WIN;C</Text>

//       {/* 카카오 로그인 버튼 */}
//       <Pressable onPress={handleButtonClickKaKao} style={styles.button}>
//         <Image source={require('../assets/images/kakao_login.png')} style={styles.buttonImage} />
//       </Pressable>

//       {/* 네이버 로그인 버튼 */}
//       <Pressable onPress={handleButtonClickNaver} style={styles.button}>
//         <Image source={require('../assets/images/naver_login.png')} style={styles.buttonImage} />
//       </Pressable>

//       {/* WebView를 Modal로 감싸기 */}
//       <Modal visible={webViewVisible} animationType="slide">
//         <WebView
//           source={{ uri: webViewUrl }}
//           onNavigationStateChange={handleWebViewNavigationStateChange} // URL 변경 감지
//           startInLoadingState={true} // 로딩 스피너 표시
//           javaScriptEnabled={true} // JavaScript 활성화
//           style={{ flex: 1 }}
//         />
//         {/* 닫기 버튼 */}
//         <Pressable onPress={() => setWebViewVisible(false)} style={styles.closeButton}>
//           <Text style={styles.closeButtonText}>닫기</Text>
//         </Pressable>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 40,
//     fontWeight: 'bold',
//     marginBottom: 50,
//   },
//   button: {
//     marginBottom: 20,
//   },
//   buttonImage: {
//     width: 200,
//     height: 50,
//   },
//   closeButton: {
//     position: 'absolute',
//     bottom: 20,
//     alignSelf: 'center',
//     backgroundColor: 'red',
//     padding: 10,
//     borderRadius: 5,
//   },
//   closeButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

