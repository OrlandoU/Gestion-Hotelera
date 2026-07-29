from typing import Optional

from pydantic import BaseModel

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
    fecha_entrada: Optional[str] = None
    fecha_salida: Optional[str] = None
    cantidad_unidades: Optional[int] = None
    reserva_estado: Optional[str] = None
    tarifa: Optional[float] = None

    class Config:
        from_attributes = True

class Reservas(BaseModel):
    huesped_id: str
    espacio_id: str
    tarifa_id: str
    numero_reserva: str
    estado: str
    fecha_entrada: str
    fecha_salida: str
    cantidad_unidades: str
    precio_unidades: str
    total_pagar: str
    fecha_creacion: str