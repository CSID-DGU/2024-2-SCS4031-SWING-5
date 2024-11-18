import pandas as pd

# 기존의 CSV 파일 로드
df = pd.read_csv("drug_data_complete_1.csv", encoding='utf-8-sig')

# 총 제품 수 출력
print(f"크롤링된 전체 제품 수: {len(df)}")

# HTML 파일로 변환하는 함수
def save_to_html(df, output_file):
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("<html><head><meta charset='utf-8'><title>약물 데이터 확인</title></head><body>")
        f.write("<h1>크롤링한 약물 데이터</h1>")
        f.write("<table border='1' style='border-collapse: collapse; width: 100%;'>")
        
        # 테이블 헤더 추가
        f.write("<tr>")
        for column in df.columns:
            f.write(f"<th>{column}</th>")
        f.write("</tr>")

        # 각 행을 HTML 테이블로 변환
        for _, row in df.iterrows():
            f.write("<tr>")
            for col, value in row.items():
                if col == "약 이미지" and value != "N/A":
                    # 이미지 열은 img 태그로 삽입
                    f.write(f"<td><img src='{value}' width='100'></td>")
                else:
                    f.write(f"<td>{value}</td>")
            f.write("</tr>")
        
        f.write("</table>")
        f.write("</body></html>")

# HTML 파일로 저장
save_to_html(df, "drug_data_complete_1.html")

print("HTML 파일 생성 완료: drug_data_complete.html")

