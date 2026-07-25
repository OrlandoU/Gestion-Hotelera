from datetime import datetime
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
    fecha_creacion: datetime = None
    fecha_limite: datetime = None
    
class ComentarioSchema(BaseModel):
    usuario_id: int
    numero_ticket: str
    contenido: str
    fecha_creacion: datetime = None
