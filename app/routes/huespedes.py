from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db

router = APIRouter(
    prefix="/huespedes",
    tags=["huespedes"]
)

@router.get("")
async def read_huespedes():
    return {"Hello": "World"}
