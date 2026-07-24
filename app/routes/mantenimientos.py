from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from datetime import date
from app.repositories.mantenimiento import MantenimientoRepository
from app.models import MantenimientoSchema

def get_mantenimiento_repo(db = Depends(get_db)):
    return MantenimientoRepository(db)

router = APIRouter(
    prefix="/mantenimientos",
    tags=["mantenimientos"]
)

@router.get("")
async def read_mantenimientos(
    fecha_inicio: date = Query(default=date.today(), description="Fecha de inicio del mantenimiento"),
    fecha_final: date = Query(default=date.today(), description="Fecha final del mantenimiento"),
    tipo: str = Query(None, description="Tipo de mantenimiento"),
    usuario_id: int = Query(None, description="ID del usuario"),
    repo: MantenimientoRepository = Depends(get_mantenimiento_repo)
):
    
    mantenimientos = repo.listar(fecha_inicio, fecha_final, tipo, usuario_id)

    if not mantenimientos:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Mantenimientos no encontrados"
        )

    return mantenimientos

@router.get("/kpi")
async def read_kpi(
    repo: MantenimientoRepository = Depends(get_mantenimiento_repo)
):
    kpi = repo.obtener_kpi()
    
    if not kpi:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="KPI no encontrado"
        )

    return kpi

@router.post("")
async def crear_mantenimiento(
    mantenimiento: MantenimientoSchema,
    repo: MantenimientoRepository = Depends(get_mantenimiento_repo)
):
    return repo.crear(mantenimiento)