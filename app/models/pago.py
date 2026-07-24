from pydantic import BaseModel
from datetime import date
from typing import Optional

class PagoSchema(BaseModel):
    fecha: Optional[date] = None
    metodo_pago: Optional[str] = None
    reserva_id: Optional[int] = None
