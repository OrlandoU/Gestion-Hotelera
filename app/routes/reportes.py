from fastapi import APIRouter

# Initialize router with a prefix and documentation tag
router = APIRouter(
    prefix="/reportes",
    tags=["reportes"]
)

@router.get("")
async def read_reportes():
    return {"Hello": "World"}

@router.get("/{item_id}")
async def read_reporte(item_id: int):
    return {"item_id": item_id, "name": "Specific Item"}

# REPORTES 
@router.get("/clientes")
async def read_clientes():
    return {"Hello": "World"}

@router.get("reservaciones-diarias")
async def read_reservaciones_diarias():
    return {"Hello": "World"}

@router.get("estado-de-habitaciones")
async def read_estado_de_habitaciones():
    return {"Hello": "World"}

@router.get("actividades-mantenimientos-diarias")
async def read_actividades_mantenimientos_diarias():
    return {"Hello": "World"}

@router.get("pagos-realizados")
async def read_pagos_realizados():
    return {"Hello": "World"}

@router.get("consumo-stock-semanal")
async def read_consumo_stock_semanal():
    return {"Hello": "World"}

@router.get("estadistica-ocupacion-mensual")
async def read_estadistica_ocupacion_mensual():
    return {"Hello": "World"}

@router.get("ingresos-tipo-habitacion")
async def read_ingresos_tipo_habitacion():
    return {"Hello": "World"}

@router.get("consumo-amenidades-mensual")
async def read_consumo_amenidades_mensual():
    return {"Hello": "World"}