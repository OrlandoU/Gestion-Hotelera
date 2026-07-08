'use client';

import PageHeader from "@/components/pageheader";
import { ViewTransition } from "react";
import { useState, useMemo } from "react";
import { useIngresosTipoHabitacion } from "@/functions/reportes-api"; 
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type TooltipPayload = {
  payload?: Array<{
    payload?: {
      tipo_habitacion?: string;
      ingresos_totales?: number;
      porcentaje?: number;
    };
  }>;
};

const CustomTooltip = ({ active, payload }: TooltipPayload & { active?: boolean }) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    if (!data) return null;
    return (
      <div className="bg-white border border-slate-300 p-3 rounded-lg shadow-level-2 text-xs font-['Hanken_Grotesk']">
        <p className="font-bold text-black mb-1">{data.tipo_habitacion}</p>
        <p className="text-slate-600">Ingresos: <span className="font-bold text-[#008cc7]">${(data.ingresos_totales || 0).toLocaleString()}</span></p>
        <p className="text-slate-600">Participación: <span className="font-semibold text-slate-900">{data.porcentaje}%</span></p>
      </div>
    );
  }
  return null;
};

export default function Page() {
  // Inicializamos el periodo en el mes actual (Junio 2026)
  const [periodoFiltro, setPeriodoFiltro] = useState<string>("2026-07-01");

  // Pasamos el periodo dinámicamente al hook de la API
  const { data: ingresosApi, loading, error, refetch } = useIngresosTipoHabitacion(periodoFiltro);

  const handlePeriodoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    setPeriodoFiltro(e.target.value);
    refetch(e.target.value + "-01"); // Agregar día para formar una fecha completa
  }

  const [ordenar, setOrdenar] = useState<"ingresos" | "reservas" | "noches">("ingresos");

  // Fallback de arreglo seguro
  const ingresosData = useMemo(() => ingresosApi || [], [ingresosApi]);

  const formatearMes = (value: string) => {
    if (!value) return "Mes seleccionado";
    const [year, month] = value.split("-");
    const fecha = new Date(Number(year), Number(month) - 1, 1);
    const nombreMes = fecha.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
    return nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
  };

  // Paleta de azules distintivos de la aplicación para el gráfico y la tabla
const esquemaColores: Record<string, { hex: string; bg: string; text: string; border: string }> = {
    "Básica": { hex: "#C084FC", bg: "bg-purple-100", text: "text-purple-800", border: "border-l-4 border-purple-400" },
    "Estandar": { hex: "#0EA5E9", bg: "bg-sky-100", text: "text-sky-800", border: "border-l-4 border-sky-500" },
    "Doble-Básica": { hex: "#2563EB", bg: "bg-blue-100", text: "text-blue-800", border: "border-l-4 border-blue-600" },
    "Doble-Estandar": { hex: "#4338CA", bg: "bg-indigo-100", text: "text-indigo-800", border: "border-l-4 border-indigo-700" },
  };

  const colorFallback = { hex: "#2563eb", bg: "bg-blue-50", text: "text-blue-700", border: "border-l-4 border-blue-500" };

  // Totales generales acumulados del periodo seleccionado
  const globales = useMemo(() => {
    const totalIngresos = ingresosData.reduce((sum, item) => sum + (item.ingresos_totales || 0), 0);
    const totalReservas = ingresosData.reduce((sum, item) => sum + (item.total_reservas || 0), 0);
    const totalNoches = ingresosData.reduce((sum, item) => sum + (item.total_noches || 0), 0);
    return { totalIngresos, totalReservas, totalNoches };
  }, [ingresosData]);

  // Datos ordenados dinámicamente para la visualización de la tabla
  const ingresosOrdenados = useMemo(() => {
    const resultado = [...ingresosData];
    resultado.sort((a, b) => {
      if (ordenar === "ingresos") return (b.ingresos_totales || 0) - (a.ingresos_totales || 0);
      if (ordenar === "reservas") return (b.total_reservas || 0) - (a.total_reservas || 0);
      if (ordenar === "noches") return (b.total_noches || 0) - (a.total_noches || 0);
      return 0;
    });
    return resultado;
  }, [ingresosData, ordenar]);

  if (error && !loading) {
    return (
      <ViewTransition enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}>
        <PageHeader
          name="Ingresos mensuales por tipo de habitación"
          subtitle="Análisis de rentabilidad, distribución monetaria y tasas de ocupación"
        />
        <div className="bg-red-50 border border-red-300 rounded-xl p-6 flex items-start gap-4">
          <span className="material-symbols-outlined text-[32px] text-red-600">error</span>
          <div className="flex-1">
            <h3 className="font-bold text-red-800 mb-2">Error al procesar la distribución de ingresos</h3>
            <p className="text-red-700 mb-4">{error.message}</p>
            <button onClick={() => refetch(periodoFiltro + "-01")} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined">refresh</span>
              Sincronizar Datos
            </button>
          </div>
        </div>
      </ViewTransition>
    );
  }

  return (
    <ViewTransition enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}>
      {/* Encabezado Principal y Controles de Periodo */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <PageHeader
            name="Ingresos mensuales por tipo de habitación"
            subtitle="Análisis de rentabilidad, distribución monetaria y tasas de ocupación"
          />
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-linear-to-r bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#008cc7] text-white">
              <span className="material-symbols-outlined text-[22px]">calendar_month</span>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#515f74]">Periodo mensual</p>
              <h3 className="text-[18px] font-semibold text-[#0f172a]">{formatearMes(periodoFiltro)}</h3>
              <p className="text-sm text-slate-500">Selecciona el periodo para actualizar la distribución de ingresos.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex flex-col rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#515f74]">Mes</span>
              <input
                type="month"
                value={periodoFiltro}
                onChange={handlePeriodoChange}
                className="mt-1 bg-transparent text-sm font-semibold text-[#191c1e] focus:outline-none"
                disabled={loading}
              />
            </label>

            <button
              onClick={() => refetch(periodoFiltro + "-01")}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#008cc7] hover:text-[#008cc7] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              {loading ? "Actualizando" : "Actualizar"}
            </button>
          </div>
        </div>
      </section>

      {/* Bloque Global de KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300 shadow-level-1">
          <div className="flex justify-between items-start flex-col-reverse">
            <span className="text-[14px] font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Facturación Total</span>
            <div className="p-2 bg-[#d5e3fd] rounded-lg mb-4">
              <span className="material-symbols-outlined text-[20px] text-[#008cc7]">payments</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[20px] font-semibold text-[#000000]">
            {loading ? <span className="animate-pulse">--</span> : `${globales.totalIngresos.toLocaleString()} Lps`}
          </h2>
        </div>

        <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300 shadow-level-1">
          <div className="flex justify-between items-start flex-col-reverse">
            <span className="text-[14px] font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Volumen de Reservas</span>
            <div className="p-2 bg-[#c9e6ff] rounded-lg mb-4">
              <span className="material-symbols-outlined text-[20px] text-[#008cc7]">book_online</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[20px] font-semibold text-[#000000]">
            {loading ? <span className="animate-pulse">--</span> : `${globales.totalReservas} Transacciones`}
          </h2>
        </div>

        <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300 shadow-level-1">
          <div className="flex justify-between items-start flex-col-reverse">
            <span className="text-[14px] font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Noches en Estancia</span>
            <div className="p-2 bg-[#e0e3e5] rounded-lg mb-4">
              <span className="material-symbols-outlined text-[20px] text-[#565e74]">bedtime</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[20px] font-semibold text-[#000000]">
            {loading ? <span className="animate-pulse">--</span> : `${globales.totalNoches} Noches Ocupadas`}
          </h2>
        </div>
      </section>

      {/* Fila de Reporte Gráfico e Histograma */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Componente: Gráfico de Torta con Recharts */}
        <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-6 lg:col-span-5 flex flex-col justify-between shadow-level-1">
          <div>
            <h3 className="font-['Hanken_Grotesk'] text-[18px] font-semibold text-[#000000] mb-1">Desglose de Ingresos</h3>
            <p className="text-[13px] text-[#515f74] mb-6">Porcentaje de ingresos según categoría de hospedaje</p>
          </div>

          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center flex-1">
              <span className="material-symbols-outlined text-[40px] text-slate-300 animate-spin">progress_activity</span>
            </div>
          ) : ingresosData.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center flex-1">
              <span className="material-symbols-outlined text-[40px] text-slate-300">pie_chart_dissolved</span>
              <p className="text-sm text-slate-500 mt-2">No hay datos de facturación para este periodo</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center my-auto w-full">
              <div className="w-full h-56 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ingresosData}
                      dataKey="ingresos_totales"
                      nameKey="tipo_habitacion"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={4}
                      isAnimationActive={true}
                      animationDuration={600}
                    >
                      {ingresosData.map((entry, index) => {
                        const color = esquemaColores[entry.tipo_habitacion!] || colorFallback;
                        return <Cell key={`cell-${index}`} fill={color.hex} />;
                      })}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} wrapperClassName="z-10"/>
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[11px] font-bold text-[#515f74] uppercase tracking-wider">Mix</span>
                  <span className="text-[16px] font-bold text-black">{ingresosData.length} Tipos</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-6 w-full px-2">
                {ingresosData.map((item) => {
                  const color = esquemaColores[item.tipo_habitacion!] || colorFallback;
                  return (
                    <div key={item.tipo_habitacion} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color.hex }} />
                      <span className="text-[13px] font-medium text-slate-700 truncate">{item.tipo_habitacion}</span>
                      <span className="text-[12px] font-bold text-slate-900 ml-auto">{item.porcentaje}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Tabla Analítica con Controles de Ordenamiento */}
        <div className="bg-[#ffffff] border border-slate-300 rounded-xl lg:col-span-7 overflow-hidden flex flex-col justify-between shadow-level-1">
          <div>
            <div className="px-6 py-4 border-b border-slate-300 bg-[#f7f9fb] flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h3 className="font-['Hanken_Grotesk'] text-[18px] font-semibold text-[#000000]">Métricas por Categoría</h3>
              </div>
              <div>
                <select
                  value={ordenar}
                  onChange={(e) => setOrdenar(e.target.value as "ingresos" | "reservas" | "noches")}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-[13px] font-semibold text-[#191c1e] bg-white focus:outline-none focus:border-[#008cc7]"
                  disabled={loading}
                >
                  <option value="ingresos">Ordenar por Ingresos (Lps)</option>
                  <option value="reservas">Ordenar por Reservas</option>
                  <option value="noches">Ordenar por Noches</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="px-6 py-12 text-center">
                <span className="material-symbols-outlined text-[40px] text-slate-300 block mb-2 animate-spin">refresh</span>
                <p className="text-[14px] text-[#515f74]">Estructurando matriz financiera...</p>
              </div>
            ) : ingresosOrdenados.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <span className="material-symbols-outlined text-[40px] text-slate-300 block mb-2">grid_off</span>
                <p className="text-[14px] text-[#515f74]">No hay registros de habitaciones que procesar en este periodo</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-300 bg-[#f7f9fb]">
                      <th className="px-6 py-3 text-left text-[11px] font-bold text-[#515f74] uppercase tracking-wider">Tipo Habitación</th>
                      <th className="px-6 py-3 text-right text-[11px] font-bold text-[#515f74] uppercase tracking-wider">Reservas</th>
                      <th className="px-6 py-3 text-right text-[11px] font-bold text-[#515f74] uppercase tracking-wider">Noches Totales</th>
                      <th className="px-6 py-3 text-right text-[11px] font-bold text-[#515f74] uppercase tracking-wider">Ingresos Totales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingresosOrdenados.map((item) => {
                      const color = esquemaColores[item.tipo_habitacion!] || colorFallback;
                      return (
                        <tr key={item.tipo_habitacion} className="border-b border-slate-300 hover:bg-[#f2f4f6] transition-colors">
                          <td className={`px-6 py-4 text-[14px] font-bold text-[#000000] ${color.border}`}>
                            {item.tipo_habitacion == "Estandar" ? "Estándar" : item.tipo_habitacion == "Doble-Estandar" ? "Doble Estándar" : item.tipo_habitacion}
                          </td>
                          <td className="px-6 py-4 text-right text-[14px] font-medium text-[#515f74]">
                            {item.total_reservas}
                          </td>
                          <td className="px-6 py-4 text-right text-[14px] font-medium text-[#515f74]">
                            {item.total_noches}
                          </td>
                          <td className="px-6 py-4 text-right text-[14px] font-bold text-[#008cc7]">
                            {item.ingresos_totales.toLocaleString()} Lps
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 text-[12px] font-medium text-slate-500 flex items-center gap-2">
            <span className="material-symbols-outlined text-[15px]">insights</span>
            <span>La categoría con mayor rendimiento representa el {ingresosOrdenados[0]?.porcentaje || 0}% de los ingresos del periodo.</span>
          </div>
        </div>
      </section>
    </ViewTransition>
  );
}