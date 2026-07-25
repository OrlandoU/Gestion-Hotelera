from datetime import datetime
from typing import List

from pydantic import BaseModel

class MantenimientoCreateSchema(BaseModel):
    fecha_inicio: datetime
    fecha_final: datetime
    tipo: str
    usuario_id: int

    class Config:
        from_attributes = True

class MantenimientoSchema(BaseModel):
    mantenimiento_id: int | None = None     
    usuario_id: int
    responsable_id: int | None = None
    nombre_responsable: str | None = None
    telefono_responsable: str | None = None
    tipo: str
    prioridad: str
    estado: str
    fecha_inicio: datetime | str | None = None
    fecha_final: datetime | str | None = None
    espacio_id: int
    descripcion: str

    class Config:
        from_attributes = True