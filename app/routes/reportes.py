from fastapi import APIRouter

# Initialize router with a prefix and documentation tag
router = APIRouter(
    prefix="/reportes",
    tags=["reportes"]
)

@router.get("")
async def read_reportes():
    return {"Hello": "World"}

@router.get("/{item_id}")
async def read_reporte(item_id: int):
    return {"item_id": item_id, "name": "Specific Item"}
