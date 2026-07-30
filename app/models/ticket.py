from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class TicketSchema(BaseModel):
    espacio_id: int
    reserva_id: int | None = None
    usuario_id: int
    responsable_id: int | None = None
    nombre_responsable: str | None = None
    telefono_responsable: str | None = None
    titulo: str
    descripcion: str
    estado: str = 'Pendiente'
    fecha_creacion: Optional[str] = None
    fecha_limite: Optional[str] = None
    tipo: Optional[str] = None
    prioridad: Optional[str] = None
    ticket_id: Optional[int] = None

class ComentarioSchema(BaseModel):
    usuario_id: int
    ticket_id: int
    contenido: str
    fecha_creacion: Optional[datetime] = None

class TicketUpdate(BaseModel):
    estado: str