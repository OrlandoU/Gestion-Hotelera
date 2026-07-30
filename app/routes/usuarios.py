from app.repositories.usuarios import UsuarioRepository
from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from datetime import date
from app.models import UsuarioSchema

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
    
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_usuario(
    usuario: UsuarioSchema,
    repo: UsuarioRepository = Depends(get_usuario_repo)
):
    return repo.crear(usuario)

@router.put("/{usuario_id}", status_code=status.HTTP_200_OK)
async def update_usuario(
    usuario_id: int = Path(...),
    usuario: UsuarioSchema = None,
    repo: UsuarioRepository = Depends(get_usuario_repo)
):
    return repo.actualizar(usuario_id, usuario)
