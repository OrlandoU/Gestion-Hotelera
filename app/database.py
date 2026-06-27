from os import getenv
from dotenv import load_dotenv
import pymssql

load_dotenv()

# Dependencia para tus endpoints en FastAPI
def get_db():
    # pymssql se conecta directamente usando parámetros con nombre
    conn = pymssql.connect(
        host=getenv('DB_SERVER'),
        port=getenv('DB_PORT'),
        user=getenv('DB_USER'),
        password=getenv('DB_PASSWORD'),
        database=getenv('DB_NAME')
    )
    try:
        yield conn
    finally:
        conn.close()