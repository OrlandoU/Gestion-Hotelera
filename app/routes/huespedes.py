from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from app.database import get_db
from app.repositories.huesped import HuespedRepository
from app.models.models import Huesped

# Creamos dependencias rápidas para inicializar los repositorios con la conexión de BD
def get_huesped_repo(db = Depends(get_db)):
    return HuespedRepository(db)


router = APIRouter(prefix="/huespedes", tags=["huespedes"])

# ==========================================
# RUTAS DE HUÉSPEDES
# ==========================================

@router.get("", status_code=status.HTTP_200_OK)
async def listar_huespedes(repo: HuespedRepository = Depends(get_huesped_repo)):
    return repo.obtener_todos()


@router.get("/{huesped_id}", status_code=status.HTTP_200_OK)
async def obtener_huesped(
    huesped_id: int = Path(..., description="ID del huésped a consultar"),
    repo: HuespedRepository = Depends(get_huesped_repo)
):
    huesped = repo.obtener_por_id(huesped_id)
    if not huesped:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Huésped no encontrado")
    return huesped


@router.post("", status_code=status.HTTP_201_CREATED)
async def crear_huesped(payload: Huesped, repo: HuespedRepository = Depends(get_huesped_repo)):
    repo.crear(payload)
    return {"message": "Huésped creado exitosamente"}
