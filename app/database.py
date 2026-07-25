from os import getenv
from pathlib import Path
from dotenv import load_dotenv
import pymssql

dotenv_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=dotenv_path)

# Dependencia para tus endpoints en FastAPI
def get_db():
    host = getenv("DB_SERVER")
    port = getenv("DB_PORT")
    user = getenv("DB_USER")
    password = getenv("DB_PASSWORD")
    database = getenv("DB_NAME")

    missing = [name for name, value in (
        ("DB_SERVER", host),
        ("DB_PORT", port),
        ("DB_USER", user),
        ("DB_PASSWORD", password),
        ("DB_NAME", database),
    ) if not value]
    if missing:
        raise RuntimeError(f"Missing DB config variables: {', '.join(missing)}")

    try:
        conn = pymssql.connect(
            host=host,
            port=int(port),
            user=user,
            password=password,
            database=database,
            login_timeout=10,
        )
    except Exception as exc:
        raise RuntimeError(f"Database connection failed: {exc}") from exc

    try:
        yield conn
    finally:
        conn.close()