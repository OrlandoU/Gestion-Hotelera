from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query
from app.database import get_db
import pymssql
from .reservas_interface import ReservaSchema

router = APIRouter(
    prefix="/reservas",
    tags=["reservas"]
)

@router.get("")
def read_reservas():
    return {"Hello": "World"}

@router.get("/obtener-reserva")
def obtener_reserva(
    reserva_id: int = Query(..., description="ID de la reserva"),
    db = Depends(get_db)
):
    cursor = None
    try:
        cursor = db.cursor(as_dict=True)
        cursor.execute("EXEC sp_obtener_reserva %s", (reserva_id))
        reserva = cursor.fetchone()
        return reserva
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")
    finally:
        if cursor:
            cursor.close()

# PAGO
@router.post("/registrar-pago")
def registrar_pago(    
    reserva_id: int = Query(..., description="ID de la reserreserva va"),
    metodo: str = Query(..., description="Método de pago"),
    monto: int = Query(..., description="Monto a pagar"),
    db = Depends(get_db)
):
    cursor = None
    try:
        cursor = db.cursor(as_dict=True)
        cursor.execute("EXEC sp_registrar_pago %s, %s, %s", (reserva_id, metodo, monto))
        db.commit()
        return {"message": "Pago registrado exitosamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")
    finally:
        if cursor:
            cursor.close()


@router.get("/listar-reservaciones")
def listar_reservaciones(
    fecha_entrada: date = Query(..., description="Fecha de entrada"),
    db = Depends(get_db)
):
    cursor = None
    try:
        cursor = db.cursor(as_dict=True)
        # Usamos %s para pymssql
        cursor.execute("EXEC sp_listar_reservaciones %s", (fecha_entrada,))
        reservaciones = cursor.fetchall()
        
        return reservaciones
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")
    finally:
        if cursor:
            cursor.close()


@router.get("/mostrar-habitaciones-disponibles")
def mostrar_habitaciones_disponibles(
    fecha_entrada: date = Query(default=date.today(), description="Formato YYYY-MM-DD"),
    fecha_salida: date = Query(default=date.today(), description="Formato YYYY-MM-DD"),
    db = Depends(get_db)
):
    cursor = None
    try:
        cursor = db.cursor(as_dict=True)
        cursor.execute(
            "EXEC sp_mostrar_habitaciones_disponibles %s, %s", 
            (fecha_entrada, fecha_salida)
        )
        
        habitaciones_disponibles = cursor.fetchall()
        return habitaciones_disponibles

    except ValueError as val_err:
        # Captura si el string enviado desde el frontend no tenía un formato ISO válido
        print("ERROR DE PARSEO DE FECHA:", str(val_err))
        raise HTTPException(status_code=400, detail=f"Formato de fecha inválido. Use YYYY-MM-DDTHH:MM:SS")
    except Exception as e:
        print("ERROR CRÍTICO EN PYMSSQL / SQL SERVER:", str(e))
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")
    finally:
        if cursor:
            cursor.close()


@router.post("/crear-reserva")
def crear_reserva(
    reserva: ReservaSchema,
    db = Depends(get_db)
):
    cursor = None
    try:
        # Aunque es un POST, usamos as_dict=True para mantener consistencia con tus otros métodos
        cursor = db.cursor(as_dict=True)
        
        # Ejecutamos el SP enviando los 4 parámetros ordenados con %s
        cursor.execute(
            "EXEC sp_crear_reserva %s, %s, %s, %s, %s, %s, %s, %s",
            (reserva.nombre_huesped, reserva.apellido_huesped, reserva.telefono_huesped, reserva.email_huesped, reserva.huesped_dni, reserva.espacio_id, reserva.fecha_entrada, reserva.fecha_salida)
        )
        
        # REGLA DE ORO PARA INSERCIONES: Confirmar los cambios en la conexión de pymssql
        db.commit()
        
        return {"message": "Reserva creada exitosamente"}
    except Exception as e:
        # Si falla la inserción, deshacemos cualquier cambio pendiente
        db.rollback()
        import traceback
        print("ERROR DETALLADO EN CONSOLA BLACKEND:")
        traceback.print_exc() # Esto imprimirá el error real en la terminal negra de Python 

        raise HTTPException(status_code=500, detail=f"Error al crear reserva: {repr(e)}")
    finally:
        if cursor:
            cursor.close()