from typing import Optional

from app.models.usuario import UsuarioCreateSchema
from app.repositories.base import BaseRepository


class UsuarioRepository(BaseRepository):
    def __init__(self, db):
        super().__init__(db)
        self._ensure_table()

    def _ensure_table(self) -> None:
        query = """
        IF OBJECT_ID(N'dbo.usuarios', N'U') IS NULL
        BEGIN
            CREATE TABLE dbo.usuarios (
                usuario_id INT IDENTITY(1,1) PRIMARY KEY,
                primer_nombre NVARCHAR(150) NOT NULL,
                segundo_nombre NVARCHAR(150) NOT NULL,
                primer_apellido NVARCHAR(150) NOT NULL,
                segundo_apellido NVARCHAR(150) NOT NULL,
                fecha_nacimiento DATE NOT NULL,
                telefono NVARCHAR(50) NULL,
                email NVARCHAR(255) NOT NULL UNIQUE,
                password_hash NVARCHAR(255) NOT NULL,
                created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
            )
        END
        """
        self._execute_query(query, is_write=True)

    def crear(self, usuario: UsuarioCreateSchema, hashed_password: str) -> int:
        print(usuario)
        query = """
        Exec crear_usuario %s, %s, %s, %s, %s, %s, %s, %s, %s, %s;
        """
        result = self._execute_query(
            query,
            (
                usuario.primer_nombre,
                usuario.segundo_nombre,
                usuario.primer_apellido,
                usuario.segundo_apellido,
                usuario.fecha_nacimiento,
                usuario.telefono,
                usuario.email,
                None,
                hashed_password,
                None
            ),
            is_write=True,
        )
        if result:
            if isinstance(result, dict):
                return int(result.get("usuario_id", 0))
            elif isinstance(result, (list, tuple)):
                return int(result[0])
        return 0

    def obtener_por_email(self, email: str) -> Optional[dict]:
        query = "SELECT TOP 1 usuario_id, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, telefono, email, password_hash FROM dbo.usuarios WHERE email = %s"
        return self._execute_query(query, (email,), fetch_one=True)
