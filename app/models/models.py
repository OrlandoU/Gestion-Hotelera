from pydantic import BaseModel

class Huesped(BaseModel):
    nombres: str
    apellidos: str
    telefono: str
    email: str
    dni: str

class Espacio(BaseModel):
    numero_espacio: str
    categoria: str
    tipo: str
    estado: str
    espacio_padre_id: str
    estado_activo: bool
    capacidad_huespedes: int

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

class Productos(BaseModel):
    proveedor_id: str
    categoria: str
    nombre: str
    precio: str
    cantidad: str 
    unidad: str
    fecha_vencimiento: str
    estado_activo: str

# class Mantenimiento(BaseModel):
#     espacio_id: str
#     usuario_id: str
#     responsable_id: str
#     nombre_responsable: str
