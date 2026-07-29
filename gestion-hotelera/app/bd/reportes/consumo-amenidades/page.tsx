'use client';

import PageHeader from "@/components/pageheader";
// removed ViewTransition import (not available in this React version)
import { useState, useMemo } from "react";
import { useConsumoAmenidadesMensual } from "@/functions/reportes-api"; // Ajustado según tu alias de funciones
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function Page() {
  // Inicializamos en abril de 2026 de acuerdo al set de datos de muestra
  const [mesFiltro, setMesFiltro] = useState<string>("2026-07-06");

  const { data: consumoApi, loading, error, refetch } = useConsumoAmenidadesMensual();

  // Fallback seguro de arreglo
  const consumoData = useMemo(() => consumoApi || [], [consumoApi]);

  // Calcula el rango semanal (7 días) que termina en la fecha dada
  const calcularRangoSemana = (fechaStr: string) => {
    const [year, month, day] = fechaStr.split('-').map(Number);
    const fin = new Date(year, month - 1, day);
    const inicio = new Date(fin);
    inicio.setDate(fin.getDate() - 6);
    return { inicio, fin };
  };

  const NOMBRES_MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const formatearFechaCorta = (fecha: Date) => {
    return `${String(fecha.getDate()).padStart(2, '0')} ${NOMBRES_MESES_CORTOS[fecha.getMonth()]}`;
  };

  const formatearFechaDDMMYYYY = (fecha: Date) => {
    return `${String(fecha.getDate()).padStart(2, '0')}/${String(fecha.getMonth() + 1).padStart(2, '0')}/${fecha.getFullYear()}`;
  };

  // Devuelve el rango "dd/mm/yyyy - dd/mm/yyyy" (formato "largo", para la tabla)
  // o "dd Mon - dd Mon" (formato "corto", para el gráfico/tooltip)
  const formatearRangoSemana = (fechaStr: string, formato: 'corto' | 'largo' = 'largo') => {
    const { inicio, fin } = calcularRangoSemana(fechaStr);
    if (formato === 'corto') {
      return `${formatearFechaCorta(inicio)} - ${formatearFechaCorta(fin)}`;
    }
    return `${formatearFechaDDMMYYYY(inicio)} - ${formatearFechaDDMMYYYY(fin)}`;
  };

  const formatearMes = (value: string) => {
    if (!value) return "Mes seleccionado";
    const [year, month] = value.split("-");
    const fecha = new Date(Number(year), Number(month) - 1, 1);
    const nombreMes = fecha.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
    return nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
  };

  const handleMesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMesFiltro(e.target.value);
    refetch(e.target.value + "-01"); // Agregar día para formar una fecha completa
  }

  // Paleta de colores consistente para identificar de manera fija cada amenidad/producto
  const coloresProductos: Record<string, string> = useMemo(() => {
    return {
      "Jabón de Tocador Hotelero Barra 20g": "#00a8f0",
      "Shampoo Hotelero Sachet 30ml": "#0086c0",
      "Cloro en Gel Maxiclean": "#006894",
      "Desinfectante de Lavanda Fabuloso": "#004d6e"
    };
  }, []);
  const colorFallback = "#64748b";

  // 1. Transformación para el Gráfico de Líneas: Agrupación por Fecha
  const dataGraficoLineas = useMemo(() => {
    const agrupadoPorFecha: Record<string, Record<string, string | number>> = {};

    consumoData.forEach(item => {
      if (!agrupadoPorFecha[item.fecha]) {
        // Etiqueta corta en el eje X (fecha final de la semana) y rango completo para el tooltip
        const { fin } = calcularRangoSemana(item.fecha);
        const etiquetaFecha = formatearFechaCorta(fin);
        const rangoCompleto = formatearRangoSemana(item.fecha, 'corto');

        agrupadoPorFecha[item.fecha] = {
          fechaOriginal: item.fecha,
          name: etiquetaFecha,
          rangoCompleto: rangoCompleto
        };
      }
      // Asignar la cantidad gastada al producto correspondiente en esa fecha
      agrupadoPorFecha[item.fecha][item.nombre] = item.cantidad_gastada;
      console.log(agrupadoPorFecha)
    });

    // Ordenar cronológicamente por la fecha original
    return Object.values(agrupadoPorFecha).sort((a, b) => {
      const fechaA = String(a.fechaOriginal);
      const fechaB = String(b.fechaOriginal);
      return fechaA.localeCompare(fechaB);
    });
  }, [consumoData]);

  // 2. Transformación para el Gráfico de Barras Horizontales: Consumo Total por Producto (Sin Fechas)
  const dataGraficoBarras = useMemo(() => {
    const acumuladoPorProducto: Record<string, number> = {};

    consumoData.forEach(item => {
      acumuladoPorProducto[item.nombre] = (acumuladoPorProducto[item.nombre] || 0) + item.cantidad_gastada;
    });

    // Mapear al formato que requiere Recharts y ordenar de mayor a menor consumo
    return Object.entries(acumuladoPorProducto)
      .map(([nombre, total]) => ({
        nombre,
        total,
        fill: coloresProductos[nombre] || colorFallback
      }))
      .sort((a, b) => b.total - a.total);
  }, [consumoData, coloresProductos]);

  // Listado de nombres únicos de productos activos en el mes para renderizar las líneas del gráfico
  const productosUnicos = useMemo(() => {
    return Array.from(new Set(consumoData.map(item => item.nombre)));
  }, [consumoData]);

  // Cálculo de KPIs Globales
  const stats = useMemo(() => {
    const totalUnidades = consumoData.reduce((sum, item) => sum + (item.cantidad_gastada || 0), 0);
    const variedadProductos = productosUnicos.length;
    return { totalUnidades, variedadProductos };
  }, [consumoData, productosUnicos]);

  const topProducts = dataGraficoBarras.slice(0, 5);

  if (error && !loading) {
    return (
      <>
        <PageHeader
          name="Resumen de consumo mensual de insumos y amenidades"
          subtitle="Monitoreo de stock gastado e insumos distribuidos por fecha"
        />
        <div className="bg-red-50 border border-red-300 rounded-xl p-6 flex items-start gap-4">
          <span className="material-symbols-outlined text-[32px] text-red-600">error</span>
          <div className="flex-1">
            <h3 className="font-bold text-red-800 mb-2">Error al cargar el histórico de consumos</h3>
            <p className="text-red-700 mb-4">{error.message}</p>
            <button
              onClick={() => refetch(mesFiltro + "-01")}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center gap-2"
            >
              <span className="material-symbols-outlined">refresh</span>
              Sincronizar Periodo
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Encabezado Principal y Selector de Mes */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <PageHeader
            name="Resumen de Consumo Mensual de Insumos y Amenidades"
            subtitle="Monitoreo de stock gastado e insumos distribuidos por fecha"
          />
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex flex-col">
            <label className="text-[11px] font-bold text-[#515f74] uppercase tracking-wider mb-1">Periodo Analítico</label>
            <input
              type="month"
              value={mesFiltro}
              onChange={(e) => setMesFiltro(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-[14px] font-semibold text-[#191c1e] bg-white focus:outline-none focus:border-[#008cc7]"
              disabled={loading}
            />
          </div>
          <button
            onClick={() => refetch()}
            className="mt-5 p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700"
            title="Recargar datos"
          >
            <span className="material-symbols-outlined text-[20px] block">refresh</span>
          </button>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white  p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#008cc7] text-white">
              <span className="material-symbols-outlined text-[22px]">calendar_month</span>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#515f74]">Periodo</p>
              <h3 className="text-[18px] font-semibold text-[#0f172a]">{formatearMes(mesFiltro)}</h3>
              <p className="text-sm text-slate-500">Selecciona un periodo para actualizar el consumo mensual.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex flex-col rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#515f74]">Mes</span>
              <input
                type="month"
                value={mesFiltro}
                onChange={handleMesChange}
                className="mt-1 bg-transparent text-sm font-semibold text-[#191c1e] focus:outline-none"
                disabled={loading}
              />
            </label>

            <button
              onClick={() => refetch(mesFiltro + "-01")}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#008cc7] hover:text-[#008cc7] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              {loading ? "Actualizando" : "Actualizar"}
            </button>
          </div>
        </div>
      </section>

      {/* Tarjetas de KPIs Globales */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-6 shadow-level-1">
          <div className="flex justify-between items-start flex-col-reverse">
            <span className="text-[14px] font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Unidades Despachadas</span>
            <div className="p-2 bg-[#c9e6ff] rounded-lg mb-4">
              <span className="material-symbols-outlined text-[20px] text-[#008cc7]">inventory_2</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[20px] font-semibold text-[#000000]">
            {loading ? <span className="animate-pulse">--</span> : `${stats.totalUnidades} Unidades`}
          </h2>
        </div>

        <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-6 shadow-level-1">
          <div className="flex justify-between items-start flex-col-reverse">
            <span className="text-[14px] font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Líneas de Productos Activos</span>
            <div className="p-2 bg-[#e0e3e5] rounded-lg mb-4">
              <span className="material-symbols-outlined text-[20px] text-[#565e74]">category</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[20px] font-semibold text-[#000000]">
            {loading ? <span className="animate-pulse">--</span> : `${stats.variedadProductos} Amenidades`}
          </h2>
        </div>
      </section>

      {/* Sección de Gráficos Analíticos */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* 1. Gráfico de Líneas con Fechas */}
        <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-6 lg:col-span-7 flex flex-col justify-between shadow-level-1">
          <div>
            <h3 className="font-['Hanken_Grotesk'] text-[18px] font-semibold text-[#000000] mb-1">Tendencia de Consumo en el Tiempo</h3>
            <p className="text-[13px] text-[#515f74] mb-6">Variación y picos de uso por cada fecha de registro</p>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <span className="material-symbols-outlined text-[40px] text-slate-300 animate-spin">progress_activity</span>
            </div>
          ) : dataGraficoLineas.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400">
              <span className="material-symbols-outlined text-[40px]">timeline</span>
              <p className="text-sm mt-2">Sin registros cronológicos en este periodo</p>
            </div>
          ) : (
            <div className="w-full h-64 text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataGraficoLineas} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                    labelStyle={{ fontWeight: 'bold', color: '#000' }}
                    labelFormatter={(label, payload) => {
                      const rango = payload && payload[0] ? (payload[0].payload as { rangoCompleto?: string }).rangoCompleto : null;
                      return rango || label;
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '15px' }} layout="vertical" width="100%" />
                  {productosUnicos.map((producto) => (
                    <Line
                      key={producto}
                      type="monotone"
                      dataKey={producto}
                      stroke={coloresProductos[producto] || colorFallback}
                      strokeWidth={2.5}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* 2. Gráfico de Barras Horizontales sin Fechas */}
        <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-6 lg:col-span-5 flex flex-col justify-between shadow-level-1">
          <div>
            <h3 className="font-['Hanken_Grotesk'] text-[18px] font-semibold text-[#000000] mb-1">Acumulado General del Mes</h3>
            <p className="text-[13px] text-[#515f74] mb-6">Volumen total consumido por amenidad (Sin desglose temporal)</p>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <span className="material-symbols-outlined text-[40px] text-slate-300 animate-spin">progress_activity</span>
            </div>
          ) : dataGraficoBarras.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400">
              <span className="material-symbols-outlined text-[40px]">bar_chart</span>
              <p className="text-sm mt-2">Sin totales acumulados en este periodo</p>
            </div>
          ) : (
            <div className="w-full h-64 text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dataGraficoBarras}
                  layout="vertical"
                  margin={{ top: 0, right: 10, left: 20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  {/* Ocultamos el eje Y de texto largo si interfiere, o lo formateamos recortado */}
                  <YAxis
                    dataKey="nombre"
                    type="category"
                    stroke="#64748b"
                    width={80}
                    tickFormatter={(value) => value.length > 12 ? `${value.substring(0, 10)}...` : value}
                  />
                  <XAxis type="number" stroke="#64748b" />
                  <Tooltip
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                  />
                  <Bar
                    dataKey="total"
                    name="Cantidad Gastada"
                    radius={[0, 4, 4, 0]}
                    barSize={16}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>

      {/* Resumen Sintético de Consumo */}
      <section className="bg-[#ffffff] border border-slate-300 rounded-xl overflow-hidden shadow-level-1">
        <div className="px-6 py-4 border-b border-slate-300 bg-[#f7f9fb]">
          <h3 className="font-['Hanken_Grotesk'] text-[18px] font-semibold text-[#000000]">Resumen Sintético de Consumo</h3>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <span className="material-symbols-outlined animate-spin block mb-2 text-[32px]">refresh</span>
            <p className="text-sm">Consolidando inventario gastado...</p>
          </div>
        ) : consumoData.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <span className="material-symbols-outlined block mb-2 text-[32px]">inventory_edges</span>
            <p className="text-sm">No existen registros de salida para el mes seleccionado.</p>
          </div>
        ) : (
          <div className="px-6 py-6 space-y-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total consumido</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{stats.totalUnidades}</p>
                <p className="text-sm text-slate-500 mt-1">Unidades gastadas en el periodo</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Productos activos</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{stats.variedadProductos}</p>
                <p className="text-sm text-slate-500 mt-1">Líneas distintas usadas en los gráficos</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Top producto</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{topProducts[0]?.nombre || 'N/A'}</p>
                <p className="text-sm text-slate-500 mt-1">Basado en el resumen acumulado del gráfico de barras</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Cantidad top</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{topProducts[0]?.total ?? 0}</p>
                <p className="text-sm text-slate-500 mt-1">Unidades del producto más consumido</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Resumen por producto</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#f7f9fb] text-left text-[11px] uppercase tracking-[0.18em] text-[#515f74]">
                      <th className="px-5 py-4">Amenidad / Insumo</th>
                      <th className="px-5 py-4">Total consumido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((item) => (
                      <tr key={item.nombre} className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4 font-semibold text-slate-900 flex items-center gap-3">
                          <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                          {item.nombre}
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-900">{item.total} uds</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-4 bg-slate-50 text-xs text-slate-500">
                Resumen sintético basado en los mismos datos que alimentan los gráficos de arriba.
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}