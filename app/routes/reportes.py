from fastapi import APIRouter, Depends, HTTPException, Query
from app.database import get_db
from datetime import date

# Initialize router with a prefix and documentation tag
router = APIRouter(
    prefix="/reportes",
    tags=["reportes"]
)

# Función utilitaria para transformar las filas del cursor en diccionarios limpios
def fetch_as_dict(cursor):
    if cursor.description is None:
        return []
    columns = [column[0] for column in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]


@router.get("")
async def read_reportes():
    return {"Hello": "World"}


# REPORTES 
@router.get("/clientes")
async def read_huespedes_frecuentes(db = Depends(get_db)):
    try:
        cursor = db.cursor()
        cursor.execute("EXEC sp_clientes_frecuentes")
        usuarios = fetch_as_dict(cursor)
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
        cursor = db.cursor()
        # Se reemplaza el parámetro ":fecha" por "?"
        cursor.execute("EXEC sp_reporte_reservaciones_diarias ?", (fecha,))
        resultado = fetch_as_dict(cursor)
        cursor.close()
        return resultado
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")


@router.get("/estado-de-habitaciones")
async def read_reporte_habitaciones(db = Depends(get_db)):
    try:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM vw_reporte_habitaciones")
        espacios = fetch_as_dict(cursor)
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
        cursor = db.cursor()
        # Pasamos los 3 parámetros ordenados en una tupla
        cursor.execute(
            "EXEC sp_reporte_actividades_mantenimiento ?, ?, ?", 
            (tipo, usuario_id, fecha_inicio)
        )
        actividades = fetch_as_dict(cursor)
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
        cursor = db.cursor()
        cursor.execute("EXEC sp_listar_pagos_realizados ?", (fecha,))
        pagos = fetch_as_dict(cursor)
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
        cursor = db.cursor()
        cursor.execute("EXEC sp_consumo_stock_semanal ?", (fecha,))
        consumos = fetch_as_dict(cursor)
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
        cursor = db.cursor()
        cursor.execute("EXEC sp_estadistica_ocupacion_habitacion_mensual ?", (fecha,))
        estadistica = fetch_as_dict(cursor)
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
        cursor = db.cursor()
        cursor.execute("EXEC sp_ingresos_por_tipo_habitacion ?", (fecha,))
        ingresos = fetch_as_dict(cursor)
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
        cursor = db.cursor()
        cursor.execute("EXEC sp_resumen_mensual_consumo_productos ?", (fecha,))
        consumos = fetch_as_dict(cursor)
        cursor.close()
        return consumos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")