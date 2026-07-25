from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from app.database import get_db
from app.repositories.base import BaseRepository
from app.models import PagoSchema

class PagoRepository(BaseRepository):
    def listar(self, pago: PagoSchema):
        """
        Lista las reservaciones. Si no se provee fecha, usa la del día actual.
        """
        query = "EXEC sp_listar_pagos_realizados %s, %s, %s"
        return self._execute_query(query, (pago.fecha, pago.metodo_pago, pago.reserva_id))
        