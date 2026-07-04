from fastapi import APIRouter, Depends, HTTPException, Query
from app.database import get_db
import pymssql

# Initialize router with a prefix and documentation tag
router = APIRouter(
    prefix="/proveedores",
    tags=["proveedores"]
)

@router.get("/listar")
async def read_proveedores(db = Depends(get_db)):
    try:
        cursor = db.cursor(as_dict=True)
        cursor.execute("EXEC sp_listar_proveedores")
        proveedores = cursor.fetchall()
        cursor.close()
        return proveedores
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al conectar con SQL Server: {str(e)}")