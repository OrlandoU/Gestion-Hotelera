from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from datetime import date

# Initialize router with a prefix and documentation tag
router = APIRouter(
    prefix="/reportes",
    tags=["reportes"]
)

@router.get("")
async def read_reportes():
    return {"Hello": "World"}

# REPORTES 
@router.get("/clientes")
async def read_huespedes_frecuentes(db: Session = Depends(get_db)):
    try:
        # Ejemplo ejecutando una consulta SQL cruda
        result = db.execute(text("EXEC sp_clientes_frecuentes"))
        # Convertimos a diccionario
        usuarios = [dict(row._mapping) for row in result]
        return usuarios
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al conectar con SQL Server: {str(e)}")

@router.get("/reservaciones-diarias")
async def read_reporte_reservaciones_diarias(
    fecha: date = Query(default=date.today(), description="Formato YYYY-MM-DD"),
    db: Session = Depends(get_db)
):
    try:
        # Usamos :fecha como parámetro para el SP
        query = text("EXEC sp_reporte_reservaciones_diarias :fecha")
        result = db.execute(query, {"fecha": fecha})
        
        # Convertimos a lista de diccionarios
        return [dict(row._mapping) for row in result]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")

@router.get("/estado-de-habitaciones")
async def read_reporte_habitaciones(
    db: Session = Depends(get_db)
):
    try:
        # Usamos :fecha como parámetro para el SP
        result = db.execute(text("SELECT * FROM vw_reporte_habitaciones"))
        espacios = [dict(row._mapping) for row in result]
        
        # Convertimos a lista de diccionarios
        return espacios
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")

@router.get("/actividades-mantenimientos-diarios")
async def read_reporte_actividades_mantenimiento(
    tipo: str = Query(default=None, description="Tipo de actividad"),
    usuario_id: int = Query(default=None, description="ID del usuario"),
    fecha_inicio: date = Query(default=None, description="Formato YYYY-MM-DD"),
    db: Session = Depends(get_db)
):
    try:
        query = text("EXEC sp_reporte_actividades_mantenimiento :tipo, :usuario_id, :fecha_inicio")
        result = db.execute(query, {"tipo": tipo, "usuario_id": usuario_id, "fecha_inicio": fecha_inicio})
        actividades = [dict(row._mapping) for row in result]
        return actividades
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")

@router.get("/pagos-realizados")
async def read_pagos_realizados(
    fecha: date = Query(default=None, description="Formato YYYY-MM-DD"),
    db: Session = Depends(get_db)
):
    try: 
        query = text("EXEC sp_listar_pagos_realizados :fecha")
        result = db.execute(query, {"fecha": fecha})
        pagos = [dict(row._mapping) for row in result]
        return pagos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")

@router.get("/consumo-stock-semanal")
async def read_consumo_stock_semanal(
    fecha: None,
    db: Session = Depends(get_db)
):
    try:
        query = text("EXEC sp_consumo_stock_semanal :fecha")
        result = db.execute(query, {"fecha": fecha})
        consumos = [dict(row._mapping) for row in result]
        return consumos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")

@router.get("/estadistica-ocupacion-mensual")
async def read_estadistica_ocupacion_mensual(
    fecha: date = Query(default=date.today(), description="Formato YYYY-MM-DD"),
    db: Session = Depends(get_db)
):
    try:
        query = text("EXEC sp_estadistica_ocupacion_habitacion_mensual :fecha")
        result = db.execute(query, {"fecha": fecha})
        estadistica = [dict(row._mapping) for row in result]
        return estadistica
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")

@router.get("/ingresos-tipo-habitacion")
async def read_ingresos_tipo_habitacion(
    fecha: date = Query(default=None, description="Formato YYYY-MM-DD"),
    db: Session = Depends(get_db)
):
    try:
        query = text("EXEC sp_ingresos_por_tipo_habitacion :fecha")
        result = db.execute(query, {"fecha": fecha})
        ingresos = [dict(row._mapping) for row in result]
        return ingresos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")
    

@router.get("/consumo-amenidades-mensual")
async def read_consumo_amenidades_mensual(
    fecha: date = Query(default=None, description="Formato YYYY-MM-DD"),
    db: Session = Depends(get_db)
):
    try:
        query = text("EXEC sp_resumen_mensual_consumo_productos :fecha")
        result = db.execute(query, {"fecha": fecha})
        consumos = [dict(row._mapping) for row in result]
        return consumos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")