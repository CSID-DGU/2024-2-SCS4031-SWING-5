

# import requests
# from bs4 import BeautifulSoup
# import pandas as pd
# import time

# # 수집할 데이터를 저장할 리스트
# data = []

# # URL 기본 설정
# base_url = "https://nedrug.mfds.go.kr/searchDrug?sort=&sortOrder=false&searchYn=true&ExcelRowdata=&page={}&searchDivision=detail&itemName=&itemEngName=&entpName=&entpEngName=&ingrName1=&ingrName2=&ingrName3=&ingrEngName=&itemSeq=&stdrCodeName=&atcCodeName=&indutyClassCode=A0&sClassNo=&narcoticKindCode=&cancelCode=0&etcOtcCode=01&makeMaterialGb=&searchConEe=AND&eeDocData=&searchConUd=AND&udDocData=&searchConNb=AND&nbDocData=&startPermitDate=&endPermitDate="
# detail_base_url = "https://nedrug.mfds.go.kr"

# # 페이지 범위 설정 (필요에 따라 변경)
# start_page = 1
# end_page = 2  # 원하는 페이지 수

# # 메인 페이지 순회
# for page in range(start_page, end_page + 1):
#     url = base_url.format(page)
#     response = requests.get(url)
    
#     if response.status_code == 200:
#         soup = BeautifulSoup(response.text, 'html.parser')
        
#         # 의약품 목록 추출
#         rows = soup.select('table tbody tr')

#         for row in rows:
#             columns = row.find_all('td')
#             if columns:
#                 item_name = columns[0].text.strip()  # 메인 페이지의 의약품명
#                 manufacturer = columns[1].text.strip()  # 메인 페이지의 제조사
#                 permit_date = columns[2].text.strip()  # 메인 페이지의 허가일

#                 # 상세 페이지 링크 추출
#                 detail_link = row.select_one('a')['href']
                
#                 # 절대 URL 생성
#                 detail_url = detail_base_url + detail_link
#                 print("Detail URL:", detail_url)  # 상세 URL 확인
                
#                 # 상세 페이지로 이동하여 정보 추출
#                 detail_response = requests.get(detail_url)
#                 if detail_response.status_code == 200:
#                     detail_soup = BeautifulSoup(detail_response.text, 'html.parser')

#                     # 1. 제품명
#                     product_name = detail_soup.select_one('tr:has(th:contains("제품명")) td span')
#                     product_name_text = product_name.text.strip() if product_name else "N/A"

#                     # 2. 약 이미지 URL 추출
#                     image_tag = detail_soup.select_one('.dr_img .pc-img img')
#                     image_url = image_tag['src'] if image_tag else "N/A"
#                     if image_url != "N/A" and not image_url.startswith("http"):
#                         image_url = detail_base_url + image_url  # 상대 경로일 경우 절대 경로로 변환

#                     # 3. 업체명
#                     manufacturer = detail_soup.select_one('tr:has(th:contains("업체명")) td button')
#                     manufacturer_text = manufacturer.text.strip() if manufacturer else "N/A"

#                     # 4. 전문/일반
#                     general_type = detail_soup.select_one('tr:has(th:contains("전문/일반")) td')
#                     general_type_text = general_type.text.strip() if general_type else "N/A"

#                     # 5. 품목기준코드
#                     item_code = detail_soup.select_one('tr:has(th:contains("품목기준코드")) td')
#                     item_code_text = item_code.text.strip() if item_code else "N/A"

#                     # 6. 효능효과
#                     efficacy = detail_soup.select_one('#_ee_doc p')
#                     efficacy_text = efficacy.text.strip() if efficacy else "N/A"

#                     # 7. 용법용량
#                     usage = detail_soup.select_one('#_ud_doc p')
#                     usage_text = usage.text.strip() if usage else "N/A"

#                     # 8. 사용상 주의사항 - 모든 <p>와 <div> 태그의 텍스트를 합침
#                     precautions_section = detail_soup.select('#_nb_doc p, #_nb_doc div')
#                     precautions_text = "\n".join([element.text.strip() for element in precautions_section])

#                     # 데이터 저장
#                     data.append({
#                         "제품명": product_name_text,
#                         "약 이미지": image_url,
#                         "업체명": manufacturer_text,
#                         "전문/일반": general_type_text,
#                         "품목기준코드": item_code_text,
#                         "효능": efficacy_text,
#                         "용법": usage_text,
#                         "사용상 주의사항": precautions_text
#                     })
                    
#                     print(f"제품명: {product_name_text}, 이미지 URL: {image_url}, 업체명: {manufacturer_text}, 전문/일반: {general_type_text}")
#                     print(f"품목기준코드: {item_code_text}, 효능: {efficacy_text}, 용법: {usage_text}, 사용상 주의사항: {precautions_text}")
#                 else:
#                     print(f"URL 접속 실패: {detail_url}")
                
#                 time.sleep(1)  # 예의로 잠시 대기

#     else:
#         print(f"Page {page}에 접속 실패")

# # 결과를 DataFrame으로 변환하고 CSV 파일로 저장
# df = pd.DataFrame(data)
# df.to_csv("drug_data_complete.csv", index=False, encoding='utf-8-sig')
# print("모든 데이터 수집 완료 및 저장")
##################################################################################################

import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import base64
import os
import random

# 수집할 데이터를 저장할 리스트
data = []

# URL 기본 설정
#base_url = "https://nedrug.mfds.go.kr/searchDrug?sort=&sortOrder=false&searchYn=true&ExcelRowdata=&page={}&searchDivision=detail&itemName=&itemEngName=&entpName=&entpEngName=&ingrName1=&ingrName2=&ingrName3=&ingrEngName=&itemSeq=&stdrCodeName=&atcCodeName=&indutyClassCode=A0&sClassNo=&narcoticKindCode=&cancelCode=0&etcOtcCode=01&makeMaterialGb=&searchConEe=AND&eeDocData=&searchConUd=AND&udDocData=&searchConNb=AND&nbDocData=&startPermitDate=&endPermitDate="
base_url = "https://nedrug.mfds.go.kr/searchDrug?sort=&sortOrder=false&searchYn=&ExcelRowdata=&page={}&searchDivision=detail&itemName=&itemEngName=&entpName=&entpEngName=&ingrName1=&ingrName2=&ingrName3=&ingrEngName=&itemSeq=&stdrCodeName=&atcCodeName=&indutyClassCode=A0&sClassNo=&narcoticKindCode=&cancelCode=0&etcOtcCode=&makeMaterialGb=&searchConEe=AND&eeDocData=&searchConUd=AND&udDocData=&searchConNb=AND&nbDocData=&startPermitDate=&endPermitDate="

detail_base_url = "https://nedrug.mfds.go.kr"

# 페이지 범위 설정
start_page = 2351
end_page = 2470  # 원하는 페이지 수

# 이미지 저장 경로 설정
image_folder = "drug_images"
os.makedirs(image_folder, exist_ok=True)

# 요청 재시도 함수
def fetch_with_retry(url, retries=5, delay=5):
    for attempt in range(retries):
        try:
            response = requests.get(url, timeout=10)  # 10초 타임아웃 설정
            response.raise_for_status()  # HTTP 에러 발생 시 예외 처리
            return response
        except (requests.exceptions.ChunkedEncodingError, 
                requests.exceptions.ConnectionError, 
                requests.exceptions.Timeout) as e:
            print(f"Error fetching {url}: {e}. Retrying {attempt + 1}/{retries}...")
            time.sleep(delay)
    print(f"Failed to fetch {url} after {retries} retries.")
    return None

# 메인 페이지 순회
for page in range(start_page, end_page + 1):
    url = base_url.format(page)
    response = requests.get(url)
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 의약품 목록 추출
        rows = soup.select('table tbody tr')

        for row in rows:
            columns = row.find_all('td')
            if columns:
                item_name = columns[0].text.strip()  # 메인 페이지의 의약품명
                manufacturer = columns[1].text.strip()  # 메인 페이지의 제조사
                permit_date = columns[2].text.strip()  # 메인 페이지의 허가일

                # 상세 페이지 링크 추출
                detail_link = row.select_one('a')['href']
                
                # 절대 URL 생성
                detail_url = detail_base_url + detail_link
                print("Detail URL:", detail_url)
                
                # 상세 페이지로 이동하여 정보 추출
                detail_response = requests.get(detail_url)
                if detail_response.status_code == 200:
                    detail_soup = BeautifulSoup(detail_response.text, 'html.parser')

                    # 1. 제품명
                    product_name = detail_soup.select_one('tr:has(th:contains("제품명")) td span')
                    product_name_text = product_name.text.strip() if product_name else "N/A"

                    # 2. 약 이미지 URL 추출 및 저장
                    image_tag = detail_soup.select_one('.dr_img .pc-img img')
                    image_url = "N/A"
                    if image_tag:
                        src = image_tag['src']
                        if src.startswith("data:image"):  # Base64 인코딩된 이미지
                            image_data = src.split(",")[1]
                            image_bytes = base64.b64decode(image_data)
                            image_path = os.path.join(image_folder, f"{item_name}.jpg")
                            with open(image_path, "wb") as img_file:
                                img_file.write(image_bytes)
                            image_url = image_path
                        else:
                            if not src.startswith("http"):
                                src = detail_base_url + src
                            image_url = src

                    # 3. 업체명
                    manufacturer = detail_soup.select_one('tr:has(th:contains("업체명")) td button')
                    manufacturer_text = manufacturer.text.strip() if manufacturer else "N/A"

                    # 4. 전문/일반
                    general_type = detail_soup.select_one('tr:has(th:contains("전문/일반")) td')
                    general_type_text = general_type.text.strip() if general_type else "N/A"

                    # 5. 품목기준코드
                    item_code = detail_soup.select_one('tr:has(th:contains("품목기준코드")) td')
                    item_code_text = item_code.text.strip() if item_code else "N/A"

                    # 6. 효능효과
                    efficacy = detail_soup.select_one('#_ee_doc p')
                    efficacy_text = efficacy.text.strip() if efficacy else "N/A"

                    # 7. 용법용량
                    usage = detail_soup.select_one('#_ud_doc p')
                    usage_text = usage.text.strip() if usage else "N/A"

                    # 8. 사용상 주의사항 - 모든 <p>와 <div> 태그의 텍스트를 합침
                    precautions_section = detail_soup.select('#_nb_doc p, #_nb_doc div')
                    precautions_text = "\n".join([element.text.strip() for element in precautions_section])

                    # 데이터 저장
                    data.append({
                        "제품명": product_name_text,
                        "약 이미지": image_url,
                        "업체명": manufacturer_text,
                        "전문/일반": general_type_text,
                        "품목기준코드": item_code_text,
                        "효능": efficacy_text,
                        "용법": usage_text,
                        "사용상 주의사항": precautions_text
                    })
                    
                    print(f"제품명: {product_name_text}, 이미지 URL: {image_url}, 업체명: {manufacturer_text}, 전문/일반: {general_type_text}")
                    print(f"품목기준코드: {item_code_text}, 효능: {efficacy_text}, 용법: {usage_text}, 사용상 주의사항: {precautions_text}")
                else:
                    print(f"URL 접속 실패: {detail_url}")
                
                time.sleep(1)

    else:
        print(f"Page {page}에 접속 실패")

# 결과를 DataFrame으로 변환하고 CSV 파일로 저장
df = pd.DataFrame(data)
df.to_csv("drug_data_complete_10.csv", index=False, encoding='utf-8-sig')
print("모든 데이터 수집 완료 및 저장")

# 크롤링된 전체 제품 수 출력
print(f"크롤링된 전체 제품 수: {len(data)}")