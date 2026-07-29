from datetime import datetime, timedelta
from os import getenv
from typing import Optional

import bcrypt  # <-- Usamos bcrypt directamente
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from app.database import get_db
from app.repositories.usuario import UsuarioRepository

SECRET_KEY = getenv("JWT_SECRET_KEY", "Hola123456.")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "480"))

oauth2_scheme = HTTPBearer()

# --- ELIMINAMOS CryptContext y usamos funciones nativas de bcrypt ---

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"), 
            hashed_password.encode("utf-8")
        )
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed_bytes = bcrypt.hashpw(pwd_bytes, salt)
    return hashed_bytes.decode("utf-8")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as error:
        raise ValueError(f"Token inválido: {error}")


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(oauth2_scheme),
    db = Depends(get_db),
):
    token = credentials.credentials
    try:
        payload = decode_access_token(token)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido o expirado")

    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")

    user_repo = UsuarioRepository(db)
    user = user_repo.obtener_por_email(email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario no encontrado")

    return user