import json
from app.repositories.base import BaseRepository
from datetime import date
from app.models import MantenimientoSchema

class MantenimientoRepository(BaseRepository):
    def listar(self, fecha_inicio: date, fecha_final: date, tipo: str, usuario_id: int):
        """
        Lista los mantenimientos
        """
        # Nota: En pymssql, si pasas un solo parámetro en la tupla debe ser (proveedor_id,)
        # Si es None, enviamos la tupla vacía o manejamos el SP según corresponda.
        query = "EXEC sp_mantenimientos_por_rango %s, %s, %s, %s"
        params = (
            fecha_inicio, fecha_final, 
            tipo, usuario_id) 
        return self._execute_query(query, params)

    def obtener_kpi(self):
        """
        Obtiene el KPI de mantenimientos
        """
        query = "EXEC sp_reporte_mantenimientos"
        return self._execute_query(query, ())

    def crear(self, mantenimiento: MantenimientoSchema):
        """
        Crea un mantenimiento
        """
        query = "EXEC sp_crear_mantenimiento %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s"
        params = (
            mantenimiento.espacio_id,
            mantenimiento.usuario_id, 
            mantenimiento.responsable_id,
            mantenimiento.nombre_responsable,
            mantenimiento.telefono_responsable,
            mantenimiento.tipo, 
            mantenimiento.prioridad, 
            mantenimiento.estado, 
            mantenimiento.fecha_inicio, 
            mantenimiento.fecha_final, 
            mantenimiento.descripcion
        )
        return self._execute_query(query, params, is_write=True)