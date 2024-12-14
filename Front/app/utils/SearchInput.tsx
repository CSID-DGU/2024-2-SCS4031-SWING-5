import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // expo-router import
import { Ionicons } from '@expo/vector-icons'; // 아이콘 사용

export default function SearchInput() {
  const [inputValue, setInputValue] = React.useState('');
  const router = useRouter(); // expo-router 훅 사용

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('../(main)/registerOptions')} // 특정 페이지로 이동
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.header}>직접 입력</Text>
      <Text style={styles.subHeader}>약의 이름이나 정보를 입력하고 검색하세요.</Text>
      
      <TextInput
        style={styles.input}
        placeholder="약 정보를 입력하세요..."
        value={inputValue}
        onChangeText={setInputValue}
      />
      
      <Button title="검색" onPress={() => alert(`입력한 값: ${inputValue}`)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 40, // 상단에 여백을 추가하여 '뒤로가기' 버튼과 겹치지 않게 조정
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});
