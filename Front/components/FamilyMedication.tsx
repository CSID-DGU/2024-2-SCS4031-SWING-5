import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';

const FamilyMedication = ({ userId, selectedDate }) => {
    const [medicationData, setMedicationData] = useState([]);
    const [loading, setLoading] = useState(true);

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
                // hidden이 false인 데이터만 필터링
                const filteredData = data.filter((item) => !item.hidden);
                setMedicationData(filteredData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setMedicationData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, selectedDate]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (medicationData.length === 0) {
        return <Text style={styles.noDataText}>복용 기록이 없습니다</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            {medicationData.map((medication, index) => (
                <View key={index} style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.time}>{medication.notificationTime}</Text>
                        <View style={styles.titleContainer}>
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
                        <Text style={styles.duration}>{medication.notificationDate}</Text>
                    </View>
                    <View style={styles.medicineList}>
                        {medication.medicineList.map((medicine) => (
                            <View key={medicine.intakeMedicineListId} style={styles.medicineItem}>
                                <Text style={styles.medicineName}>{medicine.medicineName}</Text>
                                <Text style={styles.medicineDosage}>
                                    {medicine.dosagePerIntake}정
                                </Text>
                                <View
                                    style={[
                                        styles.intakeStatus,
                                        medicine.intakeConfirmed
                                            ? styles.confirmed
                                            : styles.pending,
                                    ]}
                                >
                                    <Text style={styles.intakeStatusText}>
                                        {medicine.intakeConfirmed ? '✔️' : '❌'}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            ))}
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
    intakeStatus: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center',
        width: 80,
    },
    confirmed: {
        backgroundColor: '#d4edda', // 파란색 배경 (복용 완료)
    },
    pending: {
        backgroundColor: '#f8d7da', // 빨간색 배경 (복용 미완료)
    },
    intakeStatusText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    noDataText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
    },
});

export default FamilyMedication;
