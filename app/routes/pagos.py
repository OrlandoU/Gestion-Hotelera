from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from app.database import get_db
from app.repositories.pagos import PagoRepository
from app.models import PagoSchema
from typing import Optional

# Inyector de dependencia para el repositorio
def get_pago_repo(db = Depends(get_db)):
    return PagoRepository(db)


router = APIRouter(
    prefix="/pagos",
    tags=["pagos"]
)

# ==========================================
# RUTAS DE PAGOS
# ==========================================

### 1. OBTENER TODOS LOS PAGOS (O FILTRADOS POR FECHA)
@router.get("", status_code=status.HTTP_200_OK)
async def listar_pagos(
    pago: PagoSchema = Depends(PagoSchema),
    repo: PagoRepository = Depends(get_pago_repo)
):
    return repo.listar(pago)