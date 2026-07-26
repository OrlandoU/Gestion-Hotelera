from typing import Callable

from fastapi import status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from app.database import get_db
from app.repositories.usuario import UsuarioRepository
from app.utils.security import decode_access_token


class AuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, protected_prefixes=None):
        super().__init__(app)
        self.protected_prefixes = protected_prefixes or ["/reservas"]

    async def dispatch(self, request: Request, call_next: Callable):
        path = request.url.path

        if not any(path.startswith(prefix) for prefix in self.protected_prefixes):
            return await call_next(request)

        # Allow CORS preflight requests through without auth
        if request.method and request.method.upper() == "OPTIONS":
            return await call_next(request)

        # Debug: show method and whether Authorization header is present
        print(f"Auth middleware: method={request.method}, path={path}, has_authorization={('authorization' in request.headers)}")

        authorization = request.headers.get("authorization") or request.headers.get("Authorization")
        if not authorization or not authorization.lower().startswith("bearer "):
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Token faltante o inválido"},
            )

        token = authorization.split(" ", 1)[1].strip()
        print(f"Token recibido en middleware: {token}")
        try:
            payload = decode_access_token(token)
        except ValueError:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Token inválido o expirado"},
            )

        email = payload.get("sub")
        if not email:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Token inválido"},
            )

        try:
            db_generator = get_db()
            db = next(db_generator)
        except Exception as exc:
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={"detail": f"Error al conectar con la base de datos: {exc}"},
            )

        try:
            user_repo = UsuarioRepository(db)
            user = user_repo.obtener_por_email(email)
            if not user:
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Usuario no encontrado"},
                )
            request.state.user = user
        finally:
            db_generator.close()

        return await call_next(request)
