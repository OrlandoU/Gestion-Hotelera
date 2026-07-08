'use client';

import PageHeader from "@/components/pageheader";
import TablePagination from "@/components/TablePagination";
import { ViewTransition } from "react";
import { useState, useMemo } from "react";
import { useReservacionesDiarias } from "@/functions/reportes-api"; // Ajustado según tu alias de funciones
import { exportToExcel } from "@/functions/excel-utils";
import { Toaster, toast } from "sonner";

export default function Page() {
  // Inicializamos la fecha con el día de hoy en formato YYYY-MM-DD
  const hoyStr = new Date().toISOString().split('T')[0];
  const [fechaFiltro, setFechaFiltro] = useState(hoyStr);

  // Consumo de la API pasando el parámetro de fecha reactivo
  const { data: reservacionesApi, loading, error, refetch } = useReservacionesDiarias(fechaFiltro);

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("Todos");
  const [ordenar, setOrdenar] = useState<"reserva" | "total" | "noches">("reserva");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

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

  const reservacionesMostradas = useMemo(() => {
    const start = (page - 1) * pageSize;
    return reservacionesFiltradas.slice(start, start + pageSize);
  }, [reservacionesFiltradas, page, pageSize]);

  // KPIs Estratégicos calculados dinámicamente sobre la data del día
  const stats = useMemo(() => {
    const totalReservas = reservacionesData.length;
    const ingresosDelDia = reservacionesData.reduce((sum, r) => sum + (r.total_pagar || 0), 0);
    const promedioTarifa = totalReservas > 0 ? Math.round(ingresosDelDia / totalReservas) : 0;

    // Contadores de estados para los selectores y métricas
    const porEstado = reservacionesData.reduce((acc: Record<string, number>, r) => {
      const est = normalizarEstadoHabitacion(r.reserva_estado);
      acc[est] = (acc[est] || 0) + 1;
      return acc;
    }, {});

    return { totalReservas, ingresosDelDia, promedioTarifa, porEstado };
  }, [reservacionesData]);

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

  const handleExportReservaciones = () => {
    const rows = reservacionesFiltradas.map((reserva) => ({
      "Código Reserva": reserva.numero_reserva || "",
      "Huésped ID": reserva.huesped_id || "",
      "Espacio ID": reserva.espacio_id || "",
      Estado: reserva.estado || "",
      "Check In": formatFecha(reserva.fecha_entrada),
      "Check Out": formatFecha(reserva.fecha_salida),
      Noches: reserva.cantidad_unidades || 0,
      "Monto Noche": reserva.precio_unidad || 0,
      Total: reserva.total_pagar || 0,
    }));

    exportToExcel(rows, `reservaciones-diarias-${fechaFiltro || new Date().toISOString().split("T")[0]}.xlsx`, "ReservacionesDiarias");
    toast.success("Exportación completada exitosamente!")
  };

  const handleGeneratePdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const params = new URLSearchParams();
      params.set("fecha", fechaFiltro);
      if (filtroEstado !== "Todos") {
        params.set("estado", filtroEstado);
      }
      if (busqueda.trim()) {
        params.set("busqueda", busqueda.trim());
      }
      params.set("ordenar", ordenar);

      const response = await fetch(`/api/reservas-pdf/generate?${params.toString()}`);
      if (!response.ok) {
        throw new Error("No se pudo generar el PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `reservaciones-diarias-${fechaFiltro || new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("PDF generado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al generar el PDF");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

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
            <button
              onClick={refetch}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center gap-2"
            >
              <span className="material-symbols-outlined">refresh</span>
              Reintentar Operación
            </button>
          </div>
        </div>
      </ViewTransition>
    );
  }

  return (
    <ViewTransition enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}>
      {/* Encabezado y Acción Global */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <PageHeader
            name="Reporte Diario de Reservaciones Creadas"
            subtitle="Listado de reservaciones registradas en la fecha seleccionada"
          />
        </div>

        {loading ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
            <span className="material-symbols-outlined animate-spin text-blue-600">refresh</span>
            <span className="text-blue-700 text-sm font-medium">Sincronizando...</span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={refetch}
              className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-semibold text-slate-700"
              title="Sincronizar data con el servidor"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              Actualizar
            </button>
            <button
              onClick={handleExportReservaciones}
              disabled={reservacionesFiltradas.length === 0}
              className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              title="Exportar los datos filtrados a Excel"
            >
              <span className="material-symbols-outlined text-[18px]">file_upload</span>
              Exportar
            </button>
            <button
              onClick={handleGeneratePdf}
              disabled={reservacionesFiltradas.length === 0 || isGeneratingPdf}
              className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-[#008cc7] text-white hover:bg-[#0073a3] rounded-lg transition-colors font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              title="Generar PDF con los filtros actuales"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              {isGeneratingPdf ? "Generando..." : "PDF"}
            </button>
          </div>
        )}
      </div>

      {/* Paneles KPI Cuantitativos */}
      {/* <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white card-shadow border border-slate-300 rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300">
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

        <div className="bg-white card-shadow border border-slate-300 rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300">
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

        <div className="bg-white card-shadow border border-slate-300 rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300">
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

        <div className="bg-white card-shadow border border-slate-300 rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300">
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

      {/* Segmento de Segmentación y Filtros de Búsqueda */}
      <section className="bg-white card-shadow border border-slate-300 rounded-xl p-6">
        <h3 className="font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-[#000000] mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Criterio 1: Fecha Focal de Consulta (Parámetro API) */}
          <div>
            <label className="block text-[12px] font-semibold text-[#515f74] mb-2 uppercase tracking-wider">Fecha de Creación</label>
            <input
              type="date"
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
              className="w-full cursor-pointer px-4 py-2 border border-slate-300 rounded-lg text-[14px] font-medium text-[#191c1e] focus:outline-none focus:border-[#008cc7] focus:ring-1 focus:ring-[#008cc7]"
              disabled={loading}
            />
          </div>

          {/* Criterio 2: Búsqueda Libre en Memoria */}
          <div>
            <label className="block text-[12px] font-semibold text-[#515f74] mb-2 uppercase tracking-wider">Buscar Reserva / IDs</label>
            <input
              type="text"
              placeholder="Ej: RES-2026-0081"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full cursor-pointer px-4 py-2 border border-slate-300 rounded-lg text-[14px] font-medium text-[#191c1e] placeholder-slate-400 focus:outline-none focus:border-[#008cc7] focus:ring-1 focus:ring-[#008cc7]"
              disabled={loading}
            />
          </div>

          {/* Criterio 3: Discriminador por Estado de Reserva */}
          <div>
            <label className="block text-[12px] font-semibold text-[#515f74] mb-2 uppercase tracking-wider">Filtrar Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full cursor-pointer px-4 py-2 border border-slate-300 rounded-lg text-[14px] font-medium text-[#191c1e] focus:outline-none focus:border-[#008cc7] focus:ring-1 focus:ring-[#008cc7]"
              disabled={loading}
            >
              <option value="Todos">Todos los estados</option>
              {Object.keys(stats.porEstado).map((estado) => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>

          {/* Criterio 4: Clasificación del Listado */}
          <div>
            <label className="block text-[12px] font-semibold text-[#515f74] mb-2 uppercase tracking-wider">Ordenar por</label>
            <select
              value={ordenar}
              onChange={(e) => setOrdenar(e.target.value as "reserva" | "total" | "noches")}
              className="w-full cursor-pointer px-4 py-2 border border-slate-300 rounded-lg text-[14px] font-medium text-[#191c1e] focus:outline-none focus:border-[#008cc7] focus:ring-1 focus:ring-[#008cc7]"
              disabled={loading}
            >
              <option value="reserva">Código de Reserva</option>
              <option value="total">Monto Total (Lps)</option>
              <option value="noches">Cantidad Noches</option>
            </select>
          </div>
        </div>
      </section>

      {/* Matriz / Tabla Estructurada de Datos */}
      <section className="bg-white card-shadow border border-slate-300 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-300 bg-[#f7f9fb] flex justify-between items-center">
          <h3 className="font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-[#000000]">
            Reservaciones creadas en la fecha seleccionada {filtroEstado !== "Todos" && `(${filtroEstado})`}
          </h3>
          <span className="text-[14px] font-semibold text-[#515f74]">
            {reservacionesFiltradas.length} Registros encontrados
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
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-300 bg-[#f7f9fb]">
                    <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Código Reserva</th>
                    <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Huésped / Espacio</th>
                    <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Check In</th>
                    <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Check Out</th>
                    <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Noches</th>
                    <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Monto Noche</th>
                    <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {reservacionesMostradas.map((reserva) => {
                    const estadoTexto = normalizarEstadoHabitacion(reserva.reserva_estado);
                    const colorEstado = getColorEstado(estadoTexto);
                    return (
                      <tr key={reserva.reserva_id} className="border-b border-slate-300 hover:bg-[#f2f4f6] transition-colors">
                        <td className={`px-6 py-4 text-[14px] font-bold text-[#000000] ${colorEstado.border}`}>
                          {reserva.numero_reserva}
                        </td>
                        <td className="px-6 py-4 text-[14px] font-medium text-[#515f74]">
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-xs mr-1 text-nowrap">{reserva.nombres}</span>
                          <span className="bg-slate-200 px-2 py-0.5 rounded text-xs text-nowrap">{reserva.numero_espacio}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[12px] font-bold px-3 py-1 rounded-full ${colorEstado.bg} inline-flex items-center gap-1`}>
                            {estadoTexto}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[13px] font-medium text-slate-600">
                          {formatFecha(reserva.fecha_entrada)}
                        </td>
                        <td className="px-6 py-4 text-[13px] font-medium text-slate-600">
                          {formatFecha(reserva.fecha_salida)}
                        </td>
                        <td className="px-6 py-4 text-[14px] font-medium text-[#515f74]">
                          {reserva.cantidad_unidades}
                        </td>
                        <td className="px-6 py-4 text-[14px] font-medium text-slate-600">
                          {reserva.precio_unidad} Lps
                        </td>
                        <td className="px-6 py-4 text-[14px] font-bold text-[#008cc7] text-nowrap">
                          {reserva.total_pagar} Lps
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <TablePagination
              page={page}
              setPage={setPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalItems={reservacionesFiltradas.length}
              label="reservaciones"
            />
          </>
        )}
      </section>

      {/* Resumen Final de Impacto Monetario y Operativo */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white card-shadow border border-slate-300 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-semibold text-[#515f74] uppercase tracking-wider mb-2">Muestra Filtrada</p>
              <h4 className="text-[24px] font-bold text-[#000000]">{reservacionesFiltradas.length}</h4>
              <p className="text-[12px] text-[#515f74] mt-2">Reservas visualizadas bajo los criterios actuales</p>
            </div>
            <span className="material-symbols-outlined text-[32px] text-[#008cc7]">segment</span>
          </div>
        </div>

        <div className="bg-white card-shadow border border-slate-300 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-semibold text-[#515f74] uppercase tracking-wider mb-2">Ingresos de la Selección</p>
              <h4 className="text-[24px] font-bold text-[#000000]">
                {reservacionesFiltradas.reduce((sum, r) => sum + (r.total_pagar || 0), 0).toLocaleString()} Lps
              </h4>
              <p className="text-[12px] text-[#515f74] mt-2">Impacto monetario neto de los elementos visibles</p>
            </div>
            <span className="material-symbols-outlined text-[32px] text-[#008cc7]">account_balance_wallet</span>
          </div>
        </div>
      </section>

      {/* Paneles KPI Cuantitativos */}
      {/*
      <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Reservaciones 
        <div className="bg-white card-shadow border border-slate-300 rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300">
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
        <div className="bg-white card-shadow border border-slate-300 rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300">
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
        <div className="bg-white card-shadow border border-slate-300 rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300">
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
        <div className="bg-white card-shadow border border-slate-300 rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300">
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

      {/* Footer Informativo de Transparencia de la API */}
      {/* <section className="bg-slate-50 border border-slate-300 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[12px] font-medium text-slate-600">
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span>Datos obtenidos desde API en tiempo real</span>
            {loading && <span className="animate-pulse">• Actualizando...</span>}
          </div>
          <button
            onClick={refetch}
            className="text-[#008cc7] hover:text-[#006fa0] font-semibold hover:underline text-[12px] flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">refresh</span>
            Actualizar
          </button>
        </div>
      </section> */}
      <Toaster richColors expand />

    </ViewTransition>
  );
}