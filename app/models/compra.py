from datetime import datetime
from typing import List

from pydantic import BaseModel


class DetalleCompraSchema(BaseModel):
    producto_id: int
    cantidad: int
    costo_unitario: float


class CompraCreateSchema(BaseModel):
    proveedor_id: int
    numero_factura_proveedor: str
    fecha_compra: datetime
    detalles: List[DetalleCompraSchema]
