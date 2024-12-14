import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView, Image, Modal } from 'react-native';

const MedicationManagement = ({ userId, selectedDate }) => {
    const [medicationData, setMedicationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false); 
    const [modalMessage, setModalMessage] = useState('');   

    useEffect(() => {
        const fetchData = async () => {
            if (!userId || !selectedDate) return;

            try {
                const response = await fetch(
                    `http://localhost:8080/api/medicine/${userId}?date=${selectedDate}`,
                    {
                        method: 'GET',
                        credentials: 'include',
                    }
                );

                if (!response.ok) throw new Error('Failed to fetch medication data');

                const data = await response.json();
                setMedicationData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setMedicationData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, selectedDate]);

    const handleIntakeConfirmation = async (intakeMedicineListId, currentStatus) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/medicine/intake?intakeMedicineListId=${intakeMedicineListId}&intakeConfirmed=${!currentStatus}`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                }
            );

            if (!response.ok) throw new Error('Failed to update intake status');

            setMedicationData((prevData) =>
                prevData.map((medication) => ({
                    ...medication,
                    medicineList: medication.medicineList.map((medicine) =>
                        medicine.intakeMedicineListId === intakeMedicineListId
                            ? { ...medicine, intakeConfirmed: !currentStatus }
                            : medicine
                    ),
                }))
            );
        } catch (error) {
            console.error('Error updating intake status:', error);
        }
    };

    const handleAllIntakeConfirmation = async (medicationManagementId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/medicine/intake/all?medicationManagementId=${medicationManagementId}`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                }
            );

            if (!response.ok) throw new Error('Failed to update all intake status');

            const result = await response.text(); // "100포인트 적립" 같은 메시지 반환
            setModalMessage(result); // 모달 메시지 설정
            setModalVisible(true);

            setMedicationData((prevData) =>
                prevData.map((medication) =>
                    medication.medicationManagementId === medicationManagementId
                        ? {
                              ...medication,
                              totalIntakeConfirmed: true,
                              medicineList: medication.medicineList.map((medicine) => ({
                                  ...medicine,
                                  intakeConfirmed: true,
                              })),
                          }
                        : medication
                )
            );
        } catch (error) {
            console.error('Error updating all intake status:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {medicationData.length > 0 ? (
                medicationData.map((medication, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.header}>
                            <Text style={styles.time}>{medication.notificationTime}</Text>

                            <View style={styles.titleContainer}>
                                {/* 타입에 따른 이미지 표시 */}
                                <Image
                                    source={
                                        medication.type === 'M'
                                            ? require('../assets/images/prescriptionDrug.png')
                                            : require('../assets/images/supplements.png')
                                    }
                                    style={styles.icon}
                                />
                                <Text style={styles.title}>{medication.medicineBagName}</Text>
                            </View>
                            <Text style={styles.duration}>
                                {medication.notificationDate}
                            </Text>
                        </View>
                        <View style={styles.medicineList}>
                            {medication.medicineList.map((medicine) => (
                                <View key={medicine.intakeMedicineListId} style={styles.medicineItem}>
                                    <Text style={styles.medicineName}>{medicine.medicineName}</Text>
                                    <Text style={styles.medicineDosage}>
                                        {medicine.dosagePerIntake}정
                                    </Text>
                                    <TouchableOpacity
                                        style={[
                                            styles.intakeButton,
                                            medicine.intakeConfirmed ? styles.confirmed : styles.pending,
                                        ]}
                                        onPress={() =>
                                            handleIntakeConfirmation(
                                                medicine.intakeMedicineListId,
                                                medicine.intakeConfirmed
                                            )
                                        }
                                    >
                                        <Text style={styles.intakeButtonText}>
                                            {medicine.intakeConfirmed ? '✔️ 복용 완료' : '복용'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                        <TouchableOpacity
                            style={styles.allIntakeButton}
                            onPress={() => handleAllIntakeConfirmation(medication.medicationManagementId)}
                        >
                            <Text style={styles.allIntakeButtonText}>모두 복용</Text>
                        </TouchableOpacity>
                    </View>
                ))
            ) : (
                <Text style={styles.noDataText}>복용 기록이 없습니다</Text>
            )}
            <Modal
                animationType="none"
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4FF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#ffffff',
        margin: 10,
        borderRadius: 8,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        marginBottom: 10,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    icon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    time: {
        fontSize: 16,
        color: '#555',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    duration: {
        fontSize: 14,
        color: '#999',
    },
    medicineList: {
        marginTop: 10,
    },
    medicineItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    medicineName: {
        fontSize: 16,
        flex: 2,
        color: '#333',
    },
    medicineDosage: {
        fontSize: 14,
        flex: 1,
        textAlign: 'center',
        color: '#555',
    },
    intakeButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    confirmed: {
        backgroundColor: '#FFA18C',
    },
    pending: {
        backgroundColor: '#f8d7da',
    },
    intakeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    allIntakeButton: {
        marginTop: 10,
        backgroundColor: '#7686DB',
        borderRadius: 6,
        paddingVertical: 10,
        alignItems: 'center',
    },
    allIntakeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    noDataText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
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
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MedicationManagement;
