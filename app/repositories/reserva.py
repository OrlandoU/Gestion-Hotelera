from datetime import date
from app.repositories.base import BaseRepository
from app.models import ReservaSchema

class ReservaRepository(BaseRepository):
    def listar(self, fecha_entrada: date = None):
        """
        Lista las reservaciones. Si no se provee fecha, usa la del día actual.
        """
        query = "EXEC sp_listar_reservaciones %s"
        return self._execute_query(query, (fecha_entrada,))

    def verificar_disponibilidad(self, fecha_entrada: date, fecha_salida: date):
        """
        Obtiene las habitaciones disponibles entre dos fechas.
        """
        query = "EXEC sp_mostrar_habitaciones_disponibles %s, %s"
        return self._execute_query(query, (fecha_entrada, fecha_salida))
    
    def verificar_disponibilidad_unica(self, fecha_entrada: date, fecha_salida: date, tipo: str):
        """
        Obtiene las habitaciones disponibles entre dos fechas.
        """
        query = "EXEC sp_mostrar_habitacion_disponible %s, %s, %s"
        return self._execute_query(query, (fecha_entrada, fecha_salida, tipo))
    

    def obtener_por_id(self, reserva_id: int):
        """
        Obtiene el detalle de una reserva específica.
        """
        query = "EXEC sp_obtener_reserva %s"
        return self._execute_query(query, (reserva_id,), fetch_one=True)

    def crear(self, reserva: ReservaSchema):
        """
        Registra una nueva reserva mapeando los datos de Pydantic.
        """
        query = "EXEC sp_crear_reserva %s, %s, %s, %s, %s, %s, %s, %s"
        params = (
            reserva.nombres,
            reserva.apellidos,
            reserva.telefono,
            reserva.email,
            reserva.dni,
            reserva.espacio_id,
            reserva.fecha_entrada,
            reserva.fecha_salida
        )
        return self._execute_query(query, params, is_write=True)

    def registrar_pago(self, reserva_id: int, metodo: str, monto: int):
        """
        Registra el pago de una reserva existente.
        """
        query = "EXEC sp_registrar_pago %s, %s, %s"
        params = (reserva_id, metodo, monto)
        return self._execute_query(query, params, is_write=True)