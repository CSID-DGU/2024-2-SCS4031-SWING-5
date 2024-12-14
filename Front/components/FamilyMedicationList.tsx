import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';

const FamilyMedicationList = ({ userId, selectedDate }) => {
    const [medicationData, setMedicationData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;

            try {
                const response = await fetch(
                    `http://localhost:8080/api/medicine/${userId}?date=${selectedDate}`,
                    { method: 'GET', credentials: 'include' }
                );
                if (!response.ok) throw new Error('Failed to fetch medication data');
                const data = await response.json();

                // 동일한 medicineBagId로 그룹화
                const groupedData = Object.values(
                    data.reduce((acc, item) => {
                        if (!acc[item.medicineBagId]) {
                            acc[item.medicineBagId] = {
                                ...item,
                                times: [item.notificationTime],
                            };
                        } else {
                            acc[item.medicineBagId].times.push(item.notificationTime);
                        }
                        return acc;
                    }, {})
                );

                setMedicationData(groupedData);
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>오늘의 복용 리스트</Text>
            <View style={styles.medicationContainer}>
                {medicationData.length > 0 ? (
                    medicationData.map((medication, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.medicationItem}
                            activeOpacity={1} // 버튼 효과 제거
                        >
                            {/* 타입에 따른 이미지 렌더링 */}
                            <Image
                                source={
                                    medication.type === 'M'
                                        ? require('../assets/images/prescriptionDrug.png')
                                        : require('../assets/images/supplements.png')
                                }
                                style={styles.medicationImage}
                            />
                            <View style={styles.medicationTextContainer}>
                                <Text style={styles.medicationName}>{medication.medicineBagName}</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.noMedicationText}>복용 기록이 없습니다</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 0,
        marginVertical: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        margin: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        paddingVertical: 10,
        backgroundColor: '#7686DB',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    medicationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
    },
    medicationItem: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 15,
        width: 80,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 10,
    },
    medicationImage: {
        width: 40,
        height: 40,
        marginBottom: 5,
        borderRadius: 5,
        resizeMode: 'contain',
    },
    medicationTextContainer: {
        alignItems: 'center',
    },
    medicationName: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    medicationTime: {
        fontSize: 12,
        color: '#666',
    },
    noMedicationText: {
        textAlign: 'center',
        color: '#999',
        marginVertical: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default FamilyMedicationList;
