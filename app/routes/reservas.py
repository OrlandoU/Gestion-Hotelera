from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from app.database import get_db
from app.repositories.reserva import ReservaRepository
from app.models import ReservaSchema
from app.utils.security import get_current_user
import pymssql
from fastapi import HTTPException # o jsonify en Flask
import re

# Inyector de dependencia para el repositorio
def get_reserva_repo(db = Depends(get_db)):
    return ReservaRepository(db)


router = APIRouter(
    prefix="/reservas",
    tags=["reservas"],
    dependencies=[Depends(get_current_user)],
)

# ==========================================
# RUTAS DE RESERVAS
# ==========================================

@router.get("", status_code=status.HTTP_200_OK)
async def listar_reservas(
    fecha_entrada: date = Query(None, description="Filtrar reservas por fecha de entrada"),
    repo: ReservaRepository = Depends(get_reserva_repo)
):
    return repo.listar(fecha_entrada=fecha_entrada)

@router.get("/habitacion-disponible", status_code=status.HTTP_200_OK)
async def mostrar_habitaciones_disponibles(
    fecha_entrada: date = Query(default=date.today(), description="Formato YYYY-MM-DD"),
    fecha_salida: date = Query(default=date.today(), description="Formato YYYY-MM-DD"),
    tipo: str = Query(..., description="Tipo de habitación"),
    repo: ReservaRepository = Depends(get_reserva_repo)
):
    return repo.verificar_disponibilidad_unica(fecha_entrada, fecha_salida, tipo)


@router.get("/habitaciones-disponibles", status_code=status.HTTP_200_OK)
async def mostrar_habitaciones_disponibles(
    fecha_entrada: date = Query(default=date.today(), description="Formato YYYY-MM-DD"),
    fecha_salida: date = Query(default=date.today(), description="Formato YYYY-MM-DD"),
    repo: ReservaRepository = Depends(get_reserva_repo)
):
    # Nota: FastAPI ya valida el formato 'date' automáticamente. 
    # Si viene incorrecto, lanza un 422 automáticamente sin tocar el repo.
    return repo.verificar_disponibilidad(fecha_entrada, fecha_salida)

@router.get("/habitacion-disponible", status_code=status.HTTP_200_OK)
async def mostrar_habitaciones_disponibles(
    fecha_entrada: date = Query(default=date.today(), description="Formato YYYY-MM-DD"),
    fecha_salida: date = Query(default=date.today(), description="Formato YYYY-MM-DD"),
    tipo: str = Query(description="Ingresa el tipo de habitacion"),
    repo: ReservaRepository = Depends(get_reserva_repo)
):
    # Nota: FastAPI ya valida el formato 'date' automáticamente. 
    # Si viene incorrecto, lanza un 422 automáticamente sin tocar el repo.
    return repo.verificar_disponibilidad_unica(fecha_entrada, fecha_salida, tipo)

@router.get("/{reserva_id}", status_code=status.HTTP_200_OK)
async def obtener_reserva(
    reserva_id: int = Path(..., description="ID de la reserva a consultar"),
    repo: ReservaRepository = Depends(get_reserva_repo)
):
    reserva = repo.obtener_por_id(reserva_id)
    if not reserva:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Reserva no encontrada"
        )
    return reserva


@router.put("/{reserva_id}", status_code=status.HTTP_200_OK)
async def modificar_estado(
    reserva_id: int = Path(..., description="ID de la reserva a modificar"),
    es_entrada: bool = Query(..., description="Estado de la reserva (entrada/salida)"),
    repo: ReservaRepository = Depends(get_reserva_repo)
):
    try:
        repo.modificar_estado(reserva_id, es_entrada)
        return {"message": "Estado modificado exitosamente"}
    except Exception as e:
        mensaje_bruto = str(e)
        mensaje_limpio = "Ocurrió un error al procesar la solicitud."

        # Extraemos lo que esté entre b' y DB-Lib error (que es el mensaje del THROW 51000)
        # Ejemplo: (51000, b'No es posible hacer check-out...DB-Lib error')
        patron = r"b'(.*?)DB-Lib"
        coincidencia = re.search(patron, mensaje_bruto)

        if coincidencia:
            mensaje_limpio = coincidencia.group(1).strip()
        else:
            # Si no vino con DB-Lib, intentamos extraer todo lo que está dentro de b'...'
            patron_respaldo = r"b'(.*?)'"
            coincidencia_respaldo = re.search(patron_respaldo, mensaje_bruto)
            if coincidencia_respaldo:
                mensaje_limpio = coincidencia_respaldo.group(1).strip()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=mensaje_limpio
        )

@router.post("", status_code=status.HTTP_201_CREATED)
async def crear_reserva(
    reserva: ReservaSchema,
    repo: ReservaRepository = Depends(get_reserva_repo)
):
    repo.crear(reserva)
    return {"message": "Reserva creada exitosamente"}


@router.post("/{reserva_id}/pagos", status_code=status.HTTP_201_CREATED)
async def registrar_pago(    
    reserva_id: int = Path(..., description="ID de la reserva a la que se le aplica el pago"),
    metodo: str = Query(..., description="Método de pago"),
    monto: int = Query(..., description="Monto a pagar"),
    repo: ReservaRepository = Depends(get_reserva_repo)
):
    repo.registrar_pago(reserva_id, metodo, monto)
    return {"message": "Pago registrado exitosamente"}