"use client";

import React, { useEffect, useRef, useState } from "react";
import PageHeader from "@/components/pageheader";
import Link from "next/link";
import { RESERVATIONS_LIST } from "@/data/reservations";

const ROOM_COL_PX = 200; // matches CSS calc(200px...)
const MS_PER_DAY = 24 * 60 * 60 * 1000;

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
type Reservation = { id: string; roomId: string; start: string; end: string; guest: string; color?: string; icon?: string };

function getStatusLabel(color?: string) {
    if (!color) return "—";
    if (color === "amber-100") return "Stay-in";
    if (color === "emerald-100") return "Checked-out";
    if (color === "blue-100") return "Confirmed";
    return "—";
}

function getBadgeClass(color?: string) {
    if (color === "amber-100") return "bg-amber-100 text-amber-800 border-amber-300";
    if (color === "emerald-100") return "bg-emerald-100 text-emerald-800 border-emerald-300";
    if (color === "blue-100") return "bg-blue-100 text-blue-800 border-blue-300";
    return "bg-slate-100 text-slate-800 border-slate-200";
}

export default function Page() {
    // sample date range (same as original example)
    const startDate = new Date("2023-10-12");
    const endDate = new Date("2023-10-25");
    const dates = getDatesInRange(startDate, endDate);

    // sample rooms and reservations — replace with real data later
    const rooms: Room[] = [
        { id: "101", name: "101", type: "King Suite", statusColor: "bg-emerald-500" },
        { id: "102", name: "102", type: "Queen Suite", statusColor: "bg-red-500" },
        { id: "103", name: "103", type: "Imperial Suite", statusColor: "bg-yellow-500" },
    ];

    const reservations: Reservation[] = RESERVATIONS_LIST;
    const [view, setView] = useState<"timeline" | "list">("timeline");

    const containerRef = useRef<HTMLDivElement | null>(null);
    const [dayWidth, setDayWidth] = useState<number>(100); // px fallback

    useEffect(() => {
        function updateWidths() {
            const el = containerRef.current;
            if (!el) return;
            const total = el.clientWidth; // includes the room column
            const avail = Math.max(0, total - ROOM_COL_PX);
            const w = avail / Math.max(1, dates.length);
            setDayWidth(w);
        }

        updateWidths();
        window.addEventListener("resize", updateWidths);
        return () => window.removeEventListener("resize", updateWidths);
    }, [dates.length]);

    return (
        <>
            <PageHeader
                name="Reservaciones"
                subtitle="Gestión de reservas y disponibilidad"
                buttons={
                    <div className="flex items-center gap-2">
                        <div className="inline-flex rounded-md bg-slate-50 p-1">
                            <button onClick={() => setView("timeline")} className={`px-3 py-1 text-sm rounded ${view === "timeline" ? "bg-white shadow" : "hover:bg-slate-100"}`}>
                                Timeline
                            </button>
                            <button onClick={() => setView("list")} className={`px-3 py-1 text-sm rounded ${view === "list" ? "bg-white shadow" : "hover:bg-slate-100"}`}>
                                Lista
                            </button>
                        </div>
                        <button className="flex items-center gap-2 bg-[#008cc7] text-white px-4 py-2 rounded transition-transform active:scale-95"><span className="material-symbols-outlined">add</span> Nueva Reserva</button>
                    </div>
                }
            />
            {view === "timeline" ? (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1 min-h-[500px]">
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white gantt-header">
                        <div className="flex items-center gap-3">
                            <button className="p-1 rounded hover:bg-slate-100 transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
                            <h3 className="text-sm font-bold text-slate-800">Oct 12 - Oct 25, 2023</h3>
                            <button className="p-1 rounded hover:bg-slate-100 transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span><span className="text-xs text-slate-500 font-medium">Confirmed</span></div>
                            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span><span className="text-xs text-slate-500 font-medium">Stay-in</span></div>
                            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="text-xs text-slate-500 font-medium">Checked-out</span></div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto scrollbar-hide relative">
                        <div className="min-w-[1000px]" ref={containerRef}>
                            <div className="gantt-grid border-b border-slate-200 bg-slate-50 sticky top-0 z-10" style={{ display: "flex" }}>
                                <div className="p-3 text-xs font-semibold text-slate-500 border-r border-slate-200 room-col flex items-center bg-white" style={{ width: ROOM_COL_PX }}>Room / Status</div>
                                {dates.map((d) => {
                                    const weekday = d.toLocaleString(undefined, { weekday: "short" });
                                    const daynum = d.getDate();
                                    const isMid = d.getDay() === 3; // example highlight for Wed
                                    const weekend = d.getDay() === 0 || d.getDay() === 6;
                                    return (
                                        <div key={d.toISOString()} className={`p-2 text-center border-r border-slate-200 ${isMid ? "bg-blue-50/50" : weekend ? "bg-slate-100/50" : ""}`} style={{ minWidth: dayWidth }}>
                                            <div className={`text-xs ${isMid ? "text-blue-600 font-bold" : "text-slate-400"}`}>{weekday}</div>
                                            <div className={`${isMid ? "text-sm font-bold text-blue-600" : "text-sm font-medium"}`}>{daynum}</div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="bg-slate-100 px-4 py-2 text-xs font-semibold sticky left-0 z-20 text-slate-500">Floor 1 - Suites</div>

                            {rooms.map((room) => (
                                <div key={room.id} className="gantt-grid border-b border-slate-200 hover:bg-slate-50/50 transition-colors group relative h-14">
                                    <div className="p-3 border-r border-slate-200 flex items-center justify-between room-col bg-white group-hover:bg-slate-50 transition-colors" style={{ width: ROOM_COL_PX }}>
                                        <div>
                                            <div className="text-sm font-semibold text-slate-800">{room.name}</div>
                                            <div className="text-xs text-slate-400">{room.type}</div>
                                        </div>
                                        <span className={`w-2 h-2 rounded-full ${room.statusColor}`}></span>
                                    </div>

                                    {/* day separators */}
                                    {dates.map((d, idx) => (
                                        <div key={idx} className="border-r border-slate-100" style={{ width: dayWidth, display: "inline-block", height: "100%" }}></div>
                                    ))}

                                    {/* reservations for this room */}
                                    {reservations
                                        .filter((r) => r.roomId === room.id)
                                        .map((r) => {
                                            const rStart = new Date(r.start);
                                            const rEnd = new Date(r.end);
                                            const offset = Math.max(0, diffDays(rStart, startDate));
                                            const length = diffDays(rEnd, rStart) + 1;
                                            const left = ROOM_COL_PX + offset * dayWidth;
                                            const width = Math.max(dayWidth * length, dayWidth); // at least 1 day
                                            const bg = r.color === "amber-100" ? "bg-amber-100" : r.color === "emerald-100" ? "bg-emerald-100" : r.color === "blue-100" ? "bg-blue-100" : "bg-slate-100";
                                            const border = r.color === "amber-100" ? "border-amber-500" : r.color === "emerald-100" ? "border-emerald-500" : r.color === "blue-100" ? "border-blue-500" : "border-slate-300";
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
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1 min-h-[200px] p-4">
                    <div className="overflow-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Guest</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Room</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Check-in</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Check-out</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Nights</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {reservations.map((r) => {
                                    const nights = diffDays(new Date(r.end), new Date(r.start)) + 1;
                                    const statusLabel = r.color === "amber-100" ? "Stay-in" : r.color === "emerald-100" ? "Checked-out" : r.color === "blue-100" ? "Confirmed" : "—";
                                    const badgeBg = r.color === "amber-100" ? "bg-amber-100" : r.color === "emerald-100" ? "bg-emerald-100" : r.color === "blue-100" ? "bg-blue-100" : "bg-slate-100";
                                    const badgeText = r.color === "amber-100" ? "text-amber-800" : r.color === "emerald-100" ? "text-emerald-800" : r.color === "blue-100" ? "text-blue-800" : "text-slate-800";
                                    const dotBg = r.color === "amber-100" ? "bg-amber-500" : r.color === "emerald-100" ? "bg-emerald-500" : r.color === "blue-100" ? "bg-blue-500" : "bg-slate-400";
                                    return (
                                        <tr key={r.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 align-middle">
                                                <div className="text-sm font-medium text-slate-900">{r.guest}</div>
                                                <div className="text-xs text-slate-400">Booking {r.id}</div>
                                            </td>
                                            <td className="px-4 py-3">{r.roomId}</td>
                                            <td className="px-4 py-3">{new Date(r.start).toLocaleDateString()}</td>
                                            <td className="px-4 py-3">{new Date(r.end).toLocaleDateString()}</td>
                                            <td className="px-4 py-3">{nights}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-medium border ${badgeBg} ${badgeText} border-slate-200`}>
                                                    <span className={`w-2 h-2 rounded-full ${dotBg}`}></span>
                                                    {statusLabel}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link href={`/bd/reservaciones/${r.id}`} className="text-sm text-[#008cc7] hover:underline mr-3">Ver</Link>
                                                <Link href={`/bd/reservaciones/${r.id}/edit`} className="text-sm text-slate-700 hover:underline">Editar</Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
}