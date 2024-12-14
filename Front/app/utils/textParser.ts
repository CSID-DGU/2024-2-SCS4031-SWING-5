import { PrescriptionInfo, Medicine } from '../../types/types';

export const parseOCRText = (text: string): PrescriptionInfo => {
  const medicines: Medicine[] = [];
  let registrationDate = "";

  try {
    // 텍스트 정제
    text = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ');

    // 조제 날짜 추출
    const dateMatches = text.match(/\b(\d{4}-\d{2}-\d{2})\b/g);
    const nextVisitDateMatch = text.match(/다음내방일\s*[\n\s]*(\d{4}-\d{2}-\d{2})/);
    const nextVisitDate = nextVisitDateMatch ? nextVisitDateMatch[1] : "";
    if (dateMatches) {
      registrationDate = dateMatches.find(date => date !== nextVisitDate) || "";
    }

    // 약물명 및 복약 정보 패턴 설정
    const medicinePattern = /([가-힣A-Za-z]+(?:정|캡슐|포|시럽)[0-9]*(?:mg|g)?)(.*?)((?=[가-힣A-Za-z]+(?:정|캡슐|포|시럽))|$)/g;

    // 약물 블록 추출
    let match;
    while ((match = medicinePattern.exec(text)) !== null) {
      const [_, name, details] = match;

      // "환자정", "병원정", "코팅정" 제외
      if (name === "환자정" || name === "병원정" || name === "필름코팅정" || name === "루미늄호일포") continue;

      const medicine: Medicine = {
        medicineName: name.trim(),
        dosagePerIntake: 0, // 기본값
        frequencyIntake: 0, // 기본값
        durationIntake: 0, // 기본값
        morningTimebox: false, // 기본값
        lunchTimebox: false, // 기본값
        dinnerTimebox: false, // 기본값
        beforeSleepTimebox: false, // 기본값
      };

      // 세부 정보에서 투약량, 횟수, 기간 추출
      const dosageMatch = details.match(/(\d+)(정|캡슐|포|mL)씩/);
      if (dosageMatch) {
        medicine.dosagePerIntake = parseInt(dosageMatch[1], 10); // 숫자만 추출
      }

      const frequencyMatch = details.match(/(\d+)회/);
      if (frequencyMatch) {
        medicine.frequencyIntake = parseInt(frequencyMatch[1], 10); // 숫자만 추출
      }

      const durationMatch = details.match(/(\d+)(일분|일치)/);
      if (durationMatch) {
        medicine.durationIntake = parseInt(durationMatch[1], 10); // 숫자만 추출
      }

      medicines.push(medicine);
    }

    const result: PrescriptionInfo = {
      registrationDate: registrationDate,
      medicineList: medicines,
    };
    console.log("변환된 결과:", JSON.stringify(result, null, 2));

    return result;

  } catch (error) {
    console.error("텍스트 분석 중 오류 발생:", error);
    return { registrationDate: "", medicineList: [] };
  }
};
