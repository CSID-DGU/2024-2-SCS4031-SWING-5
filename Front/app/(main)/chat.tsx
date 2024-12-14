import React, { useEffect, useState, useRef } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { connectWebSocket, sendMessage } from '@/components/ChatWebsocket';

const ChatComponent = () => {
  const [roomId, setRoomId] = useState(''); // 현재 방 ID
  const [messages, setMessages] = useState([]); // 메시지 목록
  const [input, setInput] = useState(''); // 메시지 입력값
  const [stompClient, setStompClient] = useState(null); // WebSocket 클라이언트
  const [familyRole, setFamilyRole] = useState(null); // 사용자 역할
  const [userId, setUserId] = useState(null); // 사용자 ID
  const [enteredRoom, setEnteredRoom] = useState(false); // 방 입장 여부
  const flatListRef = useRef(null); // FlatList 참조

  // 사용자 데이터 가져오기
  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/userdata', {
        method: 'GET',
        credentials: 'include', // 인증 포함
      });
      if (response.ok) {
        const data = await response.json();
        setUserId(data.userId);
        setFamilyRole(data.familyRole);
        console.log('User data fetched:', data);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // 채팅방 조회 또는 생성
  const fetchOrCreateRoom = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/rooms?userId=${userId}`,
        { method: 'POST' }
      );
      if (response.ok) {
        const room = await response.json();
        setRoomId(room.roomId); // 기본 roomId 설정
        console.log('Room fetched or created:', room);
      } else {
        console.error('Failed to fetch or create room');
      }
    } catch (error) {
      console.error('Error fetching or creating room:', error);
    }
  };

  // 특정 방의 메시지 내역 가져오기
  const fetchMessages = async (roomId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/rooms/${roomId}/messages`,
        { method: 'GET' }
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data); // 기존 메시지 상태 초기화 후 추가
        console.log('Messages fetched:', data);
        // 메시지 가져온 후 아래로 스크롤
        flatListRef.current?.scrollToEnd({ animated: true });
      } else {
        console.error('Failed to fetch messages for room:', roomId);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // WebSocket 연결 설정
  useEffect(() => {
    if (!stompClient) {
      console.log('Setting up WebSocket connection...');
      const client = connectWebSocket(() => {
        console.log('WebSocket connected.');
      });
      setStompClient(client);
    }
  }, []);

  // WebSocket 구독 로직 및 메시지 내역 가져오기
  useEffect(() => {
    if (enteredRoom && roomId && stompClient && stompClient.connected) {
      console.log('WebSocket connected. Subscribing to room:', roomId);

      // 메시지 내역 가져오기
      fetchMessages(roomId);

      const subscription = stompClient.subscribe(`/sub/chat/room/${roomId}`, (message) => {
        if (message.body) {
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, JSON.parse(message.body)];
            // 메시지 추가 시 아래로 스크롤
            flatListRef.current?.scrollToEnd({ animated: true });
            return updatedMessages;
          });
        }
      });

      console.log(`Subscribed to room: ${roomId}`);

      // 구독 해제 로직
      return () => {
        subscription.unsubscribe();
        console.log(`Unsubscribed from room: ${roomId}`);
      };
    } else if (stompClient && !stompClient.connected) {
      // console.error('STOMP client is not connected yet.');
    }
  }, [roomId, stompClient, enteredRoom]);

  // 메시지 전송
  const handleSendMessage = () => {
    if (input.trim() && stompClient && stompClient.connected && familyRole) {
      const message = {
        type: 'TALK',
        roomId,
        sender: familyRole,
        message: input,
      };
      sendMessage(stompClient, message);
      setInput('');
    } else {
      console.error('Cannot send message: WebSocket not connected or familyRole unavailable.');
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userId) fetchOrCreateRoom();
  }, [userId]);

  // 방 입장 버튼 클릭 핸들러
  const handleEnterRoom = () => {
    if (roomId) {
      setEnteredRoom(true);
      console.log(`Entered room: ${roomId}`);
    }
  };

  // 메시지 렌더링 (카카오톡 스타일)
  const renderMessage = ({ item }) => {
    const isMine = item.sender === familyRole;
    const isSpecialSender = item.sender === 'WIN;C'; // 특정 발신자 조건 추가
    const messageStyle = [
      styles.messageContainer,
      isMine
        ? styles.myMessage
        : isSpecialSender
        ? styles.specialMessage // 특정 발신자의 스타일
        : styles.otherMessage,
    ];

    // 현재 시간 구하기
    const currentTime = new Date();

    // 시간 데이터 변환 (없을 경우 현재 시간 사용)
    const formattedDate = item.time
      ? new Date(item.time).toLocaleDateString()
      : currentTime.toLocaleDateString(); // 날짜가 없을 경우 현재 날짜
    const formattedTime = item.time
      ? new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // 시간이 없을 경우 현재 시간

    return (
      <View style={messageStyle}>
        <View style={styles.messageHeader}>
          <Text style={styles.sender}>{isMine ? '나' : item.sender}</Text>
          <Text style={styles.timestamp}>{`${formattedDate} ${formattedTime}`}</Text>
        </View>
        <Text style={styles.message}>{item.message}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {!enteredRoom && (
        <TouchableOpacity style={styles.reloadButton} onPress={handleEnterRoom}>
          <Text style={styles.reloadButtonText}>가족방 입장</Text>
        </TouchableOpacity>
      )}
      {enteredRoom && (
        <>
          <FlatList
            data={messages}
            ref={flatListRef} // FlatList 참조 추가
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })} // 크기 변경 시 스크롤
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="메시지를 입력하세요"
              onSubmitEditing={handleSendMessage} // 엔터를 누르면 메시지 전송
              returnKeyType="send" // 키보드의 엔터 키를 전송 키로 설정
            />
            <Button title="전송" onPress={handleSendMessage} />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  messagesList: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    maxWidth: '70%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#daf8cb',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
  },
  specialMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFEC5', // 특정 발신자의 메시지 배경색 (노란색)
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  sender: {
    fontSize: 12,
    color: '#888',
  },
  timestamp: {
    fontSize: 10,
    color: '#aaa',
    marginLeft: 5,
  },
  message: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 5,
  },
  reloadButton: {
    alignSelf: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  reloadButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ChatComponent;