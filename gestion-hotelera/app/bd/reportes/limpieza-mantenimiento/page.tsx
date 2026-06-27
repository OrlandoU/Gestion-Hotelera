'use client';

import PageHeader from "@/components/pageheader";
import { ViewTransition } from "react";
import { useState, useMemo } from "react";
import { useActividadesMantenimiento } from "@/functions/reportes-api"; // Ajustado según tu alias de funciones

export default function Page() {
  const { data: actividadesApi, loading, error, refetch } = useActividadesMantenimiento();
  
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("Todos");
  const [fechaFiltro, setFechaFiltro] = useState<string>(""); // "" representa "Todas las fechas"
  const [ordenar, setOrdenar] = useState<"reciente" | "espacio" | "responsable">("reciente");

  // Fallback seguro de arreglo
  const actividadesData = actividadesApi || [];

  // KPIs Estratégicos calculados en memoria sobre el total de la data cargada
  const stats = useMemo(() => {
    const totalActividades = actividadesData.length;
    const espaciosUnicos = new Set(actividadesData.map(a => a.numero_espacio).filter(Boolean)).size;
    const staffActivo = new Set(actividadesData.map(a => a.nombre_responsable).filter(Boolean)).size;

    // Clasificación por tipo para selectores dinámicos
    const porTipo = actividadesData.reduce((acc: Record<string, number>, curr) => {
      const t = curr.tipo || "Otros";
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {});

    return { totalActividades, espaciosUnicos, staffActivo, porTipo };
  }, [actividadesData]);

  // Filtrado y Ordenamiento Avanzado en Memoria
  const actividadesFiltradas = useMemo(() => {
    let resultado = [...actividadesData];

    // 1. Filtro por Fecha (Aísla por año-mes-día)
    if (fechaFiltro) {
      resultado = resultado.filter(a => {
        if (!a.fecha_inicio) return false;
        const fechaActividadStr = a.fecha_inicio.split('T')[0]; // Extrae "YYYY-MM-DD"
        return fechaActividadStr === fechaFiltro;
      });
    }

    // 2. Filtro por Tipo de Actividad
    if (filtroTipo !== "Todos") {
      resultado = resultado.filter(a => a.tipo?.toLowerCase() === filtroTipo.toLowerCase());
    }

    // 3. Búsqueda por Espacio, Responsable o Descripción
    if (busqueda) {
      const b = busqueda.toLowerCase();
      resultado = resultado.filter(a => 
        a.numero_espacio?.toLowerCase().includes(b) ||
        a.nombre_responsable?.toLowerCase().includes(b) ||
        a.descripcion?.toLowerCase().includes(b)
      );
    }

    // 4. Criterios de Ordenamiento
    resultado.sort((a, b) => {
      if (ordenar === "reciente") {
        return new Date(b.fecha_inicio || 0).getTime() - new Date(a.fecha_inicio || 0).getTime();
      }
      if (ordenar === "espacio") {
        return (a.numero_espacio || "").localeCompare(b.numero_espacio || "");
      }
      if (ordenar === "responsable") {
        return (a.nombre_responsable || "").localeCompare(b.nombre_responsable || "");
      }
      return 0;
    });

    return resultado;
  }, [actividadesData, fechaFiltro, filtroTipo, busqueda, ordenar]);

  // Estilización semántica para los tags de actividades
  const getEstiloTipo = (tipo: string) => {
    switch (tipo?.toLowerCase()) {
      case "aseo":
      case "limpieza":
        return { bg: "bg-teal-100 text-teal-800", border: "border-l-4 border-teal-500", icon: "clean_hands" };
      case "mantenimiento":
      case "reparacion":
        return { bg: "bg-indigo-100 text-indigo-800", border: "border-l-4 border-indigo-500", icon: "build" };
      default:
        return { bg: "bg-slate-100 text-slate-800", border: "border-l-4 border-slate-400", icon: "engineering" };
    }
  };

  const formatFecha = (isoString?: string) => {
    if (!isoString) return "--";
    const date = new Date(isoString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (error && !loading) {
    return (
      <ViewTransition enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}>
        <PageHeader 
          name="Actividades de Mantenimiento" 
          subtitle="Auditoría interna de saneamiento, uso de insumos y gestión de espacios"
        />
        <div className="bg-red-50 border border-red-300 rounded-xl p-6 flex items-start gap-4 mt-4">
          <span className="material-symbols-outlined text-[32px] text-red-600">error</span>
          <div className="flex-1">
            <h3 className="font-bold text-red-800 mb-2">Error al solicitar bitácora de actividades</h3>
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
            name="Reporte de Actividades Mantenimiento/Limpieza Diarias" 
            subtitle="Auditoría interna de saneamiento, uso de insumos y gestión de espacios"
          />
        </div>
        
        {loading ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
            <span className="material-symbols-outlined animate-spin text-blue-600">refresh</span>
            <span className="text-blue-700 text-sm font-medium">Sincronizando logs...</span>
          </div>
        ) : (
          <button 
            onClick={refetch}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-semibold text-slate-700"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Actualizar
          </button>
        )}
      </div>

      {/* Bloque Informativo de KPIs Cuantitativos */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300 shadow-level-1">
          <div className="flex justify-between items-start flex-col-reverse">
            <span className="text-[14px] font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Órdenes Ejecutadas</span>
            <div className="p-2 bg-[#e0e3e5] rounded-lg mb-4 flex items-center">
              <span className="material-symbols-outlined text-[20px] text-[#565e74]">assignment</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[20px] font-semibold text-[#000000]">
            {loading ? <span className="animate-pulse">--</span> : stats.totalActividades} Tareas
          </h2>
        </div>

        <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300 shadow-level-1">
          <div className="flex justify-between items-start flex-col-reverse">
            <span className="text-[14px] font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Habitaciones / Espacios</span>
            <div className="p-2 bg-[#c9e6ff] rounded-lg mb-4 flex items-center">
              <span className="material-symbols-outlined text-[20px] text-[#008cc7]">meeting_room</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[20px] font-semibold text-[#000000]">
            {loading ? <span className="animate-pulse">--</span> : `${stats.espaciosUnicos} Unidades`}
          </h2>
        </div>

        <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300 shadow-level-1">
          <div className="flex justify-between items-start flex-col-reverse">
            <span className="text-[14px] font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Personal Operativo</span>
            <div className="p-2 bg-[#d5e3fd] rounded-lg mb-4 flex items-center">
              <span className="material-symbols-outlined text-[20px] text-[#008cc7]">badge</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[20px] font-semibold text-[#000000]">
            {loading ? <span className="animate-pulse">--</span> : `${stats.staffActivo} Encargados`}
          </h2>
        </div>
      </section>

      {/* Módulo de Filtros y Segmentación Extendida */}
      <section className="bg-[#ffffff] border border-slate-300 rounded-xl p-6 shadow-level-1">
        <h3 className="font-['Hanken_Grotesk'] text-[18px] font-semibold text-[#000000] mb-4">Filtros de Auditoría</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Nuevo Criterio: Filtro Cronológico */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[11px] font-bold text-[#515f74] uppercase tracking-wider">Fecha de Ejecución</label>
              {fechaFiltro && (
                <button 
                  onClick={() => setFechaFiltro("")} 
                  className="text-[11px] text-[#008cc7] font-semibold hover:underline"
                >
                  Ver Todas
                </button>
              )}
            </div>
            <input
              type="date"
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[14px] font-medium text-[#191c1e] focus:outline-none focus:border-[#008cc7]"
              disabled={loading}
            />
          </div>

          {/* Búsqueda por términos */}
          <div>
            <label className="block text-[11px] font-bold text-[#515f74] mb-2 uppercase tracking-wider">Buscar por texto</label>
            <input
              type="text"
              placeholder="Ej: H-211, Luis, jabón..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[14px] font-medium text-[#191c1e] placeholder-slate-400 focus:outline-none focus:border-[#008cc7]"
              disabled={loading}
            />
          </div>

          {/* Discriminador por Tipo */}
          <div>
            <label className="block text-[11px] font-bold text-[#515f74] mb-2 uppercase tracking-wider">Tipo de orden</label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[14px] font-medium text-[#191c1e] focus:outline-none focus:border-[#008cc7]"
              disabled={loading}
            >
              <option value="Todos">Todos los tipos</option>
              {Object.keys(stats.porTipo).map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          {/* Criterio de Ordenamiento */}
          <div>
            <label className="block text-[11px] font-bold text-[#515f74] mb-2 uppercase tracking-wider">Clasificación de filas</label>
            <select
              value={ordenar}
              onChange={(e) => setOrdenar(e.target.value as any)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[14px] font-medium text-[#191c1e] focus:outline-none focus:border-[#008cc7]"
              disabled={loading}
            >
              <option value="reciente">Cronológico (Más reciente)</option>
              <option value="espacio">Número de Espacio</option>
              <option value="responsable">Responsable Asignado</option>
            </select>
          </div>
        </div>
      </section>

      {/* Matriz Estructurada de Datos */}
      <section className="bg-[#ffffff] border border-slate-300 rounded-xl overflow-hidden shadow-level-1">
        <div className="px-6 py-4 border-b border-slate-300 bg-[#f7f9fb] flex justify-between items-center">
          <h3 className="font-['Hanken_Grotesk'] text-[18px] font-semibold text-[#000000]">
            Bitácora de Saneamiento y Logística
          </h3>
          <span className="text-[13px] font-semibold text-[#515f74]">
            {actividadesFiltradas.length} de {stats.totalActividades} registros visibles
          </span>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center">
            <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-4 animate-spin">refresh</span>
            <p className="text-[16px] font-medium text-[#515f74]">Solicitando base de datos al backend...</p>
          </div>
        ) : actividadesFiltradas.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-4">search_off</span>
            <p className="text-[16px] font-medium text-[#515f74]">Ninguna orden coincide con la fecha o parámetros aplicados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-300 bg-[#f7f9fb]">
                  <th className="px-6 py-3 text-left text-[11px] font-bold text-[#515f74] uppercase tracking-wider">Espacio</th>
                  <th className="px-6 py-3 text-left text-[11px] font-bold text-[#515f74] uppercase tracking-wider">ID Log</th>
                  <th className="px-6 py-3 text-left text-[11px] font-bold text-[#515f74] uppercase tracking-wider">Responsable</th>
                  <th className="px-6 py-3 text-left text-[11px] font-bold text-[#515f74] uppercase tracking-wider">Tipo Actividad</th>
                  <th className="px-6 py-3 text-left text-[11px] font-bold text-[#515f74] uppercase tracking-wider">Descripción / Detalle de Insumos</th>
                  <th className="px-6 py-3 text-left text-[11px] font-bold text-[#515f74] uppercase tracking-wider">Fecha / Hora de Inicio</th>
                </tr>
              </thead>
              <tbody>
                {actividadesFiltradas.map((actividad, index) => {
                  const estiloTipo = getEstiloTipo(actividad.tipo || "");
                  return (
                    <tr key={`${actividad.mantenimiento_id}-${index}`} className="border-b border-slate-300 hover:bg-[#f2f4f6] transition-colors">
                      <td className={`px-6 py-4 text-[14px] font-bold text-[#000000] ${estiloTipo.border}`}>
                        {actividad.numero_espacio}
                      </td>
                      <td className="px-6 py-4 text-[13px] text-slate-500 font-mono">
                        #{actividad.mantenimiento_id}
                      </td>
                      <td className="px-6 py-4 text-[14px] font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-200 text-[11px] font-bold text-slate-700 flex items-center justify-center">
                            {actividad.nombre_responsable?.charAt(0)}
                          </span>
                          <span>{actividad.nombre_responsable}</span>
                          <span className="text-[11px] font-medium text-slate-400">(UID: {actividad.usuario_id})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[14px] font-bold px-2.5 py-1.5 rounded-full ${estiloTipo.bg} inline-flex items-center gap-1`}>
                          <span className="material-symbols-outlined text-[13px]">{estiloTipo.icon}</span>
                          {actividad.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-slate-700 max-w-xs truncate" title={actividad.descripcion}>
                        {actividad.descripcion}
                      </td>
                      <td className="px-6 py-4 text-[13px] font-medium text-slate-600">
                        {formatFecha(actividad.fecha_inicio)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Footer del Reporte */}
      <section className="bg-slate-50 border border-slate-300 rounded-xl p-4 mt-4">
        <div className="flex items-center justify-between text-[12px] font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">history_toggle_off</span>
            <span>Auditoría cronológica. Remueve o selecciona un día específico usando el calendario.</span>
          </div>
          <span>Reporte Operativo</span>
        </div>
      </section>
    </ViewTransition>
  );
}