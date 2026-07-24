from pydantic import BaseModel
from datetime import date
from typing import Optional

class PagoSchema(BaseModel):
    reserva_id: Optional[int] = None
    metodo_pago: Optional[str] = None
    fecha: Optional[date] = None
