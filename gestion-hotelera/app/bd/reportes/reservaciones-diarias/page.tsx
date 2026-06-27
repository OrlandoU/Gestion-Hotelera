'use client';

import PageHeader from "@/components/pageheader";
import { ViewTransition } from "react";
import { useState, useMemo } from "react";
import { useReservacionesDiarias } from "@/functions/reportes-api"; // Ajustado según tu alias de funciones

export default function Page() {
  // Inicializamos la fecha con el día de hoy en formato YYYY-MM-DD
  const hoyStr = new Date().toISOString().split('T')[0];
  const [fechaFiltro, setFechaFiltro] = useState(hoyStr);
  
  // Consumo de la API pasando el parámetro de fecha reactivo
  const { data: reservacionesApi, loading, error, refetch } = useReservacionesDiarias(fechaFiltro);
  
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("Todos");
  const [ordenar, setOrdenar] = useState<"reserva" | "total" | "noches">("reserva");

  // Fallback de arreglo seguro
  const reservacionesData = reservacionesApi || [];

  // Filtrado y Ordenamiento Avanzado en memoria
  const reservacionesFiltradas = useMemo(() => {
    let resultado = [...reservacionesData];

    // Filtro por estado
    if (filtroEstado !== "Todos") {
      resultado = resultado.filter(r => r.estado?.toLowerCase() === filtroEstado.toLowerCase());
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

  // KPIs Estratégicos calculados dinámicamente sobre la data del día
  const stats = useMemo(() => {
    const totalReservas = reservacionesData.length;
    const ingresosDelDia = reservacionesData.reduce((sum, r) => sum + (r.total_pagar || 0), 0);
    const promedioTarifa = totalReservas > 0 ? Math.round(ingresosDelDia / totalReservas) : 0;
    
    // Contadores de estados para los selectores y métricas
    const porEstado = reservacionesData.reduce((acc: Record<string, number>, r) => {
      const est = r.estado || "Desconocido";
      acc[est] = (acc[est] || 0) + 1;
      return acc;
    }, {});

    return { totalReservas, ingresosDelDia, promedioTarifa, porEstado };
  }, [reservacionesData]);

  // Mapeo semántico de colores para los badges de estado
  const getColorEstado = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case "finalizada":
        return { bg: "bg-emerald-100 text-emerald-800", border: "border-l-4 border-emerald-500", icon: "task_alt", text: "text-emerald-700" };
      case "activa":
      case "confirmada":
        return { bg: "bg-blue-100 text-blue-800", border: "border-l-4 border-blue-500", icon: "check_circle", text: "text-blue-700" };
      case "pendiente":
        return { bg: "bg-amber-100 text-amber-800", border: "border-l-4 border-amber-500", icon: "hourglass_empty", text: "text-amber-700" };
      case "cancelada":
        return { bg: "bg-rose-100 text-rose-800", border: "border-l-4 border-rose-500", icon: "cancel", text: "text-rose-700" };
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

  // Renderizado defensivo en caso de error crítico de la API
  if (error && !loading) {
    return (
      <ViewTransition enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}>
        <PageHeader 
          name="Reservaciones Diarias" 
          subtitle="Monitoreo y control de ingresos, salidas y ocupación programada"
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
            name="Reservaciones Diarias" 
            subtitle="Monitoreo y control de ingresos, salidas y ocupación programada"
          />
        </div>
        
        {loading ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
            <span className="material-symbols-outlined animate-spin text-blue-600">refresh</span>
            <span className="text-blue-700 text-sm font-medium">Sincronizando...</span>
          </div>
        ) : (
          <button 
            onClick={refetch}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-semibold text-slate-700"
            title="Sincronizar data con el servidor"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Actualizar
          </button>
        )}
      </div>

      {/* Paneles KPI Cuantitativos */}
      <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Reservaciones */}
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

        {/* Ingresos Totales del Día */}
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

        {/* Tarifa Promedio por Transacción */}
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

        {/* Tasa Operativa Acumulada */}
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
      </section>

      {/* Segmento de Segmentación y Filtros de Búsqueda */}
      <section className="bg-[#ffffff] border border-slate-300 rounded-xl p-6">
        <h3 className="font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-[#000000] mb-6">Parámetros del Reporte</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Criterio 1: Fecha Focal de Consulta (Parámetro API) */}
          <div>
            <label className="block text-[12px] font-semibold text-[#515f74] mb-2 uppercase tracking-wider">Fecha de Consulta</label>
            <input
              type="date"
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[14px] font-medium text-[#191c1e] focus:outline-none focus:border-[#008cc7] focus:ring-1 focus:ring-[#008cc7]"
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
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[14px] font-medium text-[#191c1e] placeholder-slate-400 focus:outline-none focus:border-[#008cc7] focus:ring-1 focus:ring-[#008cc7]"
              disabled={loading}
            />
          </div>
          
          {/* Criterio 3: Discriminador por Estado de Reserva */}
          <div>
            <label className="block text-[12px] font-semibold text-[#515f74] mb-2 uppercase tracking-wider">Filtrar Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[14px] font-medium text-[#191c1e] focus:outline-none focus:border-[#008cc7] focus:ring-1 focus:ring-[#008cc7]"
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
            <label className="block text-[12px] font-semibold text-[#515f74] mb-2 uppercase tracking-wider">Ordenar registros</label>
            <select
              value={ordenar}
              onChange={(e) => setOrdenar(e.target.value as "reserva" | "total" | "noches")}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[14px] font-medium text-[#191c1e] focus:outline-none focus:border-[#008cc7] focus:ring-1 focus:ring-[#008cc7]"
              disabled={loading}
            >
              <option value="reserva">Código de Reserva</option>
              <option value="total">Monto Total ($)</option>
              <option value="noches">Cantidad Noches</option>
            </select>
          </div>
        </div>
      </section>

      {/* Matriz / Tabla Estructurada de Datos */}
      <section className="bg-[#ffffff] border border-slate-300 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-300 bg-[#f7f9fb] flex justify-between items-center">
          <h3 className="font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-[#000000]">
            Flujo de Reservaciones {filtroEstado !== "Todos" && `(${filtroEstado})`}
          </h3>
          <span className="text-[14px] font-semibold text-[#515f74]">
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-300 bg-[#f7f9fb]">
                  <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Código Reserva</th>
                  <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">IDs (Huésped / Espacio)</th>
                  <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Noches</th>
                  <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Monto Noche</th>
                  <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody>
                {reservacionesFiltradas.map((reserva) => {
                  const colorEstado = getColorEstado(reserva.estado || "");
                  return (
                    <tr key={reserva.reserva_id} className="border-b border-slate-300 hover:bg-[#f2f4f6] transition-colors">
                      {/* Aplicamos tu patrón de acento en el borde izquierdo según estado */}
                      <td className={`px-6 py-4 text-[14px] font-bold text-[#000000] ${colorEstado.border}`}>
                        {reserva.numero_reserva}
                      </td>
                      <td className="px-6 py-4 text-[14px] font-medium text-[#515f74]">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-xs mr-1">H: {reserva.huesped_id}</span>
                        <span className="bg-slate-200 px-2 py-0.5 rounded text-xs">E: {reserva.espacio_id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[12px] font-bold px-3 py-1 rounded-full ${colorEstado.bg} inline-flex items-center gap-1`}>
                          <span className="material-symbols-outlined text-[14px]">{colorEstado.icon}</span>
                          {reserva.estado}
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
                        ${reserva.precio_unidad}
                      </td>
                      <td className="px-6 py-4 text-[14px] font-bold text-[#008cc7]">
                        ${reserva.total_pagar}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Resumen Final de Impacto Monetario y Operativo */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-semibold text-[#515f74] uppercase tracking-wider mb-2">Muestra Filtrada</p>
              <h4 className="text-[24px] font-bold text-[#000000]">{reservacionesFiltradas.length}</h4>
              <p className="text-[12px] text-[#515f74] mt-2">Reservas visualizadas bajo los criterios actuales</p>
            </div>
            <span className="material-symbols-outlined text-[32px] text-[#008cc7]">segment</span>
          </div>
        </div>

        <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-semibold text-[#515f74] uppercase tracking-wider mb-2">Ingresos de la Selección</p>
              <h4 className="text-[24px] font-bold text-[#000000]">
                ${reservacionesFiltradas.reduce((sum, r) => sum + (r.total_pagar || 0), 0).toLocaleString()}
              </h4>
              <p className="text-[12px] text-[#515f74] mt-2">Impacto monetario neto de los elementos visibles</p>
            </div>
            <span className="material-symbols-outlined text-[32px] text-[#008cc7]">account_balance_wallet</span>
          </div>
        </div>
      </section>

      {/* Footer Informativo de Transparencia de la API */}
      <section className="bg-slate-50 border border-slate-300 rounded-xl p-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[12px] font-medium text-slate-600">
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span>Auditoría de reservaciones parametrizada por fecha en tiempo real</span>
          </div>
          <span className="text-[12px] font-semibold text-slate-500">
            Filtro base: {fechaFiltro}
          </span>
        </div>
      </section>
    </ViewTransition>
  );
}