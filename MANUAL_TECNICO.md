# Manual Técnico - Sistema de Gestión Hotelera

## 1. Portada

### Proyecto
Sistema de Gestión Hotelera

### Descripción general
Aplicación web para la gestión operativa de un hotel, integrando módulos de reservas, huéspedes, habitaciones, mantenimiento, inventario, productos y reportes.

### Tecnologías principales
- Backend: FastAPI (Python)
- Frontend: Next.js (TypeScript)
- Estilos: TailwindCSS
- Base de datos: SQL Server
- Conexión y acceso a datos: pymssql

---

## 2. Arquitectura del sistema

### Arquitectura general
El sistema se organiza en una arquitectura cliente-servidor con dos capas principales:
- Backend: expone endpoints REST y encapsula la lógica de acceso a datos en repositorios.
- Frontend: consume los servicios del backend mediante hooks y funciones HTTP.

### Principios de diseño
- Separación de responsabilidades: las rutas gestionan el protocolo HTTP; los repositorios encapsulan el acceso a datos; los modelos definen los contratos de entrada y salida.
- Centralización de acceso a datos: la lógica de base de datos se concentra en los repositorios y procedimientos almacenados.
- Consumo explícito de servicios: el frontend reutiliza funciones y hooks para mantener una capa de integración clara y predecible.

### Estructura del repositorio
- Backend: carpeta app/
  - routes/: endpoints FastAPI
  - repositories/: lógica de acceso a datos
  - models/: esquemas Pydantic y modelos de dominio
  - database.py: configuración y conexión a base de datos
- Frontend: carpeta gestion-hotelera/
  - app/: páginas y rutas del App Router
  - components/: componentes reutilizables
  - functions/: servicios HTTP y helpers

### Patrón de diseño aplicado
- Backend: Patrón Repositorio, donde las rutas delegan a repositorios que encapsulan consultas y procedimientos almacenados.
- Frontend: componentes reutilizables, hooks y funciones de servicio que centralizan las llamadas HTTP.

### Flujo de información principal
1. El usuario interactúa con una vista del frontend.
2. El componente o hook invoca una función de servicio HTTP.
3. El backend recibe la petición a través de FastAPI.
4. La ruta delega al repositorio correspondiente.
5. El repositorio ejecuta un stored procedure o una consulta directa contra SQL Server.
6. El resultado se devuelve al frontend para ser mostrado en pantalla.

### Resumen ejecutivo de la arquitectura
El sistema está orientado a mantener un flujo de negocio claro: la interfaz recoge datos, el backend valida y procesa, y la base de datos realiza el almacenamiento y la consulta de información operativa.

---

## 3. Requisitos

### Requisitos de software
- Python 3.x
- Node.js y pnpm
- SQL Server
- Dependencias de Python definidas en app/requirements.txt
- Dependencias de Node definidas en gestion-hotelera/package.json

### Variables y configuración
- El backend utiliza archivos de configuración y conexión a base de datos definidos en la carpeta app.
- El frontend usa Next.js con configuración propia dentro de gestion-hotelera/.

---

## 4. Instalación

### Backend
1. Ir a la carpeta app.
2. Instalar dependencias de Python desde el archivo de requisitos del proyecto.
3. Configurar la conexión a SQL Server en la capa de acceso a datos del backend.
4. Ejecutar la aplicación FastAPI desde el punto de entrada principal del backend.

### Frontend
1. Ir a la carpeta gestion-hotelera.
2. Instalar dependencias con pnpm.
3. Ejecutar la aplicación de Next.js desde la carpeta del frontend.
4. Verificar que las funciones HTTP del proyecto apunten al backend correcto y que los endpoints esperados estén disponibles.

---

## 5. Documentación de la API

### 5.1 Endpoints del backend

| Módulo | Método | Ruta | Propósito |
|---|---|---|---|
| Huéspedes | GET | /huespedes | Lista huéspedes mediante sp_listar_huespedes. |
| Huéspedes | GET | /huespedes/{huesped_id} | Obtiene un huésped por ID mediante sp_obtener_huesped. |
| Huéspedes | POST | /huespedes | Crea un huésped usando el modelo Huesped. |
| Espacios | GET | /espacios/habitaciones | Devuelve habitaciones consultando vw_habitaciones o vw_reporte_habitaciones. |
| Espacios | GET | /espacios/{espacio_id} | Obtiene un espacio específico por ID. |
| Reservas | GET | /reservas | Lista reservas filtradas por fecha de entrada. |
| Reservas | GET | /reservas/habitaciones-disponibles | Consulta disponibilidad entre dos fechas mediante sp_mostrar_habitaciones_disponibles. |
| Reservas | GET | /reservas/{reserva_id} | Obtiene una reserva específica con sp_obtener_reserva. |
| Reservas | POST | /reservas | Crea una reserva usando ReservaSchema y sp_crear_reserva. |
| Reservas | POST | /reservas/{reserva_id}/pagos | Registra un pago con sp_registrar_pago. |
| Productos | GET | /productos | Lista productos filtrando por proveedor opcionalmente. |
| Productos | POST | /productos/registrar-compra | Registra una compra usando CompraCreateSchema y crear_compra_json. |
| Reportes | GET | /reportes | Ruta base para reportes del sistema. |
| Reportes | GET | /reportes/clientes | Reporte de clientes frecuentes. |
| Reportes | GET | /reportes/reservaciones-diarias | Reporte diario de reservas. |
| Reportes | GET | /reportes/estado-de-habitaciones | Estado de habitaciones. |
| Reportes | GET | /reportes/actividades-mantenimientos-diarias | Actividades de mantenimiento. |
| Reportes | GET | /reportes/pagos-realizados | Pagos realizados. |
| Reportes | GET | /reportes/consumo-stock-semanal | Consumo de stock semanal. |
| Reportes | GET | /reportes/estadistica-ocupacion-mensual | Estadística mensual de ocupación. |
| Reportes | GET | /reportes/ingresos-tipo-habitacion | Ingresos por tipo de habitación. |
| Reportes | GET | /reportes/consumo-amenidades-mensual | Consumo mensual de amenidades. |
| Reportes | GET | /reportes/incidentes | Reporte de incidentes. |

### 5.2 Modelos Pydantic y contratos del backend

#### Modelos principales
| Modelo | Propósito | Campos principales |
|---|---|---|
| Huesped | Representa la información de un huésped | nombres, apellidos, telefono, email, dni |
| ReservaSchema | Define el payload de creación de reservas | huesped_id, espacio_id, fecha_entrada, fecha_salida, cantidad_unidades, tarifa |
| CompraCreateSchema | Define el payload de compra de productos | proveedor_id, numero_factura_proveedor, fecha_compra, detalles |
| DetalleCompraSchema | Describe una línea de detalle dentro de una compra | producto_id, cantidad, costo_unitario |

#### Notas de diseño
- Los modelos se definen en app/models/ y se usan tanto por rutas como por repositorios.
- El uso de Pydantic permite validar estructuras de entrada y lograr una comunicación más clara entre capas.

### 5.3 Servicios HTTP del frontend

#### Módulo de reservas
El frontend cuenta con funciones en gestion-hotelera/functions/reservas.ts para interactuar con los endpoints del backend:

| Función | Propósito |
|---|---|
| getReserva(id) | Recupera una reserva por su identificador |
| registrarPago(reserva_id, metodo, monto) | Registra un pago asociado a una reserva |
| getReservas(fecha_entrada) | Obtiene reservas filtradas por fecha |
| getHabitacionesDisponibles(fechaEntrada, fechaSalida) | Consulta disponibilidad de habitaciones |
| crearReserva(datos) | Envía una nueva reserva al backend |

Además, se exponen hooks personalizados como:
- useReservas(fecha_entrada)
- useHabitacionesDisponibles(fechaEntrada, fechaSalida)

#### Módulo base HTTP
- gestion-hotelera/functions/http-base.ts ofrece un helper reutilizable para construir solicitudes con query params y manejo de errores.
- gestion-hotelera/functions/reportes-api.ts encapsula el acceso a los endpoints de reportes y define interfaces TypeScript específicas por vista.

### 5.4 Procedimientos almacenados y vistas clave

#### Procedimientos almacenados referenciados por el backend
| Procedimiento | Uso principal |
|---|---|
| sp_listar_huespedes | Listar huéspedes |
| sp_obtener_huesped | Obtener un huésped por ID |
| sp_crear_huesped | Crear huésped |
| sp_actualizar_huesped | Actualizar huésped |
| sp_eliminar_huesped | Eliminar huésped |
| sp_listar_productos | Listar productos |
| sp_mostrar_habitaciones_disponibles | Consultar disponibilidad de habitaciones |
| sp_obtener_reserva | Recuperar una reserva específica |
| sp_crear_reserva | Crear una nueva reserva |
| sp_registrar_pago | Registrar pagos de una reserva |
| sp_listar_proveedores | Listar proveedores |
| sp_clientes_frecuentes | Reporte de clientes frecuentes |
| sp_reporte_reservaciones_diarias | Reporte de reservas por día |
| sp_reporte_actividades_mantenimiento | Reporte de actividades de mantenimiento |
| sp_listar_pagos_realizados | Reporte de pagos realizados |
| sp_consumo_stock_semanal | Reporte de consumo de stock |
| sp_estadistica_ocupacion_habitacion_mensual | Estadísticas de ocupación mensual |
| sp_ingresos_por_tipo_habitacion | Ingresos por tipo de habitación |
| sp_resumen_mensual_consumo_productos | Consumo mensual de productos |
| sp_incidentes | Reporte de incidentes |
| crear_compra_json | Registrar una compra con detalles JSON |

#### Vistas referenciadas
| Vista | Uso |
|---|---|
| vw_habitaciones | Consulta general de habitaciones |
| vw_reporte_habitaciones | Reporte o filtrado de habitaciones disponibles |

### 5.5 Resumen operativo del sistema

El sistema está pensado para que cada interacción siga un patrón claro:
- La UI recoge información del usuario.
- El servicio HTTP la transforma en una petición REST.
- FastAPI enruta la solicitud al repositorio adecuado.
- El repositorio ejecuta lógica de base de datos en SQL Server.
- El resultado vuelve al frontend para mostrarse o procesarse.

Este diseño permite separar responsabilidades y facilitar mantenimiento, pruebas y evolución del sistema.

---

## 6. Mapa de módulos principales

### 6.1 Estructura del backend
- app/routes/: define los endpoints HTTP y agrupa la lógica por dominio.
- app/repositories/: encapsula las operaciones de acceso a datos y ejecución de stored procedures.
- app/models/: contiene los esquemas Pydantic usados para validar entradas y definir contratos.
- app/database.py: centraliza la conexión con la base de datos.

### 6.2 Estructura del frontend
- gestion-hotelera/app/: contiene las pantallas y páginas del sistema según el App Router.
- gestion-hotelera/components/: agrupa componentes reutilizables como encabezados, modales, paginación y toasts.
- gestion-hotelera/functions/: centraliza la lógica de consumo de API, hooks y helpers reutilizables.
- gestion-hotelera/data/: almacena modelos o datos estáticos de ejemplo.

### 6.3 Componentes del frontend relevantes
- Páginas de reservas: gestion-hotelera/app/bd/reservaciones/
- Páginas de huéspedes: gestion-hotelera/app/bd/clientes/
- Páginas de habitaciones: gestion-hotelera/app/bd/habitaciones/
- Páginas de reportes: gestion-hotelera/app/bd/reportes/
- Componentes compartidos: gestion-hotelera/components/

### 6.4 Puntos de integración importantes
- Los servicios HTTP del frontend se concentran en gestion-hotelera/functions/.
- Las páginas de negocio consumen directamente esos servicios para mantener la lógica de integración centralizada.
- El backend actúa como proveedor de datos y la interfaz como capa de presentación y experiencia de usuario.

## 7. Flujo completo de una reserva

### 7.1 Inicio del proceso
El usuario accede a la sección de reservas desde el frontend. La vista solicita disponibilidad de habitaciones mediante el hook useHabitacionesDisponibles o una llamada equivalente desde la página de creación.

### 7.2 Consulta de disponibilidad
El frontend invoca la función getHabitacionesDisponibles, que construye una petición GET a /reservas/habitaciones-disponibles con fecha de entrada y salida.

### 7.3 Creación de la reserva
Una vez seleccionada la habitación y captados los datos del huésped, la interfaz llama a crearReserva(datos). Esta función envía una petición POST a /reservas con un payload basado en ReservaSchema.

### 7.4 Procesamiento en backend
La ruta /reservas delega a ReservaRepository, que ejecuta sp_crear_reserva para registrar la reserva en SQL Server.

### 7.5 Registro de pago
Si el proceso continúa con el pago, el frontend invoca registrarPago(reserva_id, metodo, monto), que consume POST /reservas/{reserva_id}/pagos y ejecuta sp_registrar_pago en el backend.

### 7.6 Respuesta al usuario
El backend devuelve mensajes de éxito o errores, y la interfaz puede mostrar el estado al usuario, actualizar tablas o redirigir a otra vista.

## 8. Esquema de base de datos

Aunque el archivo SQL completo no está presente en el workspace en este momento, el código del backend permite identificar las entidades y campos principales que el sistema maneja. La documentación técnica a continuación se basa en esos modelos y en el uso de los procedimientos almacenados.

### 8.1 Esquema de base de datos basado en el SQL entregado

El archivo [db.sql](db.sql) expone un modelo relacional más completo que el inicial. A continuación se resumen las tablas y campos que faltaban en la documentación previa.

#### 8.1.1 Tablas principales de negocio

##### TB_HUESPED
| Campo | Descripción |
|---|---|
| HUESPED_ID | Identificador único del huésped |
| NOMBRE | Nombres del huésped |
| APELLIDO | Apellidos del huésped |
| TELEFONO | Teléfono de contacto |
| EMAIL | Correo electrónico |
| DNI | Documento de identidad |
| ESTADO_ACTIVO | Indicador de vigencia del registro |
| FECHA_CREACION / FECHA_ACTUALIZACION | Auditoría de creación y modificación |

##### TB_ESPACIO
| Campo | Descripción |
|---|---|
| ESPACIO_ID | Identificador único del espacio o habitación |
| NUMERO_ESPACIO | Número o código del espacio |
| NUMERO_PISO | Piso donde se encuentra el espacio |
| CAPACIDAD_HUESPEDES | Capacidad máxima de personas |
| ESTADO | Estado operativo del espacio |
| ESTADO_ACTIVO | Indicador de actividad |
| DESCRIPCION | Descripción general del espacio |
| TIPO | Tipo de espacio |
| CATEGORIA | Categoría del espacio |
| ESPACIO_PADRE_ID | Referencia jerárquica a un espacio padre |
| ESTADO_MANTENIMIENTO | Estado de mantenimiento |
| FECHA_ULTIMA_LIMPIEZA | Fecha de la última limpieza |
| FECHA_ULTIMO_MANTENIMIENTO | Fecha del último mantenimiento |

##### TB_RESERVA
| Campo | Descripción |
|---|---|
| RESERVA_ID | Identificador único de la reserva |
| HUESPED_ID | Referencia al huésped |
| ESPACIO_ID | Referencia al espacio reservado |
| FECHA_ENTRADA / FECHA_SALIDA | Rango de estadía |
| FECHA_RESERVA | Fecha en que se generó la reserva |
| ESTADO_RESERVA | Estado de la reserva |
| MONTO_TOTAL / MONTO_PAGADO / SUBTOTAL / TARIFA | Información financiera básica |
| OBSERVACIONES | Comentarios adicionales |
| NUMERO_PERSONAS | Número de personas asociadas |
| METODO_PAGO / ESTADO_PAGO / TIPO_PAGO | Datos de pago |
| PORCENTAJE_ADELANTO / PORCENTAJE_RESTANTE / PORCENTAJE_PAGADO | Indicadores de pago |
| FECHA_INICIO / FECHA_FIN | Fechas operativas de la reserva |

##### TB_PAGO
| Campo | Descripción |
|---|---|
| PAGO_ID | Identificador único del pago |
| RESERVA_ID | Reserva asociada |
| MONTO | Monto del pago |
| METODO_PAGO | Método de pago |
| ESTADO_PAGO | Estado del registro de pago |
| FECHA_PAGO | Fecha del pago |

##### TB_COMPRA y TB_DETALLE_COMPRA
| Campo | Descripción |
|---|---|
| COMPRA_ID | Identificador único de la compra |
| PROVEEDOR_ID | Referencia al proveedor |
| NUMERO_FACTURA_PROVEEDOR | Número de factura del proveedor |
| FECHA_COMPRA | Fecha de la compra |
| TOTAL_COMPRA | Total del documento |
| ESTADO_COMPRA | Estado de la compra |
| DETALLE_COMPRA_ID / PRODUCTO_ID / CANTIDAD / COSTO_UNITARIO / SUBTOTAL | Detalle de los productos incluidos |

##### TB_MANTENIMIENTO, TB_INCIDENTE y TB_SOLICITUD_MANTENIMIENTO
| Tabla | Campos clave |
|---|---|
| TB_MANTENIMIENTO | MANTENIMIENTO_ID, ESPACIO_ID, DESCRIPCION, ESTADO, FECHA_INICIO, FECHA_FIN |
| TB_INCIDENTE | INCIDENTE_ID, ESPACIO_ID, DESCRIPCION, ESTADO, FECHA_REPORTE |
| TB_SOLICITUD_MANTENIMIENTO | SOLICITUD_MANTENIMIENTO_ID, ESPACIO_ID, USUARIO_ID, DESCRIPCION, ESTADO, FECHA_SOLICITUD |

#### 8.1.2 Tablas de soporte, catálogo y auditoría

##### TB_USUARIO y TB_REPORTE
| Tabla | Campos clave |
|---|---|
| TB_USUARIO | USUARIO_ID, NOMBRE, APELLIDO, EMAIL, CONTRASENA, ROL, ESTADO_ACTIVO |
| TB_REPORTE | REPORTE_ID, TITULO, DESCRIPCION, FECHA_GENERACION, FORMATO, PATH_ARCHIVO, USUARIO_ID |

##### TB_CONFIGURACION, TB_LOG y historiales
| Tabla | Campos clave |
|---|---|
| TB_CONFIGURACION | CONFIGURACION_ID, CLAVE, VALOR, DESCRIPCION, ESTADO_ACTIVO |
| TB_LOG | LOG_ID, USUARIO_ID, ACCION, DETALLE, FECHA |
| TB_HISTORIAL_PAGO | HISTORIAL_PAGO_ID, RESERVA_ID, PAGO_ID, MONTO, FECHA_REGISTRO |
| TB_HISTORIAL_ESTADO | HISTORIAL_ESTADO_ID, RESERVA_ID, ESTADO_ANTERIOR, ESTADO_NUEVO, FECHA_CAMBIO |
| TB_HISTORIAL_CUENTA | HISTORIAL_CUENTA_ID, HUESPED_ID, ESTADO_ANTERIOR, ESTADO_NUEVO, FECHA_CAMBIO |

##### Catálogos y tablas auxiliares
| Tabla | Propósito |
|---|---|
| TB_TIPO_HABITACION | Catálogo de tipos de habitación |
| TB_TIPO_PAGO | Catálogo de métodos o tipos de pago |
| TB_TIPO_ESPACIO | Catálogo de tipos de espacio |
| TB_CATEGORIA_ESPACIO | Catálogo de categorías operativas |
| TB_TIPO_MONEDA | Catálogo de monedas |
| TB_TIPO_DOCUMENTO | Catálogo de documentos de identidad |
| TB_TIPO_ESTADO / TB_ESTADO | Catálogo y valores de estados transversales |
| TB_DOC_IDENTIDAD | Documentos de identidad asociados a huéspedes |
| TB_CONTACTO / TB_TIPO_CONTACTO | Contactos de huéspedes y tipos de contacto |
| TB_BANCO / TB_TARJETA / TB_TARJETA_RESERVA | Información bancaria y medios de pago asociados a reservas |
| TB_TIPO_HUELLA / TB_HUELLA / TB_FIRMA | Datos biométricos o de firma del huésped |
| TB_REPORTE_DETALLE / TB_REPORTE_ESTADISTICO | Detalle interno de reportes |
| TB_TIPO_REPORTE / TB_TIPO_REPORTE_DETALLE / TB_REPORTE_TIPO_REPORTE / TB_REPORTE_TIPO_REPORTE_DETALLE | Estructura de clasificación y asociación de reportes |

### 8.2 Reglas de negocio derivadas del esquema
- Una reserva debe quedar asociada a un huésped y a un espacio válidos.
- El estado de una reserva debe poder evolucionar a través de un historial, no solo como valor estático.
- Los pagos deben registrarse de forma independiente y poder ser auditados por reserva.
- Las compras deben conservar trazabilidad de proveedor, producto y detalle de compra.
- Las solicitudes de mantenimiento, incidentes y reportes deben quedar vinculados a un espacio y a un usuario responsable.
- Los datos de contacto, documentos e incluso firmas o huellas constituyen información complementaria del huésped.

### 8.3 Estados de dominio recomendados
| Entidad | Estados sugeridos |
|---|---|
| Reserva | Pendiente, Confirmada, Cancelada, Finalizada |
| Pago | Pendiente, Pagado, Rechazado, Parcial |
| Compra | Registrada, Procesada, Anulada |
| Espacio | Disponible, Ocupado, Mantenimiento, Inactivo |
| Producto | Disponible, Agotado, Inactivo |
| Solicitud de mantenimiento | Creada, En proceso, Resuelta, Cancelada |

### 8.4 Relación entre capas
- El backend modela estas tablas mediante modelos Pydantic y repositorios.
- Los procedimientos almacenados y consultas SQL operan sobre las tablas reales contenidas en [db.sql](db.sql).
- El frontend consume la información a través de endpoints REST y presenta los datos operativos al usuario.

### 8.5 Relaciones reales detectadas en el esquema

| Tabla origen | Campo relacionado | Tabla destino |
|---|---|---|
| TB_PRODUCTO | PROVEEDOR_ID | TB_PROVEEDOR |
| TB_RESERVA | HUESPED_ID | TB_HUESPED |
| TB_RESERVA | ESPACIO_ID | TB_ESPACIO |
| TB_PAGO | RESERVA_ID | TB_RESERVA |
| TB_COMPRA | PROVEEDOR_ID | TB_PROVEEDOR |
| TB_DETALLE_COMPRA | COMPRA_ID | TB_COMPRA |
| TB_DETALLE_COMPRA | PRODUCTO_ID | TB_PRODUCTO |
| TB_MANTENIMIENTO | ESPACIO_ID | TB_ESPACIO |
| TB_INCIDENTE | ESPACIO_ID | TB_ESPACIO |
| TB_REPORTE | USUARIO_ID | TB_USUARIO |
| TB_SOLICITUD_MANTENIMIENTO | ESPACIO_ID | TB_ESPACIO |
| TB_SOLICITUD_MANTENIMIENTO | USUARIO_ID | TB_USUARIO |
| TB_LOG | USUARIO_ID | TB_USUARIO |
| TB_HISTORIAL_PAGO | RESERVA_ID | TB_RESERVA |
| TB_HISTORIAL_PAGO | PAGO_ID | TB_PAGO |
| TB_RESERVA_HUESPED | RESERVA_ID | TB_RESERVA |
| TB_RESERVA_HUESPED | HUESPED_ID | TB_HUESPED |
| TB_RESERVA_ESPACIO | RESERVA_ID | TB_RESERVA |
| TB_RESERVA_ESPACIO | ESPACIO_ID | TB_ESPACIO |
| TB_HISTORIAL_ESTADO | RESERVA_ID | TB_RESERVA |
| TB_DOC_IDENTIDAD | HUESPED_ID | TB_HUESPED |
| TB_DOC_IDENTIDAD | TIPO_DOCUMENTO_ID | TB_TIPO_DOCUMENTO |
| TB_CONTACTO | HUESPED_ID | TB_HUESPED |
| TB_TARJETA | BANCO_ID | TB_BANCO |
| TB_TARJETA | HUESPED_ID | TB_HUESPED |
| TB_TARJETA_RESERVA | TARJETA_ID | TB_TARJETA |
| TB_TARJETA_RESERVA | RESERVA_ID | TB_RESERVA |
| TB_HUELLA | HUESPED_ID | TB_HUESPED |
| TB_HUELLA | TIPO_HUELLA_ID | TB_TIPO_HUELLA |
| TB_FIRMA | HUESPED_ID | TB_HUESPED |
| TB_HISTORIAL_CUENTA | HUESPED_ID | TB_HUESPED |
| TB_REPORTE_DETALLE | REPORTE_ID | TB_REPORTE |
| TB_REPORTE_ESTADISTICO | REPORTE_ID | TB_REPORTE |
| TB_REPORTE_TIPO_REPORTE | REPORTE_ID | TB_REPORTE |
| TB_REPORTE_TIPO_REPORTE | TIPO_REPORTE_ID | TB_TIPO_REPORTE |
| TB_REPORTE_TIPO_REPORTE_DETALLE | REPORTE_ID | TB_REPORTE |
| TB_REPORTE_TIPO_REPORTE_DETALLE | TIPO_REPORTE_DETALLE_ID | TB_TIPO_REPORTE_DETALLE |

### 8.6 Consideraciones de integridad referencial
- Las referencias entre tablas deben mantenerse consistentes para evitar datos huérfanos.
- Las tablas de historial y auditoría deben conservarse incluso cuando la entidad principal cambie de estado.
- Los campos de fecha y estado deben validar su consistencia para evitar conflictos operativos.
- En un entorno real de SQL Server, estas relaciones deberían implementarse con claves foráneas y restricciones de integridad.

### 8.7 Modelo relacional orientado a negocio
El esquema expuesto en [db.sql](db.sql) permite entender el sistema como una base operativa hotelera donde:
- las reservas representan la ocupación del hotel,
- los espacios representan las habitaciones o unidades operativas,
- los pagos registran la liquidación económica de las reservas,
- los productos y compras soportan el control de inventario y abastecimiento,
- los reportes y catálogos permiten auditoría y análisis,
- y los datos complementarios del huésped amplían el perfil para operaciones futuras.

## 9. Seguridad y buenas prácticas

### 9.1 Principios de seguridad
- Restringir el acceso a los endpoints por rol o contexto de negocio cuando se implemente autenticación.
- Validar todas las entradas en el backend mediante modelos Pydantic antes de ejecutar lógica o consultas.
- Evitar exponer información sensible en respuestas de error o logs.
- Proteger los accesos a SQL Server mediante credenciales seguras y permisos mínimos por usuario.

### 9.2 Recomendaciones operativas
- Mantener los secretos y credenciales fuera del repositorio y en variables de entorno o mecanismos seguros de despliegue.
- Revisar periódicamente los procedimientos almacenados y consultas para evitar patrones inseguros o de alto costo.
- Limitar la exposición de rutas administrativas o sensibles a usuarios autorizados.
- Usar mecanismos de logging y monitoreo para auditar operaciones críticas como reservas, pagos y compras.

## 10. Despliegue y entorno de ejecución

### 10.1 Consideraciones generales
El sistema puede desplegarse como una solución distribuida con un frontend Next.js y un backend FastAPI conectado a SQL Server. En entornos productivos, es recomendable separar claramente los ambientes de desarrollo, pruebas y producción.

### 10.2 Configuración recomendada
- Configurar variables de entorno para la conexión al motor de base de datos y la URL del frontend.
- Definir puertos explícitos para backend y frontend para facilitar la operación y monitoreo.
- Implementar health checks o verificaciones básicas de disponibilidad antes de exponer el sistema a usuarios finales.
- Preparar un proceso de respaldo y restauración para la base de datos antes de cambios críticos.

## 11. Troubleshooting y diagnóstico

### 11.1 Errores comunes
- Error de conexión a SQL Server: revisar credenciales, disponibilidad del servidor y permisos del usuario.
- Error 404 o 500 en endpoints: verificar que la ruta exista y que el repositorio asociado esté correctamente importado.
- Datos no mostrados en interfaz: revisar el flujo entre servicio HTTP, endpoint y consulta SQL.
- Inconsistencias en reservas o pagos: revisar los procedimientos almacenados y el estado de las transacciones.

### 11.2 Estrategias de diagnóstico
- Revisar logs del backend y del servidor de base de datos.
- Validar manualmente la entrada de datos y el payload enviado desde el frontend.
- Probar los endpoints con herramientas como Postman o curl para aislar si el problema está en el backend o en la capa de presentación.
- Registrar los errores con contexto y fecha para facilitar futuras investigaciones.

## 12. Roadmap de evolución

### Mejoras recomendadas
- Incorporar autenticación y autorización para usuarios del sistema.
- Añadir pruebas automatizadas para backend y frontend.
- Implementar logging estructurado y métricas de rendimiento.
- Mejorar el manejo de excepciones y mensajes de error para el usuario final.
- Añadir migraciones y versionado de base de datos para un control más robusto de cambios.

## 13. Glosario técnico

| Término | Definición |
|---|---|
| Reserva | Registro del arribo y uso de una habitación por un huésped durante un rango de fechas. |
| Huésped | Persona asociada a una reserva o a una estancia en el hotel. |
| Espacio | Entidad que representa una habitación o unidad operativa del hotel. |
| Stored Procedure | Procedimiento almacenado de SQL Server usado para encapsular lógica de negocio y acceso a datos. |
| View | Vista SQL que simplifica consultas para lectura de datos agregados o consolidados. |
| Endpoint | Ruta expuesta por el backend FastAPI para recibir solicitudes HTTP. |
| Repositorio | Capa que centraliza el acceso a datos y delega la ejecución de consultas o procedimientos. |
| Modelo Pydantic | Estructura de validación utilizada por FastAPI para definir contratos de entrada. |

## 14. Criterios de mantenimiento técnico

- Mantener la documentación alineada con el código real del repositorio.
- Cada vez que se agregue o modifique un endpoint, modelo, servicio HTTP o stored procedure, actualizar la sección correspondiente del manual.
- Preferir explicaciones claras y precisas sobre documentación excesivamente descriptiva.
- Incluir referencias a los archivos fuente relevantes cuando una sección sea modificada.
- Mantener un lenguaje técnico consistente y adecuado para desarrolladores, analistas y personal de soporte.
- Registrar cambios importantes de arquitectura, datos o integración para facilitar el mantenimiento futuro del sistema.
