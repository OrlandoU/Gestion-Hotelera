from app.repositories.base import BaseRepository
from datetime import date
from app.models import TicketSchema, ComentarioSchema

class TicketRepository(BaseRepository):
    def listar(self, numero_ticket: str, fecha_creacion: date, estado: str):
        """
        Lista los tickets
        """
        query = "EXEC sp_listar_tickets %s, %s, %s"
        params = (
            numero_ticket, fecha_creacion, estado
        )
        return self._execute_query(query, params)

    def obtener_kpi(self):
        """
        Obtiene el KPI de tickets
        """
        query = "EXEC sp_reporte_tickets"
        return self._execute_query(query, ())

    def crear(self, ticket: TicketSchema):
        """
        Crea un ticket
        """
        print(ticket)
        query = "EXEC sp_crear_ticket %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s"
        params = (
            ticket.espacio_id,
            ticket.reserva_id, 
            ticket.usuario_id, 
            ticket.responsable_id, 
            ticket.nombre_responsable, 
            ticket.telefono_responsable, 
            ticket.titulo, 
            ticket.descripcion, 
            ticket.estado, 
            ticket.fecha_creacion, 
            ticket.fecha_limite,
            ticket.tipo,
            ticket.prioridad
        )
        return self._execute_query(query, params, is_write=True)

    def actualizar(self, ticket_id: int, estado: str):
        """
        Actualiza un ticket
        """
        query = "EXEC sp_modificar_ticket %s, %s"
        params = (
            ticket_id,
            estado
        )
        return self._execute_query(query, params, is_write=True)

    def listar_comentarios(self, ticket_id: int, fecha_creacion: date, usuario_id: int):
        """
        Lista los comentarios de un ticket
        """
        query = "EXEC sp_listar_comentarios %s, %s, %s"
        params = (
            ticket_id,
            fecha_creacion,
            usuario_id
        )
        return self._execute_query(query, params)

    def crear_comentario(self, comentario: ComentarioSchema):
        """
        Crea un comentario
        """
        query = "EXEC sp_registrar_comentario %s, %s, %s, %s"
        params = (
            comentario.usuario_id,
            comentario.ticket_id,
            comentario.contenido,
            None
        )
        return self._execute_query(query, params, is_write=True)
