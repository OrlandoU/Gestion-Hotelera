from pydantic import BaseModel

class Espacio(BaseModel):
    numero_espacio: str
    categoria: str
    tipo: str
    estado: str
    espacio_padre_id: str
    estado_activo: bool
    capacidad_huespedes: int