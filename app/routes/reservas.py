from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from app.database import get_db
from datetime import date

router = APIRouter(
    prefix="/reservas",
    tags=["reservas"]
)

@router.get("")
async def read_reservas():
    return {"Hello": "World"}

@router.get("/mostrar-habitaciones-disponibles")
async def mostrar_habitaciones_disponibles(
    fecha_entrada: date = Query(..., description="Fecha de entrada"),
    fecha_salida: date = Query(..., description="Fecha de salida"),
    db = Depends(get_db)
):
    try:
        cursor = db.cursor(as_dict=True)
        cursor.execute("EXEC sp_mostrar_habitaciones_disponibles %s, %s", (fecha_entrada, fecha_salida))
        habitaciones = cursor.fetchall()
        cursor.close()
        return habitaciones
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/crear-reserva")
async def crear_reserva(huesped_id: int = Query(..., description="ID del huésped"),
    espacio_id: int = Query(..., description="ID del espacio"), fecha_entrada: datetime = Query(..., description="Fecha de entrada"),
    fecha_salida: datetime = Query(..., description="Fecha de salida"), db = Depends(get_db)):
    try:
        cursor = db.cursor()
        cursor.execute(
            "EXEC sp_crear_reserva %s, %s, %s, %s",
            (
                huesped_id,
                espacio_id,
                fecha_entrada,
                fecha_salida
            )
        )
        db.commit()
        return {"message": "Reserva creada exitosamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))