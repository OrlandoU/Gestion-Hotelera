from fastapi import APIRouter, Depends, HTTPException
from app.database import get_db 

router = APIRouter(
    prefix="/huespedes",
    tags=["huespedes"]
)

@router.get("")
async def read_huespedes():
    return {"Hello": "World"}

@router.get("/listar")
async def listar_huespedes(db = Depends(get_db)):
    try:
        cursor = db.cursor(as_dict=True)
        cursor.execute("EXEC sp_listar_huespedes")
        proveedores = cursor.fetchall()
        cursor.close()
        return proveedores
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al conectar con SQL Server: {str(e)}")