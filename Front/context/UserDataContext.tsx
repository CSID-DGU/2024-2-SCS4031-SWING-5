import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 로그인 상태와 유저 데이터 초기화
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userName = await AsyncStorage.getItem('userName');
        const userId = await AsyncStorage.getItem('userId'); 
        if (userName && userId) {
          const familyRole = await AsyncStorage.getItem('familyRole');
          setUser({ userId: parseInt(userId, 10), name: userName, familyRole });
        }
      } catch (error) {
        console.error('Error initializing user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeUser();
  }, []);

  // 유저 정보 업데이트 (로그인 후 호출됨)
  const updateUser = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem('userName', userData.name);
    await AsyncStorage.setItem('userId', String(userData.userId)); 
    await AsyncStorage.setItem('familyRole', userData.familyRole || '');
  };


  // 로그아웃 함수
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('userName');
    await AsyncStorage.removeItem('userId'); 
    await AsyncStorage.removeItem('familyRole');
  };

  return (
    <UserDataContext.Provider value={{ user, updateUser, logout, isLoading }}>
      {children}
    </UserDataContext.Provider>
  );
};

// 커스텀 훅
export const useUserData = () => useContext(UserDataContext);
