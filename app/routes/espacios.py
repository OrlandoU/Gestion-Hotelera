from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from app.database import get_db
from app.repositories.espacio import EspacioRepository

def get_espacio_repo(db = Depends(get_db)):
    return EspacioRepository(db)


router = APIRouter(prefix="/espacios", tags=["espacios"])

# ==========================================
# RUTAS DE ESPACIOS
# ==========================================

@router.get("/habitaciones", status_code=status.HTTP_200_OK)
async def listar_habitaciones(
    disponibles_only: bool = Query(False, description="Filtra solo por habitaciones disponibles"),
    repo: EspacioRepository = Depends(get_espacio_repo)
):
    return repo.obtener_habitaciones(disponibles_only=disponibles_only)


@router.get("/{espacio_id}", status_code=status.HTTP_200_OK)
async def obtener_espacio(
    espacio_id: int = Path(..., description="ID del espacio/habitación a consultar"),
    repo: EspacioRepository = Depends(get_espacio_repo)
):
    espacio = repo.obtener_por_id(espacio_id)
    if not espacio:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Espacio no encontrado")
    return espacio