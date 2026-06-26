from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db

router = APIRouter(
    prefix="/huespedes",
    tags=["huespedes"]
)

@router.get("")
async def read_huespedes():
    return {"Hello": "World"}

@router.get("/frecuentes")
async def read_huespedes_frecuentes(db: Session = Depends(get_db)):
    try:
        # Ejemplo ejecutando una consulta SQL cruda
        result = db.execute(text("SELECT * FROM vw_huespedes_frecuentes"))
        # Convertimos a diccionario
        usuarios = [dict(row._mapping) for row in result]
        return usuarios
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al conectar con SQL Server: {str(e)}")