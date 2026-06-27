'use client';
import PageHeader from "@/components/pageheader";
import { useOcupacionMensual } from "@/functions/reportes-api";
import { ViewTransition } from "react";
import { useState, useMemo } from "react";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface OcupacionData {
  espacio_id: number;
  numero_espacio: string;
  cantidad_unidades: number;
  total_dias_mes: number;
  porcentaje: number;
}

export default function Page() {
  const [datos, setDatos] = useState<OcupacionData[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>("2026-05-27");
  const [mes, setMes] = useState<string>("Mayo 2026");
  const { data: ocupacionApi, loading, error, refetch } = useOcupacionMensual();

  const ocupacionData = ocupacionApi || [];

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

  // Cargar datos al montar componente y cuando cambia la fecha
  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaFecha = e.target.value;
    setFechaSeleccionada(nuevaFecha);
    refetch();
  };

  // Cálculos estadísticos
  const stats = useMemo(() => {
    if (ocupacionData.length === 0) return null;

    const totalHabitaciones = 25;
    const diasDelMes = new Date(new Date(fechaSeleccionada).getFullYear(), new Date(fechaSeleccionada).getMonth() + 1, 0).getDate();
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

  const COLORS = ['#008cc7', '#0066a8', '#004d7f', '#003a5c', '#002c47'];

  // Renderizar error
  if (error && !loading) {
    return (
      <ViewTransition enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}>
        <PageHeader 
          name="Ocupación Mensual" 
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
      <div className="flex justify-between items-start gap-4">
        <div>
          <PageHeader 
            name="Ocupación Mensual" 
            subtitle="Análisis sintetizado de ocupación por mes"
          />
        </div>
        {loading && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
            <span className="material-symbols-outlined animate-spin text-blue-600">refresh</span>
            <span className="text-blue-700 text-sm font-medium">Cargando...</span>
          </div>
        )}
      </div>

      {/* Selector de fecha */}
      <section className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="w-full sm:w-64">
            <label className="block text-[12px] font-semibold text-[#515f74] mb-2 uppercase tracking-wider">Seleccionar fecha</label>
            <input
              type="date"
              value={fechaSeleccionada}
              onChange={handleFechaChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[14px] font-medium text-[#191c1e] focus:outline-none focus:border-[#008cc7] focus:ring-1 focus:ring-[#008cc7]"
            />
            <p className="text-[12px] text-[#515f74] mt-2">Se usará el mes de la fecha seleccionada</p>
          </div>
          <div className="flex-1">
            <h3 className="text-[18px] font-bold text-[#008cc7] capitalize">{mes}</h3>
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
          <span className="text-[12px] leading-3.5 font-medium text-[#515f74] flex items-center mt-2">
            <span className="material-symbols-outlined text-[16px]">hotel</span> Del mes {mes}
          </span>
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
          <span className="text-[12px] leading-3.5 font-medium text-[#515f74] flex items-center mt-2">
            <span className="material-symbols-outlined text-[16px]">calendar_month</span> Espacios libres
          </span>
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
          <span className="text-[12px] leading-3.5 font-medium text-[#515f74] flex items-center mt-2">
            <span className="material-symbols-outlined text-[16px]">event</span> Unidades reservadas
          </span>
        </div>

        <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start gap-4 flex-col-reverse">
            <span className="text-[14px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Días del Mes</span>
            <div className="p-2 bg-[#e8d5ff] rounded-lg flex items-center">
              <span className="material-symbols-outlined text-[20px] text-[#6a2d91]">calendar_today</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[20px] leading-10 tracking-[-0.02em] font-semibold text-[#000000]">
            {loading ? <span className="animate-pulse">--</span> : stats?.diasDelMes}
          </h2>
          <span className="text-[12px] leading-3.5 font-medium text-[#6a2d91] flex items-center mt-2">
            <span className="material-symbols-outlined text-[16px]">date_range</span> Período
          </span>
        </div>
      </section>

      {/* Gráficos */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Torta */}
        <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1">
          <h3 className="font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-[#000000] mb-6">Ocupación General</h3>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-lg">
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
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
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
          <div className="h-[400px] flex items-center justify-center bg-slate-50 rounded-lg">
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
          <h3 className="font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-[#000000]">
            Detalle de Ocupación por Habitación
          </h3>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center">
            <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-4 animate-spin">refresh</span>
            <p className="text-[16px] font-medium text-[#515f74]">Cargando datos...</p>
          </div>
        ) : datos.length === 0 ? (
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
                  <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Reservas</th>
                  <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Total Días Mes</th>
                  <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Aporte (%)</th>
                  <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Visualización</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((item) => (
                  <tr key={item.espacio_id} className="border-b border-slate-300 hover:bg-[#f2f4f6] transition-colors">
                    <td className="px-6 py-4 text-[14px] font-bold text-[#008cc7]">{item.numero_espacio}</td>
                    <td className="px-6 py-4 text-[14px] font-semibold text-[#000000]">{item.cantidad_unidades}</td>
                    <td className="px-6 py-4 text-[14px] text-[#515f74]">{item.total_dias_mes}</td>
                    <td className="px-6 py-4 text-[14px] font-bold text-[#000000]">{item.porcentaje}%</td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden max-w-xs">
                        <div 
                          className="h-full bg-[#008cc7] rounded-full transition-all duration-300"
                          style={{ width: `${item.porcentaje}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Información de cálculo */}
      <section className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
        <div className="flex gap-3">
          <span className="material-symbols-outlined text-blue-600 flex-shrink-0">info</span>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Cálculo de Ocupación General:</p>
            <p>Ocupación = (Total días reservados en mes) / (Total habitaciones × Días del mes) × 100</p>
            <p className="mt-1">En este caso: {datos.length > 0 ? `${datos[0]?.total_dias_mes || 0}` : '--'} / (25 × {stats?.diasDelMes || '--'}) × 100 = {stats?.ocupacionGeneral || '--'}%</p>
          </div>
        </div>
      </section>
    </ViewTransition>
  );
}