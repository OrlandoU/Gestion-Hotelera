from pydantic import BaseModel

class Huesped(BaseModel):
    nombres: str
    apellidos: str
    telefono: str
    email: str
    dni: str