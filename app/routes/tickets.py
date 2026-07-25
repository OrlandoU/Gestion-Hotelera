from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from datetime import date
from app.repositories.ticket import TicketRepository
from app.models import TicketSchema, ComentarioSchema

def get_ticket_repo(db = Depends(get_db)):
    return TicketRepository(db)

router = APIRouter(
    prefix="/tickets",
    tags=["tickets"]
)

@router.get("")
async def read_tickets(
    numero_ticket: str = Query(None, description="Numero del ticket"),
    fecha_creacion: date = Query(default=None, description="Fecha de inicio del mantenimiento"),
    estado: str = Query(None, description="Estado del ticket"),
    repo: TicketRepository = Depends(get_ticket_repo)
):
    
    tickets = repo.listar(numero_ticket, fecha_creacion, estado)

    if not tickets:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Tickets no encontrados"
        )

    return tickets

@router.get("/comentarios")
async def read_comentarios(
    numero_ticket: str = Query(default=None, description="Numero del ticket"),
    fecha_creacion: date = Query(default=None, description="Fecha de creacion del comentario"),
    usuario: str = Query(default=None, description="Usuario que creo el comentario"),
    repo: TicketRepository = Depends(get_ticket_repo)
):
    
    comentarios = repo.listar_comentarios(numero_ticket, fecha_creacion, usuario)

    if not comentarios:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Comentarios no encontrados"
        )

    return comentarios

@router.post("/comentarios")
async def crear_comentario(
    comentario: ComentarioSchema,
    repo: TicketRepository = Depends(get_ticket_repo)
):
    return repo.crear_comentario(comentario)

@router.post("")
async def crear_ticket(
    ticket: TicketSchema,
    repo: TicketRepository = Depends(get_ticket_repo)
):
    return repo.crear(ticket)