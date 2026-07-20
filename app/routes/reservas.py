from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from app.database import get_db
from app.repositories.reserva import ReservaRepository
from app.routes.reservas_interface import ReservaSchema

# Inyector de dependencia para el repositorio
def get_reserva_repo(db = Depends(get_db)):
    return ReservaRepository(db)


router = APIRouter(
    prefix="/reservas",
    tags=["reservas"]
)

# ==========================================
# RUTAS DE RESERVAS
# ==========================================

### 1. OBTENER TODAS LAS RESERVAS (O FILTRADAS POR FECHA)
@router.get("", status_code=status.HTTP_200_OK)
async def listar_reservas(
    fecha_entrada: date = Query(None, description="Filtrar reservas por fecha de entrada"),
    repo: ReservaRepository = Depends(get_reserva_repo)
):
    return repo.listar(fecha_entrada=fecha_entrada)


### 2. DISPONIBILIDAD DE HABITACIONES (Sub-ruta de búsqueda)
@router.get("/habitaciones-disponibles", status_code=status.HTTP_200_OK)
async def mostrar_habitaciones_disponibles(
    fecha_entrada: date = Query(default=date.today(), description="Formato YYYY-MM-DD"),
    fecha_salida: date = Query(default=date.today(), description="Formato YYYY-MM-DD"),
    repo: ReservaRepository = Depends(get_reserva_repo)
):
    # Nota: FastAPI ya valida el formato 'date' automáticamente. 
    # Si viene incorrecto, lanza un 422 automáticamente sin tocar el repo.
    return repo.verificar_disponibilidad(fecha_entrada, fecha_salida)


### 3. DETALLE DE UNA RESERVA ESPECÍFICA
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


### 4. CREAR UNA RESERVA
@router.post("", status_code=status.HTTP_201_CREATED)
async def crear_reserva(
    reserva: ReservaSchema,
    repo: ReservaRepository = Depends(get_reserva_repo)
):
    print(reserva)
    repo.crear(reserva)
    return {"message": "Reserva creada exitosamente"}


### 5. REGISTRAR EL PAGO DE UNA RESERVA (Sub-recurso dependiente)
@router.post("/{reserva_id}/pagos", status_code=status.HTTP_201_CREATED)
async def registrar_pago(    
    reserva_id: int = Path(..., description="ID de la reserva a la que se le aplica el pago"),
    metodo: str = Query(..., description="Método de pago"),
    monto: int = Query(..., description="Monto a pagar"),
    repo: ReservaRepository = Depends(get_reserva_repo)
):
    repo.registrar_pago(reserva_id, metodo, monto)
    return {"message": "Pago registrado exitosamente"}