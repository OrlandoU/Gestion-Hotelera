from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db

router = APIRouter(
    prefix="/espacios",
    tags=["espacios"]
)

@router.get("/")
async def read_espacios():
    return {"Hello": "World"}

