import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function NotificationSettings() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.profileCard}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                    source={require('../../../assets/images/back.png')} // 뒤로가기 아이콘
                    style={styles.backIcon}
                    />
                </TouchableOpacity>
            <Text style={styles.headerTitle}>알림 설정</Text>
            <View style={styles.placeholder}></View>
            </View>
            </View>
        </View>
  );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        alignItems: 'center',
        backgroundColor: '#F0F4FF',
        padding: 10,
        marginTop: 15,
    },
    profileCard: {
        width: '95%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginTop: 5,
        paddingBottom: 30
    },
    header: {
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        justifyContent: 'space-between', 
        width: '100%',
        marginTop: 5,
    },
    backIcon: {
        width: 20, 
        height: 20, 
        marginRight: 8, 
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        flex: 1,
    },
    placeholder: {
        flex: 0.06, // 오른쪽에 빈 공간으로 대칭 맞추기
    },
});
