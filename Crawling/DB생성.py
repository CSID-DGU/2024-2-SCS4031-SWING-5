import pandas as pd
from sqlalchemy import create_engine

# CSV 파일 로드
df = pd.read_csv("drug_data_complete_1.csv", encoding='utf-8-sig')

# MySQL 연결 설정
db_connection_str = 'mysql+pymysql://root:k19921127@localhost/drug_db'
db_connection = create_engine(db_connection_str)

# 데이터베이스에 테이블 저장
df.to_sql(name='drug_info', con=db_connection, if_exists='replace', index=False)

print("데이터가 MySQL에 성공적으로 저장되었습니다.")
