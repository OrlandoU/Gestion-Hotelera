'use client';

import PageHeader from "@/components/pageheader";
import { Suspense, ViewTransition } from "react";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useReservacionesDiarias } from "@/functions/reportes-api"; // Ajustado según tu alias de funciones
import Image from "next/image";
import logo from "@/public/logo.png";

export default function Page() {
    return (
        <Suspense fallback={<div className="p-6 text-sm text-slate-500">Cargando reporte…</div>}>
            <ReservasPdfContent />
        </Suspense>
    );
}

function ReservasPdfContent() {
    const searchParams = useSearchParams();

    // Inicializamos la fecha con el día de hoy en formato YYYY-MM-DD
    const hoyStr = new Date().toISOString().split('T')[0];

    // Consumo de la API pasando el parámetro de fecha reactivo
    const fechaFiltro = searchParams.get("fecha") || hoyStr;
    const { data: reservacionesApi, loading, error } = useReservacionesDiarias(fechaFiltro);

    const busqueda = searchParams.get("busqueda") ? decodeURIComponent(searchParams.get("busqueda")!) : "";
    const filtroEstado = searchParams.get("estado") || "Todos";
    const ordenarParam = searchParams.get("ordenar");
    const ordenar: "reserva" | "total" | "noches" = ordenarParam === "reserva" || ordenarParam === "total" || ordenarParam === "noches"
        ? ordenarParam
        : "reserva";

    // Fallback de arreglo seguro
    const reservacionesData = useMemo(() => reservacionesApi || [], [reservacionesApi]);

    const normalizarEstadoHabitacion = (estado?: string) => {
        const valor = (estado || "").trim().toLowerCase();

        if (["finalizada", "finalizado", "completada", "completado", "completed", "done"].includes(valor)) {
            return "Finalizada";
        }

        if (["reservada", "reservado", "reserva", "confirmada", "confirmado", "activa", "active", "booked"].includes(valor)) {
            return "Reservada";
        }

        if (["no asistio", "no asistió", "noasistio", "noshow", "no-show", "no_show"].includes(valor)) {
            return "No asistio";
        }

        if (["cancelada", "cancelado", "cancel", "canceled", "cancellation"].includes(valor)) {
            return "Cancelada";
        }

        if (["hospedado", "hospedada", "ocupado", "checked-in", "checkin", "check-in"].includes(valor)) {
            return "Hospedado";
        }
        if (["pendiente", "pending", "en espera", "waiting"].includes(valor)) {
            return "Pendiente";
        }
        return "Desconocido";
    };

    // Filtrado y Ordenamiento Avanzado en memoria
    const reservacionesFiltradas = useMemo(() => {
        let resultado = [...reservacionesData];

        // Filtro por estado
        if (filtroEstado !== "Todos") {
            const estadoSeleccionado = normalizarEstadoHabitacion(filtroEstado);
            resultado = resultado.filter(r => normalizarEstadoHabitacion(r.reserva_estado) === estadoSeleccionado);
        }

        // Filtro por búsqueda textual (ID de huésped o número de reserva)
        if (busqueda) {
            const b = busqueda.toLowerCase();
            resultado = resultado.filter(r =>
                r.numero_reserva?.toLowerCase().includes(b) ||
                String(r.huesped_id)?.includes(b) ||
                String(r.espacio_id)?.includes(b)
            );
        }

        // Ordenamiento por criterios clave
        resultado.sort((a, b) => {
            if (ordenar === "reserva") return (a.numero_reserva || "").localeCompare(b.numero_reserva || "");
            if (ordenar === "total") return (b.total_pagar || 0) - (a.total_pagar || 0); // Mayor a menor
            if (ordenar === "noches") return (b.cantidad_unidades || 0) - (a.cantidad_unidades || 0);
            return 0;
        });

        return resultado;
    }, [reservacionesData, filtroEstado, busqueda, ordenar]);

    const reservacionesMostradas = reservacionesFiltradas;

    // Mapeo semántico de colores para los badges de estado
    const getColorEstado = (estado: string) => {
        switch (estado?.toLowerCase()) {
            case "pendiente":
                return { bg: "bg-yellow-100 text-yellow-800", border: "border-l-4 border-yellow-500", icon: "hourglass_empty", text: "text-yellow-700" };
            case "finalizada":
                return { bg: "bg-emerald-100 text-emerald-800", border: "border-l-4 border-emerald-500", icon: "task_alt", text: "text-emerald-700" };

            case "reservada":
                return { bg: "bg-blue-100 text-blue-800", border: "border-l-4 border-blue-500", icon: "check_circle", text: "text-blue-700" };
            case "no asistio":
                return { bg: "bg-amber-100 text-amber-800", border: "border-l-4 border-amber-500", icon: "event_busy", text: "text-amber-700" };
            case "cancelada":
                return { bg: "bg-rose-100 text-rose-800", border: "border-l-4 border-rose-500", icon: "cancel", text: "text-rose-700" };
            case "hospedado":
                return { bg: "bg-emerald-100 text-emerald-800", border: "border-l-4 border-emerald-500", icon: "task_alt", text: "text-emerald-700" };
            default:
                return { bg: "bg-slate-100 text-slate-800", border: "border-l-4 border-slate-300", icon: "info", text: "text-slate-700" };
        }
    };

    // Helper para formatear las fechas ISO limpiamente
    const formatFecha = (isoString?: string) => {
        if (!isoString) return "--";
        const date = new Date(isoString);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const formatMoneda = (valor: number) =>
        new Intl.NumberFormat('es-HN', {
            style: 'currency',
            currency: 'HNL',
            maximumFractionDigits: 0,
        }).format(valor);

    const fechaEmitido = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    // Renderizado defensivo en caso de error crítico de la API
    if (error && !loading) {
        return (
            <ViewTransition enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}>
                <PageHeader
                    name="Reservaciones Creadas"
                    subtitle="Listado de reservaciones registradas en la fecha seleccionada"
                />
                <div className="bg-red-50 border border-red-300 rounded-xl p-6 flex items-start gap-4 mt-4">
                    <span className="material-symbols-outlined text-[32px] text-red-600">error</span>
                    <div className="flex-1">
                        <h3 className="font-bold text-red-800 mb-2">Error al solicitar flujo de reservaciones</h3>
                        <p className="text-red-700 mb-4">{error.message}</p>
                    </div>
                </div>
            </ViewTransition>
        );
    }

    return (
        <ViewTransition enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}>
            <div className="rounded-[24px] border border-slate-200 bg-white p-6">
                <div className="flex flex-col items-center border-slate-200">
                    <Image width={86} height={100} alt="Hotel San Pedro Logo" className="h-12 drop-shadow-lg object-contain" src={logo} />
                    <div className="mt-2 text-center">
                        <h1 className="text-[20px] leading-7 font-['Hanken_Grotesk'] font-bold text-[#000000]">Hotel San Pedro</h1>
                        <p className="text-[12px] leading-3.5 font-medium font-['Hanken_Grotesk'] text-[#515f74] uppercase tracking-wider">Hospitalidad &amp; Comodidad</p>
                    </div>
                </div>

                <div className="mt-5 flex flex-col items-center justify-center text-center">
                    <PageHeader
                        name="Reporte Diario de Reservaciones Creadas"
                        subtitle="Listado de reservaciones registradas en la fecha seleccionada"
                    />
                </div>

                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <span><strong>Fecha:</strong> {fechaFiltro}</span>
                        <span><strong>Estado:</strong> {filtroEstado === "Todos" ? "Todos" : filtroEstado}</span>
                        <span><strong>Búsqueda:</strong> {busqueda || "Sin filtro"}</span>
                        <span><strong>Orden:</strong> {ordenar === "reserva" ? "Código de reserva" : ordenar === "total" ? "Monto total" : "Cantidad de noches"}</span>
                        <span><strong>Reporte emitido el:</strong> {fechaEmitido}</span>
                    </div>
                </div>
            </div>

            {/* Paneles KPI Cuantitativos */}
            {/* <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start gap-4 flex-col-reverse">
            <span className="text-[14px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Reservas en Fecha</span>
            <div className="p-2 bg-[#c9e6ff] rounded-lg flex items-center">
              <span className="material-symbols-outlined text-[20px] text-[#008cc7]">calendar_today</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[20px] leading-10 tracking-[-0.02em] font-semibold text-[#000000]">
            {loading ? <span className="animate-pulse">--</span> : stats.totalReservas}
          </h2>
        </div>

        <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start gap-4 flex-col-reverse">
            <span className="text-[14px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Ingresos Brutos</span>
            <div className="p-2 bg-[#d5e3fd] rounded-lg flex items-center">
              <span className="material-symbols-outlined text-[20px] text-[#008cc7]">monetization_on</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[20px] leading-10 tracking-[-0.02em] font-semibold text-[#000000]">
            {loading ? <span className="animate-pulse">--</span> : `${stats.ingresosDelDia.toLocaleString()} Lps`}
          </h2>
        </div>

        <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start gap-4 flex-col-reverse">
            <span className="text-[14px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Precio Promedio de Reservacion</span>
            <div className="p-2 bg-[#ffdad6] rounded-lg flex items-center">
              <span className="material-symbols-outlined text-[20px] text-[#93000a]">analytics</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[20px] leading-10 tracking-[-0.02em] font-semibold text-[#000000]">
            {loading ? <span className="animate-pulse">--</span> : `${stats.promedioTarifa.toLocaleString()} Lps`}
          </h2>
        </div>

        <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start gap-4 flex-col-reverse">
            <span className="text-[14px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Efectividad Operativa</span>
            <div className="p-2 bg-[#e0e3e5] rounded-lg flex items-center">
              <span className="material-symbols-outlined text-[20px] text-[#565e74]">verified_user</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[20px] leading-10 tracking-[-0.02em] font-semibold text-[#000000]">
            {stats.porEstado["Finalizada"] || 0} Completadas
          </h2>
        </div>
      </section> */}

            {/* Matriz / Tabla Estructurada de Datos */}
            <section className="bg-[#ffffff] border border-slate-300 rounded-xl overflow-hidden mx-1">
                <div className="px-3 py-2 border-b border-slate-300 bg-[#f7f9fb] flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-['Hanken_Grotesk'] text-[18px] leading-7 font-semibold text-[#000000]">
                        Flujo de Reservaciones {filtroEstado !== "Todos" && `(${filtroEstado})`}
                    </h3>
                    <span className="text-[13px] font-semibold text-[#515f74]">
                        {reservacionesFiltradas.length} encontradas
                    </span>
                </div>

                {loading ? (
                    <div className="px-6 py-12 text-center">
                        <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-4 animate-spin">refresh</span>
                        <p className="text-[16px] font-medium text-[#515f74]">Analizando peticiones HTTP...</p>
                    </div>
                ) : reservacionesFiltradas.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-4">search_off</span>
                        <p className="text-[16px] font-medium text-[#515f74]">No existen reservaciones vinculadas a la fecha o filtros aplicados</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full ">
                                <thead>
                                    <tr className="border-b border-slate-300 bg-[#f7f9fb]">
                                        <th className="px-2 py-2 text-left text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Código Reserva</th>
                                        <th className="px-2 py-2 text-left text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Huésped / Espacio</th>
                                        <th className="px-2 py-2 text-left text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Estado</th>
                                        <th className="px-2 py-2 text-left text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Check In</th>
                                        <th className="px-2 py-2 text-left text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Check Out</th>
                                        <th className="px-2 py-2 text-left text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Noches</th>
                                        <th className="px-2 py-2 text-left text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Monto Noche</th>
                                        <th className="px-2 py-2 text-left text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservacionesMostradas.map((reserva) => {
                                        const estadoTexto = normalizarEstadoHabitacion(reserva.reserva_estado);
                                        const colorEstado = getColorEstado(estadoTexto);
                                        return (
                                            <tr key={reserva.reserva_id} className="border-b border-slate-300 bg-white">
                                                <td className={`px-2 py-2 text-[10px] font-bold text-[#000000] ${colorEstado.border}`}>
                                                    {reserva.numero_reserva}
                                                </td>
                                                <td className="px-2 py-2 text-[10px] font-medium text-[#515f74]">
                                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-nowrap mr-1">{reserva.nombres}</span>
                                                    <span className="bg-slate-200 px-2 py-0.5 rounded text-nowrap">{reserva.numero_espacio}</span>
                                                </td>
                                                <td className="px-2 py-2">
                                                    <span className={`text-[10px] font-bold rounded-full ${colorEstado.bg} inline-flex items-center gap-1 px-2 `}>
                                                        {estadoTexto}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-2 text-[10px] font-medium text-slate-600">
                                                    {formatFecha(reserva.fecha_entrada)}
                                                </td>
                                                <td className="px-2 py-2 text-[10px] font-medium text-slate-600">
                                                    {formatFecha(reserva.fecha_salida)}
                                                </td>
                                                <td className="px-2 py-2 text-[10px] font-medium text-[#515f74]">
                                                    {reserva.cantidad_unidades}
                                                </td>
                                                <td className="px-2 py-2 text-[10px] font-medium text-slate-600">
                                                    {formatMoneda(reserva.precio_unidad || 0)}
                                                </td>
                                                <td className="px-2 py-2 text-[10px] font-bold text-[#008cc7] text-nowrap">
                                                    {formatMoneda(reserva.total_pagar || 0)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </section>

            {/* Resumen Final de Impacto Monetario y Operativo */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[12px] font-semibold text-[#515f74] uppercase tracking-wider mb-2">Muestra Filtrada</p>
                            <h4 className="text-[22px] font-bold text-[#000000]">{reservacionesFiltradas.length}</h4>
                            <p className="text-[12px] text-[#515f74] mt-2">Reservas visualizadas bajo los criterios actuales</p>
                        </div>
                        <span className="material-symbols-outlined text-[28px] text-[#008cc7]">segment</span>
                    </div>
                </div> */}

                <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[12px] font-semibold text-[#515f74] uppercase tracking-wider mb-2">Ingresos de la Selección</p>
                            <h4 className="text-[22px] font-bold text-[#000000]">
                                {formatMoneda(reservacionesFiltradas.reduce((sum, r) => sum + (r.total_pagar || 0), 0))}
                            </h4>
                            <p className="text-[12px] text-[#515f74] mt-2">Impacto monetario neto de los elementos visibles</p>
                        </div>
                        <span className="material-symbols-outlined text-[28px] text-[#008cc7]">account_balance_wallet</span>
                    </div>
                </div>
            </section>

            {/* Paneles KPI Cuantitativos */}
            {/*
      <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Reservaciones 
        <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start gap-4 flex-col-reverse">
            <span className="text-[14px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Reservas en Fecha</span>
            <div className="p-2 bg-[#c9e6ff] rounded-lg flex items-center">
              <span className="material-symbols-outlined text-[20px] text-[#008cc7]">calendar_today</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[20px] leading-10 tracking-[-0.02em] font-semibold text-[#000000]">
            {loading ? <span className="animate-pulse">--</span> : stats.totalReservas}
          </h2>
        </div>

        {/* Ingresos Totales del Día 
        <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start gap-4 flex-col-reverse">
            <span className="text-[14px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Ingresos Brutos</span>
            <div className="p-2 bg-[#d5e3fd] rounded-lg flex items-center">
              <span className="material-symbols-outlined text-[20px] text-[#008cc7]">monetization_on</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[20px] leading-10 tracking-[-0.02em] font-semibold text-[#000000]">
            {loading ? <span className="animate-pulse">--</span> : `$${stats.ingresosDelDia.toLocaleString()}`}
          </h2>
        </div>

        {/* Tarifa Promedio por Transacción 
        <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start gap-4 flex-col-reverse">
            <span className="text-[14px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Ticket Promedio</span>
            <div className="p-2 bg-[#ffdad6] rounded-lg flex items-center">
              <span className="material-symbols-outlined text-[20px] text-[#93000a]">analytics</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[20px] leading-10 tracking-[-0.02em] font-semibold text-[#000000]">
            {loading ? <span className="animate-pulse">--</span> : `$${stats.promedioTarifa.toLocaleString()}`}
          </h2>
        </div>

        {/* Tasa Operativa Acumulada 
        <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start gap-4 flex-col-reverse">
            <span className="text-[14px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Efectividad Operativa</span>
            <div className="p-2 bg-[#e0e3e5] rounded-lg flex items-center">
              <span className="material-symbols-outlined text-[20px] text-[#565e74]">verified_user</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[20px] leading-10 tracking-[-0.02em] font-semibold text-[#000000]">
            {stats.porEstado["Finalizada"] || 0} Completadas
          </h2>
        </div>
      </section> */}
        </ViewTransition>
    );
}