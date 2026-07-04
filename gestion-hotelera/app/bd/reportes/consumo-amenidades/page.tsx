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
  const [mesFiltro, setMesFiltro] = useState<string>("2026-04-25");
  
  const { data: consumoApi, loading, error, refetch } = useConsumoAmenidadesMensual();

  // Fallback seguro de arreglo
  const consumoData = consumoApi || [];

  // Paleta de colores consistente para identificar de manera fija cada amenidad/producto
  const coloresProductos: Record<string, string> = {
    "Jabón de Tocador Hotelero Barra 20g": "#008cc7",
    "shampoo Hotelero Sachet 30ml": "#10b981",
    "Cloro en Gel Maxiclean": "#f59e0b",
    "Desinfectante de Lavanda Fabuloso": "#ec4899"
  };
  const colorFallback = "#64748b";

  // 1. Transformación para el Gráfico de Líneas: Agrupación por Fecha
  const dataGraficoLineas = useMemo(() => {
    const agrupadoPorFecha: Record<string, any> = {};

    consumoData.forEach(item => {
      if (!agrupadoPorFecha[item.fecha]) {
        // Formatear la fecha visualmente corta (Ej: "06 Abr")
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
    });

    // Ordenar cronológicamente por la fecha original
    return Object.values(agrupadoPorFecha).sort((a, b) => 
      a.fechaOriginal.localeCompare(b.fechaOriginal)
    );
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
  }, [consumoData]);

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
              onClick={refetch}
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
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
            onClick={refetch}
            className="mt-5 p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700"
            title="Recargar datos"
          >
            <span className="material-symbols-outlined text-[20px] block">refresh</span>
          </button>
        </div>
      </div>

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
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '15px' }} layout="vertical" width="100%"/>
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
          <h3 className="font-['Hanken_Grotesk'] text-[18px] font-semibold text-[#000000]">Desglose de Auditoría Física</h3>
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
                {consumoData.map((item, index) => {
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
      </section>
    </ViewTransition>
  );
}