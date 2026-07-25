"use client";

import React, { useEffect, useRef, useState, ViewTransition, useCallback } from "react";
import { useReservas } from "@/functions/reservas";
import PageHeader from "@/components/pageheader";
import NewReservation from "@/components/NewReservation";
import Link from "next/link";
import { RESERVATIONS_LIST } from "@/data/reservations";

const ROOM_COL_PX = 200;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Configuración de estados basada EXACTAMENTE en los valores de tu BD (r.reserva_estado)
const STATUS_CONFIG = {
    Pendiente: {
        label: "Pendiente",
        badgeBg: "bg-amber-100",
        badgeText: "text-amber-800",
        border: "border-amber-300",
        dotBg: "bg-amber-500"
    },
    Reservada: {
        label: "Reservada",
        badgeBg: "bg-blue-100",
        badgeText: "text-blue-800",
        border: "border-blue-300",
        dotBg: "bg-blue-500"
    },
    Hospedado: {
        label: "Hospedado",
        badgeBg: "bg-emerald-100",
        badgeText: "text-emerald-800",
        border: "border-emerald-300",
        dotBg: "bg-emerald-500"
    },
    Finalizada: {
        label: "Finalizada",
        badgeBg: "bg-slate-100",
        badgeText: "text-slate-800",
        border: "border-slate-300 card-shadow",
        dotBg: "bg-slate-400"
    }
};

const handleEnlace = (telefono: string, nombre_huesped: string, total_pagar: number): string => {
    const total_depositar = total_pagar * 0.5;
    const ahora = new Date();
    const horaActual = ahora.getHours();
    let saludo = '';

    if (horaActual >= 0 && horaActual < 12) {
        saludo = 'buenos días';
    } else if (horaActual >= 12 && horaActual < 18) {
        saludo = 'buenas tardes';
    } else {
        saludo = 'buenas noches';
    }

    const mensaje = `Hola ${nombre_huesped} ${saludo}. Mucho gusto, soy el recepcionista del Hotel San Pedro, se nos ha solicitado una reservación con su número, si usted es la persona recordarle que según los términos y condiciones del hotel, para realizar la reservación usted deberá realizar un depósito del 50% de su saldo total (${total_depositar} Lempiras) para poder confirmar la reservación, de lo contrario no se realizará. 
    
    Puede realizar el depósito a las siguientes cuentas:
    
    Banco: Banco Atlántida
    Numero de Cuenta: 123456789

    En caso de no haber solicitado la reservación puede continuar con sus actividades diarias y una disculpa. ${saludo}`;


    return `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
}

function getDatesInRange(start: Date, end: Date) {
    const dates: Date[] = [];
    let cur = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    while (cur <= end) {
        dates.push(new Date(cur));
        cur = new Date(cur.getTime() + MS_PER_DAY);
    }
    return dates;
}

function diffDays(a: Date, b: Date) {
    return Math.round((a.getTime() - b.getTime()) / MS_PER_DAY);
}

type Room = { id: string; name: string; type?: string; statusColor?: string };
type Reservation = { id: string; roomId: string; numberReservation: string; start: string; end: string; guest: string; color?: string; icon?: string, status?: string };

// 🔥 Interfaz espejo de lo que retorna tu "EXEC sp_listar_reservaciones" en FastAPI
interface ApiReservation {
    reserva_id: number;
    huesped_nombre: string;
    numero_reserva: string;
    total_pagar: number;
    telefono_huesped?: string;
    numero_espacio?: string | number;
    fecha_entrada?: string;
    fecha_salida?: string;
    cantidad_unidades?: number;
    reserva_estado?: string;
}

export default function Page() {
    // Del Cronograma no se toca nada de lógica ni UI interna
    const startDate = new Date("2026-10-12");
    const endDate = new Date("2026-10-25");
    const dates = getDatesInRange(startDate, endDate);

    // Sincronizamos el estado inicial de la fecha con el value del input para evitar desfases
    const [fechaStr, setFechaStr] = useState(new Date().toISOString().split('T')[0]);

    // Pasamos un objeto Date válido a tu hook usando la fecha del estado
    const { data, loading, error } = useReservas(new Date(`${fechaStr}T00:00:00`));
    const reservacionesData = (data || []) as ApiReservation[];

    const rooms: Room[] = [
        { id: "101", name: "101", type: "King Suite", statusColor: "bg-emerald-500" },
        { id: "102", name: "102", type: "Queen Suite", statusColor: "bg-red-500" },
        { id: "103", name: "103", type: "Imperial Suite", statusColor: "bg-yellow-500" },
    ];

    const reservations: Reservation[] = RESERVATIONS_LIST;
    const [view, setView] = useState<"timeline" | "list">("timeline");

    const containerRef = useRef<HTMLDivElement | null>(null);
    const [dayWidth, setDayWidth] = useState<number>(100);

    useEffect(() => {
        function updateWidths() {
            const el = containerRef.current;
            if (!el) return;
            const total = el.clientWidth;
            const avail = Math.max(0, total - ROOM_COL_PX);
            const w = avail / Math.max(1, dates.length);
            setDayWidth(w);
        }

        updateWidths();
        window.addEventListener("resize", updateWidths);
        return () => window.removeEventListener("resize", updateWidths);
    }, [dates.length]);

    return (
        <ViewTransition enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}>
            <PageHeader
                name="Reservaciones"
                subtitle="Gestión de reservas y disponibilidad"
                buttons={
                    <div className="flex items-center gap-2">
                        <div className="inline-flex rounded-md bg-slate-50 p-1">
                            <button onClick={() => setView("timeline")} className={`px-3 py-1 text-sm rounded ${view === "timeline" ? "bg-white shadow" : "hover:bg-slate-100"}`}>
                                Cronograma
                            </button>
                            <button onClick={() => setView("list")} className={`px-3 py-1 text-sm rounded ${view === "list" ? "bg-white shadow" : "hover:bg-slate-100"}`}>
                                Lista
                            </button>
                        </div>
                        <NewReservation />
                    </div>
                }
            />
            {view === "timeline" ? (
                <div className="bg-white rounded-xl border border-slate-300 card-shadow shadow-sm overflow-hidden flex flex-col flex-1 min-h-125">
                    <div className="flex items-center justify-between p-4 border-b border-slate-300 card-shadow bg-white gantt-header">
                        <div className="flex items-center gap-3">
                            <button className="p-1 rounded hover:bg-slate-100 transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
                            <h3 className="text-sm font-bold text-slate-800">Oct 12 - Oct 25, 2026</h3>
                            <button className="p-1 rounded hover:bg-slate-100 transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                <span className="text-xs text-slate-600 font-medium">Pendiente</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                <span className="text-xs text-slate-600 font-medium">Confirmada</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                <span className="text-xs text-slate-600 font-medium">En estancia</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                                <span className="text-xs text-slate-600 font-medium">Finalizada</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto scrollbar-hide relative">
                        <div className="min-w-250" ref={containerRef}>
                            <div className="gantt-grid border-b border-slate-300 card-shadow bg-slate-50 sticky top-0 z-10" style={{ display: "flex" }}>
                                <div className="p-3 text-xs font-semibold text-slate-500 border-r border-slate-300 card-shadow room-col flex items-center bg-white" style={{ width: ROOM_COL_PX }}>Habitación / Estado</div>
                                {dates.map((d) => {
                                    const weekday = d.toLocaleString(undefined, { weekday: "short" });
                                    const daynum = d.getDate();
                                    const isMid = d.getDay() === 3;
                                    const weekend = d.getDay() === 0 || d.getDay() === 6;
                                    return (
                                        <div key={d.toISOString()} className={`p-2 text-center border-r border-slate-300 card-shadow ${isMid ? "bg-blue-50/50" : weekend ? "bg-slate-100/50" : ""}`} style={{ minWidth: dayWidth }}>
                                            <div className={`text-xs ${isMid ? "text-blue-600 font-bold" : "text-slate-400"}`}>{weekday}</div>
                                            <div className={`${isMid ? "text-sm font-bold text-blue-600" : "text-sm font-medium"}`}>{daynum}</div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="bg-slate-100 px-4 py-2 text-xs font-semibold sticky left-0 z-20 text-slate-500">Planta 1 - Suites</div>

                            {rooms.map((room) => (
                                <div key={room.id} className="gantt-grid border-b border-slate-300 card-shadow hover:bg-slate-50/50 transition-colors group relative h-14">
                                    <div className="p-3 border-r border-slate-300 card-shadow flex items-center justify-between room-col bg-white group-hover:bg-slate-50 transition-colors" style={{ width: ROOM_COL_PX }}>
                                        <div>
                                            <div className="text-sm font-semibold text-slate-800">{room.name}</div>
                                            <div className="text-xs text-slate-400">{room.type}</div>
                                        </div>
                                        <span className={`w-2 h-2 rounded-full ${room.statusColor}`}></span>
                                    </div>

                                    {dates.map((d, idx) => (
                                        <div key={idx} className="border-r border-slate-100" style={{ width: dayWidth, display: "inline-block", height: "100%" }}></div>
                                    ))}

                                    {reservations
                                        .filter((r) => r.roomId === room.id)
                                        .map((r) => {
                                            const rStart = new Date(r.start);
                                            const rEnd = new Date(r.end);
                                            const offset = Math.max(0, diffDays(rStart, startDate));
                                            const length = diffDays(rEnd, rStart) + 1;
                                            const left = ROOM_COL_PX + offset * dayWidth;
                                            const width = Math.max(dayWidth * length, dayWidth);

                                            const bg =
                                                r.status === "Pending" ? "bg-amber-100" :
                                                    r.status === "Confirmed" ? "bg-blue-100" :
                                                        r.status === "InHouse" ? "bg-emerald-100" : "bg-slate-100";

                                            const border =
                                                r.status === "Pending" ? "border-amber-500" :
                                                    r.status === "Confirmed" ? "border-blue-500" :
                                                        r.status === "InHouse" ? "border-emerald-500" : "border-slate-300 card-shadow";

                                            return (
                                                <Link href={`/bd/reservaciones/${r.id}`} key={r.id} className={`reservation-bar ${bg} border-l-4 ${border} px-3 py-1 flex items-center justify-between overflow-hidden cursor-pointer`} style={{ position: "absolute", top: 8, bottom: 8, left, width }}>
                                                    <div className="truncate">
                                                        <div className="text-xs font-bold text-slate-900 truncate">{r.guest}</div>
                                                    </div>
                                                    {r.icon ? <span className="material-symbols-outlined text-[16px] text-slate-700">{r.icon}</span> : null}
                                                </Link>
                                            );
                                        })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-300 card-shadow shadow-sm overflow-hidden flex flex-col flex-1 min-h-50 p-4">
                    <input
                        className="bg-transparent py-2 border-none text-black p-0 w-full focus:ring-0 text-md outline-hidden accent-blue-500 mb-4"
                        type="date"
                        value={fechaStr}
                        onChange={(e) => setFechaStr(e.target.value)}
                    />

                    {loading ? (
                        <div className="py-8 text-center text-sm text-slate-500 font-medium">Cargando reservaciones desde el servidor...</div>
                    ) : error ? (
                        <div className="py-8 text-center text-sm text-red-500 font-medium">Error al conectar con la API de reservaciones.</div>
                    ) : reservacionesData.length === 0 ? (
                        <div className="py-8 text-center text-sm text-slate-500 font-medium">No se encontraron reservaciones para el día seleccionado.</div>
                    ) : (
                        <div className="overflow-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Huésped</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Hab.</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Entrada</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Salida</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Noches</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Estado</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {reservacionesData.map((r) => {
                                        const currentStatus = STATUS_CONFIG[r.reserva_estado as keyof typeof STATUS_CONFIG] || {
                                            label: r.reserva_estado || "—",
                                            badgeBg: "bg-slate-100",
                                            badgeText: "text-slate-800",
                                            border: "border-slate-300",
                                            dotBg: "bg-slate-400"
                                        };

                                        return (
                                            <tr key={r.reserva_id} className="hover:bg-slate-50 border-b border-slate-100 last:border-none">
                                                <td className="px-4 py-3 align-middle">
                                                    <div className="text-sm font-medium text-slate-900">{r.huesped_nombre}</div>
                                                    <div className="text-xs text-slate-400">Reserva {r.numero_reserva}</div>
                                                </td>
                                                <td className="px-4 py-3 align-middle text-slate-700">{r.numero_espacio || "—"}</td>
                                                <td className="px-4 py-3 align-middle text-slate-600">{r.fecha_entrada || "—"}</td>
                                                <td className="px-4 py-3 align-middle text-slate-600">{r.fecha_salida || "—"}</td>
                                                <td className="px-4 py-3 align-middle text-slate-600">{r.cantidad_unidades || "—"}</td>
                                                <td className="px-4 py-3 align-middle">
                                                    <span className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-medium border ${currentStatus.badgeBg} ${currentStatus.badgeText} ${currentStatus.border}`}>
                                                        <span className={`w-2 h-2 rounded-full ${currentStatus.dotBg}`}></span>
                                                        {currentStatus.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 align-middle">
                                                    <Link href={`/bd/reservaciones/${r.reserva_id}`} className="text-sm text-[#008cc7] hover:underline mr-3">Ver</Link>
                                                    <Link href={`/bd/reservaciones/${r.reserva_id}/edit`} className="text-sm text-slate-700 hover:underline">Pagos</Link>
                                                    <a
                                                        href={handleEnlace(r.telefono_huesped || "", r.huesped_nombre || "", r.total_pagar || 0)}
                                                        target="whatsapp-chat"
                                                        className="flex items-center justify-center p-2 text-slate-700 hover:text-green-600 transition-colors"
                                                        title="Enviar mensaje por WhatsApp"
                                                    >
                                                        {/* Icono de mensaje SVG */}
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                                        </svg>
                                                    </a>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </ViewTransition>
    );
}