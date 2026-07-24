from app.repositories.usuarios import UsuarioRepository
from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from datetime import date

router = APIRouter(
    prefix="/usuarios",
    tags=["usuarios"]
)

def get_usuario_repo(db = Depends(get_db)):
    return UsuarioRepository(db)

@router.get("/", status_code=status.HTTP_200_OK)
async def read_usuarios(
    repo: UsuarioRepository = Depends(get_usuario_repo)
):
    return repo.listar()
    

