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
        query = "EXEC crear_usuario %s, %s, %s, %s, %s, %s, %s, %s, %s, %s"
        params = (
        usuario.primer_nombre,     # 1
        usuario.segundo_nombre,    # 2
        usuario.primer_apellido,   # 3
        usuario.segundo_apellido,  # 4
        usuario.fecha_nacimiento,  # 5
        usuario.telefono,          # 6
        usuario.email,             # 7
        usuario.rol,               # 8
        usuario.password_hash,     # 9
        usuario.fecha_contrato,    # 10
    )
        return self._execute_query(query, params, is_write=True)
    
    def actualizar(self, usuario_id: int, usuario: UsuarioSchema):
        query = "EXEC sp_actualizar_usuario %s, %s, %s, %s"
        params = (
            usuario_id,
            usuario.telefono,
            usuario.email,
            usuario.rol
        )
        return self._execute_query(query, params, is_write=True)
    
    def eliminar(self, usuario_id: int):
        query = "EXEC sp_eliminar_usuario %s"
        return self._execute_query(query, (usuario_id,), is_write=True)
    