from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db

router = APIRouter(
    prefix="/espacios",
    tags=["espacios"]
)

@router.get("/")
async def read_espacios():
    return {"Hello": "World"}

@router.get("/reporte-estado-habitaciones")
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
        