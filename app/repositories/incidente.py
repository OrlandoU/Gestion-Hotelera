import traceback
from fastapi import HTTPException, status

from app.models.incidente import IncidenteCreateSchema


class IncidenteRepository:
    def __init__(self, db):
        self.db = db

    def crear(self, payload: IncidenteCreateSchema):
        cursor = None
        try:
            cursor = self.db.cursor(as_dict=True)
            cursor.execute(
                "EXEC sp_registrar_incidente %s, %s, %s, %s, %s, %s",
                (
                    payload.usuario_id,
                    payload.tipo,
                    payload.detalles,
                    payload.causas,
                    payload.recomendaciones,
                    payload.fecha,
                ),
            )
            self.db.commit()
            return True
        except Exception as e:
            if self.db:
                self.db.rollback()
            traceback.print_exc()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error al registrar incidente: {str(e)}",
            )
        finally:
            if cursor:
                cursor.close()
