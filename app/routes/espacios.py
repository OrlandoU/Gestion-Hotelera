from fastapi import APIRouter, Depends, HTTPException
from app.database import get_db

router = APIRouter(
    prefix="/espacios",
    tags=["espacios"]
)

@router.get("")
async def read_espacios():
    return {"Hello": "World"}

@router.get("/habitaciones-disponibles")
async def read_habitaciones_disponibles(db = Depends(get_db)):
    try:
        cursor = db.cursor(as_dict=True)
        cursor.execute("SELECT * FROM vw_reporte_habitaciones")
        habitaciones = cursor.fetchall()
        cursor.close()
        return habitaciones
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener habitaciones disponibles: {str(e)}")