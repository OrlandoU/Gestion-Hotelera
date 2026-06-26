'use client';
import PageHeader from "@/components/pageheader";
import { ViewTransition } from "react";
import { useState, useMemo } from "react";
import { useEstadoHabitaciones } from "@/functions/reportes-api";

type TipoHabitacion = "Básica" | "Doble-Básica" | "Estandar" | "Doble-Estandar";

export default function Page() {
  const { data: habitacionesApi, loading, error, refetch } = useEstadoHabitaciones();
  const [filtroTipo, setFiltroTipo] = useState<TipoHabitacion | "Todos">("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [ordenar, setOrdenar] = useState<"numero" | "tipo" | "precio">("numero");

  // Usar datos de API si existen, sino array vacío
  const habitacionesData = habitacionesApi || [];

  // Cálculos y filtrados
  const habitacionesFiltradas = useMemo(() => {
    let resultado = habitacionesData;

    if (filtroTipo !== "Todos") {
      resultado = resultado.filter(h => h.tipo === filtroTipo);
    }

    if (busqueda) {
      resultado = resultado.filter(h => 
        h.numero_espacio?.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Ordenar
    resultado.sort((a, b) => {
      if (ordenar === "numero") return (a.numero_espacio || "").localeCompare(b.numero_espacio || "");
      if (ordenar === "tipo") return (a.tipo || "").localeCompare(b.tipo || "");
      if (ordenar === "precio") return (a.precio_unidad || 0) - (b.precio_unidad || 0);
      return 0;
    });

    return resultado;
  }, [habitacionesData, filtroTipo, busqueda, ordenar]);

  // Estadísticas
  const stats = useMemo(() => {
    const totalHabitaciones = habitacionesData.length;
    const ingresoTotal = habitacionesData.reduce((sum, h) => sum + (h.precio_unidad || 0), 0);
    const ingresoPromedio = totalHabitaciones > 0 ? Math.round(ingresoTotal / totalHabitaciones) : 0;
    
    const porTipo = habitacionesData.reduce((acc: Record<string, number>, h) => {
      const tipo = h.tipo || "Sin tipo";
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});

    return { totalHabitaciones, ingresoTotal, ingresoPromedio, porTipo };
  }, [habitacionesData]);

  const getColorEstado = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case "disponible":
        return { bg: "bg-emerald-50", border: "border-l-4 border-emerald-500", icon: "check_circle", text: "text-emerald-700" };
      case "ocupada":
        return { bg: "bg-slate-50", border: "border-l-4 border-slate-500", icon: "lock", text: "text-slate-700" };
      case "limpieza":
        return { bg: "bg-amber-50", border: "border-l-4 border-amber-500", icon: "cleaning_services", text: "text-amber-700" };
      case "mantenimiento":
        return { bg: "bg-rose-50", border: "border-l-4 border-rose-500", icon: "build", text: "text-rose-700" };
      default:
        return { bg: "bg-slate-50", border: "border-l-4 border-slate-300", icon: "info", text: "text-slate-700" };
    }
  };

  const getColorTipo = (tipo: string) => {
    switch (tipo) {
      case "Básica":
        return "bg-blue-100 text-blue-800";
      case "Doble-Básica":
        return "bg-cyan-100 text-cyan-800";
      case "Estandar":
        return "bg-purple-100 text-purple-800";
      case "Doble-Estandar":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  // Renderizar error
  if (error && !loading) {
    return (
      <ViewTransition enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}>
        <PageHeader 
          name="Estado de Habitaciones" 
          subtitle="Visualización y gestión del inventario de espacios disponibles"
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
      <div className="flex justify-between items-start gap-4 mb-6">
        <div>
          <PageHeader 
            name="Estado de Habitaciones" 
            subtitle="Visualización y gestión del inventario de espacios disponibles"
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
            <span className="text-[14px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Total Habitaciones</span>
            <div className="p-2 bg-[#c9e6ff] rounded-lg flex items-center">
              <span className="material-symbols-outlined text-[20px] text-[#008cc7]">meeting_room</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[24px] leading-10 tracking-[-0.02em] font-semibold text-[#000000] mt-4">
            {loading ? <span className="animate-pulse">--</span> : stats.totalHabitaciones}
          </h2>
          <span className="text-[12px] leading-3.5 font-medium text-[#515f74] flex items-center mt-2">
            <span className="material-symbols-outlined text-[16px]">rooms</span> Espacios inventariados
          </span>
        </div>

        <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start gap-4 flex-col-reverse">
            <span className="text-[14px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Ingreso Total Potencial</span>
            <div className="p-2 bg-[#d5e3fd] rounded-lg flex items-center">
              <span className="material-symbols-outlined text-[20px] text-[#008cc7]">payments</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[24px] leading-10 tracking-[-0.02em] font-semibold text-[#000000] mt-4">
            {loading ? <span className="animate-pulse">--</span> : `$${(stats.ingresoTotal / 1000).toFixed(1)}k`}
          </h2>
          <span className="text-[12px] leading-3.5 font-medium text-[#515f74] flex items-center mt-2">
            <span className="material-symbols-outlined text-[16px]">trending_up</span> Precio diario combinado
          </span>
        </div>

        <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start gap-4 flex-col-reverse">
            <span className="text-[14px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Precio Promedio</span>
            <div className="p-2 bg-[#ffdad6] rounded-lg flex items-center">
              <span className="material-symbols-outlined text-[20px] text-[#93000a]">price_change</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[24px] leading-10 tracking-[-0.02em] font-semibold text-[#000000] mt-4">
            {loading ? <span className="animate-pulse">--</span> : `$${stats.ingresoPromedio}`}
          </h2>
          <span className="text-[12px] leading-3.5 font-medium text-[#515f74] flex items-center mt-2">
            <span className="material-symbols-outlined text-[16px]">show_chart</span> Por habitación
          </span>
        </div>

        <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start gap-4 flex-col-reverse">
            <span className="text-[14px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Disponibilidad</span>
            <div className="p-2 bg-[#e0e3e5] rounded-lg flex items-center">
              <span className="material-symbols-outlined text-[20px] text-[#565e74]">check_circle</span>
            </div>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-[24px] leading-10 tracking-[-0.02em] font-semibold text-[#000000] mt-4">
            {loading ? <span className="animate-pulse">--</span> : (stats.totalHabitaciones > 0 ? '100%' : 'N/A')}
          </h2>
          <span className="text-[12px] leading-3.5 font-medium text-[#007a2c] flex items-center mt-2">
            <span className="material-symbols-outlined text-[16px]">verified</span> Todas disponibles
          </span>
        </div>
      </section>

      {/* Distribución por tipo */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1">
          <h3 className="font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-[#000000] mb-6">Distribución por Tipo</h3>
          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
                    <div className="h-2.5 bg-slate-200 rounded-full w-full"></div>
                  </div>
                ))}
              </div>
            ) : Object.entries(stats.porTipo).length > 0 ? (
              Object.entries(stats.porTipo).map(([tipo, cantidad]) => (
                <div key={tipo}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[14px] font-medium text-[#515f74]">{tipo}</span>
                    <span className="text-[14px] font-bold text-[#000000]">{cantidad} habitaciones</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        tipo === "Básica" ? "bg-blue-500" :
                        tipo === "Doble-Básica" ? "bg-cyan-500" :
                        tipo === "Estandar" ? "bg-purple-500" :
                        tipo === "Doble-Estandar" ? "bg-indigo-500" :
                        "bg-slate-500"
                      }`}
                      style={{ width: `${stats.totalHabitaciones > 0 ? (cantidad / stats.totalHabitaciones) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-8">Sin datos disponibles</p>
            )}
          </div>
        </div>

        <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1">
          <h3 className="font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-[#000000] mb-6">Leyenda de Estados</h3>
          <div className="flex flex-col gap-3">
            {[
              { estado: "Disponible", icon: "check_circle", color: "emerald" },
              { estado: "Ocupada", icon: "lock", color: "slate" },
              { estado: "Limpieza", icon: "cleaning_services", color: "amber" },
              { estado: "Mantenimiento", icon: "build", color: "rose" },
            ].map(({ estado, icon, color }) => (
              <div key={estado} className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-[20px] text-${color}-600`}>{icon}</span>
                <span className="text-[14px] font-medium text-[#515f74]">{estado}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filtros y búsqueda */}
      <section className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1">
        <h3 className="font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-[#000000] mb-6">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[12px] font-semibold text-[#515f74] mb-2 uppercase tracking-wider">Buscar por número</label>
            <input
              type="text"
              placeholder="ej: H-201"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[14px] font-medium text-[#191c1e] placeholder-slate-400 focus:outline-none focus:border-[#008cc7] focus:ring-1 focus:ring-[#008cc7]"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-[12px] font-semibold text-[#515f74] mb-2 uppercase tracking-wider">Tipo de habitación</label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value as TipoHabitacion | "Todos")}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[14px] font-medium text-[#191c1e] focus:outline-none focus:border-[#008cc7] focus:ring-1 focus:ring-[#008cc7]"
              disabled={loading}
            >
              <option value="Todos">Todos los tipos</option>
              {Object.keys(stats.porTipo).map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#515f74] mb-2 uppercase tracking-wider">Ordenar por</label>
            <select
              value={ordenar}
              onChange={(e) => setOrdenar(e.target.value as "numero" | "tipo" | "precio")}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[14px] font-medium text-[#191c1e] focus:outline-none focus:border-[#008cc7] focus:ring-1 focus:ring-[#008cc7]"
              disabled={loading}
            >
              <option value="numero">Número de habitación</option>
              <option value="tipo">Tipo</option>
              <option value="precio">Precio</option>
            </select>
          </div>
        </div>
      </section>

      {/* Tabla de habitaciones */}
      <section className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl shadow-level-1 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-300 bg-[#f7f9fb] flex justify-between items-center">
          <h3 className="font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-[#000000]">
            Habitaciones {filtroTipo !== "Todos" && `(${filtroTipo})`}
          </h3>
          <span className="text-[14px] font-semibold text-[#515f74]">
            {habitacionesFiltradas.length} de {stats.totalHabitaciones}
          </span>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center">
            <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-4 animate-spin">refresh</span>
            <p className="text-[16px] font-medium text-[#515f74]">Cargando datos de la API...</p>
          </div>
        ) : habitacionesFiltradas.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-4">search_off</span>
            <p className="text-[16px] font-medium text-[#515f74]">No se encontraron habitaciones</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-300 bg-[#f7f9fb]">
                  <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Habitación</th>
                  <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Capacidad</th>
                  <th className="px-6 py-3 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Precio/Noche</th>
                </tr>
              </thead>
              <tbody>
                {habitacionesFiltradas.map((habitacion) => {
                  const colorEstado = getColorEstado(habitacion.estado || "");
                  return (
                    <tr key={habitacion.numero_espacio} className={`border-b border-slate-300 hover:bg-[#f2f4f6] transition-colors ${colorEstado.bg}`}>
                      <td className={`px-6 py-4 text-[14px] font-bold text-[#000000] ${colorEstado.border}`}>{habitacion.numero_espacio}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[12px] font-bold px-3 py-1 rounded-full ${getColorTipo(habitacion.tipo || "")}`}>
                          {habitacion.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-[18px] ${colorEstado.text}`}>{colorEstado.icon}</span>
                          <span className={`text-[14px] font-semibold ${colorEstado.text}`}>{habitacion.estado}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[14px] font-medium text-[#515f74]">
                        <span className="inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">person</span>
                          {habitacion.capacidad_huespedes}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[14px] font-bold text-[#008cc7]">${habitacion.precio_unidad}</td>
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
              <h4 className="text-[24px] font-bold text-[#000000]">{habitacionesFiltradas.length}</h4>
              <p className="text-[12px] text-[#515f74] mt-2">Habitaciones mostradas</p>
            </div>
            <span className="material-symbols-outlined text-[32px] text-[#008cc7]">list</span>
          </div>
        </div>

        <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-semibold text-[#515f74] uppercase tracking-wider mb-2">Ingreso Filtrado</p>
              <h4 className="text-[24px] font-bold text-[#000000]">${(habitacionesFiltradas.reduce((sum, h) => sum + (h.precio_unidad || 0), 0) / 1000).toFixed(1)}k</h4>
              <p className="text-[12px] text-[#515f74] mt-2">Total potencial</p>
            </div>
            <span className="material-symbols-outlined text-[32px] text-[#008cc7]">attach_money</span>
          </div>
        </div>

        <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-semibold text-[#515f74] uppercase tracking-wider mb-2">Precio Promedio</p>
              <h4 className="text-[24px] font-bold text-[#000000]">
                ${habitacionesFiltradas.length > 0 ? Math.round(habitacionesFiltradas.reduce((sum, h) => sum + (h.precio_unidad || 0), 0) / habitacionesFiltradas.length) : 0}
              </h4>
              <p className="text-[12px] text-[#515f74] mt-2">Del filtrado</p>
            </div>
            <span className="material-symbols-outlined text-[32px] text-[#008cc7]">trending_up</span>
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