from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from app.database import get_db
from app.repositories.reserva import ReservaRepository
from app.models import ReservaSchema
from app.utils.security import get_current_user
import pymssql
from fastapi import HTTPException # o jsonify en Flask

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

    except (pymssql.OperationalError, pymssql.DatabaseError, Exception) as e:
        mensaje_bruto = ""

        # 1. Extraer el mensaje que viene en los argumentos de pymssql
        if hasattr(e, 'args') and len(e.args) > 1:
            mensaje_bruto = e.args[1]
            if isinstance(mensaje_bruto, bytes):
                mensaje_bruto = mensaje_bruto.decode('utf-8', errors='ignore')
        else:
            mensaje_bruto = str(e)

        # 2. Cortar el texto sobrante de "DB-Lib error message..."
        if "DB-Lib error message" in mensaje_bruto:
            mensaje_limpio = mensaje_bruto.split("DB-Lib error message")[0]
        else:
            mensaje_limpio = mensaje_bruto

        # 3. Quitar espacios sobrantes y devolver error 400
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=mensaje_limpio.strip()
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