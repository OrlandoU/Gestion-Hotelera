"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReservas, type Reserva } from "@/functions/reservas";
import { getCurrentUser, LoggedUser } from "@/functions/auth";
import PageHeader from "@/components/pageheader";
import NewReservation from "@/components/NewReservation";
import Link from "next/link";

const ROOM_COL_PX = 200;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const STATUS_CONFIG = {
    Pendiente: {
        label: "Pendiente",
        badgeBg: "bg-amber-100",
        badgeText: "text-amber-800",
        border: "border-amber-300",
        dotBg: "bg-amber-500",
    },
    Reservada: {
        label: "Reservada",
        badgeBg: "bg-purple-100",
        badgeText: "text-purple-800",
        border: "border-purple-300",
        dotBg: "bg-purple-500",
    },
    Hospedado: {
        label: "Hospedado",
        badgeBg: "bg-indigo-100",
        badgeText: "text-indigo-800",
        border: "border-indigo-300",
        dotBg: "bg-indigo-500",
    },
    Finalizada: {
        label: "Finalizada",
        badgeBg: "bg-slate-100",
        badgeText: "text-slate-800",
        border: "border-slate-300 card-shadow",
        dotBg: "bg-slate-400",
    },
};

type Room = {
    id: string;
    name: string;
    type: string;
    statusColor: string;
};

type TimelineReservation = {
    id: string;
    roomId: string;
    roomName: string;
    numberReservation: string;
    start: string;
    end: string;
    guest: string;
    status?: string;
    icon?: string;
};

const handleEnlace = (
    telefono: string,
    nombre_huesped: string,
    total_pagar: number,
    nombre: string
): string => {
    const total_depositar = (total_pagar * 0.3).toFixed(2);
    const horaActual = new Date().getHours();

    let saludo = "Buenos días";
    let despedida = "feliz día";

    if (horaActual >= 12 && horaActual < 18) {
        saludo = "Buenas tardes";
        despedida = "feliz tarde";
    } else if (horaActual >= 18) {
        saludo = "Buenas noches";
        despedida = "feliz noche";
    }

    // El salto de línea dentro de los backticks se conserva automáticamente al codificar la URL
    const mensaje = `¡Hola, ${nombre_huesped}! ${saludo}.
Le saluda ${nombre}, recepcionista de Hotel San Pedro.

Para confirmar su reservación, le solicitamos realizar un anticipo del 30% del total (L. ${total_depositar}).

Quedo a la espera de su comprobante para finalizar el registro. ¡Muchas gracias y ${despedida}!`;

    // Limpia el número de teléfono removiendo guiones o espacios antes de enviarlo
    const telefonoLimpio = telefono.replace(/\D/g, "");

    return `https://wa.me/504${telefonoLimpio}?text=${encodeURIComponent(mensaje)}`;
};

function getDatesInRange(start: Date, end: Date) {
    const dates: Date[] = [];
    const current = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const final = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    while (current <= final) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return dates;
}

function diffDays(a: Date, b: Date) {
    return Math.round((a.getTime() - b.getTime()) / MS_PER_DAY);
}

function parseDateValue(value?: string | null): Date | null {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value: Date | string): string {
    const date = value instanceof Date ? value : new Date(value);
    return date.toISOString().split("T")[0];
}

function getGuestName(reserva: Reserva): string {
    const parts = [reserva.nombres, reserva.apellidos, reserva.nombre_huesped].filter(Boolean) as string[];
    return parts.join(" ").trim() || "Huésped sin nombre";
}

function getReservationStatus(reserva: Reserva): string {
    return String(reserva.reserva_estado || reserva.estado || "Finalizada");
}

function getStatusStyles(status?: string) {
    switch (status) {
        case "Pendiente":
            return { bg: "bg-amber-100", border: "border-amber-500", dot: "bg-amber-500" };
        case "Reservada":
            return { bg: "bg-indigo-100", border: "border-indigo-500", dot: "bg-indigo-500" };
        case "Hospedado":
            return { bg: "bg-purple-100", border: "border-purple-500", dot: "bg-purple-500" };
        default:
            return { bg: "bg-slate-100", border: "border-slate-300 card-shadow", dot: "bg-slate-400" };
    }
}

function getStartOfWeek(date: Date) {
    const copy = new Date(date);
    const day = copy.getDay();
    const diff = (day + 6) % 7;
    copy.setDate(copy.getDate() - diff);
    copy.setHours(0, 0, 0, 0);
    return copy;
}

function addDays(date: Date, days: number) {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    copy.setHours(0, 0, 0, 0);
    return copy;
}

function formatRangeLabel(start: Date, end: Date) {
    const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
    const formatter = (date: Date) => date.toLocaleDateString("es-HN", { month: "short", day: "numeric" });

    if (sameMonth) {
        return `${start.toLocaleDateString("es-HN", { month: "short" })} ${start.getDate()} - ${end.getDate()}, ${end.getFullYear()}`;
    }

    return `${formatter(start)} - ${formatter(end)} ${end.getFullYear()}`;
}

export default function Page() {
    // Crear una funcion que obtenga el usuario actual y sea async
    const [usuario, setUsuario] = useState<LoggedUser>();

    useEffect(() => {
        const obtenerUsuario = async () => {
            const user = await getCurrentUser();
            setUsuario(user!);
        };
        obtenerUsuario();
    }, []);

    const [timelineStartDate, setTimelineStartDate] = useState<Date>(() => getStartOfWeek(new Date()));
    const [customRange, setCustomRange] = useState<{ start: string; end: string } | null>(null);
    const [showRangePicker, setShowRangePicker] = useState(false);
    const [draftRange, setDraftRange] = useState<{ start: string; end: string }>({ start: "", end: "" });
    const [listFechaStr, setListFechaStr] = useState<string>(() => {
        const agora = new Date();
        agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
        return agora.toISOString().split("T")[0];
    });
    type ListSortKey = "fecha_entrada" | "fecha_salida" | "numero_espacio" | "nombre" | "reserva_estado";

    const [listSearch, setListSearch] = useState<string>("");
    const [listStatusFilter, setListStatusFilter] = useState<string>("");
    const [listSortBy, setListSortBy] = useState<ListSortKey>("fecha_entrada");
    const [listSortOrder, setListSortOrder] = useState<"asc" | "desc">("asc");
    const [view, setView] = useState<"timeline" | "list">("timeline");

    const listDate = useMemo(
        () => (listFechaStr ? new Date(`${listFechaStr}T00:00:00`) : undefined),
        [listFechaStr]
    );

    const timelineHook = useReservas(undefined);
    const listHook = useReservas(listDate);

    const timelineData = useMemo(() => (timelineHook.data || []) as Reserva[], [timelineHook.data]);
    const listData = useMemo(() => (listHook.data || []) as Reserva[], [listHook.data]);

    const hasCustomRange = Boolean(customRange?.start && customRange?.end && parseDateValue(customRange.start) && parseDateValue(customRange.end));
    const visibleStartDate = hasCustomRange ? parseDateValue(customRange!.start)! : timelineStartDate;
    const visibleEndDate = hasCustomRange ? parseDateValue(customRange!.end)! : addDays(timelineStartDate, 6);

    const timelineRange = useMemo(
        () => ({
            startDate: visibleStartDate,
            endDate: visibleEndDate,
            dates: getDatesInRange(visibleStartDate, visibleEndDate),
        }),
        [visibleStartDate, visibleEndDate]
    );

    const { startDate, endDate, dates } = timelineRange;

    const timelineReservations = useMemo<TimelineReservation[]>(() => {
        return timelineData.map((reserva) => {
            const roomId = reserva.espacio_id ? String(reserva.espacio_id) : reserva.numero_espacio ? String(reserva.numero_espacio) : "sin-habitacion";
            const roomName = reserva.numero_espacio ? String(reserva.numero_espacio) : `Espacio ${roomId}`;
            const status = getReservationStatus(reserva);

            return {
                id: String(reserva.reserva_id ?? `${roomId}-${reserva.numero_reserva ?? "sin-id"}`),
                roomId,
                roomName,
                numberReservation: reserva.numero_reserva || `RES-${reserva.reserva_id ?? ""}`,
                start: reserva.fecha_entrada || "",
                end: reserva.fecha_salida || reserva.fecha_entrada || "",
                guest: getGuestName(reserva),
                status,
                icon: ["Hospedado", "Reservada"].includes(status) ? "person" : undefined,
            };
        });
    }, [timelineData]);

    const rooms = useMemo<Room[]>(() => {
        const uniqueRooms = new Map<string, Room>();
        timelineReservations.forEach((reservation) => {
            if (!uniqueRooms.has(reservation.roomId)) {
                uniqueRooms.set(reservation.roomId, {
                    id: reservation.roomId,
                    name: reservation.roomName,
                    type: "Reserva",
                    statusColor: "bg-emerald-500",
                });
            }
        });
        return Array.from(uniqueRooms.values());
    }, [timelineReservations]);

    const timelineVisibleReservations = useMemo(() => {
        return timelineReservations.filter((reservation) => {
            const start = parseDateValue(reservation.start);
            const end = parseDateValue(reservation.end);
            return Boolean(start && end && end >= startDate && start <= endDate);
        });
    }, [timelineReservations, startDate, endDate]);

    const filteredListReservations = useMemo(() => {
        const normalizedSearch = listSearch.trim().toLowerCase();

        const filtered = listData.filter((reserva) => {
            const start = parseDateValue(reserva.fecha_entrada);
            const end = parseDateValue(reserva.fecha_salida || reserva.fecha_entrada);
            const matchesDate = listDate ? Boolean(start && end && listDate >= start && listDate <= end) : true;

            const guestName = getGuestName(reserva).toLowerCase();
            const reservationNumber = String(reserva.numero_reserva || reserva.reserva_id || "").toLowerCase();
            const status = String(reserva.reserva_estado || reserva.estado || "").toLowerCase();
            const space = String(reserva.numero_espacio || "").toLowerCase();
            const matchesSearch = !normalizedSearch || guestName.includes(normalizedSearch) || reservationNumber.includes(normalizedSearch) || space.includes(normalizedSearch);
            const matchesStatus = !listStatusFilter || status === listStatusFilter.toLowerCase();

            return matchesDate && matchesSearch && matchesStatus;
        });

        return filtered.slice().sort((a, b) => {
            const order = listSortOrder === "asc" ? 1 : -1;
            const valueFor = (reserva: Reserva) => {
                if (listSortBy === "fecha_entrada") return reserva.fecha_entrada || "";
                if (listSortBy === "fecha_salida") return reserva.fecha_salida || "";
                if (listSortBy === "numero_espacio") return reserva.numero_espacio || "";
                if (listSortBy === "reserva_estado") return reserva.reserva_estado || reserva.estado || "";
                return getGuestName(reserva).toLowerCase();
            };

            const left = String(valueFor(a));
            const right = String(valueFor(b));
            return left.localeCompare(right, "es-HN", { numeric: true }) * order;
        });
    }, [listDate, listData, listSearch, listStatusFilter, listSortBy, listSortOrder]);

    const moveTimelineWindow = (days: number) => {
        if (hasCustomRange) {
            setCustomRange((prev) => {
                if (!prev) return prev;
                const start = parseDateValue(prev.start);
                const end = parseDateValue(prev.end);
                if (!start || !end) return prev;

                return {
                    start: formatDate(addDays(start, days)),
                    end: formatDate(addDays(end, days)),
                };
            });
            return;
        }

        setTimelineStartDate((prev) => addDays(prev, days));
    };

    const timelineLoading = timelineHook.loading;
    const timelineError = timelineHook.error;
    const listLoading = listHook.loading;
    const listError = listHook.error;

    const containerRef = useRef<HTMLDivElement | null>(null);
    const [dayWidth, setDayWidth] = useState<number>(100);

    useEffect(() => {
        function updateWidths() {
            const el = containerRef.current;
            if (!el) return;
            const total = el.clientWidth;
            const available = Math.max(0, total - ROOM_COL_PX);
            const width = available / Math.max(dates.length, 1);
            setDayWidth(width);
        }

        updateWidths();
        window.addEventListener("resize", updateWidths);
        return () => window.removeEventListener("resize", updateWidths);
    }, [dates.length, timelineLoading, view]);

    return (
        <>
            <PageHeader
                name="Reservaciones"
                subtitle="Gestión de reservas y disponibilidad"
                buttons={
                    <div className="flex items-center gap-2">
                        <div className="inline-flex rounded-md bg-slate-50 p-1">
                            <button
                                type="button"
                                onClick={() => setView("timeline")}
                                className={`px-3 py-1 text-sm rounded ${view === "timeline" ? "bg-white shadow" : "hover:bg-slate-100"}`}
                            >
                                Cronograma
                            </button>
                            <button
                                type="button"
                                onClick={() => setView("list")}
                                className={`px-3 py-1 text-sm rounded ${view === "list" ? "bg-white shadow" : "hover:bg-slate-100"}`}
                            >
                                Lista
                            </button>
                        </div>
                        <NewReservation />
                    </div>
                }
            />

            {view === "timeline" ? (
                <div className="bg-white rounded-xl border border-slate-300 card-shadow shadow-sm overflow-hidden flex flex-col flex-1 min-h-125">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-slate-300 bg-white">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => moveTimelineWindow(-7)}
                                className="p-1 rounded hover:bg-slate-100 transition-colors"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setDraftRange({ start: formatDate(visibleStartDate), end: formatDate(visibleEndDate) });
                                    setShowRangePicker((prev) => !prev);
                                }}
                                className="px-3 py-2 rounded border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 text-sm font-medium"
                            >
                                {formatRangeLabel(visibleStartDate, visibleEndDate)}
                            </button>
                            <button
                                type="button"
                                onClick={() => moveTimelineWindow(7)}
                                className="p-1 rounded hover:bg-slate-100 transition-colors"
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-600">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                <span>Pendiente</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                <span>Confirmada</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                <span>En estancia</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                                <span>Finalizada</span>
                            </div>
                        </div>
                    </div>

                    {showRangePicker && (
                        <div className="p-4 border-b border-slate-200 bg-slate-50">
                            <div className="flex flex-col lg:flex-row gap-4 items-end">
                                <label className="flex flex-col text-slate-700 text-xs">
                                    Desde
                                    <input
                                        type="date"
                                        value={draftRange.start}
                                        onChange={(e) => setDraftRange((prev) => ({ ...prev, start: e.target.value }))}
                                        className="mt-2 p-2 border border-slate-300 rounded-md"
                                    />
                                </label>
                                <label className="flex flex-col text-slate-700 text-xs">
                                    Hasta
                                    <input
                                        type="date"
                                        value={draftRange.end}
                                        onChange={(e) => setDraftRange((prev) => ({ ...prev, end: e.target.value }))}
                                        className="mt-2 p-2 border border-slate-300 rounded-md"
                                    />
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        disabled={
                                            !draftRange.start ||
                                            !draftRange.end ||
                                            !parseDateValue(draftRange.start) ||
                                            !parseDateValue(draftRange.end) ||
                                            (parseDateValue(draftRange.start)!.getTime() > parseDateValue(draftRange.end)!.getTime())
                                        }
                                        onClick={() => {
                                            const start = parseDateValue(draftRange.start);
                                            const end = parseDateValue(draftRange.end);
                                            if (start && end && start <= end) {
                                                setCustomRange({ start: draftRange.start, end: draftRange.end });
                                                setShowRangePicker(false);
                                            }
                                        }}
                                        className="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
                                    >Aplicar</button>
                                    <button
                                        type="button"
                                        onClick={() => setShowRangePicker(false)}
                                        className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100"
                                    >Cancelar</button>
                                    {hasCustomRange && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCustomRange(null);
                                                setDraftRange({ start: "", end: "" });
                                                setShowRangePicker(false);
                                            }}
                                            className="px-4 py-2 rounded-md border border-red-300 text-red-700 hover:bg-red-50"
                                        >Limpiar rango</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {timelineLoading ? (
                        <div className="p-8 text-center text-sm text-slate-500">Cargando cronograma...</div>
                    ) : timelineError ? (
                        <div className="p-8 text-center text-sm text-red-500">Error cargando reservaciones.</div>
                    ) : (
                        <div className="flex-1 overflow-auto scrollbar-hide relative">
                            <div className="min-w-250" ref={containerRef}>
                                <div className="gantt-grid border-b border-slate-300 card-shadow bg-slate-50 sticky top-0 z-10" style={{ display: "flex" }}>
                                    <div className="p-3 text-xs font-semibold text-slate-500 border-r border-slate-300 card-shadow room-col flex items-center bg-white" style={{ width: ROOM_COL_PX }}>
                                        Habitación / Estado
                                    </div>
                                    {dates.map((date) => {
                                        const weekday = date.toLocaleString("es-HN", { weekday: "short" });
                                        const daynum = date.getDate();
                                        const isMid = date.getDay() === 4;
                                        const weekend = date.getDay() === 0 || date.getDay() === 6;
                                        return (
                                            <div key={date.toISOString()} className={`p-2 text-center border-r border-slate-300 card-shadow ${isMid ? "bg-blue-50/50" : weekend ? "bg-slate-100/50" : ""}`} style={{ minWidth: dayWidth }}>
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
                                            {/*<span className={`w-2 h-2 rounded-full ${room.statusColor}`}></span>*/}
                                        </div>

                                        {dates.map((_, index) => (
                                            <div key={index} className="border-r border-slate-100" style={{ width: dayWidth, display: "inline-block", height: "100%" }}></div>
                                        ))}

                                        {timelineVisibleReservations
                                            .filter((reservation) => reservation.roomId === room.id)
                                            .map((reservation) => {
                                                const start = parseDateValue(reservation.start);
                                                const end = parseDateValue(reservation.end);
                                                if (!start || !end) return null;

                                                const clippedStart = start < startDate ? startDate : start;
                                                const clippedEnd = end > endDate ? endDate : end;
                                                if (clippedEnd < startDate || clippedStart > endDate) return null;

                                                const offset = Math.max(0, diffDays(clippedStart, startDate));
                                                const length = Math.max(1, diffDays(clippedEnd, clippedStart) + 1);
                                                const left = ROOM_COL_PX + offset * dayWidth;
                                                const width = Math.max(dayWidth * length, dayWidth);
                                                const statusStyles = getStatusStyles(reservation.status);

                                                return (
                                                    <Link
                                                        key={reservation.id}
                                                        href={`/bd/reservaciones/${reservation.id}`}
                                                        className={`reservation-bar ${statusStyles.bg} border-l-4 ${statusStyles.border} px-3 py-1 flex items-center justify-between overflow-hidden cursor-pointer`}
                                                        style={{ position: "absolute", top: 8, bottom: 8, left, width }}
                                                    >
                                                        <div className="truncate">
                                                            <div className="text-xs font-bold text-slate-900 truncate">{reservation.guest}</div>
                                                            <div className="text-[11px] text-slate-600 truncate">{reservation.numberReservation}</div>
                                                        </div>
                                                        {reservation.icon ? (
                                                            <span className="material-symbols-outlined text-[16px] text-slate-700">{reservation.icon}</span>
                                                        ) : null}
                                                    </Link>
                                                );
                                            })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-300 card-shadow shadow-sm overflow-hidden flex flex-col flex-1 min-h-50 p-4">
                    <div className="flex flex-col gap-4 mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                            <label className="flex flex-col w-full sm:w-auto text-slate-700 text-sm">
                                Filtrar por fecha
                                <input
                                    className="mt-2 p-2 border border-slate-300 rounded-md"
                                    type="date"
                                    value={listFechaStr}
                                    onChange={(e) => setListFechaStr(e.target.value)}
                                />
                            </label>
                            <button
                                type="button"
                                onClick={() => setListFechaStr("")}
                                className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100"
                            >
                                Limpiar
                            </button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            <label className="flex flex-col text-slate-700 text-sm">
                                Buscar
                                <input
                                    type="text"
                                    value={listSearch}
                                    onChange={(e) => setListSearch(e.target.value)}
                                    placeholder="Huésped, reserva, habitación"
                                    className="mt-2 p-2 border border-slate-300 rounded-md"
                                />
                            </label>
                            <label className="flex flex-col text-slate-700 text-sm">
                                Estado
                                <select
                                    value={listStatusFilter}
                                    onChange={(e) => setListStatusFilter(e.target.value)}
                                    className="mt-2 p-2 border border-slate-300 rounded-md"
                                >
                                    <option value="">Todos</option>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="reservada">Reservada</option>
                                    <option value="hospedado">Hospedado</option>
                                    <option value="finalizada">Finalizada</option>
                                </select>
                            </label>
                            <label className="flex flex-col text-slate-700 text-sm">
                                Ordenar por
                                <select
                                    value={listSortBy}
                                    onChange={(e) => setListSortBy(e.target.value as ListSortKey)}
                                    className="mt-2 p-2 border border-slate-300 rounded-md"
                                >
                                    <option value="fecha_entrada">Fecha de entrada</option>
                                    <option value="fecha_salida">Fecha de salida</option>
                                    <option value="numero_espacio">Habitación</option>
                                    <option value="nombre">Huésped</option>
                                    <option value="reserva_estado">Estado</option>
                                </select>
                            </label>
                            <label className="flex flex-col text-slate-700 text-sm">
                                Orden
                                <select
                                    value={listSortOrder}
                                    onChange={(e) => setListSortOrder(e.target.value as "asc" | "desc")}
                                    className="mt-2 p-2 border border-slate-300 rounded-md"
                                >
                                    <option value="asc">Ascendente</option>
                                    <option value="desc">Descendente</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    {listLoading ? (
                        <div className="py-8 text-center text-sm text-slate-500 font-medium">Cargando reservaciones desde el servidor...</div>
                    ) : listError ? (
                        <div className="py-8 text-center text-sm text-red-500 font-medium">Error al conectar con la API de reservaciones.</div>
                    ) : filteredListReservations.length === 0 ? (
                        <div className="py-8 text-center text-sm text-slate-500 font-medium">No se encontraron reservaciones para la fecha seleccionada.</div>
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
                                    {filteredListReservations.map((reserva) => {
                                        const statusKey = getReservationStatus(reserva);
                                        const currentStatus = STATUS_CONFIG[statusKey as keyof typeof STATUS_CONFIG] || {
                                            label: statusKey || "—",
                                            badgeBg: "bg-slate-100",
                                            badgeText: "text-slate-800",
                                            border: "border-slate-300",
                                            dotBg: "bg-slate-400",
                                        };
                                        const start = parseDateValue(reserva.fecha_entrada);
                                        const end = parseDateValue(reserva.fecha_salida || reserva.fecha_entrada);
                                        const nights = start && end ? Math.max(1, diffDays(end, start)) : reserva.cantidad_unidades || "—";

                                        return (
                                            <tr key={reserva.reserva_id ?? reserva.numero_reserva} className="hover:bg-slate-50 border-b border-slate-100 last:border-none">
                                                <td className="px-4 py-3 align-middle">
                                                    <div className="text-sm font-medium text-slate-900">{getGuestName(reserva)}</div>
                                                    <div className="text-xs text-slate-400">Reserva {reserva.numero_reserva || reserva.reserva_id}</div>
                                                </td>
                                                <td className="px-4 py-3 align-middle text-slate-700">{reserva.numero_espacio || "—"}</td>
                                                <td className="px-4 py-3 align-middle text-slate-600">{reserva.fecha_entrada || "—"}</td>
                                                <td className="px-4 py-3 align-middle text-slate-600">{reserva.fecha_salida || "—"}</td>
                                                <td className="px-4 py-3 align-middle text-slate-600">{nights}</td>
                                                <td className="px-4 py-3 align-middle">
                                                    <span className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-medium border ${currentStatus.badgeBg} ${currentStatus.badgeText} ${currentStatus.border}`}>
                                                        <span className={`w-2 h-2 rounded-full ${currentStatus.dotBg}`}></span>
                                                        {currentStatus.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 align-middle">
                                                    <Link href={`/bd/reservaciones/${reserva.reserva_id}`} className="text-sm text-[#008cc7] hover:underline mr-3">Ver</Link>
                                                    <Link href={`/bd/reservaciones/${reserva.reserva_id}/pagos`} className="text-sm text-slate-700 hover:underline">Pagos</Link>
                                                    <a
                                                        href={handleEnlace(reserva.telefono_huesped || reserva.telefono || "", getGuestName(reserva), reserva.total_pagar || 0, usuario!.nombre)}
                                                        target="whatsapp-chat"
                                                        className="inline-flex items-center justify-center p-2 text-slate-700 hover:text-green-600 transition-colors"
                                                        title="Enviar mensaje por WhatsApp"
                                                    >
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
        </>
    );
}
