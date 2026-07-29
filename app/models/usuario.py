from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class UsuarioSchema(BaseModel):
    usuario_id: Optional[int] = None
    primer_nombre: str
    segundo_nombre: str
    primer_apellido: str
    segundo_apellido: str
    fecha_nacimiento: date
    email: EmailStr
    password_hash: str
    telefono: str
    created_at: Optional[datetime] = None


class UsuarioCreateSchema(BaseModel):
    primer_nombre: str
    segundo_nombre: str
    primer_apellido: str
    segundo_apellido: str
    fecha_nacimiento: date
    email: EmailStr
    telefono: str
    password: str


class UsuarioLoginSchema(BaseModel):
    email: EmailStr
    password: str


class UsuarioOutSchema(BaseModel):
    usuario_id: int
    primer_nombre: str
    segundo_nombre: str
    primer_apellido: str
    segundo_apellido: str
    fecha_nacimiento: date
    email: EmailStr
