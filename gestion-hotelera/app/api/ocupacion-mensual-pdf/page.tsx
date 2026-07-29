'use client';
import PageHeader from "@/components/pageheader";
import { useOcupacionMensual } from "@/functions/reportes-api";
import { Suspense } from "react";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import Image from "next/image";
import logo from "@/public/logo.png";

export default function Page() {
    return (
        <Suspense fallback={<div className="p-6 text-sm text-slate-500">Cargando reporte…</div>}>
            <OcupacionMensualContent />
        </Suspense>
    );
}

function OcupacionMensualContent() {
    const searchParams = useSearchParams();

    // Mes actual en formato YYYY-MM como fallback
    const hoy = new Date();
    const mesActualStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}`;

    // El mes se controla desde la URL, ej: ?fecha=2026-06
    const fechaFiltro = searchParams.get("fecha") || mesActualStr;
    const fechaCompleta = `${fechaFiltro}-01`;

    const { data: ocupacionApi, loading, error } = useOcupacionMensual(fechaCompleta);

    const ocupacionData = useMemo(() => ocupacionApi || [], [ocupacionApi]);

    const formatearMes = (value: string) => {
        if (!value) return "Mes seleccionado";
        const [year, month] = value.split("-");
        const fecha = new Date(Number(year), Number(month) - 1, 1);
        const nombreMes = fecha.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
        return nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
    };

    const fechaEmitido = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const stats = useMemo(() => {
        if (ocupacionData.length === 0) return null;

        const totalHabitaciones = 25;
        const diasDelMes = new Date(new Date(fechaCompleta).getFullYear(), new Date(fechaCompleta).getMonth() + 1, 0).getDate();
        const diasDelMesReales = new Date(new Date(fechaCompleta).getFullYear(), new Date(fechaCompleta).getMonth() + 2, 0).getDate();
        const capacidadTotalDias = totalHabitaciones * diasDelMes;
        const totalReservas = ocupacionData.reduce((sum, d) => sum + d.cantidad_unidades, 0);

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
    }, [ocupacionData, fechaCompleta]);

    const dataTorta = useMemo(() => {
        if (!stats) return [];
        return [
            { name: 'Ocupada', value: stats.ocupacionGeneral, fill: '#008cc7' },
            { name: 'Disponible', value: stats.disponibilidad, fill: '#c7c7c7' },
        ];
    }, [stats]);

    const dataBarras = useMemo(() => {
        return ocupacionData.map(d => ({
            nombre: d.numero_espacio,
            reservas: d.cantidad_unidades,
            aporte: d.porcentaje,
        }));
    }, [ocupacionData]);

    if (error && !loading) {
        return (
            <>
                <PageHeader
                    name="Estadística de ocupación mensual"
                    subtitle="Análisis sintetizado de ocupación por mes"
                />
                <div className="bg-red-50 border border-red-300 rounded-xl p-6 flex items-start gap-4">
                    <span className="material-symbols-outlined text-[32px] text-red-600">error</span>
                    <div className="flex-1">
                        <h3 className="font-bold text-red-800 mb-2">Error cargando datos</h3>
                        <p className="text-red-700 mb-4">{error.message}</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
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
                            Estadística de ocupación mensual
                        </h2>
                        <p className="text-[11px] leading-4 font-medium text-[#515f74] mt-0.5">
                            Análisis sintetizado de ocupación por mes
                        </p>
                    </div>
                </div>

                {/* Metadatos del reporte */}
                <div className="mt-5 rounded-xl border border-slate-300 bg-[#f7f9fb] px-5 py-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="text-center sm:text-left">
                            <p className="text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Periodo</p>
                            <p className="text-[14px] font-semibold text-[#000000] mt-0.5">{formatearMes(fechaFiltro)}</p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Habitaciones</p>
                            <p className="text-[14px] font-semibold text-[#000000] mt-0.5">{stats?.totalHabitaciones ?? 25}</p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Días del mes</p>
                            <p className="text-[13px] font-semibold text-[#000000] mt-0.5">
                                {loading ? "--" : stats?.diasDelMesReales ?? "--"}
                            </p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Emitido</p>
                            <p className="text-[13px] font-semibold text-[#000000] mt-0.5">{fechaEmitido}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Métricas KPI */}
            <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4" style={{ breakInside: 'avoid' }}>
                <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl px-6 py-4 shadow-level-1 hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex justify-between items-start gap-2 flex-col-reverse">
                        <span className="text-[12px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Ocupación General</span>
                        <div className="p-2 bg-[#c9e6ff] rounded-lg flex items-center">
                            <span className="material-symbols-outlined text-[12px] text-[#008cc7]">percent</span>
                        </div>
                    </div>
                    <h2 className="font-['Hanken_Grotesk'] text-[14px] leading-10 tracking-[-0.02em] font-semibold text-[#000000]">
                        {loading ? <span className="animate-pulse">--</span> : `${stats?.ocupacionGeneral || 0}%`}
                    </h2>
                </div>

                <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl px-6 py-4 shadow-level-1 hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex justify-between items-start gap-2 flex-col-reverse">
                        <span className="text-[12px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Disponibilidad</span>
                        <div className="p-2 bg-[#d5e3fd] rounded-lg flex items-center">
                            <span className="material-symbols-outlined text-[12px] text-[#008cc7]">check_circle</span>
                        </div>
                    </div>
                    <h2 className="font-['Hanken_Grotesk'] text-[14px] leading-10 tracking-[-0.02em] font-semibold text-[#000000]">
                        {loading ? <span className="animate-pulse">--</span> : `${stats?.disponibilidad || 0}%`}
                    </h2>
                </div>

                <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl px-6 py-4 shadow-level-1 hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex justify-between items-start gap-2 flex-col-reverse">
                        <span className="text-[12px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Total Reservas</span>
                        <div className="p-2 bg-[#ffdad6] rounded-lg flex items-center">
                            <span className="material-symbols-outlined text-[12px] text-[#93000a]">event_busy</span>
                        </div>
                    </div>
                    <h2 className="font-['Hanken_Grotesk'] text-[14px] leading-10 tracking-[-0.02em] font-semibold text-[#000000]">
                        {loading ? <span className="animate-pulse">--</span> : stats?.totalReservas}
                    </h2>
                </div>

                <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl px-6 py-4 shadow-level-1 hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex justify-between items-start gap-2 flex-col-reverse">
                        <span className="text-[12px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Días del Mes</span>
                        <div className="p-2 bg-[#e8d5ff] rounded-lg flex items-center">
                            <span className="material-symbols-outlined text-[12px] text-[#6a2d91]">calendar_today</span>
                        </div>
                    </div>
                    <h2 className="font-['Hanken_Grotesk'] text-[14px] leading-10 tracking-[-0.02em] font-semibold text-[#000000]">
                        {loading ? <span className="animate-pulse">--</span> : stats?.diasDelMesReales}
                    </h2>
                </div>
            </section>

            {/* Gráficos */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1 flex flex-col items-center" style={{ breakInside: 'avoid' }}>
                    <h3 className="font-['Hanken_Grotesk'] text-[12px] leading-7 font-semibold text-[#000000] mb-6 self-start">Ocupación General</h3>
                    {loading ? (
                        <div className="h-65 w-full flex items-center justify-center bg-slate-50 rounded-lg">
                            <div className="text-center">
                                <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-2 animate-spin">refresh</span>
                                <p className="text-slate-500 text-sm">Cargando gráfico...</p>
                            </div>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie
                                    data={dataTorta}
                                    cx="50%"
                                    cy="45%"
                                    labelLine={false}
                                    label={false}
                                    outerRadius={80}
                                    dataKey="value"
                                    isAnimationActive={false}
                                >
                                    {dataTorta.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Legend
                                    verticalAlign="bottom"
                                    align="center"
                                    formatter={(value: string, entry?: { payload?: { value?: number } }) => `${value}: ${entry?.payload?.value?.toFixed(2)}%`}
                                    wrapperStyle={{ fontSize: 12, color: '#515f74' }}
                                />
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1" style={{ breakInside: 'avoid' }}>
                    <h3 className="font-['Hanken_Grotesk'] text-[12px] leading-7 font-semibold text-[#000000] mb-6">Top 5 Habitaciones Más Ocupadas</h3>
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
                                        <p className="text-[12px] font-semibold text-[#000000]">{hab.numero_espacio}</p>
                                        <p className="text-[12px] text-[#515f74]">{hab.cantidad_unidades} reservas</p>
                                    </div>
                                    <span className="text-[12px] font-bold text-[#008cc7]">{hab.porcentaje}%</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-center py-8">Sin datos</p>
                    )}
                </div>
            </section>

            {/* Gráfico de Barras - Aporte por habitación */}
            <section className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl p-6 shadow-level-1" style={{ breakInside: 'avoid' }}>
                <h3 className="font-['Hanken_Grotesk'] text-[12px] leading-7 font-semibold text-[#000000] mb-6">Aporte de Cada Habitación a la Ocupación Total</h3>
                {loading ? (
                    <div className="h-100 flex items-center justify-center bg-slate-50 rounded-lg">
                        <div className="text-center">
                            <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-2 animate-spin">refresh</span>
                            <p className="text-slate-500 text-sm">Cargando gráfico...</p>
                        </div>
                    </div>
                ) : (
                    // Sin overflow-x-auto ni minWidth fijo: en un PDF impreso no existe scroll,
                    // así que el gráfico debe ajustarse al 100% del ancho de la página para
                    // que las 25 habitaciones sean visibles sin cortarse.
                    <div className="w-full flex justify-center">
                        <ResponsiveContainer width="100%" height={420}>
                            <BarChart
                                data={dataBarras}
                                margin={{ top: 20, right: 20, left: 0, bottom: 90 }}
                                barCategoryGap="15%"
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e3e5" />
                                <XAxis
                                    dataKey="nombre"
                                    angle={-90}
                                    textAnchor="end"
                                    interval={0}
                                    height={100}
                                    tick={{ fontSize: 12, fill: '#515f74' }}
                                />
                                <YAxis
                                    label={{ value: 'Porcentaje (%)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                                    tick={{ fontSize: 10, fill: '#515f74' }}
                                    width={45}
                                />
                                <Tooltip
                                    labelFormatter={(label) => `Habitación: ${label}`}
                                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #ccc', borderRadius: '8px' }}
                                />
                                <Bar
                                    dataKey="aporte"
                                    fill="#008cc7"
                                    radius={[4, 4, 0, 0]}
                                    name="Aporte (%)"
                                    isAnimationActive={false}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </section>

            {/* Tabla de datos */}
            <section className="bg-[#ffffff] border border-slate-300 card-shadow rounded-xl shadow-level-1 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-300 bg-[#f7f9fb]" style={{ breakInside: 'avoid' }}>
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <h3 className="font-['Hanken_Grotesk'] text-[12px] leading-7 font-semibold text-[#000000]">
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
                                <tr className="border-b border-slate-300 bg-[#f7f9fb]" style={{ breakInside: 'avoid' }}>
                                    <th className="px-2 py-2 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Habitación</th>
                                    <th className="px-2 py-2 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Descripcion de la habitacion</th>
                                    <th className="px-2 py-2 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Veces reservada</th>
                                    <th className="px-2 py-2 text-left text-[12px] font-bold text-[#515f74] uppercase tracking-wider">Participación del mes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ocupacionData.map((item) => {
                                    const porcentajeParticipacion = stats?.totalReservas
                                        ? (item.cantidad_unidades / stats.totalReservas) * 100
                                        : 0;

                                    return (
                                        <tr
                                            key={item.espacio_id}
                                            className="border-b border-slate-300 hover:bg-[#f2f4f6] transition-colors"
                                            style={{ breakInside: 'avoid' }}
                                        >
                                            <td className="px-2 py-2">
                                                <div className="flex gap-1">
                                                    <span className="text-[12px] font-bold text-[#008cc7]">{item.numero_espacio}</span>
                                                    <span className="text-[12px] text-[#515f74]">ID {item.espacio_id}</span>
                                                </div>
                                            </td>
                                            <td className="px-2 py-2">
                                                <p className="text-[12px] text-[#515f74]">{item.descripcion || "Sin descripción"}</p>
                                            </td>
                                            <td className="px-2 py-2 text-[12px] font-semibold text-[#000000]">{item.cantidad_unidades} reservas</td>
                                            <td className="px-2 py-2 text-[12px] font-bold text-[#000000]">{porcentajeParticipacion.toFixed(1)}%</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Información de cálculo */}
            <section className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6" style={{ breakInside: 'avoid' }}>
                <div className="flex gap-3">
                    <span className="material-symbols-outlined text-blue-600 shrink-0">info</span>
                    <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Cómo se interpreta esta tabla:</p>
                        <p>La cantidad de reservas representa cuántas veces se ocupó una habitación durante el mes.</p>
                        <p>El total del mes es la suma de todas esas reservas en todas las habitaciones.</p>
                    </div>
                </div>
            </section>
        </>
    );
}