'use client';

import PageHeader from "@/components/pageheader";
import { ViewTransition } from "react";
import { useState, useMemo } from "react";
import { useIncidentes } from "@/functions/reportes-api";

interface Incidente {
  incidente_id: number;
  usuario_id: number;
  tipo: string;
  detalles: string;
  causas: string;
  recomendaciones: string;
  fecha: string;
  nombre: string;
  telefono: string;
  rol: string;
}

export default function Page() {
  const anioActual = new Date().getFullYear();
  const [anioFiltro, setAnioFiltro] = useState<number>(anioActual);
  const { data: incidentesApi, loading, error, refetch } = useIncidentes(anioFiltro);

  const [busqueda, setBusqueda] = useState("");
  const [incidenteSeleccionado, setIncidenteSeleccionado] = useState<Incidente | null>(null);

  const incidentesData = useMemo(() => (incidentesApi as Incidente[]) || [], [incidentesApi]);

  const incidentesFiltrados = useMemo(() => {
    let resultado = incidentesData;

    if (busqueda) {
      const b = busqueda.toLowerCase();
      resultado = resultado.filter(i =>
        i.tipo?.toLowerCase().includes(b) ||
        i.nombre?.toLowerCase().includes(b) ||
        i.detalles?.toLowerCase().includes(b)
      );
    }

    return [...resultado].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [incidentesData, busqueda]);

// Estilo semántico según palabras clave del tipo de incidente
  const getEstiloTipo = (tipo: string) => {
    const t = tipo?.toLowerCase() || "";
    if (t.includes("electric") || t.includes("apagon") || t.includes("apagón")) {
      return { bg: "bg-sky-100 text-sky-800", ring: "border-sky-300", icon: "bolt" };
    }
    if (t.includes("red") || t.includes("servidor") || t.includes("sistema") || t.includes("internet")) {
      return { bg: "bg-blue-100 text-blue-800", ring: "border-blue-300", icon: "dns" };
    }
    if (t.includes("incendio") || t.includes("fuego") || t.includes("humo")) {
      return { bg: "bg-indigo-100 text-indigo-800", ring: "border-indigo-300", icon: "local_fire_department" };
    }
    if (t.includes("agua") || t.includes("fuga") || t.includes("inundacion") || t.includes("inundación")) {
      return { bg: "bg-cyan-100 text-cyan-800", ring: "border-cyan-300", icon: "water_drop" };
    }
    if (t.includes("seguridad") || t.includes("robo") || t.includes("intrusion") || t.includes("intrusión")) {
      return { bg: "bg-purple-100 text-purple-800", ring: "border-purple-300", icon: "shield" };
    }
    return { bg: "bg-violet-100 text-violet-800", ring: "border-violet-300", icon: "report" };
  };

  const formatFecha = (isoString?: string) => {
    if (!isoString) return "--";
    const date = new Date(isoString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const truncar = (texto?: string, max = 140) => {
    if (!texto) return "";
    return texto.length > max ? texto.slice(0, max).trim() + "…" : texto;
  };

  if (error && !loading) {
    return (
      <ViewTransition enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}>
        <PageHeader
          name="Reporte de incidentes anuales"
          subtitle="Registro de incidentes y eventos fuera de lo común"
        />
        <div className="bg-red-50 border border-red-300 rounded-xl p-6 flex items-start gap-4 mt-4">
          <span className="material-symbols-outlined text-[32px] text-red-600">error</span>
          <div className="flex-1">
            <h3 className="font-bold text-red-800 mb-2">Error al cargar incidentes</h3>
            <p className="text-red-700 mb-4">{error.message}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center gap-2"
            >
              <span className="material-symbols-outlined">refresh</span>
              Reintentar
            </button>
          </div>
        </div>
      </ViewTransition>
    );
  }

  return (
    <ViewTransition enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}>
      <div className="flex justify-between items-start gap-4">
        <div>
          <PageHeader
            name="Reporte de incidentes anuales"
            subtitle="Registro de incidentes y eventos fuera de lo común"
          />
        </div>

        {loading ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
            <span className="material-symbols-outlined animate-spin text-blue-600">refresh</span>
            <span className="text-blue-700 text-sm font-medium">Cargando...</span>
          </div>
        ) : (
          <button
            onClick={() => refetch()}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-semibold text-slate-700"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Actualizar
          </button>
        )}
      </div>

      {/* Filtros */}
      <section className="bg-[#ffffff] border border-slate-300 rounded-xl p-6 shadow-level-1">
        <h3 className="font-['Hanken_Grotesk'] text-[18px] font-semibold text-[#000000] mb-4">Filtros</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-[#515f74] mb-2 uppercase tracking-wider">Año</label>
            <input
              type="number"
              value={anioFiltro}
              onChange={(e) => setAnioFiltro(Number(e.target.value))}
              className="w-full cursor-pointer px-4 py-2 border border-slate-300 rounded-lg text-[14px] font-medium text-[#191c1e] focus:outline-none focus:border-[#008cc7]"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#515f74] mb-2 uppercase tracking-wider">Buscar por tipo, responsable o detalle</label>
            <input
              type="text"
              placeholder="Ej: apagón, Jeferson, transformador..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full cursor-pointer px-4 py-2 border border-slate-300 rounded-lg text-[14px] font-medium text-[#191c1e] placeholder-slate-400 focus:outline-none focus:border-[#008cc7]"
              disabled={loading}
            />
          </div>
        </div>
      </section>

      {/* Grid de tarjetas flotantes */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-white border border-slate-200 rounded-xl p-6 h-44" />
          ))}
        </div>
      ) : incidentesFiltrados.length === 0 ? (
        <div className="bg-white border border-slate-300 rounded-xl px-6 py-12 text-center">
          <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-4">search_off</span>
          <p className="text-[16px] font-medium text-[#515f74]">No se encontraron incidentes con los filtros aplicados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {incidentesFiltrados.map((incidente) => {
            const estilo = getEstiloTipo(incidente.tipo);
            return (
              <button
                key={incidente.incidente_id}
                onClick={() => setIncidenteSeleccionado(incidente)}
                className={`text-left bg-white border ${estilo.ring} rounded-xl p-6 shadow-level-1 hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col gap-3`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-4 py-1 rounded-full ${estilo.bg}`}>
                    <span className="material-symbols-outlined text-[8px]">{estilo.icon}</span>
                    {incidente.tipo}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 text-nowrap">#{incidente.incidente_id}</span>
                </div>

                <p className="text-[13px] text-slate-600 line-clamp-3">
                  {truncar(incidente.detalles, 140)}
                </p>

                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-slate-200 text-[11px] font-bold text-slate-700 flex items-center justify-center">
                      {incidente.nombre?.charAt(0)}
                    </span>
                    <span className="text-[12px] font-semibold text-slate-700 truncate">{incidente.nombre}</span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 text-nowrap">{formatFecha(incidente.fecha)}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Modal de detalle */}
      {incidenteSeleccionado && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setIncidenteSeleccionado(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-start justify-between gap-4 rounded-t-2xl">
              <div>
                <span className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-1 rounded-full ${getEstiloTipo(incidenteSeleccionado.tipo).bg}`}>
                  <span className="material-symbols-outlined text-[16px]">{getEstiloTipo(incidenteSeleccionado.tipo).icon}</span>
                  {incidenteSeleccionado.tipo}
                </span>
                <p className="text-[12px] text-slate-400 font-medium mt-2">
                  Incidente #{incidenteSeleccionado.incidente_id} · {formatFecha(incidenteSeleccionado.fecha)}
                </p>
              </div>
              <button
                onClick={() => setIncidenteSeleccionado(null)}
                className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-slate-500">close</span>
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-5">
              <div>
                <h4 className="text-[12px] font-bold text-[#515f74] uppercase tracking-wider mb-2">Detalles del incidente</h4>
                <p className="text-[14px] text-slate-700 leading-relaxed">{incidenteSeleccionado.detalles}</p>
              </div>

              <div>
                <h4 className="text-[12px] font-bold text-[#515f74] uppercase tracking-wider mb-2">Causas identificadas</h4>
                <p className="text-[14px] text-slate-700 leading-relaxed">{incidenteSeleccionado.causas}</p>
              </div>

              <div>
                <h4 className="text-[12px] font-bold text-[#515f74] uppercase tracking-wider mb-2">Recomendaciones</h4>
                <p className="text-[14px] text-slate-700 leading-relaxed">{incidenteSeleccionado.recomendaciones}</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                <span className="w-10 h-10 shrink-0 rounded-full bg-[#008cc7] text-white font-bold flex items-center justify-center">
                  {incidenteSeleccionado.nombre?.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-slate-900">{incidenteSeleccionado.nombre}</p>
                  <p className="text-[12px] text-slate-500">{incidenteSeleccionado.rol} · {incidenteSeleccionado.telefono}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ViewTransition>
  );
}