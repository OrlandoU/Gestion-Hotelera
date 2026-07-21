from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.database import get_db
from app.repositories.producto import ProductoRepository
from app.models import CompraCreateSchema

# Inyector del repositorio de productos
def get_producto_repo(db = Depends(get_db)):
    return ProductoRepository(db)


router = APIRouter(
    prefix="/productos",
    tags=["productos"]
)

# ==========================================
# RUTAS DE PRODUCTOS
# ==========================================

### 1. OBTENER TODOS LOS PRODUCTOS (Reemplaza a /listar)
@router.get("", status_code=status.HTTP_200_OK)
async def read_productos(
    proveedor_id: int = Query(default=None, description='ID del proveedor para filtrar'),
    repo: ProductoRepository = Depends(get_producto_repo)
):
    return repo.listar(proveedor_id=proveedor_id)


### 2. REGISTRAR UNA COMPRA DE PRODUCTOS
@router.post("/registrar-compra", status_code=status.HTTP_201_CREATED)
async def registrar_compra(
    compra_data: CompraCreateSchema, 
    repo: ProductoRepository = Depends(get_producto_repo)
):
    resultado = repo.registrar_compra(compra_data)
    
    if not resultado or "compra_id" not in resultado:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="La compra se procesó pero no se pudo recuperar el ID generado."
        )
        
    return {
        "message": "Compra registrada con éxito", 
        "compra_id": resultado["compra_id"]
    }