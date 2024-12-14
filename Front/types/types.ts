// Medicine 인터페이스 수정 (새로운 필드 정의)
export interface Medicine {
  medicineName: string; // 약물 이름
  dosagePerIntake: number; // 1회 복용량
  frequencyIntake: number; // 복용 횟수
  durationIntake: number; // 복용 기간
  morningTimebox: boolean; // 기본값 false
  lunchTimebox: boolean; // 기본값 false
  dinnerTimebox: boolean; // 기본값 false
  beforeSleepTimebox: boolean; // 기본값 false
}

// PrescriptionInfo 인터페이스 수정
export interface PrescriptionInfo {
  userId: number; // 사용자 ID (추가)
  type: 'M' | 'NS'; // 처방 유형: 약물(M) 또는 건강보조제(NS) (추가)
  registrationDate: string; // 조제 날짜
  endDate: string; // 종료 날짜 (추가)
  medicineBagTitle: string; // 약봉투 제목 (추가)
  hidden: boolean; // 숨김 여부 (추가)
  morningTime: string; // 아침 알림 시간 (추가)
  lunchTime: string; // 점심 알림 시간 (추가)
  dinnerTime: string; // 저녁 알림 시간 (추가)
  beforeSleepTime: string; // 취침 전 알림 시간 (추가)
  medicineList: Medicine[]; // Medicine 배열로 정의
}
