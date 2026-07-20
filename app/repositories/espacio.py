from app.repositories.base import BaseRepository

class EspacioRepository(BaseRepository):
    def obtener_habitaciones(self, disponibles_only: bool = False):
        if disponibles_only:
            return self._execute_query("SELECT * FROM vw_reporte_habitaciones")
        return self._execute_query("SELECT * FROM vw_habitaciones")

    def obtener_por_id(self, espacio_id: int):
        return self._execute_query("SELECT * FROM vw_habitaciones WHERE id = %s", (espacio_id,), fetch_one=True)

    def crear(self, payload: dict):
        query = "INSERT INTO espacios (nombre, tipo) VALUES (%s, %s)"
        params = (payload.get('nombre'), payload.get('tipo'))
        return self._execute_query(query, params, is_write=True)
        
    # Agrega de forma similar actualizar y eliminar...