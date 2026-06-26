from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from os import getenv
from dotenv import load_dotenv
import urllib

load_dotenv()

# Construyes tu cadena de conexión usando tus variables de entorno
conn_str = (
    f"Driver={getenv('DB_DRIVER')};"
    f"Server={getenv('DB_SERVER')},{getenv('DB_PORT')};"
    f"Database={getenv('DB_NAME')};"
    f"UID={getenv('DB_USER')};"
    f"PWD={getenv('DB_PASSWORD')};"
    f"Encrypt={getenv('DB_ENCRYPT')};"
    f"TrustServerCertificate={getenv('DB_TRUST_CERT')};"
)

# SQLAlchemy necesita un formato específico (URL) para mssql+pyodbc
connection_url = f"mssql+pyodbc:///?odbc_connect={urllib.parse.quote(conn_str)}"

engine = create_engine(connection_url)

# SessionLocal asegura que cada request tenga su propia instancia de conexión aislada
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependencia vital para tus endpoints (Dependency Injection)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() # Se asegura de cerrar la conexión al terminar el request