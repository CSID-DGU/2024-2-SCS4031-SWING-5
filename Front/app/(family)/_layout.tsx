import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { useFamilyContext } from '@/context/FamilyContext';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';


export default function FamilyLayout() {
  const { familyMembers, selectedFamily, setSelectedFamily } = useFamilyContext();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false); // 드롭다운 토글 상태

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
          height: 75,
          paddingBottom: 20,
        },
        headerShown: true,
        headerStyle: { backgroundColor: '#AFB8DA' },
        headerTitleAlign: 'left',
        headerTitle: () => (
          <View style={styles.headerContainer}>
            {/* 왼쪽: 내 페이지로 돌아가기 */}
            <TouchableOpacity onPress={() => router.push('/(main)')}>
              <Text style={styles.backText}>내 페이지로 돌아가기</Text>
            </TouchableOpacity>

            {/* 오른쪽: 가족 선택 토글 */}
            <View style={styles.rightHeader}>
              <TouchableOpacity onPress={handleToggleDropdown} style={styles.selectedFamilyButton}>
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
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="familyMedication"
        options={{
          title: '복약 관리',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'medkit' : 'medkit-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="familyHealth"
        options={{
          title: '건강 캘린더',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'heart' : 'heart-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: '100%',
  },
  backText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  rightHeader: {
    position: 'relative',
  },
  selectedFamilyButton: {
    backgroundColor: '#7686DB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  selectedFamilyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 10,
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
});
