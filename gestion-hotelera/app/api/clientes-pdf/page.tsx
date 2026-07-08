'use client';
import PageHeader from "@/components/pageheader";
import { Suspense, ViewTransition } from "react";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useClientesFrecuentes } from "@/functions/reportes-api";
import Image from "next/image";
import logo from "@/public/logo.png";

export default function Page() {
    return (
        <Suspense fallback={<div className="p-6 text-sm text-slate-500">Cargando reporte…</div>}>
            <ClientesFrecuentesPdfContent />
        </Suspense>
    );
}

function ClientesFrecuentesPdfContent() {
    const searchParams = useSearchParams();

    const { data: clientesApi, loading, error } = useClientesFrecuentes();

    const busqueda = searchParams.get("busqueda") ? decodeURIComponent(searchParams.get("busqueda")!) : "";
    const ordenarParam = searchParams.get("ordenar");
    const ordenar: "nombre" | "frecuencia" | "id" = ordenarParam === "nombre" || ordenarParam === "id"
        ? ordenarParam
        : "frecuencia";
    const filtroFrecuenciaMin = Number(searchParams.get("frecuenciaMin") || 0);

    const clientesData = useMemo(() => clientesApi || [], [clientesApi]);

    const clientesFiltrados = useMemo(() => {
        let resultado = clientesData;

        if (busqueda) {
            const busquedaLower = busqueda.toLowerCase();
            resultado = resultado.filter(c =>
                c.nombres?.toLowerCase().includes(busquedaLower) ||
                c.apellidos?.toLowerCase().includes(busquedaLower) ||
                c.telefono?.includes(busqueda)
            );
        }

        resultado = resultado.filter(c => (c.frecuencia || 0) >= filtroFrecuenciaMin);

        resultado = [...resultado].sort((a, b) => {
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

    const getNivelFrecuencia = (frecuencia: number) => {
        if (frecuencia >= 7) return { label: "VIP", color: "bg-purple-100 text-purple-800" };
        if (frecuencia >= 6) return { label: "Premium", color: "bg-blue-100 text-blue-800" };
        return { label: "Regular", color: "bg-slate-100 text-slate-800" };
    };

    const fechaEmitido = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const visitasTotales = clientesFiltrados.reduce((sum, c) => sum + (c.frecuencia || 0), 0);
    const promedioVisitas = clientesFiltrados.length > 0
        ? (visitasTotales / clientesFiltrados.length).toFixed(1)
        : "0";

    if (error && !loading) {
        return (
            <ViewTransition enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}>
                <PageHeader
                    name="Clientes Frecuentes"
                    subtitle="Análisis de huéspedes recurrentes y patrones de visita"
                />
                <div className="bg-red-50 border border-red-300 rounded-xl p-6 flex items-start gap-4 mt-4">
                    <span className="material-symbols-outlined text-[32px] text-red-600">error</span>
                    <div className="flex-1">
                        <h3 className="font-bold text-red-800 mb-2">Error al cargar clientes frecuentes</h3>
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
                            Listado de Clientes Frecuentes
                        </h2>
                        <p className="text-[11px] leading-4 font-medium text-[#515f74] mt-0.5">
                            Análisis de huéspedes recurrentes y patrones de visita
                        </p>
                    </div>
                </div>

                {/* Metadatos del reporte */}
                <div className="mt-5 rounded-xl border border-slate-300 bg-[#f7f9fb] px-5 py-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="text-center sm:text-left">
                            <p className="text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Búsqueda</p>
                            <p className="text-[13px] font-semibold text-[#000000] mt-0.5">{busqueda || "Sin filtro"}</p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Frecuencia mínima</p>
                            <p className="text-[13px] font-semibold text-[#000000] mt-0.5">
                                {filtroFrecuenciaMin > 0 ? `${filtroFrecuenciaMin}+ visitas` : "Todos"}
                            </p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Orden</p>
                            <p className="text-[13px] font-semibold text-[#000000] mt-0.5">
                                {ordenar === "frecuencia" ? "Cantidad de visitas" : ordenar === "nombre" ? "Nombre (A-Z)" : "ID Cliente"}
                            </p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Emitido</p>
                            <p className="text-[13px] font-semibold text-[#000000] mt-0.5">{fechaEmitido}</p>
                        </div>
                    </div>
                </div>
            </div>

            

            {/* Tabla de clientes */}
            <section className="bg-[#ffffff] border border-slate-300 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-300 bg-[#f7f9fb] flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-['Hanken_Grotesk'] text-[16px] leading-6 font-semibold text-[#000000]">
                        Listado de Clientes
                    </h3>
                    <span className="text-[12px] font-semibold text-[#515f74]">
                        {clientesFiltrados.length} encontrados
                    </span>
                </div>

                {loading ? (
                    <div className="px-6 py-12 text-center">
                        <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-4 animate-spin">refresh</span>
                        <p className="text-[16px] font-medium text-[#515f74]">Cargando datos...</p>
                    </div>
                ) : clientesFiltrados.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-4">search_off</span>
                        <p className="text-[16px] font-medium text-[#515f74]">No se encontraron clientes con los filtros aplicados</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-300 bg-[#f7f9fb]" style={{ breakInside: 'avoid' }}>
                                    <th className="px-3 py-2 text-left text-[10px] font-bold text-[#515f74] uppercase tracking-wider">ID</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Nombre Completo</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Teléfono</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Visitas</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Noches</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Nivel</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientesFiltrados.map((cliente) => {
                                    const nivel = getNivelFrecuencia(cliente.frecuencia || 0);
                                    return (
                                        <tr
                                            key={cliente.huesped_id}
                                            className="border-b border-slate-300 bg-white"
                                            style={{ breakInside: 'avoid' }}
                                        >
                                            <td className="px-3 py-2 text-[11px] font-bold text-[#008cc7]">#{cliente.huesped_id}</td>
                                            <td className="px-3 py-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-semibold text-[#000000]">{cliente.nombres}</span>
                                                    <span className="text-[10px] text-[#515f74]">{cliente.apellidos}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 text-[11px] font-medium text-[#515f74]">{cliente.telefono}</td>
                                            <td className="px-3 py-2 text-[11px] font-bold text-[#000000]">{cliente.frecuencia}</td>
                                            <td className="px-3 py-2 text-[11px] font-bold text-[#000000]">{cliente.total_noches || 0}</td>
                                            <td className="px-3 py-2">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${nivel.color} inline-flex items-center gap-1`}>
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
                {/* Resumen KPI */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ breakInside: 'avoid' }}>
                <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-5">
                    <p className="text-[12px] font-semibold text-[#515f74] uppercase tracking-wider mb-2">Resultados</p>
                    <h4 className="text-[22px] font-bold text-[#000000]">{clientesFiltrados.length}</h4>
                    <p className="text-[12px] text-[#515f74] mt-2">Clientes mostrados</p>
                </div>

                <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-5">
                    <p className="text-[12px] font-semibold text-[#515f74] uppercase tracking-wider mb-2">Visitas Totales</p>
                    <h4 className="text-[22px] font-bold text-[#000000]">{visitasTotales}</h4>
                    <p className="text-[12px] text-[#515f74] mt-2">Del filtrado</p>
                </div>

                <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-5">
                    <p className="text-[12px] font-semibold text-[#515f74] uppercase tracking-wider mb-2">Visitas Promedio</p>
                    <h4 className="text-[22px] font-bold text-[#000000]">{promedioVisitas}</h4>
                    <p className="text-[12px] text-[#515f74] mt-2">Por cliente</p>
                </div>
            </section>
            </section>
        </ViewTransition>
    );
}
