import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function RegisterOptions() {
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSearchModalVisible, setSearchModalVisible] = useState(false); 

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleTakePhoto = () => {
    setModalVisible(false);
    router.push('../utils/camera');
  };

  const handleChooseFromAlbum = () => {
    setModalVisible(false);
    router.push('../utils/userPhoto');
  };

  // '직접입력' 모달
  const handleOpenSearchModal = () => {
    setSearchModalVisible(true);
  };
  const handleCloseSearchModal = () => {
    setSearchModalVisible(false);
  };
  const handlePrescriptionInput = () => {
    setSearchModalVisible(false);
    router.push('../utils/Prescription');
  };
  const handleSupplementInput = () => {
    setSearchModalVisible(false);
    router.push('../utils/supplement');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.header}>등록 항목 선택하기</Text>
        <Text style={styles.subHeader}>나의 건강 정보를 기록해보세요!</Text>
        
        <View style={styles.buttonContainer}>
          <View style={styles.row}>
            <View style={styles.card}>
              <Text style={styles.title}>처방전 스캔</Text>
              <Image
                source={require('../../assets/images/medical-record(3).png')}
                style={styles.icon}
              />
              <Text style={styles.description}>처방전을 스캔하여 복약 정보를 등록하세요!</Text>
              <TouchableOpacity style={styles.button} onPress={handleOpenModal}>
                <Text style={styles.buttonText}>등록하기</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>약봉투 스캔</Text>
              <Image
                source={require('../../assets/images/poly-bag.png')}
                style={styles.icon}
              />
              <Text style={styles.description}>약봉투를 스캔하여 복약 정보를 등록하세요!</Text>
              <TouchableOpacity style={styles.button} onPress={handleOpenModal}>
                <Text style={styles.buttonText}>등록하기</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.row}>
            <View style={styles.card}>
              <Text style={styles.title}>직접 입력</Text>
              <Image
                source={require('../../assets/images/search.png')}
                style={styles.icon}
              />
              <Text style={styles.description}>검색을 통해 약을 직접 입력하고 등록하세요!</Text>
              <TouchableOpacity style={styles.button} onPress={handleOpenSearchModal}>
              {/* <TouchableOpacity style={styles.button} onPress={() => router.push('../utils/SearchInput')}> */}
                <Text style={styles.buttonText}>등록하기</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/*  혈압/혈당 등록  */}
          <View style={styles.row}>
            <View style={styles.card}>
              <Text style={styles.title}>혈압/혈당 등록</Text>
              <Image
                source={require('../../assets/images/blood-pressure.png')} 
                style={styles.icon}
              />
              <Text style={styles.description}>혈압과 혈당 정보를 입력하고 등록하세요!</Text>
              <TouchableOpacity style={styles.button} onPress={() => router.push('../utils/Blood')}>
                <Text style={styles.buttonText}>등록하기</Text>
              </TouchableOpacity>
            </View>

          {/* 스케줄 메모 */}
      
            <View style={styles.card}>
              <Text style={styles.title}>스케줄 등록</Text>
              <Image
                source={require('../../assets/images/notes.png')} 
                style={styles.icon}
              />
              <Text style={styles.description}>간단한 일정과 메모를 입력하고 등록하세요!</Text>
              <TouchableOpacity style={styles.button} onPress={() => router.push('../utils/Schedule')}>
                <Text style={styles.buttonText}>등록하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={handleTakePhoto} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>사진 찍기</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity onPress={handleChooseFromAlbum} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>앨범에서 사진 선택</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalCancelContent}>
            <TouchableOpacity onPress={handleCloseModal} style={styles.modalCancelButton}>
              <Text style={styles.modalCancelButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/* 직접입력 모달 */}
      <Modal
          visible={isSearchModalVisible}
          transparent={true}
          animationType="none"
          onRequestClose={handleCloseSearchModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={handlePrescriptionInput} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>처방약 등록하기</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity onPress={handleSupplementInput} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>영양제 등록하기</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalCancelContent}>
              <TouchableOpacity onPress={handleCloseSearchModal} style={styles.modalCancelButton}>
                <Text style={styles.modalCancelButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
  </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    margin: 5,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    minHeight: 200,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    width: 50,
    height: 50,
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#7686DB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalButton: {
    paddingVertical: 15,
  },
  modalButtonText: {
    fontSize: 18,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
  },
  modalCancelContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 10,
  },
  modalCancelButton: {
    paddingVertical: 15,
  },
  modalCancelButtonText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
  },
});
