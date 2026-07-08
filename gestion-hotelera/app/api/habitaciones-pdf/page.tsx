'use client';
import PageHeader from "@/components/pageheader";
import { Suspense, ViewTransition } from "react";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useEstadoHabitaciones } from "@/functions/reportes-api";
import Image from "next/image";
import logo from "@/public/logo.png";

type TipoHabitacion = "Básica" | "Doble-Básica" | "Estandar" | "Doble-Estandar";

export default function Page() {
    return (
        <Suspense fallback={<div className="p-6 text-sm text-slate-500">Cargando reporte…</div>}>
            <EstadoHabitacionesPdfContent />
        </Suspense>
    );
}

function EstadoHabitacionesPdfContent() {
    const searchParams = useSearchParams();

    const { data: habitacionesApi, loading, error } = useEstadoHabitaciones();

    const filtroTipoParam = searchParams.get("tipo") || "Todos";
    const filtroTipo: TipoHabitacion | "Todos" = filtroTipoParam as TipoHabitacion | "Todos";
    const busqueda = searchParams.get("busqueda") ? decodeURIComponent(searchParams.get("busqueda")!) : "";
    const ordenarParam = searchParams.get("ordenar");
    const ordenar: "numero" | "tipo" | "precio" = ordenarParam === "tipo" || ordenarParam === "precio"
        ? ordenarParam
        : "numero";

    const habitacionesData = useMemo(() => habitacionesApi || [], [habitacionesApi]);

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

        resultado = [...resultado].sort((a, b) => {
            if (ordenar === "numero") return (a.numero_espacio || "").localeCompare(b.numero_espacio || "");
            if (ordenar === "tipo") return (a.tipo || "").localeCompare(b.tipo || "");
            if (ordenar === "precio") return (a.precio_unidad || 0) - (b.precio_unidad || 0);
            return 0;
        });

        return resultado;
    }, [habitacionesData, filtroTipo, busqueda, ordenar]);

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

    const getColorEstadoTexto = (estado: string) => {
        switch (estado?.toLowerCase()) {
            case "disponible":
                return "text-emerald-700";
            case "ocupada":
                return "text-slate-700";
            case "limpieza":
                return "text-amber-700";
            case "mantenimiento":
                return "text-rose-700";
            default:
                return "text-slate-700";
        }
    };

    const getColorBorde = (estado: string) => {
        switch (estado?.toLowerCase()) {
            case "disponible":
                return "border-l-4 border-emerald-500";
            case "ocupada":
                return "border-l-4 border-slate-500";
            case "limpieza":
                return "border-l-4 border-amber-500";
            case "mantenimiento":
                return "border-l-4 border-rose-500";
            default:
                return "border-l-4 border-slate-300";
        }
    };

    const fechaEmitido = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const ingresoFiltrado = habitacionesFiltradas.reduce((sum, h) => sum + (h.precio_unidad || 0), 0);
    const precioPromedio = habitacionesFiltradas.length > 0
        ? Math.round(ingresoFiltrado / habitacionesFiltradas.length)
        : 0;

    const tipoLabel = (tipo: string) =>
        tipo === "Estandar" ? "Estándar" : tipo === "Doble-Estandar" ? "Doble Estándar" : tipo;

    if (error && !loading) {
        return (
            <ViewTransition enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}>
                <PageHeader
                    name="Listado del estado de las habitaciones"
                    subtitle="Visualización y gestión del inventario de espacios disponibles"
                />
                <div className="bg-red-50 border border-red-300 rounded-xl p-6 flex items-start gap-4 mt-4">
                    <span className="material-symbols-outlined text-[32px] text-red-600">error</span>
                    <div className="flex-1">
                        <h3 className="font-bold text-red-800 mb-2">Error al cargar estado de habitaciones</h3>
                        <p className="text-red-700 mb-4">{error.message}</p>
                    </div>
                </div>
            </ViewTransition>
        );
    }

    return (
        <ViewTransition enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}>
            {/* Encabezado tipo membrete */}
            <div className="rounded-[24px] border border-slate-300 bg-white p-6" style={{ breakInside: 'avoid' }}>
                <div className="flex flex-wrap items-center justify-between gap-6 pb-5 border-b border-slate-300">
                    <div className="flex items-center gap-3">
                        <Image
                            width={56}
                            height={56}
                            alt="Hotel San Pedro Logo"
                            className="h-14 w-14 object-contain drop-shadow-md"
                            src={logo}
                        />
                        <div>
                            <h1 className="text-[19px] leading-6 font-['Hanken_Grotesk'] font-bold text-[#000000]">
                                Hotel San Pedro
                            </h1>
                            <p className="text-[11px] leading-4 font-medium font-['Hanken_Grotesk'] text-[#515f74] uppercase tracking-wider">
                                Hospitalidad &amp; Comodidad
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        <h2 className="text-[16px] leading-5 font-['Hanken_Grotesk'] font-bold text-[#000000]">
                            Listado del estado de las habitaciones
                        </h2>
                        <p className="text-[11px] leading-4 font-medium text-[#515f74] mt-0.5">
                            Visualización del inventario de espacios disponibles
                        </p>
                    </div>
                </div>

                {/* Metadatos del reporte */}
                <div className="mt-5 rounded-xl border border-slate-300 bg-[#f7f9fb] px-5 py-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="text-center sm:text-left">
                            <p className="text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Tipo</p>
                            <p className="text-[13px] font-semibold text-[#000000] mt-0.5">
                                {filtroTipo === "Todos" ? "Todos" : tipoLabel(filtroTipo)}
                            </p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Búsqueda</p>
                            <p className="text-[13px] font-semibold text-[#000000] mt-0.5">{busqueda || "Sin filtro"}</p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Orden</p>
                            <p className="text-[13px] font-semibold text-[#000000] mt-0.5">
                                {ordenar === "numero" ? "Número de habitación" : ordenar === "tipo" ? "Tipo" : "Precio"}
                            </p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Emitido</p>
                            <p className="text-[13px] font-semibold text-[#000000] mt-0.5">{fechaEmitido}</p>
                        </div>
                    </div>
                </div>
            </div>

            

            {/* Tabla de habitaciones */}
            <section className="bg-[#ffffff] border border-slate-300 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-300 bg-[#f7f9fb] flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-['Hanken_Grotesk'] text-[16px] leading-6 font-semibold text-[#000000]">
                        Habitaciones {filtroTipo !== "Todos" && `(${tipoLabel(filtroTipo)})`}
                    </h3>
                    <span className="text-[12px] font-semibold text-[#515f74]">
                        {habitacionesFiltradas.length} encontradas
                    </span>
                </div>

                {loading ? (
                    <div className="px-6 py-12 text-center">
                        <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-4 animate-spin">refresh</span>
                        <p className="text-[16px] font-medium text-[#515f74]">Cargando datos...</p>
                    </div>
                ) : habitacionesFiltradas.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-4">search_off</span>
                        <p className="text-[16px] font-medium text-[#515f74]">No se encontraron habitaciones con los filtros aplicados</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-300 bg-[#f7f9fb]" style={{ breakInside: 'avoid' }}>
                                    <th className="px-3 py-2 text-left text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Habitación</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Tipo</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Estado</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Capacidad</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Precio/Noche</th>
                                </tr>
                            </thead>
                            <tbody>
                                {habitacionesFiltradas.map((habitacion) => (
                                    <tr
                                        key={habitacion.numero_espacio}
                                        className="border-b border-slate-300 bg-white"
                                        style={{ breakInside: 'avoid' }}
                                    >
                                        <td className={`px-3 py-2 text-[11px] font-bold text-[#000000] ${getColorBorde(habitacion.estado || "")}`}>
                                            {habitacion.numero_espacio}
                                        </td>
                                        <td className="px-3 py-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getColorTipo(habitacion.tipo || "")}`}>
                                                {tipoLabel(habitacion.tipo || "Sin tipo")}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2">
                                            <span className={`text-[11px] font-semibold ${getColorEstadoTexto(habitacion.estado || "")}`}>
                                                {habitacion.estado}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-[11px] font-medium text-[#515f74]">
                                            {habitacion.capacidad_huespedes}
                                        </td>
                                        <td className="px-3 py-2 text-[11px] font-bold text-[#008cc7]">
                                            {habitacion.precio_unidad} Lps
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
            {/* Resumen KPI */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ breakInside: 'avoid' }}>
                <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-5">
                    <p className="text-[12px] font-semibold text-[#515f74] uppercase tracking-wider mb-2">Resultados</p>
                    <h4 className="text-[22px] font-bold text-[#000000]">{habitacionesFiltradas.length}</h4>
                    <p className="text-[12px] text-[#515f74] mt-2">Habitaciones mostradas</p>
                </div>

                <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-5">
                    <p className="text-[12px] font-semibold text-[#515f74] uppercase tracking-wider mb-2">Ingreso Filtrado</p>
                    <h4 className="text-[22px] font-bold text-[#000000]">{(ingresoFiltrado / 1000).toFixed(1)}k Lps</h4>
                    <p className="text-[12px] text-[#515f74] mt-2">Total potencial</p>
                </div>

                <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-5">
                    <p className="text-[12px] font-semibold text-[#515f74] uppercase tracking-wider mb-2">Precio Promedio</p>
                    <h4 className="text-[22px] font-bold text-[#000000]">{precioPromedio} Lps</h4>
                    <p className="text-[12px] text-[#515f74] mt-2">Del filtrado</p>
                </div>
            </section>
        </ViewTransition>
    );
}