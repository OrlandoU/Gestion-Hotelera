from typing import Optional
from pydantic import BaseModel

class UsuarioSchema(BaseModel):
    usuario_id: Optional[int] = None
    primer_nombre: Optional[str] = None
    segundo_nombre: Optional[str] = None
    primer_apellido: Optional[str] = None
    segundo_apellido: Optional[str] = None
    fecha_nacimiento: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    rol: Optional[str] = None
    password_hash: Optional[str] = None
    fecha_contrato: Optional[str] = None

    class Config:
        from_attributes = True
