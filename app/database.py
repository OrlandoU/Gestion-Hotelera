from os import getenv
from dotenv import load_dotenv
from mssql_python import connect

load_dotenv()

# Construyes tu cadena de conexión nativa para mssql-python
# Nota: Este driver acepta los parámetros estándar de las cadenas de conexión de Microsoft
conn_str = (
    f"Server={getenv('DB_SERVER')},{getenv('DB_PORT')};"
    f"Database={getenv('DB_NAME')};"
    f"UID={getenv('DB_USER')};"
    f"PWD={getenv('DB_PASSWORD')};"
    f"Encrypt={getenv('DB_ENCRYPT')};"
    f"TrustServerCertificate={getenv('DB_TRUST_CERT')};"
)

# Ya no necesitas SQLAlchemy ni codificar la URL con urllib. 
# El pool de conexiones viene integrado y activo por defecto en mssql-python.

# Dependencia vital para tus endpoints en FastAPI (Dependency Injection)
def get_db():
    # Abre una conexión eficiente desde el pool nativo
    conn = connect(conn_str)
    try:
        yield conn
    finally:
        # Al terminar el request, se cierra la sesión limpiamente
        conn.close()