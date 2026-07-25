import traceback
from fastapi import HTTPException, status

class BaseRepository:
    def __init__(self, db):
        self.db = db

    def _execute_query(self, query: str, params: tuple = None, is_write: bool = False, fetch_one: bool = False):
        """
        Método utilitario interno para centralizar el manejo de cursores y errores.
        """
        cursor = None
        try:
            cursor = self.db.cursor(as_dict=True)
            cursor.execute(query, params or ())
            
            if is_write:
                self.db.commit()
                if fetch_one:
                    return cursor.fetchone()
                return True
                
            if fetch_one:
                return cursor.fetchone()
            return cursor.fetchall()
            
        except Exception as e:
            if is_write:
                self.db.rollback()
            traceback.print_exc()  # Opcional: usar un logger real aquí
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error en la base de datos: {str(e)}"
            )
        finally:
            if cursor:
                cursor.close()