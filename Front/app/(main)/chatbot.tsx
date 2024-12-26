import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { useFamilyContext } from '@/context/FamilyContext';
import { useRouter } from 'expo-router';
import { useUserData } from '@/context/UserDataContext';
import Markdown from 'react-native-markdown-display';

export default function ChatBotScreen() {
  const { familyMembers } = useFamilyContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useUserData();
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [activeButtonId, setActiveButtonId] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리
  const [quickButtons] = useState([
    { id: 1, label: '증상 경과' },
    { id: 2, label: '진료과 추천' },
    { id: 3, label: '복용 약 관련 질문' },
    { id: 4, label: '음식 관련 질문' },
  ]);
  const router = useRouter();
  const flatListRef = useRef(null); // FlatList 참조

  useEffect(() => {
    if (user) {
      setSelectedPerson({ userId: user.userId, familyRole: '나' }); 
    }
  }, [user]);

  useEffect(() => {
    if (selectedPerson) {
      setMessages([]);
      setActiveButtonId(null);
    }
  }, [selectedPerson]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
  
    const targetUserId = selectedPerson ? selectedPerson.userId : user.userId;
    const newMessage = { sender: 'user', text, id: Date.now(), targetUserId };
  
    setMessages([...messages, newMessage, { sender: 'bot', text: '답변을 생성중입니다. 잠시만 기다려주세요.', id: Date.now(), isLoading: true }]);
    setInputText(''); // 전송 즉시 입력창 초기화
    setIsLoading(true); // 로딩 상태 시작

    scrollToBottom(); // 새로운 메시지로 스크롤 이동
  
    try {
      const response = await fetch('https://www.parking-predict.site/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: targetUserId,
          body: text,
          buttonId: activeButtonId,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server Error:', errorText);
        setIsLoading(false);
        return;
      }
  
      const botReply = await response.json();
      setMessages((prevMessages) => {
        // "답변을 생성중입니다" 메시지를 새로운 메시지로 교체
        const updatedMessages = prevMessages.map((message) =>
          message.isLoading
            ? { sender: 'bot', text: botReply.response, id: Date.now() }
            : message
        );
        return updatedMessages;
      });
      scrollToBottom(); // 응답 수신 후 스크롤 이동
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

const handleQuickButtonPress = (button) => {
  let messageText = "";

  switch (button.id) {
    case 1: // 증상 경과
      messageText = "**증상 경과에 대해 궁금한 내용을 말해주세요.**\n- (질문 예) 이번달 혈당 기록을 보고, 경과가 어떤지 알려줘\n- (질문 예) 저번 당뇨병 처방약이랑 이번 처방약이 조금 다른데, 왜 바뀐거지?";
      break;
    case 2: // 진료과 추천
      messageText = "**어디가 불편하신가요?\n그에 맞는 적절한 진료과를 추천해드리겠습니다!** \n- (질문 예) 요즘 자꾸 어지러운데, 어느 병원에 가야해?\n- (질문 예) 발목 쪽이 부었는데, 간지럽진 않은데 따가워. 어느 병원에 방문해야 해?";
      break;
    case 3: // 복용 약 관련 질문
      messageText = "**현재 복용 중인 약에 대해 궁금한 점을 알려주세요!**\n- (질문 예) 요즘 자꾸 배가 아픈데 지금 먹고있는 약 중에, 이런 부작용이 있는 약이 있어?\n- (질문 예) 코로나에 걸려서 ‘팍스로비드’라는 약을 처방받았는데, 기존에 먹던 혈압약이랑 같이 먹어도 돼 ?";
      break;
    case 4: // 음식 관련 질문
      messageText = "**음식과 관련된 질문을 해주세요.**\n- (질문 예) 요즘 위가 아픈데, 위에 건강한 식단을 하루치 추천해줘\n- (질문 예) 오늘 <이거이거 > 먹었는데, GI 지수를 계산해줘!";
      break;
    default:
      messageText = "**관련 질문을 입력해주세요.**";
  }

  setActiveButtonId(button.id);
  setMessages((prevMessages) => [
    ...prevMessages,
    {
      sender: 'bot',
      text: messageText,
      id: Date.now(),
    },
  ]);
  scrollToBottom(); // 버튼 클릭 후 스크롤 이동
};

  const handleEndButtonPress = () => {
    setActiveButtonId(null);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'bot', text: '질문 세션이 종료되었습니다.', id: Date.now() },
    ]);
    scrollToBottom(); // 세션 종료 후 스크롤 이동
  };

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const familyListWithSelf = [
    { userId: user.userId, familyRole: '나' }, 
    ...familyMembers,
  ];

  return (
    <View style={styles.container}>
      {/* 헤더 영역 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(main)')}>
          <Image
            source={require('../../assets/images/back_white.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Image
          source={require('../../assets/images/chatbot.png')} 
          style={styles.headerImage}
        />
        <TouchableOpacity
          onPress={() => setShowDropdown(!showDropdown)}
          style={styles.selectedFamilyButton}
        >
          <Text style={styles.selectedFamilyText}>
            {selectedPerson ? selectedPerson.familyRole : '가족 선택'}
          </Text>
        </TouchableOpacity>
      </View>
      {showDropdown && (
        <View style={styles.dropdown}>
          <FlatList
            data={familyListWithSelf}
            keyExtractor={(item) => item.userId}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {                  
                  setSelectedPerson(item);
                  setShowDropdown(false);}}
              >
                <Text style={styles.dropdownText}>{item.familyRole}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* 대화 영역 */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === 'user' ? styles.userMessage : styles.botMessage,
            ]}
          >
            {item.isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#333" />
                <Text style={styles.loadingText}>{item.text}</Text>
              </View>
            ) : item.sender === 'bot' ? (
              <Markdown
                style={{
                  body: { color: '#fff', fontSize: 14, lineHeight: 23 }, // 봇 메시지의 텍스트 색상
                  heading1: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
                  heading2: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
                  link: { color: '#AFB8DA', textDecorationLine: 'underline' },
                }}
              >
                {item.text}
              </Markdown>
            ) : (
              <Text
                style={[
                  styles.messageText,
                  { color: item.sender === 'user' ? '#333' : '#fff' }, // 사용자 메시지와 봇 메시지의 색상 구분
                ]}
              >
                {item.text}
              </Text>
            )}
          </View>
        )}
        
        style={styles.chatArea}
        onContentSizeChange={scrollToBottom} // 컨텐츠 크기 변경 시 자동 스크롤
        onLayout={scrollToBottom} // 초기 레이아웃 시 자동 스크롤
        ListHeaderComponent={
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>반갑습니다. 무엇을 도와드릴까요?</Text>
            <View style={styles.quickButtons}>
              {quickButtons.map((button) => (
                <TouchableOpacity
                  key={button.id}
                  style={styles.quickButton}
                  onPress={() => handleQuickButtonPress(button)}
                >
                  <Text style={styles.quickButtonText}>{button.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
      />

      {/* 활성화된 버튼이 있을 경우 종료 버튼 표시 */}
      {activeButtonId && (
        <View style={styles.endButtonContainer}>
          <TouchableOpacity style={styles.endButton} onPress={handleEndButtonPress}>
            <Text style={styles.endButtonText}>질문 세션 종료하기</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 입력 영역 */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="질문을 입력하세요..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => handleSendMessage(inputText)} // 엔터 키 입력 처리
          returnKeyType="send" // 키보드 버튼 스타일을 "전송"으로 변경
        />
        <TouchableOpacity style={styles.sendButton} onPress={() => handleSendMessage(inputText)}>
          <Text style={styles.sendText}>전송</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#AFB8DA',
    paddingVertical: 10,
    paddingHorizontal: 15,
    position: 'relative',
    overflow: 'visible', 
  },
  headerImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain', 
  },
  backIcon: {
    width: 20, 
    height: 20, 
    marginRight: 8, 
  },
  backText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  selectedFamilyButton: {
    backgroundColor: '#7686DB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    width: 62,
  },
  selectedFamilyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: 54,
    right: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 100,
    width: 62,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAF6',
  },
  dropdownText: {
    fontSize: 14,
    color: '#595958',
    textAlign: 'center',
  },
  chatArea: {
    flex: 1,
    padding: 10,
  },
  welcomeContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  quickButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  quickButton: {
    backgroundColor: '#7686DB',
    padding: 8,
    margin: 5,
    borderRadius: 5,
  },
  quickButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  endButtonContainer: {
    padding: 10,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
  },
  endButton: {
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 5,
  },
  endButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  messageContainer: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#7686DB',
  },
  messageText: {
    // color: '#333',
    fontSize: 14,
    lineHeight: 18
  },
  inputArea: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 8,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#7686DB',
    padding: 8,
    borderRadius: 5,
  },
  sendText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#fff',
  },
});