from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.database import get_db
import pymssql
import json
from app.routes.interfaces import CompraCreateSchema

router = APIRouter(
    prefix="/productos",
    tags=["productos"]
)

@router.get("/listar")
async def read_productos(
    proveedor_id: int = Query(default=None, description='ID del proveedor'),
    db = Depends(get_db)
):
    try:
        cursor = db.cursor(as_dict=True)
        cursor.execute("EXEC sp_listar_productos %s", (proveedor_id))
        productos = cursor.fetchall()
        cursor.close()
        return productos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al conectar con SQL Server: {str(e)}")

@router.post("/registrar-compra", status_code=status.HTTP_201_CREATED)
async def registrar_compra(
    compra_data: CompraCreateSchema, # Recibe todo el JSON estructurado
    db = Depends(get_db)
):
    try:
        cursor = db.cursor(as_dict=True)
        
        # Convertimos la lista de detalles a un string JSON para SQL Server
        detalles_json = json.dumps([d.model_dump() for d in compra_data.detalles])
        
        # Preparamos la consulta llamando al nuevo procedimiento que procesa JSON
        query = """
            EXEC crear_compra_json 
                @proveedor_id = %s, 
                @numero_factura_proveedor = %s, 
                @fecha_compra = %s, 
                @detalles_json = %s;
        """
        
        # Ejecutamos pasando los parámetros ordenados
        cursor.execute(query, (
            compra_data.proveedor_id,
            compra_data.numero_factura_proveedor,
            compra_data.fecha_compra.strftime('%Y-%m-%d %H:%M:%S'),
            detalles_json
        ))
        
        # Obtenemos el ID generado
        resultado = cursor.fetchone()
        db.commit() # ¡No olvides el commit en Python para salvar los cambios!
        cursor.close()
        
        return {"message": "Compra registrada con éxito", "compra_id": resultado["compra_id"]}
        
    except Exception as e:
        if 'db' in locals():
            db.rollback() # Si algo falla en la conexión, rollback
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Error al registrar la compra: {str(e)}"
        )