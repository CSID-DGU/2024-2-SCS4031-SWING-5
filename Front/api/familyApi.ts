// api/family.ts

export interface FamilyMember {
    userId: string;
    name: string;
    familyRole: string;
  }
  
  // 더미 데이터를 반환하는 함수
  export const fetchFamilyMembers = async (userId: string): Promise<FamilyMember[]> => {
    try{
    const response = await fetch(`http://localhost:8080/api/family/${userId}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch family members: ${response.status}`);
    }

    // JSON 데이터 파싱
    const data: FamilyMember[] = await response.json();

    // 반환된 데이터를 그대로 반환
    return data;
  } catch (error) {
    console.error('Error fetching family members:', error);

    // 요청 실패 시 빈 배열 반환
    return [];
    
  };
};
