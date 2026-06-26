from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from datetime import date

router = APIRouter(
    prefix="/reservas",
    tags=["reservas"]
)

@router.get("/")
async def read_reservas():
    return {"Hello": "World"}

@router.get("/reporte-reservaciones-diarias")
async def read_reporte_reservaciones_diarias(
    fecha: date = Query(default=date.today(), description="Formato YYYY-MM-DD"), 
    #fecha: date = Query(..., description="Formato YYYY-MM-DD"), 
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