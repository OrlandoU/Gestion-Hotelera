'use client';

import PageHeader from "@/components/pageheader";
import { Suspense, ViewTransition } from "react";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useActividadesMantenimiento } from "@/functions/reportes-api";
import Image from "next/image";
import logo from "@/public/logo.png";

export default function Page() {
    return (
        <Suspense fallback={<div className="p-6 text-sm text-slate-500">Cargando reporte…</div>}>
            <ActividadesMantenimientoPdfContent />
        </Suspense>
    );
}

function ActividadesMantenimientoPdfContent() {
    const searchParams = useSearchParams();

    const { data: actividadesApi, loading, error } = useActividadesMantenimiento();

    const fechaFiltro = searchParams.get("fecha") || "";
    const filtroTipo = searchParams.get("tipo") || "Todos";
    const busqueda = searchParams.get("busqueda") ? decodeURIComponent(searchParams.get("busqueda")!) : "";
    const ordenarParam = searchParams.get("ordenar");
    const ordenar: "reciente" | "espacio" | "responsable" = ordenarParam === "espacio" || ordenarParam === "responsable"
        ? ordenarParam
        : "reciente";

    const actividadesData = useMemo(() => actividadesApi || [], [actividadesApi]);

    const actividadesFiltradas = useMemo(() => {
        let resultado = [...actividadesData];

        if (fechaFiltro) {
            resultado = resultado.filter(a => {
                if (!a.fecha_inicio) return false;
                const fechaActividadStr = a.fecha_inicio.split('T')[0];
                return fechaActividadStr === fechaFiltro;
            });
        }

        if (filtroTipo !== "Todos") {
            resultado = resultado.filter(a => a.tipo?.toLowerCase() === filtroTipo.toLowerCase());
        }

        if (busqueda) {
            const b = busqueda.toLowerCase();
            resultado = resultado.filter(a =>
                a.numero_espacio?.toLowerCase().includes(b) ||
                a.nombre_responsable?.toLowerCase().includes(b) ||
                a.descripcion?.toLowerCase().includes(b)
            );
        }

        resultado.sort((a, b) => {
            if (ordenar === "reciente") {
                return new Date(b.fecha_inicio || 0).getTime() - new Date(a.fecha_inicio || 0).getTime();
            }
            if (ordenar === "espacio") {
                return (a.numero_espacio || "").localeCompare(b.numero_espacio || "");
            }
            if (ordenar === "responsable") {
                return (a.nombre_responsable || "").localeCompare(b.nombre_responsable || "");
            }
            return 0;
        });

        return resultado;
    }, [actividadesData, fechaFiltro, filtroTipo, busqueda, ordenar]);

    const getEstiloTipo = (tipo: string) => {
        switch (tipo?.toLowerCase()) {
            case "aseo":
            case "limpieza":
                return "bg-teal-100 text-teal-800";
            case "mantenimiento":
            case "reparacion":
                return "bg-indigo-100 text-indigo-800";
            default:
                return "bg-slate-100 text-slate-800";
        }
    };

    const formatFecha = (isoString?: string) => {
        if (!isoString) return "--";
        const date = new Date(isoString);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const fechaEmitido = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const espaciosUnicos = new Set(actividadesFiltradas.map(a => a.numero_espacio).filter(Boolean)).size;
    const staffActivo = new Set(actividadesFiltradas.map(a => a.nombre_responsable).filter(Boolean)).size;

    if (error && !loading) {
        return (
            <ViewTransition enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}>
                <PageHeader
                    name="Reporte de actividades de mantenimiento/limpieza diarias"
                    subtitle="Auditoría interna de saneamiento, uso de insumos y gestión de espacios"
                />
                <div className="bg-red-50 border border-red-300 rounded-xl p-6 flex items-start gap-4 mt-4">
                    <span className="material-symbols-outlined text-[32px] text-red-600">error</span>
                    <div className="flex-1">
                        <h3 className="font-bold text-red-800 mb-2">Error al solicitar bitácora de actividades</h3>
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
                            Reporte de actividades de mantenimiento/limpieza diarias
                        </h2>
                        <p className="text-[11px] leading-4 font-medium text-[#515f74] mt-0.5">
                            Auditoría interna de saneamiento, uso de insumos y gestión de espacios
                        </p>
                    </div>
                </div>

                {/* Metadatos del reporte */}
                <div className="mt-5 rounded-xl border border-slate-300 bg-[#f7f9fb] px-5 py-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        <div className="text-center sm:text-left">
                            <p className="text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Fecha</p>
                            <p className="text-[13px] font-semibold text-[#000000] mt-0.5">{fechaFiltro || "Todas"}</p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Tipo</p>
                            <p className="text-[13px] font-semibold text-[#000000] mt-0.5">{filtroTipo}</p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Búsqueda</p>
                            <p className="text-[13px] font-semibold text-[#000000] mt-0.5">{busqueda || "Sin filtro"}</p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Orden</p>
                            <p className="text-[13px] font-semibold text-[#000000] mt-0.5">
                                {ordenar === "reciente" ? "Más reciente" : ordenar === "espacio" ? "Número de espacio" : "Responsable"}
                            </p>
                        </div>
                        <div className="col-span-2 sm:col-span-1 text-center sm:text-left">
                            <p className="text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Emitido</p>
                            <p className="text-[13px] font-semibold text-[#000000] mt-0.5">{fechaEmitido}</p>
                        </div>
                    </div>
                </div>
            </div>


            {/* Tabla de actividades */}
            <section className="bg-[#ffffff] border border-slate-300 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-300 bg-[#f7f9fb] flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-['Hanken_Grotesk'] text-[16px] leading-6 font-semibold text-[#000000]">
                        Bitácora de Saneamiento y Logística
                    </h3>
                    <span className="text-[12px] font-semibold text-[#515f74]">
                        {actividadesFiltradas.length} encontradas
                    </span>
                </div>

                {loading ? (
                    <div className="px-6 py-12 text-center">
                        <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-4 animate-spin">refresh</span>
                        <p className="text-[16px] font-medium text-[#515f74]">Cargando datos...</p>
                    </div>
                ) : actividadesFiltradas.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-4">search_off</span>
                        <p className="text-[16px] font-medium text-[#515f74]">Ninguna orden coincide con los filtros aplicados</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-300 bg-[#f7f9fb]" style={{ breakInside: 'avoid' }}>
                                    <th className="px-2 py-2 text-left text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Espacio</th>
                                    <th className="px-2 py-2 text-left text-[10px] font-bold text-[#515f74] uppercase tracking-wider">ID Log</th>
                                    <th className="px-2 py-2 text-left text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Responsable</th>
                                    <th className="px-2 py-2 text-left text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Tipo</th>
                                    <th className="px-2 py-2 text-left text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Descripción / Insumos</th>
                                    <th className="px-2 py-2 text-left text-[10px] font-bold text-[#515f74] uppercase tracking-wider">Fecha / Hora</th>
                                </tr>
                            </thead>
                            <tbody>
                                {actividadesFiltradas.map((actividad, index) => (
                                    <tr
                                        key={`${actividad.mantenimiento_id}-${index}`}
                                        className="border-b border-slate-300 bg-white"
                                        style={{ breakInside: 'avoid' }}
                                    >
                                        <td className="px-2 py-2 text-[10px] font-bold text-[#000000]">
                                            {actividad.numero_espacio}
                                        </td>
                                        <td className="px-2 py-2 text-[10px] text-slate-500 font-mono">
                                            #{actividad.mantenimiento_id}
                                        </td>
                                        <td className="px-2 py-2 text-[10px] font-semibold text-slate-900">
                                            <div className="flex flex-col">
                                                <span>{actividad.nombre_responsable}</span>
                                                <span className="text-[9px] font-medium text-slate-400">UID: {actividad.usuario_id}</span>
                                            </div>
                                        </td>
                                        <td className="px-2 py-2">
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${getEstiloTipo(actividad.tipo || "")} inline-flex items-center gap-1`}>
                                                {actividad.tipo}
                                            </span>
                                        </td>
                                        <td className="px-2 py-2 text-[10px] text-slate-700 max-w-xs" title={actividad.descripcion}>
                                            {actividad.descripcion}
                                        </td>
                                        <td className="px-2 py-2 text-[10px] font-medium text-slate-600 text-nowrap">
                                            {formatFecha(actividad.fecha_inicio)}
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
                    <p className="text-[12px] font-semibold text-[#515f74] uppercase tracking-wider mb-2">Órdenes Ejecutadas</p>
                    <h4 className="text-[22px] font-bold text-[#000000]">{actividadesFiltradas.length}</h4>
                    <p className="text-[12px] text-[#515f74] mt-2">Tareas registradas</p>
                </div>

                <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-5">
                    <p className="text-[12px] font-semibold text-[#515f74] uppercase tracking-wider mb-2">Espacios Involucrados</p>
                    <h4 className="text-[22px] font-bold text-[#000000]">{espaciosUnicos}</h4>
                    <p className="text-[12px] text-[#515f74] mt-2">Unidades únicas</p>
                </div>

                <div className="bg-[#ffffff] border border-slate-300 rounded-xl p-5">
                    <p className="text-[12px] font-semibold text-[#515f74] uppercase tracking-wider mb-2">Personal Operativo</p>
                    <h4 className="text-[22px] font-bold text-[#000000]">{staffActivo}</h4>
                    <p className="text-[12px] text-[#515f74] mt-2">Encargados distintos</p>
                </div>
            </section>
        </ViewTransition>
    );
}