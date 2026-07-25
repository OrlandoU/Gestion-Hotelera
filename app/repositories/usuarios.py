from datetime import date
from app.repositories.base import BaseRepository
from app.models import UsuarioSchema


class UsuarioRepository(BaseRepository):
    def listar(self):
        query = "SELECT * FROM vw_usuarios"
        return self._execute_query(query)
    
    def obtener_por_id(self, usuario_id: int):
        query = "EXEC sp_obtener_usuario %s"
        return self._execute_query(query, (usuario_id,), fetch_one=True)
    
    def crear(self, usuario: UsuarioSchema):
        query = "EXEC sp_crear_usuario %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s"
        params = (
            usuario.primer_nombre,
            usuario.segundo_nombre,
            usuario.primer_apellido,
            usuario.segundo_apellido,
            usuario.fecha_nacimiento,
            usuario.telefono,
            usuario.email,
            usuario.rol,
            usuario.password_hash,
            usuario.fecha_contrato,
        )
        return self._execute_query(query, params, is_write=True)
    
    def actualizar(self, usuario_id: int, usuario: UsuarioSchema):
        query = "EXEC sp_actualizar_usuario %s, %s, %s, %s, %s, %s, %s, %s, %s, %s"
        params = (
            usuario_id,
            usuario.primer_nombre,
            usuario.segundo_nombre,
            usuario.primer_apellido,
            usuario.segundo_apellido,
            usuario.fecha_nacimiento,
            usuario.telefono,
            usuario.email,
            usuario.rol,
            usuario.fecha_contrato,
        )
        return self._execute_query(query, params, is_write=True)
    
    def eliminar(self, usuario_id: int):
        query = "EXEC sp_eliminar_usuario %s"
        return self._execute_query(query, (usuario_id,), is_write=True)
    