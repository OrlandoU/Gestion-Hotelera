import json
from app.repositories.base import BaseRepository
from app.routes.interfaces import CompraCreateSchema

class ProductoRepository(BaseRepository):
    def listar(self, proveedor_id: int = None):
        """
        Lista los productos filtrando por proveedor si se especifica.
        """
        # Nota: En pymssql, si pasas un solo parámetro en la tupla debe ser (proveedor_id,)
        # Si es None, enviamos la tupla vacía o manejamos el SP según corresponda.
        query = "EXEC sp_listar_productos %s"
        params = (proveedor_id,) if proveedor_id is not None else (None,)
        return self._execute_query(query, params)

    def registrar_compra(self, compra_data: CompraCreateSchema) -> dict:
        """
        Registra una compra procesando el esquema estructurado de Pydantic y
        enviando el detalle como JSON a SQL Server.
        """
        # 1. Transformamos la lista de objetos Pydantic a un string JSON puro
        detalles_json = json.dumps([d.model_dump() for d in compra_data.detalles])
        
        # 2. Formateamos la fecha al formato que espera SQL Server
        fecha_formateada = compra_data.fecha_compra.strftime('%Y-%m-%d %H:%M:%S')

        query = """
            EXEC crear_compra_json 
                @proveedor_id = %s, 
                @numero_factura_proveedor = %s, 
                @fecha_compra = %s, 
                @detalles_json = %s;
        """
        params = (
            compra_data.proveedor_id,
            compra_data.numero_factura_proveedor,
            fecha_formateada,
            detalles_json
        )
        
        # Ejecutamos indicando que es escritura (is_write=True) pero obligando a hacer 
        # un fetch_one=True para capturar el 'compra_id' generado por el procedimiento.
        return self._execute_query(query, params, is_write=True, fetch_one=True)