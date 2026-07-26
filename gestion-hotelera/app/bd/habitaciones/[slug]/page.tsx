"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getHabitacion, Habitacion } from "@/functions/espacios";

function getStatusBadge(status?: string) {
    switch (status) {
        case "Disponible":
            return "bg-emerald-100 text-emerald-800 border-emerald-300";
        case "Ocupado":
            return "bg-blue-100 text-blue-800 border-blue-300";
        case "Sucia":
            return "bg-amber-100 text-amber-800 border-amber-300";
        case "Mantenimiento":
            return "bg-rose-100 text-rose-800 border-rose-300";
        default:
            return "bg-slate-100 text-slate-800 border-slate-300";
    }
}

function formatDate(value?: string | null) {
    if (!value) return null;

    try {
        return new Date(value).toLocaleString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return value;
    }
}

export default function RoomDetailPage() {
    const params = useParams();
    const rawSlug = params?.slug;
    const roomId = Number(Array.isArray(rawSlug) ? rawSlug[0] : rawSlug);

    const [habitacion, setHabitacion] = useState<Habitacion | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!Number.isFinite(roomId)) {
            setLoading(false);
            setError("No se pudo identificar la habitación.");
            return;
        }

        let active = true;
        setLoading(true);
        setError(null);

        getHabitacion(roomId)
            .then((data) => {
                if (!active) return;
                const firstItem = Array.isArray(data) ? data[0] : data;
                setHabitacion(firstItem ?? null);
            })
            .catch(() => {
                if (active) {
                    setError("No se pudo cargar la información de la habitación.");
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [roomId]);

    if (loading) {
        return (
            <div className="bg-white border border-slate-300 rounded-3xl p-6 shadow-sm">
                <div className="text-slate-900 font-semibold">Cargando habitación...</div>
            </div>
        );
    }

    if (error || !habitacion) {
        return (
            <div className="bg-white border border-slate-300 rounded-3xl p-6 shadow-sm">
                <div className="text-slate-900 font-semibold">{error ?? "Habitación no encontrada."}</div>
                <Link href="/bd/habitaciones" className="inline-flex mt-4 px-4 py-2 rounded-lg bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800 transition-colors">
                    Volver a Habitaciones
                </Link>
            </div>
        );
    }

    const currentGuestName = [habitacion.huesped_actual_nombres, habitacion.huesped_actual_apellidos]
        .filter(Boolean)
        .join(" ")
        .trim();

    const nextGuestName = [habitacion.proximo_huesped_nombres, habitacion.proximo_huesped_apellidos]
        .filter(Boolean)
        .join(" ")
        .trim();

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-1 text-slate-500 text-xs mb-2">
                        <Link className="hover:text-slate-900 transition-colors" href="/bd/habitaciones">Habitaciones</Link>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        <span className="text-slate-800 font-medium">{habitacion.numero_espacio}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-950">Habitación {habitacion.numero_espacio}</h1>
                    <p className="text-sm text-slate-600 mt-1">{habitacion.tipo ?? "Sin tipo definido"}</p>
                </div>
                <Link href="/bd/habitaciones" className="inline-flex items-center justify-center gap-2 rounded-[2.5rem] border border-slate-300 bg-white px-5 py-3 text-[14px] font-semibold leading-4 tracking-wider text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-50 active:scale-95">
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span> Volver
                </Link>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-300 rounded-3xl p-6 shadow-sm">
                    <div className="flex flex-wrap items-center gap-6 mb-6 pb-4 border-b border-slate-100">
                        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${getStatusBadge(habitacion.estado_habitacion)}`}>
                            <span className="w-2 h-2 rounded-full bg-current"></span>
                            {habitacion.estado_habitacion ?? "Sin estado"}
                        </span>
                        <span className="text-sm text-slate-600">
                            Tipo: <strong className="text-slate-900 font-semibold">{habitacion.tipo ?? "Sin tipo"}</strong>
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold mb-2">Reserva actual</p>
                            <p className="text-base font-semibold text-slate-900">
                                {currentGuestName || "Hospedaje libre"}
                            </p>
                            <p className="text-sm text-slate-600 mt-1">
                                {habitacion.actual_fecha_entrada ? `Entrada: ${formatDate(habitacion.actual_fecha_entrada)}` : "Sin entrada registrada"}
                            </p>
                            {habitacion.estado_reserva ? (
                                <p className="text-sm text-slate-600 mt-1">Estado: {habitacion.estado_reserva}</p>
                            ) : null}
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold mb-2">Próxima reserva</p>
                            <p className="text-base font-semibold text-slate-900">
                                {nextGuestName || "Sin próximas reservas"}
                            </p>
                            <p className="text-sm text-slate-600 mt-1">
                                {habitacion.proxima_fecha_entrada ? `Llegada: ${formatDate(habitacion.proxima_fecha_entrada)}` : "Sin fecha de llegada programada"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-300 rounded-3xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-950 mb-4">Información de la habitación</h2>
                    <dl className="space-y-3 text-sm text-slate-700">
                        <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                            <dt className="font-medium text-slate-500">Número</dt>
                            <dd className="font-semibold text-slate-900">{habitacion.numero_espacio ?? "—"}</dd>
                        </div>
                        <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                            <dt className="font-medium text-slate-500">Estado</dt>
                            <dd className="font-semibold text-slate-900">{habitacion.estado_habitacion ?? "—"}</dd>
                        </div>
                        <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                            <dt className="font-medium text-slate-500">Tipo</dt>
                            <dd className="font-semibold text-slate-900">{habitacion.tipo ?? "—"}</dd>
                        </div>
                        <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                            <dt className="font-medium text-slate-500">Estado de reserva</dt>
                            <dd className="font-semibold text-slate-900">{habitacion.estado_reserva ?? "—"}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="font-medium text-slate-500">Próxima llegada</dt>
                            <dd className="font-semibold text-slate-900">{habitacion.proxima_fecha_entrada ? formatDate(habitacion.proxima_fecha_entrada) : "—"}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}
