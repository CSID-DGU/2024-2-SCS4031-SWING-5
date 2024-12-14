
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modal';
import { BarChart } from 'react-native-chart-kit';

export default function BloodPressure({ selectedDate, userId }) {
  const [bloodPressure, setBloodPressure] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchBloodPressure = async () => {
      if (!selectedDate || !userId) {
        setBloodPressure([]);
        return;
      }

      setLoading(true);
      setBloodPressure([]);

      try {
        const response = await axios.get(`http://localhost:8080/api/calendar/day/${userId}`, {
          params: { date: selectedDate },
          withCredentials: true,
        });

        const bloodPressureData = response.data.find((item) => item.type === 'bloodpresure');
        setBloodPressure(bloodPressureData?.measurements || []);
      } catch (error) {
        // console.error('혈압 데이터 가져오기 실패:', error.message);
        setBloodPressure([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBloodPressure();
  }, [selectedDate, userId]);

  const convertToKoreanTime = (utcDate) => {
    const localDate = new Date(utcDate);
    localDate.setHours(localDate.getHours() + 9); // UTC에 9시간 추가
    return localDate.toLocaleString(); // 사람이 읽기 쉬운 포맷으로 반환
  };

  const toggleModal = () => setModalVisible(!isModalVisible);

  // 데이터 병합: 수축기와 이완기 혈압을 하나의 데이터셋으로 구성
  const mergedLabels = bloodPressure.flatMap((bp) => [
    `${bp.measureTitle}:최저`,
    `${bp.measureTitle}:최고`,
  ]);

  const mergedData = bloodPressure.flatMap((bp) => [
    parseFloat(bp.highpressure), // 수축기 혈압
    parseFloat(bp.lowpressure), // 이완기 혈압
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>혈압</Text>
      </View>
      {loading ? (
        <View style={styles.contentContainer}>
          <ActivityIndicator size="large" color="#7686DB" />
          <Text style={styles.loadingText}>데이터를 불러오는 중입니다...</Text>
        </View>
      ) : bloodPressure.length > 0 ? (
        <TouchableOpacity onPress={toggleModal} style={styles.contentContainer}>
          {bloodPressure.map((bp, index) => (
            <View key={index} style={styles.measurementContainer}>
              <Text style={styles.measurementTitle}>{bp.measureTitle}</Text>
              <Text style={styles.measurementValue}>
                {bp.highpressure}/{bp.lowpressure} mmHg
              </Text>
              <Text style={styles.measurementDate}> {convertToKoreanTime(bp.registrationDate)}</Text>
            </View>
          ))}
        </TouchableOpacity>
      ) : (
        <View style={styles.contentContainer}>
          <Text style={styles.noData}>해당 날짜의 혈압 데이터가 없습니다.</Text>
        </View>
      )}
      {/* 그래프 모달 */}
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>혈압 그래프</Text>
          <BarChart
            data={{
              labels: mergedLabels, // 병합된 레이블
              datasets: [
                {
                  data: mergedData, // 병합된 데이터
                },
              ],
            }}
            width={Dimensions.get('window').width - 66}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              fillShadowGradient: `rgba(255, 99, 132, 1)`, // 막대 채우기 색상
              fillShadowGradientOpacity: 1, // 막대 투명도 제거
              color: () => `rgba(54, 162, 235, 1)`,
              labelColor: () => `rgba(0,0,0,1)`,
              barPercentage: 0.5, // 막대 너비 비율
              // barColors: [`rgba(255, 99, 132, 1)`, `rgba(54, 162, 235, 1)`], // 수축기/이완기 색상
            }}
            style={{
              marginVertical: 10,
              borderRadius: 10,
            }}
            withHorizontalLabels={true}
            withVerticalLabels={true}
            fromZero
            showValuesOnTopOfBars
          />
          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  titleContainer: {
    backgroundColor: '#7686DB',
    paddingVertical: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contentContainer: {
    padding: 10,
  },
  measurementContainer: {
    marginBottom: 10,
  },
  measurementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  measurementValue: {
    fontSize: 16,
  },
  measurementDate: {
    fontSize: 14,
    color: '#666',
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  noData: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#7686DB',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
