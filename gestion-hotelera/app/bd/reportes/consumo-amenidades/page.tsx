'use client';

import PageHeader from "@/components/pageheader";
import { ViewTransition } from "react";
import { useState, useMemo } from "react";
import { useConsumoAmenidadesMensual } from "@/functions/reportes-api"; // Ajustado según tu alias de funciones
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function Page() {
  // Inicializamos en abril de 2026 de acuerdo al set de datos de muestra
  const [mesFiltro, setMesFiltro] = useState<string>("2026-07-06");
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 8;

  const { data: consumoApi, loading, error, refetch } = useConsumoAmenidadesMensual();

  // Fallback seguro de arreglo
  const consumoData = useMemo(() => consumoApi || [], [consumoApi]);

  const formatearMes = (value: string) => {
    if (!value) return "Mes seleccionado";
    const [year, month] = value.split("-");
    const fecha = new Date(Number(year), Number(month) - 1, 1);
    const nombreMes = fecha.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
    return nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
  };

  const handleMesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMesFiltro(e.target.value);
    setPaginaActual(1);
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
        // Formatear la fecha visualmente corta 
        const [, mes, dia] = item.fecha.split('-');
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const etiquetaFecha = `${dia} ${meses[parseInt(mes) - 1]}`;

        agrupadoPorFecha[item.fecha] = {
          fechaOriginal: item.fecha,
          name: etiquetaFecha
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

  const totalPaginas = Math.max(1, Math.ceil(consumoData.length / elementosPorPagina));
  const paginaValida = Math.min(paginaActual, totalPaginas);
  const datosPaginados = useMemo(() => {
    const inicio = (paginaValida - 1) * elementosPorPagina;
    return consumoData.slice(inicio, inicio + elementosPorPagina);
  }, [consumoData, paginaValida]);

  if (error && !loading) {
    return (
      <ViewTransition enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}>
        <PageHeader
          name="Resumen de Consumo Mensual de Insumos y Amenidades"
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
      </ViewTransition>
    );
  }

  return (
    <ViewTransition enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}>
      {/* Encabezado Principal y Selector de Mes */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <PageHeader
            name="Resumen de Consumo Mensual de Insumos y Amenidades"
            subtitle="Monitoreo de stock gastado e insumos distribuidos por fecha"
          />
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

      {/* Tabla Desglose Detallada */}
      <section className="bg-[#ffffff] border border-slate-300 rounded-xl overflow-hidden shadow-level-1">
        <div className="px-6 py-4 border-b border-slate-300 bg-[#f7f9fb]">
          <h3 className="font-['Hanken_Grotesk'] text-[18px] font-semibold text-[#000000]">Desglose de Consumo de Amenidades</h3>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-300 bg-[#f7f9fb]">
                  <th className="px-6 py-3 text-left text-[11px] font-bold text-[#515f74] uppercase tracking-wider">ID Log</th>
                  <th className="px-6 py-3 text-left text-[11px] font-bold text-[#515f74] uppercase tracking-wider">Amenidad / Insumo</th>
                  <th className="px-6 py-3 text-right text-[11px] font-bold text-[#515f74] uppercase tracking-wider">Cantidad Extraída</th>
                  <th className="px-6 py-3 text-right text-[11px] font-bold text-[#515f74] uppercase tracking-wider">Fecha de Log</th>
                </tr>
              </thead>
              <tbody>
                {datosPaginados.map((item, index) => {
                  const colorLinea = coloresProductos[item.nombre] || colorFallback;
                  return (
                    <tr key={`${item.producto_gastado_id}-${index}`} className="border-b border-slate-300 hover:bg-[#f2f4f6] transition-colors">
                      <td className="px-6 py-4 text-[13px] font-mono text-slate-500">
                        #{item.producto_gastado_id}
                      </td>
                      <td className="px-6 py-4 text-[14px] font-bold text-[#000000] flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colorLinea }} />
                        {item.nombre}
                      </td>
                      <td className="px-6 py-4 text-right text-[14px] font-mono font-bold text-slate-900">
                        {item.cantidad_gastada} uds
                      </td>
                      <td className="px-6 py-4 text-right text-[13px] font-medium text-slate-600">
                        {item.fecha.split('-').reverse().join('/')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && consumoData.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-300 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Mostrando {((paginaValida - 1) * elementosPorPagina) + 1} - {Math.min(paginaValida * elementosPorPagina, consumoData.length)} de {consumoData.length} registros
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
    </ViewTransition>
  );
}