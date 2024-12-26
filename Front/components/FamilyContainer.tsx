import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useFamilyContext } from '@/context/FamilyContext';
import { fetchFamilyMembers } from '@/api/familyApi';
import { useUserData } from '@/context/UserDataContext';
import { useRouter } from 'expo-router';

export default function FamilyContainer() {
    const { familyMembers, setFamilyMembers, setSelectedFamily } = useFamilyContext();
    const { user } = useUserData();
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리
    const router = useRouter();

    useEffect(() => {
        const fetchFamilyData = async () => {
            setIsLoading(true); // 로딩 시작
            try {
                if (user && user.userId) {
                    const fetchedMembers = await fetchFamilyMembers(user.userId); // API 요청
                    setFamilyMembers(fetchedMembers || []); // 가져온 데이터 저장 (없으면 빈 배열)
                }
            } catch (error) {
                console.error('Failed to fetch family members:', error);
                setFamilyMembers([]); // 에러 발생 시 빈 배열로 초기화
            } finally {
                setIsLoading(false); // 로딩 종료
            }
        };

        fetchFamilyData();
    }, [user, setFamilyMembers]);

    const handleSelectFamily = (member) => {
        setSelectedFamily(member); // 선택된 가족 설정
        router.push('/familyMedication'); // (family) 탭으로 이동
    };

    if (isLoading) {
        // 로딩 중일 때 로딩 표시
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>가족 정보를 불러오는 중입니다...</Text>
            </View>
        );
    }

    return (
        <View style={styles.familyContainer}>
            <Text style={styles.title}>우리가족</Text>
            <View style={styles.familyList}>
                {familyMembers.length > 0 ? (
                    familyMembers.map((member) => (
                        <TouchableOpacity
                            key={member.userId}
                            style={styles.familyButton}
                            onPress={() => handleSelectFamily(member)}
                        >
                            <Text style={styles.familyButtonText}>{member.familyRole}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.noFamilyText}>아직 연동된 가족이 없습니다.</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    familyContainer: {
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
    familyList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        padding: 16,
    },
    familyButton: {
        backgroundColor: '#AFB8DA',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    familyButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    noFamilyText: {
        color: '#999',
        fontSize: 14,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
