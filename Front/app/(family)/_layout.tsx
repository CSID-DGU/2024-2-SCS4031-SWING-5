import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { useFamilyContext } from '@/context/FamilyContext';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function FamilyLayout() {
  const { familyMembers, selectedFamily, setSelectedFamily } = useFamilyContext();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false); 

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown); // 드롭다운 상태 변경
  };

  const handleFamilySelect = (member) => {
    setSelectedFamily(member); // 선택된 가족 변경
    setShowDropdown(false); // 드롭다운 닫기
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#595958',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 5,
          paddingTop: 8
        },
        headerShown: true,
        headerStyle: { backgroundColor: '#AFB8DA' },
        headerTitleAlign: 'left',
        headerTitle: () => (
          <TouchableOpacity onPress={() => router.push('/(main)')}>
            <Text style={styles.backText}>◀내 페이지로 돌아가기</Text>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={handleToggleDropdown}
              style={styles.selectedFamilyButton}
            >
              <Text style={styles.selectedFamilyText}>
                {selectedFamily ? selectedFamily.familyRole : '가족 선택'}
              </Text>
            </TouchableOpacity>
            {showDropdown && (
              <View style={styles.dropdown}>
                <FlatList
                  data={familyMembers}
                  keyExtractor={(item) => item.userId}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => handleFamilySelect(item)}
                    >
                      <Text style={styles.dropdownText}>{item.familyRole}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="familyMedication"
          options={{
            title: '복약 관리',
            tabBarIcon: ({ focused }) => (
              <Image
                source={require('../../assets/images/medical-record.png')}
                style={{
                  ...styles.tabIcon,
                  tintColor: focused ? '#595958' : '#aaa',
                  opacity: focused ? 1 : 0.5,
                }}
              />
            ),
          }}
      />
      <Tabs.Screen
        name="familyHealth"
          options={{
            title: '건강 캘린더',
            tabBarIcon: ({ focused }) => (
              <Image
                source={require('../../assets/images/schedule.png')}
                style={{
                  ...styles.tabIcon,
                  tintColor: focused ? '#595958' : '#aaa',
                  opacity: focused ? 1 : 0.5,
                }}
              />
            ),
          }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  backText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginRight: 15,
  },
  selectedFamilyButton: {
    backgroundColor: '#7686DB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    width: 70,
  },
  selectedFamilyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dropdown: {
    position: 'absolute', // 버튼 기준으로 위치
    top: 40, // 버튼 아래로 배치
    right: 0, 
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 10,
    width: 70, 
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAF6',
  },
  dropdownText: {
    fontSize: 14,
    color: '#595958',
  },
  tabIcon: {
    width: 28, // 탭 아이콘 크기 조정
    height: 28,
    marginBottom: 5, // 여백 추가
  },
});
