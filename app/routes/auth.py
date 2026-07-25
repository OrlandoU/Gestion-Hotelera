from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.database import get_db
from app.models.usuario import UsuarioCreateSchema, UsuarioLoginSchema, UsuarioOutSchema
from app.repositories.usuario import UsuarioRepository
from app.utils.security import create_access_token, get_password_hash, verify_password


class AuthResponseSchema(BaseModel):
    access_token: str
    token_type: str
    usuario_id: int
    nombre: str
    email: EmailStr


def get_usuario_repo(db = Depends(get_db)):
    return UsuarioRepository(db)


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=AuthResponseSchema, status_code=status.HTTP_201_CREATED)
async def signup(user: UsuarioCreateSchema, repo: UsuarioRepository = Depends(get_usuario_repo)):
    existing_user = repo.obtener_por_email(user.email)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="El correo electrónico ya está registrado.")

    hashed_password = get_password_hash(user.password)
    usuario_id = repo.crear(user, hashed_password)
    access_token = create_access_token(
        data={"sub": user.email, "usuario_id": usuario_id},
        expires_delta=timedelta(hours=8),
    )

    nombre_completo = " ".join(filter(None, [
        user.primer_nombre,
        user.segundo_nombre,
        user.primer_apellido,
        user.segundo_apellido,
    ])).strip()

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "usuario_id": usuario_id,
        "nombre": nombre_completo,
        "email": user.email,
    }


@router.post("/login", response_model=AuthResponseSchema)
async def login(credentials: UsuarioLoginSchema, repo: UsuarioRepository = Depends(get_usuario_repo)):
    user = repo.obtener_por_email(credentials.email)
    if not user or not verify_password(credentials.password, user.get("password_hash", "")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Correo o contraseña incorrectos.")

    access_token = create_access_token(
        data={"sub": user["email"], "usuario_id": user["usuario_id"]},
        expires_delta=timedelta(hours=8),
    )

    const_nombre = " ".join(filter(None, [
        user.get("primer_nombre"),
        user.get("segundo_nombre"),
        user.get("primer_apellido"),
        user.get("segundo_apellido"),
    ])).strip()

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "usuario_id": user["usuario_id"],
        "nombre": const_nombre or user["email"],
        "email": user["email"],
    }
