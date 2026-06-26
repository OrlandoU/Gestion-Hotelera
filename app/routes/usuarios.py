from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from datetime import date

router = APIRouter(
    prefix="/usuarios",
    tags=["usuarios"]
)

@router.get("/")
async def read_usuarios():
    return {"Hello": "World"}

@router.get("/reporte-aniversario-usuarios")
async def read_aniversario_usuarios(
    fecha_inicio: date = Query(default=None, description="Formato YYYY-MM-DD"),
    db: Session = Depends(get_db)
):
    try:
        query = text("EXEC sp_aniversario_usuarios :fecha")
        result = db.execute(query, {"fecha": fecha_inicio})
        
        return [dict(row._mapping) for row in result]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")