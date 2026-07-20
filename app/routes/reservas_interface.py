from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ReservaSchema(BaseModel):
    reserva_id: Optional[int] = None
    huesped_id: Optional[int] = None
    nombres: Optional[str] = None
    apellidos: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    dni: Optional[str] = None
    espacio_id: Optional[int] = None
    numero_reserva: Optional[str] = None
    numero_espacio: Optional[str] = None
    numero_huespedes: Optional[int] = None
    fecha_entrada: Optional[str] = None  # Pydantic convierte strings ISO a datetime automáticamente
    fecha_salida: Optional[str] = None
    cantidad_unidades: Optional[int] = None
    reserva_estado: Optional[str] = None
    tarifa: Optional[float] = None

    class Config:
        # Esto permite que el modelo lea datos aunque sean objetos ORM (como SQLAlchemy)
        from_attributes = True 