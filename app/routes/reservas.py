from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from datetime import date

router = APIRouter(
    prefix="/reservas",
    tags=["reservas"]
)

@router.get("/")
async def read_reservas():
    return {"Hello": "World"}

