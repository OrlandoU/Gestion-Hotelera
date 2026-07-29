from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class IncidenteCreateSchema(BaseModel):
    usuario_id: int
    tipo: str
    detalles: str
    causas: Optional[str] = None
    recomendaciones: Optional[str] = None
    fecha: datetime
