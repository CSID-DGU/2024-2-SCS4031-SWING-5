import React, { createContext, useState, useContext } from 'react';

interface FamilyMember {
  userId: string;
  name: string;
  familyRole: string; 
}

interface FamilyContextType {
  familyMembers: FamilyMember[]; // 모든 가족 구성원 리스트
  setFamilyMembers: (members: FamilyMember[]) => void; // 가족 구성원 업데이트 함수
  selectedFamily: FamilyMember | null; // 현재 선택된 가족 구성원
  setSelectedFamily: (member: FamilyMember) => void; // 선택된 가족 구성원 업데이트 함수
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const FamilyProvider: React.FC = ({ children }) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<FamilyMember | null>(null); // 선택된 가족 상태 추가

  return (
    <FamilyContext.Provider value={{ familyMembers, setFamilyMembers, selectedFamily, setSelectedFamily }}>
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamilyContext = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamilyContext must be used within a FamilyProvider');
  }
  return context;
};
