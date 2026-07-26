from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from app.database import get_db
from app.repositories.huesped import HuespedRepository
from app.models.huesped import Huesped

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
    resultado = repo.crear(payload)

    if not resultado:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se pudo crear el huésped."
        )

    return {
        "message": "Huésped creado exitosamente",
        "huesped": payload.model_dump() if hasattr(payload, "model_dump") else payload.dict(),
    }
