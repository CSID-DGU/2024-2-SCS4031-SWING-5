import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { PrescriptionInfo } from '../types/types'; // 타입 가져오기

const GOOGLE_VISION_API_KEY = Constants.expoConfig?.extra?.googleVisionApiKey || 'fallback-api-key';

export const useOCRWithParser = async (imageUri: string): Promise<PrescriptionInfo | null> => {
  try {
    let imageBase64: string;

    if (Platform.OS === 'web') {
      if (imageUri.startsWith('data:image/')) {
        imageBase64 = imageUri.split(',')[1];
      } else {
        throw new Error('웹에서 지원되지 않는 이미지 형식입니다.');
      }
    } else {
      const { readAsStringAsync } = await import('expo-file-system');
      imageBase64 = await readAsStringAsync(imageUri, { encoding: 'base64' });
    }

    const visionRequestBody = JSON.stringify({
      requests: [
        {
          image: { content: imageBase64 },
          features: [{ type: 'TEXT_DETECTION' }],
        },
      ],
    });

    const visionResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: visionRequestBody,
      }
    );

    if (!visionResponse.ok) {
      console.error('OCR 요청 실패:', await visionResponse.text());
      return null;
    }

    const visionData = await visionResponse.json();
    const rawText = visionData.responses[0]?.fullTextAnnotation?.text || '';
    // rawText 디버깅 출력
    console.log('Google Vision API - OCR rawText:', rawText);

    const backendRequestBody = JSON.stringify({ body: rawText });

    const backendResponse = await fetch('http://localhost:8080/api/ocr/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: backendRequestBody,
    });

    if (!backendResponse.ok) {
      console.error('백엔드 요청 실패:', await backendResponse.text());
      return null;
    }

    const backendData: PrescriptionInfo = await backendResponse.json();

    // backendData 디버깅 출력
    console.log('Backend Response Data:', backendData);

    return backendData;
  } catch (error) {
    console.error('OCR 처리 실패:', error);
    return null;
  }
};
