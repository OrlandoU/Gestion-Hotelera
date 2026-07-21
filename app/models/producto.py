from pydantic import BaseModel

class Productos(BaseModel):
    proveedor_id: str
    categoria: str
    nombre: str
    precio: str
    cantidad: str 
    unidad: str
    fecha_vencimiento: str
    estado_activo: str