'use client';
import PageHeader from "@/components/pageheader";
import { useOcupacionMensual } from "@/functions/reportes-api";
import { ViewTransition } from "react";
import { useState, useMemo } from "react";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { toast } from "sonner";

export default function Page() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>("2026-06-01");
  const [paginaActual, setPaginaActual] = useState(1);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const elementosPorPagina = 8;
  const { data: ocupacionApi, loading, error, refetch } = useOcupacionMensual();

  const ocupacionData = useMemo(() => ocupacionApi || [], [ocupacionApi]);

  const formatearMes = (value: string) => {
    if (!value) return "Mes seleccionado";
    const [year, month] = value.split("-");
    const fecha = new Date(Number(year), Number(month) - 1, 1);
    const nombreMes = fecha.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
    return nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
  };

  // // Fetch datos
  // const cargarDatos = async (fecha: string) => {
  //     let resultado = ocupacionData

  //     // Extraer mes de la fecha
  //     const date = new Date(fecha);
  //     const nombreMes = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  //     setMes(nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1));
  //   } catch (err) {
  //     setError(err instanceof Error ? err : new Error('Error desconocido'));
  //     setDatos([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    const nuevaFecha = e.target.value;
    setFechaSeleccionada(nuevaFecha);
    refetch(nuevaFecha + "-01");
    setPaginaActual(1);
  };

  const stats = useMemo(() => {
    if (ocupacionData.length === 0) return null;

    const totalHabitaciones = 25;
    const diasDelMes = new Date(new Date(fechaSeleccionada).getFullYear(), new Date(fechaSeleccionada).getMonth() + 1, 0).getDate();
    const diasDelMesReales = new Date(new Date(fechaSeleccionada).getFullYear(), new Date(fechaSeleccionada).getMonth() + 2, 0).getDate();
    const capacidadTotalDias = totalHabitaciones * diasDelMes;
    const totalReservas = ocupacionData.reduce((sum, d) => sum + d.cantidad_unidades, 0);

    // Ocupación general = (total_dias_mes / (25 habitaciones * días del mes)) * 100
    const ocupacionGeneral = (ocupacionData[0]?.total_dias_mes || 0) / capacidadTotalDias * 100;
    const disponibilidad = 100 - ocupacionGeneral;

    const habitacionesMasUsadas = [...ocupacionData].sort((a, b) => b.cantidad_unidades - a.cantidad_unidades).slice(0, 5);
    const habitacionesMenosUsadas = [...ocupacionData].filter(d => d.cantidad_unidades > 0).sort((a, b) => a.cantidad_unidades - b.cantidad_unidades).slice(0, 3);

    return {
      totalHabitaciones,
      diasDelMes,
      diasDelMesReales,
      capacidadTotalDias,
      totalReservas,
      ocupacionGeneral: Math.round(ocupacionGeneral * 100) / 100,
      disponibilidad: Math.round(disponibilidad * 100) / 100,
      habitacionesMasUsadas,
      habitacionesMenosUsadas,
    };
  }, [ocupacionData, fechaSeleccionada]);

  // Datos para el gráfico de torta
  const dataTorta = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Ocupada', value: stats.ocupacionGeneral, fill: '#008cc7' },
      { name: 'Disponible', value: stats.disponibilidad, fill: '#c7c7c7' },
    ];
  }, [stats]);

  // Datos para el gráfico de barras
  const dataBarras = useMemo(() => {
    return ocupacionData.map(d => ({
      nombre: d.numero_espacio,
      reservas: d.cantidad_unidades,
      aporte: d.porcentaje,
    }));
  }, [ocupacionData]);

  const totalPaginas = Math.max(1, Math.ceil(ocupacionData.length / elementosPorPagina));
  const paginaValida = Math.min(paginaActual, totalPaginas);
  const datosPaginados = useMemo(() => {
    const inicio = (paginaValida - 1) * elementosPorPagina;
    return ocupacionData.slice(inicio, inicio + elementosPorPagina);
  }, [ocupacionData, paginaValida]);

  const handleGeneratePdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const params = new URLSearchParams();
      params.set("fecha", fechaSeleccionada);

      const response = await fetch(`/api/ocupacion-mensual-pdf/generate?${params.toString()}`);
      if (!response.ok) {
        throw new Error("No se pudo generar el PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ocupacion-mensual-${fechaSeleccionada || new Date().toISOString().split("T")[0].slice(0, 7)}.pdf`;
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

  // Renderizar error
  if (error && !loading) {
    return (
      <ViewTransition enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}>
        <PageHeader
          name="Estadistica de Ocupación Mensual"
          subtitle="Análisis sintetizado de ocupación por mes"
        />
        <div className="bg-red-50 border border-red-300 rounded-xl p-6 flex items-start gap-4">
          <span className="material-symbols-outlined text-[32px] text-red-600">error</span>
          <div className="flex-1">
            <h3 className="font-bold text-red-800 mb-2">Error cargando datos</h3>
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <PageHeader
            name="Estadistica de Ocupación Mensual"
            subtitle="Análisis sintetizado de ocupación por mes"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleGeneratePdf}
            disabled={isGeneratingPdf || loading}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-[#008cc7] text-white hover:bg-[#0073a3] rounded-lg transition-colors font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            title="Generar PDF con los filtros actuales"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            {isGeneratingPdf ? "Generando..." : "PDF"}
          </button>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white  p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row  lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#008cc7] text-white">
              <span className="material-symbols-outlined text-[22px]">calendar_month</span>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#515f74]">Periodo</p>
              <h3 className="text-[18px] font-semibold text-[#0f172a]">{formatearMes(fechaSeleccionada)}</h3>
              <p className="text-sm text-slate-500">Selecciona un mes para actualizar la ocupación del hotel.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex flex-col rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#515f74]">Mes</span>
              <input
                type="month"
                value={fechaSeleccionada}
                onChange={handleFechaChange}
                disabled={loading}
                className="mt-1 bg-transparent text-sm font-semibold text-[#191c1e] focus:outline-none"
              />
            </label>

            <button
              onClick={() => refetch(fechaSeleccionada + "-01")}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#008cc7] hover:text-[#008cc7] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              {loading ? "Actualizando" : "Actualizar"}
            </button>
          </div>
        </div>
      </section>

      {/* Métricas KPI */}
      <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start gap-4 flex-col-reverse">
            <span className="text-[14px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Ocupación General</span>
            <div className="p-2 bg-[#c9e6ff] rounded-lg flex items-center">
              <span className="material-symbols-outlined text-[20px] text-[#008cc7]">percent</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[20px] leading-10 tracking-[-0.02em] font-semibold text-[#000000]">
            {loading ? <span className="animate-pulse">--</span> : `${stats?.ocupacionGeneral || 0}%`}
          </h2>

        </div>

        <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start gap-4 flex-col-reverse">
            <span className="text-[14px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Disponibilidad</span>
            <div className="p-2 bg-[#d5e3fd] rounded-lg flex items-center">
              <span className="material-symbols-outlined text-[20px] text-[#008cc7]">check_circle</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[20px] leading-10 tracking-[-0.02em] font-semibold text-[#000000]">
            {loading ? <span className="animate-pulse">--</span> : `${stats?.disponibilidad || 0}%`}
          </h2>

        </div>

        <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start gap-4 flex-col-reverse">
            <span className="text-[14px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Total Reservas</span>
            <div className="p-2 bg-[#ffdad6] rounded-lg flex items-center">
              <span className="material-symbols-outlined text-[20px] text-[#93000a]">event_busy</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[20px] leading-10 tracking-[-0.02em] font-semibold text-[#000000]">
            {loading ? <span className="animate-pulse">--</span> : stats?.totalReservas}
          </h2>

        </div>

        <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start gap-4 flex-col-reverse">
            <span className="text-[14px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Días del Mes</span>
            <div className="p-2 bg-[#e8d5ff] rounded-lg flex items-center">
              <span className="material-symbols-outlined text-[20px] text-[#6a2d91]">calendar_today</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[20px] leading-10 tracking-[-0.02em] font-semibold text-[#000000]">
            {loading ? <span className="animate-pulse">--</span> : stats?.diasDelMesReales}
          </h2>

        </div>
      </section>

      {/* Gráficos */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Torta */}
        <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1">
          <h3 className="font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-[#000000] mb-6">Ocupación General</h3>
          {loading ? (
            <div className="h-75 flex items-center justify-center bg-slate-50 rounded-lg">
              <div className="text-center">
                <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-2 animate-spin">refresh</span>
                <p className="text-slate-500 text-sm">Cargando gráfico...</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dataTorta}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, value }) => `${name}: ${value.toFixed(2)}%`}
                  outerRadius={100}
                  fill="#8b86e6"
                  dataKey="value"
                >
                  {dataTorta.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top habitaciones */}
        <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1">
          <h3 className="font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-[#000000] mb-6">Top 5 Habitaciones Más Ocupadas</h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse h-10 bg-slate-200 rounded"></div>
              ))}
            </div>
          ) : stats?.habitacionesMasUsadas && stats.habitacionesMasUsadas.length > 0 ? (
            <div className="space-y-3">
              {stats.habitacionesMasUsadas.map((hab, index) => (
                <div key={hab.espacio_id} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-[#008cc7] text-white font-bold rounded-full text-xs">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-semibold text-[#000000]">{hab.numero_espacio}</p>
                    <p className="text-[12px] text-[#515f74]">{hab.cantidad_unidades} reservas</p>
                  </div>
                  <span className="text-[14px] font-bold text-[#008cc7]">{hab.porcentaje}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">Sin datos</p>
          )}
        </div>
      </section>

      {/* Gráfico de Barras - Aporte por habitación */}
      <section className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1">
        <h3 className="font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-[#000000] mb-6">Aporte de Cada Habitación a la Ocupación Total</h3>
        {loading ? (
          <div className="h-100 flex items-center justify-center bg-slate-50 rounded-lg">
            <div className="text-center">
              <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-2 animate-spin">refresh</span>
              <p className="text-slate-500 text-sm">Cargando gráfico...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <ResponsiveContainer width="100%" height={400} minWidth={800}>
              <BarChart
                data={dataBarras}
                margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e3e5" />
                <XAxis
                  dataKey="nombre"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12, fill: '#515f74' }}
                />
                <YAxis
                  label={{ value: 'Porcentaje (%)', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12, fill: '#515f74' }}
                />
                <Tooltip
                  labelFormatter={(label) => `Habitación: ${label}`}
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #ccc', borderRadius: '8px' }}
                />
                <Bar
                  dataKey="aporte"
                  fill="#008cc7"
                  radius={[8, 8, 0, 0]}
                  name="Aporte (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* Tabla de datos */}
      <section className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl shadow-level-1 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-300 bg-[#f7f9fb]">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <h3 className="font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-[#000000]">
              Detalle de reservas por habitación
            </h3>
            {!loading && stats && (
              <div className="inline-flex items-center gap-2 rounded-full bg-[#eaf6ff] px-3 py-1 text-sm font-semibold text-[#008cc7]">
                <span className="material-symbols-outlined text-[18px]">summarize</span>
                Total del mes: {stats.totalReservas} reservas
              </div>
            )}
          </div>
          <p className="mt-3 text-sm text-[#515f74]">
            Cada habitación muestra cuántas veces fue reservada en el mes. El total mensual se obtiene sumando todas esas reservas y el porcentaje indica la participación de cada habitación dentro de ese total.
          </p>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center">
            <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-4 animate-spin">refresh</span>
            <p className="text-[16px] font-medium text-[#515f74]">Cargando datos...</p>
          </div>
        ) : ocupacionData.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-4">info</span>
            <p className="text-[16px] font-medium text-[#515f74]">No hay datos disponibles</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-300 bg-[#f7f9fb]">
                  <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Habitación</th>
                      <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Descripción de la habitación</th>
                  <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Veces reservada</th>
                  <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Participación del mes</th>
                </tr>
              </thead>
              <tbody>
                {datosPaginados.map((item) => {
                  const porcentajeParticipacion = stats?.totalReservas
                    ? (item.cantidad_unidades / stats.totalReservas) * 100
                    : 0;

                  return (
                    <tr key={item.espacio_id} className="border-b border-slate-300 hover:bg-[#f2f4f6] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-[#008cc7]">{item.numero_espacio}</span>
                          <span className="text-[12px] text-[#515f74]">ID {item.espacio_id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[14px] text-[#515f74]">{item.descripcion || "Sin descripción"}</span>
                      </td>
                      <td className="px-6 py-4 text-[14px] font-semibold text-[#000000]">{item.cantidad_unidades} reservas</td>
                      <td className="px-6 py-4 text-[14px] font-bold text-[#000000]">{porcentajeParticipacion.toFixed(2)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && ocupacionData.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-300 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Mostrando {((paginaValida - 1) * elementosPorPagina) + 1} - {Math.min(paginaValida * elementosPorPagina, ocupacionData.length)} de {ocupacionData.length} habitaciones
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPaginaActual((prev) => Math.max(1, prev - 1))}
                disabled={paginaValida === 1}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-[#008cc7] hover:text-[#008cc7] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm">
                Página {paginaValida} de {totalPaginas}
              </span>
              <button
                onClick={() => setPaginaActual((prev) => Math.min(totalPaginas, prev + 1))}
                disabled={paginaValida === totalPaginas}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-[#008cc7] hover:text-[#008cc7] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Información de cálculo */}
      <section className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
        <div className="flex gap-3">
          <span className="material-symbols-outlined text-blue-600 shrink-0">info</span>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Cómo se interpreta esta tabla:</p>
            <p>La cantidad de reservas representa cuántas veces se ocupó una habitación durante el mes.</p>
            <p>El total del mes es la suma de todas esas reservas en todas las habitaciones.</p>
          </div>
        </div>
      </section>
    </ViewTransition>
  );
}