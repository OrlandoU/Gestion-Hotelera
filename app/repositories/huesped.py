from app.repositories.base import BaseRepository
from app.models.huesped import Huesped

class HuespedRepository(BaseRepository):
    def obtener_todos(self):
        return self._execute_query("EXEC sp_listar_huespedes")

    def obtener_por_id(self, huesped_id: int):
        return self._execute_query("EXEC sp_obtener_huesped %s", (huesped_id,), fetch_one=True)

    def crear(self, payload: Huesped):
        # TODO: Ajustar los parámetros reales de tu SP
        query = "EXEC sp_crear_huesped %s, %s"
        params = (payload.get('nombre'), payload.get('apellido')) 
        return self._execute_query(query, params, is_write=True)

    def actualizar(self, huesped_id: int, payload: dict):
        query = "EXEC sp_actualizar_huesped %s, %s"
        params = (huesped_id, payload.get('nombre'))
        return self._execute_query(query, params, is_write=True)

    def eliminar(self, huesped_id: int):
        query = "EXEC sp_eliminar_huesped %s"
        return self._execute_query(query, (huesped_id,), is_write=True)