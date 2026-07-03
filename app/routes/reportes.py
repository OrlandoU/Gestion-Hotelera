from fastapi import APIRouter, Depends, HTTPException, Query
from app.database import get_db
from datetime import date
import pymssql

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
async def read_huespedes_frecuentes(db = Depends(get_db)):
    try:
        # Usamos DictCursor para que devuelva diccionarios automáticamente
        cursor = db.cursor(as_dict=True)
        cursor.execute("EXEC sp_clientes_frecuentes")
        usuarios = cursor.fetchall()
        cursor.close()
        return usuarios
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al conectar con SQL Server: {str(e)}")


@router.get("/reservaciones-diarias")
async def read_reporte_reservaciones_diarias(
    fecha: date = Query(default=date.today(), description="Formato YYYY-MM-DD"),
    db = Depends(get_db)
):
    try:
        cursor = db.cursor(as_dict=True)
        # Se reemplaza el parámetro "?" por "%s"
        cursor.execute("EXEC sp_reporte_reservaciones_diarias %s", (fecha,))
        resultado = cursor.fetchall()
        cursor.close()
        return resultado
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")


@router.get("/estado-de-habitaciones")
async def read_reporte_habitaciones(db = Depends(get_db)):
    try:
        cursor = db.cursor(as_dict=True)
        cursor.execute("SELECT * FROM vw_reporte_habitaciones")
        espacios = cursor.fetchall()
        cursor.close()
        return espacios
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")


@router.get("/actividades-mantenimientos-diarios")
async def read_reporte_actividades_mantenimiento(
    tipo: str = Query(default=None, description="Tipo de actividad"),
    usuario_id: int = Query(default=None, description="ID del usuario"),
    fecha_inicio: date = Query(default=None, description="Formato YYYY-MM-DD"),
    db = Depends(get_db)
):
    try:
        cursor = db.cursor(as_dict=True)
        # Se reemplazan los 3 "?" por "%s"
        cursor.execute(
            "EXEC sp_reporte_actividades_mantenimiento %s, %s, %s", 
            (tipo, usuario_id, fecha_inicio)
        )
        actividades = cursor.fetchall()
        cursor.close()
        return actividades
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")


@router.get("/pagos-realizados")
async def read_pagos_realizados(
    fecha: date = Query(default=None, description="Formato YYYY-MM-DD"),
    db = Depends(get_db)
):
    try: 
        cursor = db.cursor(as_dict=True)
        cursor.execute("EXEC sp_listar_pagos_realizados %s", (fecha,))
        pagos = cursor.fetchall()
        cursor.close()
        return pagos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")


@router.get("/consumo-stock-semanal")
async def read_consumo_stock_semanal(
    fecha: date = Query(default=None, description="Formato YYYY-MM-DD"),
    db = Depends(get_db)
):
    try:
        cursor = db.cursor(as_dict=True)
        cursor.execute("EXEC sp_consumo_stock_semanal %s", (fecha,))
        consumos = cursor.fetchall()
        cursor.close()
        return consumos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")


@router.get("/estadistica-ocupacion-mensual")
async def read_estadistica_ocupacion_mensual(
    fecha: date = Query(default=date.today(), description="Formato YYYY-MM-DD"),
    db = Depends(get_db)
):
    try:
        cursor = db.cursor(as_dict=True)
        cursor.execute("EXEC sp_estadistica_ocupacion_habitacion_mensual %s", (fecha,))
        estadistica = cursor.fetchall()
        cursor.close()
        return estadistica
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")


@router.get("/ingresos-tipo-habitacion")
async def read_ingresos_tipo_habitacion(
    fecha: date = Query(default=None, description="Formato YYYY-MM-DD"),
    db = Depends(get_db)
):
    try:
        cursor = db.cursor(as_dict=True)
        cursor.execute("EXEC sp_ingresos_por_tipo_habitacion %s", (fecha,))
        ingresos = cursor.fetchall()
        cursor.close()
        return ingresos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")
    

@router.get("/consumo-amenidades-mensual")
async def read_consumo_amenidades_mensual(
    fecha: date = Query(default=None, description="Formato YYYY-MM-DD"),
    db = Depends(get_db)
):
    try:
        cursor = db.cursor(as_dict=True)
        cursor.execute("EXEC sp_resumen_mensual_consumo_productos %s", (fecha,))
        consumos = cursor.fetchall()
        cursor.close()
        return consumos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")