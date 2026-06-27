'use client';
import PageHeader from "@/components/pageheader";
import { ViewTransition } from "react";
import { useState, useMemo } from "react";
import { useClientesFrecuentes } from "@/functions/reportes-api";

export default function Page() {
  const { data: clientesApi, loading, error, refetch } = useClientesFrecuentes();
  const [busqueda, setBusqueda] = useState("");
  const [ordenar, setOrdenar] = useState<"nombre" | "frecuencia" | "id">("frecuencia");
  const [filtroFrecuenciaMin, setFiltroFrecuenciaMin] = useState(0);

  // Usar datos de API si existen, sino array vacío
  const clientesData = clientesApi || [];

  // Cálculos y filtrados
  const clientesFiltrados = useMemo(() => {
    let resultado = clientesData;

    // Filtrar por búsqueda (nombre, apellido, teléfono)
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      resultado = resultado.filter(c => 
        c.nombres?.toLowerCase().includes(busquedaLower) ||
        c.apellidos?.toLowerCase().includes(busquedaLower) ||
        c.telefono?.includes(busqueda)
      );
    }

    // Filtrar por frecuencia mínima
    resultado = resultado.filter(c => (c.frecuencia || 0) >= filtroFrecuenciaMin);

    // Ordenar
    resultado.sort((a, b) => {
      if (ordenar === "nombre") {
        const nombreA = `${a.nombres || ''} ${a.apellidos || ''}`.trim();
        const nombreB = `${b.nombres || ''} ${b.apellidos || ''}`.trim();
        return nombreA.localeCompare(nombreB);
      }
      if (ordenar === "frecuencia") return (b.frecuencia || 0) - (a.frecuencia || 0);
      if (ordenar === "id") return (a.huesped_id || 0) - (b.huesped_id || 0);
      return 0;
    });

    return resultado;
  }, [clientesData, busqueda, ordenar, filtroFrecuenciaMin]);

  // Estadísticas
  const stats = useMemo(() => {
    const totalClientes = clientesData.length;
    const visitasTotales = clientesData.reduce((sum, c) => sum + (c.frecuencia || 0), 0);
    const frecuenciaPromedio = totalClientes > 0 ? (visitasTotales / totalClientes).toFixed(1) : 0;
    const clientesMasFrequentes = [...clientesData].sort((a, b) => (b.frecuencia || 0) - (a.frecuencia || 0)).slice(0, 5);
    
    // Distribución por rango de frecuencia
    const distribucion = {
      "5 visitas": clientesData.filter(c =>  (c.frecuencia || 0) <= 5).length,
      "6 visitas": clientesData.filter(c =>  (c.frecuencia || 0) === 6).length,
      "7+ visitas": clientesData.filter(c => (c.frecuencia || 0) >= 7).length,
    };

    return { totalClientes, visitasTotales, frecuenciaPromedio, clientesMasFrequentes, distribucion };
  }, [clientesData]);

  const getNivelFrecuencia = (frecuencia: number) => {
    if (frecuencia >= 7) return { label: "VIP", color: "bg-purple-100 text-purple-800", icon: "star" };
    if (frecuencia >= 6) return { label: "Premium", color: "bg-blue-100 text-blue-800", icon: "favorite" };
    return { label: "Regular", color: "bg-slate-100 text-slate-800", icon: "person" };
  };

  // Renderizar error
  if (error && !loading) {
    return (
      <ViewTransition enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}>
        <PageHeader 
          name="Clientes Frecuentes" 
          subtitle="Análisis de huéspedes recurrentes y patrones de visita"
        />
        <div className="bg-red-50 border border-red-300 rounded-xl p-6 flex items-start gap-4">
          <span className="material-symbols-outlined text-[32px] text-red-600">error</span>
          <div className="flex-1">
            <h3 className="font-bold text-red-800 mb-2">Error cargando datos</h3>
            <p className="text-red-700 mb-4">{error.message}</p>
            <button 
              onClick={refetch}
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
            name="Clientes Frecuentes" 
            subtitle="Análisis de huéspedes recurrentes y patrones de visita"
          />
        </div>
        {loading && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
            <span className="material-symbols-outlined animate-spin text-blue-600">refresh</span>
            <span className="text-blue-700 text-sm font-medium">Actualizando...</span>
          </div>
        )}
        {!loading && (
          <button 
            onClick={refetch}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-semibold text-slate-700"
            title="Actualizar datos de la API"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Actualizar
          </button>
        )}
      </div>

      {/* Métricas KPI */}
      <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start gap-4 flex-col-reverse">
            <span className="text-[14px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Total de Clientes</span>
            <div className="p-2 bg-[#c9e6ff] rounded-lg flex items-center">
              <span className="material-symbols-outlined text-[20px] text-[#008cc7]">group</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[24px] leading-10 tracking-[-0.02em] font-semibold text-[#000000] mt-4">
            {loading ? <span className="animate-pulse">--</span> : stats.totalClientes}
          </h2>
        </div>

        <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start gap-4 flex-col-reverse">
            <span className="text-[14px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Visitas Totales</span>
            <div className="p-2 bg-[#d5e3fd] rounded-lg flex items-center">
              <span className="material-symbols-outlined text-[20px] text-[#008cc7]">trending_up</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[24px] leading-10 tracking-[-0.02em] font-semibold text-[#000000] mt-4">
            {loading ? <span className="animate-pulse">--</span> : stats.visitasTotales}
          </h2>
        </div>

        <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start gap-4 flex-col-reverse">
            <span className="text-[14px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Frecuencia Promedio</span>
            <div className="p-2 bg-[#ffdad6] rounded-lg flex items-center">
              <span className="material-symbols-outlined text-[20px] text-[#93000a]">bar_chart</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[24px] leading-10 tracking-[-0.02em] font-semibold text-[#000000] mt-4">
            {loading ? <span className="animate-pulse">--</span> : `${stats.frecuenciaPromedio}x`}
          </h2>
        </div>

        <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start gap-4 flex-col-reverse">
            <span className="text-[14px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Clientes VIP</span>
            <div className="p-2 bg-[#e8d5ff] rounded-lg flex items-center">
              <span className="material-symbols-outlined text-[20px] text-[#6a2d91]">star</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[24px] leading-10 tracking-[-0.02em] font-semibold text-[#000000] mt-4">
            {loading ? <span className="animate-pulse">--</span> : stats.distribucion["7+ visitas"]}
          </h2>
        </div>
      </section>

      

      {/* Filtros y búsqueda */}
      <section className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1">
        <h3 className="font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-[#000000] mb-6">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[12px] font-semibold text-[#515f74] mb-2 uppercase tracking-wider">Buscar por nombre, apellido o teléfono</label>
            <input
              type="text"
              placeholder="ej: Carlos Mejía o 9988-1122"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[14px] font-medium text-[#191c1e] placeholder-slate-400 focus:outline-none focus:border-[#008cc7] focus:ring-1 focus:ring-[#008cc7]"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-[12px] font-semibold text-[#515f74] mb-2 uppercase tracking-wider">Frecuencia mínima</label>
            <select
              value={filtroFrecuenciaMin}
              onChange={(e) => setFiltroFrecuenciaMin(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[14px] font-medium text-[#191c1e] focus:outline-none focus:border-[#008cc7] focus:ring-1 focus:ring-[#008cc7]"
              disabled={loading}
            >
              <option value={0}>Todos</option>
              <option value={5}>5+ visitas</option>
              <option value={6}>6+ visitas</option>
              <option value={7}>7+ visitas (VIP)</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#515f74] mb-2 uppercase tracking-wider">Ordenar por</label>
            <select
              value={ordenar}
              onChange={(e) => setOrdenar(e.target.value as "nombre" | "frecuencia" | "id")}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[14px] font-medium text-[#191c1e] focus:outline-none focus:border-[#008cc7] focus:ring-1 focus:ring-[#008cc7]"
              disabled={loading}
            >
              <option value="frecuencia">Frecuencia (Mayor a menor)</option>
              <option value="nombre">Nombre (A-Z)</option>
              <option value="id">ID Cliente</option>
            </select>
          </div>
        </div>
      </section>

      {/* Tabla de clientes */}
      <section className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl shadow-level-1 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-300 bg-[#f7f9fb] flex justify-between items-center">
          <h3 className="font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-[#000000]">
            Listado de Clientes
          </h3>
          <span className="text-[14px] font-semibold text-[#515f74]">
            {clientesFiltrados.length} de {stats.totalClientes}
          </span>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center">
            <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-4 animate-spin">refresh</span>
            <p className="text-[16px] font-medium text-[#515f74]">Cargando datos de la API...</p>
          </div>
        ) : clientesFiltrados.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-4">search_off</span>
            <p className="text-[16px] font-medium text-[#515f74]">No se encontraron clientes</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-300 bg-[#f7f9fb]">
                  <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Nombre Completo</th>
                  <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Teléfono</th>
                  <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Frecuencia</th>
                  <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Nivel</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map((cliente) => {
                  const nivel = getNivelFrecuencia(cliente.frecuencia || 0);
                  return (
                    <tr key={cliente.huesped_id} className="border-b border-slate-300 hover:bg-[#f2f4f6] transition-colors">
                      <td className="px-6 py-4 text-[14px] font-bold text-[#008cc7]">#{cliente.huesped_id}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-semibold text-[#000000]">{cliente.nombres}</span>
                          <span className="text-[12px] text-[#515f74]">{cliente.apellidos}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[14px] font-medium text-[#515f74]">{cliente.telefono}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-[#008cc7]">event_repeat</span>
                          <span className="text-[14px] font-bold text-[#000000]">{cliente.frecuencia}x</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[12px] font-bold px-3 py-1 rounded-full ${nivel.color} inline-flex items-center gap-1`}>
                          <span className="material-symbols-outlined text-[14px]">{nivel.icon}</span>
                          {nivel.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Resumen */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-semibold text-[#515f74] uppercase tracking-wider mb-2">Resultados</p>
              <h4 className="text-[24px] font-bold text-[#000000]">{clientesFiltrados.length}</h4>
              <p className="text-[12px] text-[#515f74] mt-2">Clientes mostrados</p>
            </div>
            <span className="material-symbols-outlined text-[32px] text-[#008cc7]">people</span>
          </div>
        </div>

        <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-semibold text-[#515f74] uppercase tracking-wider mb-2">Visitas Totales</p>
              <h4 className="text-[24px] font-bold text-[#000000]">
                {clientesFiltrados.reduce((sum, c) => sum + (c.frecuencia || 0), 0)}
              </h4>
              <p className="text-[12px] text-[#515f74] mt-2">Del filtrado</p>
            </div>
            <span className="material-symbols-outlined text-[32px] text-[#008cc7]">trending_up</span>
          </div>
        </div>

        <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-semibold text-[#515f74] uppercase tracking-wider mb-2">Frecuencia Promedio</p>
              <h4 className="text-[24px] font-bold text-[#000000]">
                {clientesFiltrados.length > 0 
                  ? (clientesFiltrados.reduce((sum, c) => sum + (c.frecuencia || 0), 0) / clientesFiltrados.length).toFixed(1)
                  : 0}
              </h4>
              <p className="text-[12px] text-[#515f74] mt-2">Visitas por cliente</p>
            </div>
            <span className="material-symbols-outlined text-[32px] text-[#008cc7]">bar_chart</span>
          </div>
        </div>
      </section>
      {/* Top clientes y distribución */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1">
          <h3 className="font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-[#000000] mb-6">Top 5 Clientes Más Frecuentes</h3>
          <div className="space-y-3">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse h-12 bg-slate-200 rounded"></div>
                ))}
              </div>
            ) : stats.clientesMasFrequentes.length > 0 ? (
              stats.clientesMasFrequentes.map((cliente, index) => {
                const nivel = getNivelFrecuencia(cliente.frecuencia || 0);
                return (
                  <div key={cliente.huesped_id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center justify-center w-10 h-10 bg-[#008cc7] text-white font-bold rounded-full text-sm">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[14px] text-[#000000]">
                        {cliente.nombres} {cliente.apellidos}
                      </p>
                      <p className="text-[12px] text-[#515f74]">{cliente.telefono}</p>
                    </div>
                    <span className={`text-[12px] font-bold px-3 py-1 rounded-full ${nivel.color}`}>
                      {cliente.frecuencia}x
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-500 text-center py-8">Sin datos disponibles</p>
            )}
          </div>
        </div>

        <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1">
          <h3 className="font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-[#000000] mb-6">Distribución por Nivel</h3>
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                    <div className="h-2 bg-slate-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[14px] font-medium text-[#515f74]">VIP (7+ visitas)</span>
                    <span className="text-[14px] font-bold text-[#000000]">{stats.distribucion["7+ visitas"]}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-purple-500 transition-all duration-500"
                      style={{ width: `${stats.totalClientes > 0 ? (stats.distribucion["7+ visitas"] / stats.totalClientes) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[14px] font-medium text-[#515f74]">Premium (5-6 visitas)</span>
                    <span className="text-[14px] font-bold text-[#000000]">{stats.distribucion["6 visitas"]}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${stats.totalClientes > 0 ? (stats.distribucion["6 visitas"] / stats.totalClientes) * 100 : 0}%` }}
                    />
                  </div>
                  
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[14px] font-medium text-[#515f74]">Regular (Menos de 5 visitas)</span>
                    <span className="text-[14px] font-bold text-[#000000]">{stats.distribucion["5 visitas"]}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${stats.totalClientes > 0 ? (stats.distribucion["5 visitas"] / stats.totalClientes) * 100 : 0}%` }}
                    />
                  </div>
                  
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Estado de la API */}
      <section className="bg-slate-50 border border-slate-300 rounded-xl p-4">
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
      </section>
    </ViewTransition>
  );
}