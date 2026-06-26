from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from datetime import date

router = APIRouter(
    prefix="/mantenimientos",
    tags=["mantenimientos"]
)

@router.get("/")
async def read_mantenimientos():
    return {"Hello": "World"}

