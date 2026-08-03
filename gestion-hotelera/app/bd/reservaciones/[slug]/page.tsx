"use client";

import { useParams } from "next/navigation";
import { Reserva, useReserva } from "@/functions/reservas";
// removed ViewTransition import (not available in this React version)
import Link from "next/link";
import React from "react";
import { formatLempiras } from "@/lib/utils";
import Button from "@/components/ui/button";
import { toast } from "sonner";
import { usePagos } from "@/functions/pagos";
import { modificarReserva } from "@/functions/reservas";

const STATUS_CONFIG: Record<string, { label: string; badge: string; dot: string }> = {
    Pending: { label: "Pendiente", badge: "bg-amber-100 text-amber-800 border-amber-300", dot: "bg-amber-500" },
    Confirmed: { label: "Confirmada", badge: "bg-blue-100 text-blue-800 border-blue-300", dot: "bg-blue-500" },
    InHouse: { label: "En estancia", badge: "bg-emerald-100 text-emerald-800 border-emerald-300", dot: "bg-emerald-500" },
    Completed: { label: "Finalizada", badge: "bg-slate-100 text-slate-800 border-slate-300", dot: "bg-slate-400" },
};

type ReservationDetailNormalized = {
    bookingId: string;
    guest: { name?: string; email?: string; phone?: string; loyalty?: { tier?: string } };
    status?: string;
    createdAt?: string;
    stay?: { checkIn?: string; checkOut?: string; checkInTime?: string; checkOutTime?: string; nights?: number; specialRequests?: string };
    room?: { type?: string; number?: string };
    party?: { adults?: number };
    internalNotes?: Array<{ id?: string; text?: string; author?: string; createdAt?: string }>;
    payment?: { breakdown?: { roomRate?: number; taxesAndFees?: number; extras?: number }; total?: number; amountPaid?: number; guaranteeMethod?: string };
    activity?: Array<{ time?: string; text?: string }>;
};

function normalizeReserva(data: Reserva): ReservationDetailNormalized {
    const name = data.guest?.name ?? (([data.nombres, data.apellidos].filter(Boolean).join(" ")) || data.nombre_huesped || "Huésped desconocido");
    const email = data.guest?.email ?? data.email_huesped ?? data.email ?? "";
    const phone = data.guest?.telefono ?? data.telefono_huesped ?? data.telefono ?? "";
    const bookingId = data.bookingId ?? data.numero_reserva ?? (data.reserva_id ? `RES-${data.reserva_id}` : "—");
    const status = data.status ?? data.reserva_estado ?? data.reservationStatus ?? "Pending";

    return {
        bookingId,
        guest: {
            name,
            email,
            phone,
            loyalty: { tier: data.guest?.loyalty?.tier ?? data.loyalty_tier ?? data.tier ?? "" },
        },
        status,
        createdAt: typeof data.createdAt === "string" ? data.createdAt : typeof data.fecha_creacion === "string" ? data.fecha_creacion : typeof data.fecha_entrada === "string" ? data.fecha_entrada : undefined,
        stay: {
            checkIn: data.stay?.checkIn ?? data.fecha_entrada ?? "",
            checkOut: data.stay?.checkOut ?? data.fecha_salida ?? "",
            checkInTime: data.stay?.checkInTime ?? "",
            checkOutTime: data.stay?.checkOutTime ?? "",
            nights: data.stay?.nights ?? data.cantidad_unidades ?? 0,
            specialRequests: data.stay?.specialRequests ?? data.solicitudes_especiales ?? "",
        },
        room: {
            type: data.room?.type ?? data.tipo_espacio ?? data.tipo ?? "",
            number: data.room?.number ?? String(data.numero_espacio ?? data.espacio_id ?? ""),
        },
        party: {
            adults: data.party?.adults ?? data.numero_huespedes ?? data.cantidad_huespedes ?? data.cantidad_unidades ?? 0,
        },
        internalNotes: data.internalNotes ?? data.notas_internas ?? [],
        payment: {
            breakdown: {
                roomRate: data.payment?.breakdown?.roomRate ?? data.tarifa ?? data.precio_unidad ?? 0,
                taxesAndFees: data.payment?.breakdown?.taxesAndFees ?? data.impuestos ?? 0,
                extras: data.payment?.breakdown?.extras ?? data.extras ?? 0,
            },
            total: data.payment?.total ?? data.total_pagar ?? 0,
            amountPaid: data.payment?.amountPaid ?? data.monto_pagado ?? 0,
            guaranteeMethod: data.payment?.guaranteeMethod ?? data.metodo_garantia ?? "",
        },
        activity: data.activity ?? data.historial_actividad ?? [],
    };
}

export default function ReservationPage() {
    const params = useParams();
    const rawId = params?.slug as string | string[] | undefined;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const numericId = id ? Number(id) : null;

    const {
        data: rawReserva,
        loading: loadingReserva,
        error: errorReserva,
        refetch: refetchReserva // 1. Extrae el refetch del hook
    } = useReserva(numericId!);
    const { data: pagosApi } = usePagos(null, null, rawReserva?.reserva_id);
    const pagosData = pagosApi ?? [];

    const checkin = async () => {
        if (!rawReserva?.reserva_id) {
            toast.error("No se pudo identificar la reserva.");
            return;
        }

        try {
            await modificarReserva(rawReserva.reserva_id, true);
            toast.success("Reserva checkeada exitosamente");
            window.location.href = '/bd/reservaciones';
        } catch (error: any) {
            // Apuntamos correctamente a la estructura de error de FastAPI/Axios
            const mensajeLimpio =
                error.response?.data?.detail ||
                error.message ||
                "Ocurrió un error al procesar la solicitud.";

            toast.error(mensajeLimpio);
        }
    };

    const checkout = async () => {
        if (!rawReserva?.reserva_id) {
            toast.error("No se pudo identificar la reserva.");
            return;
        }

        try {
            await modificarReserva(rawReserva.reserva_id, false);
            toast.success("Reserva finalizada exitosamente");
            window.location.href = '/bd/reservaciones';
        } catch (error: any) {
            // Apuntamos correctamente a la estructura de error de FastAPI/Axios
            const mensajeLimpio =
                error.response?.data?.detail ||
                error.message ||
                "Ocurrió un error al procesar la solicitud.";

            toast.error(mensajeLimpio);
        }
    };

    const handleGenerarFactura = async () => {
        if (!rawReserva) {
            toast.error("No hay información de la reserva para generar la factura.");
            return;
        }

        try {
            const payload = {
                reserva: rawReserva,
                pagos: pagosData,
            };

            const params = new URLSearchParams({
                reserva: encodeURIComponent(JSON.stringify(payload.reserva)),
                pagos: encodeURIComponent(JSON.stringify(payload.pagos)),
            });

            const response = await fetch(`/api/factura-reserva-pdf/generate?${params.toString()}`);
            if (!response.ok) {
                throw new Error("No se pudo generar la factura");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `factura-reserva-${rawReserva.reserva_id || numericId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Factura generada correctamente.");
        } catch (error) {
            console.error("Error al generar la factura:", error);
            toast.error("No se pudo generar la factura.");
        }
    };

    if (!id || Number.isNaN(numericId)) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
                <p className="font-semibold text-slate-900">No se pudo identificar la reservación.</p>
                <p className="mt-2 text-sm">Intenta volver a la lista y abrir la reserva nuevamente.</p>
            </div>
        );
    }

    if (loadingReserva) {
        return (
            <>
                <div className="space-y-6">
                    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="h-4 w-32 rounded bg-slate-200" />
                        <div className="mt-4 h-8 w-64 rounded bg-slate-200" />
                        <div className="mt-3 h-4 w-48 rounded bg-slate-200" />
                    </div>
                    <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
                        <div className="space-y-4">
                            <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="h-5 w-40 rounded bg-slate-200" />
                                <div className="mt-4 grid gap-3 md:grid-cols-2">
                                    <div className="h-20 rounded-xl bg-slate-100" />
                                    <div className="h-20 rounded-xl bg-slate-100" />
                                    <div className="h-20 rounded-xl bg-slate-100" />
                                    <div className="h-20 rounded-xl bg-slate-100" />
                                </div>
                            </div>
                            <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="h-5 w-44 rounded bg-slate-200" />
                                <div className="mt-4 h-24 rounded-xl bg-slate-100" />
                            </div>
                        </div>
                        <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="h-5 w-36 rounded bg-slate-200" />
                            <div className="mt-4 space-y-3">
                                <div className="h-12 rounded-xl bg-slate-100" />
                                <div className="h-12 rounded-xl bg-slate-100" />
                                <div className="h-12 rounded-xl bg-slate-100" />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (errorReserva || !rawReserva) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm">
                <p className="font-semibold">No se pudo cargar la reservación.</p>
                <p className="mt-2 text-sm">{errorReserva?.toString() || "Intenta recargar la página o volver a intentarlo más tarde."}</p>
            </div>
        );
    }

    const { bookingId, guest, status, createdAt, stay, room, party, internalNotes, payment, activity } = normalizeReserva(rawReserva);
    console.log("Normalized Reservation Data:", { bookingId, guest, status, createdAt, stay, room, party, internalNotes, payment, activity });

    const createdLabel = createdAt?.split("T")[0] ?? "-";

    const roomRate = payment?.breakdown?.roomRate ?? rawReserva?.precio_unidad ?? 0;
    const extras = payment?.breakdown?.extras ?? 0;
    const nights = stay?.nights ?? rawReserva?.cantidad_unidades ?? 0;
    const subtotal = (nights > 0 ? roomRate * nights : rawReserva?.total_pagar ?? 0) * .85;
    const impuesto = subtotal * 0.15;
    const totalCargos = payment?.total ?? rawReserva?.total_pagar ?? subtotal + impuesto + extras;
    const amountPaid = payment?.amountPaid ?? rawReserva?.monto_pagado ?? 0;
    const saldoPendiente = Math.max(0, totalCargos - amountPaid);

    const currentStatus = STATUS_CONFIG[status ?? "Pending"] || { label: status ?? "Pendiente", badge: "bg-slate-100 text-slate-800 border-slate-300", dot: "bg-slate-400" };

    return (
        <>
            <div className="mb-2">
                <div className="flex items-center gap-1 text-slate-500 text-xs mb-2">
                    <Link className="hover:text-slate-900 transition-colors" href="/bd/reservaciones" transitionTypes={["nav-back"]}>Reservaciones</Link>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <span className="text-slate-800 font-medium">{bookingId}</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">{guest?.name}</h1>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${currentStatus.badge}`}>
                                <span className={`w-2 h-2 rounded-full ${currentStatus.dot}`}></span> {currentStatus.label}
                            </span>
                            <span className="text-xs text-slate-500">ID de reserva: {bookingId}</span>
                            <span className="text-xs text-slate-500">• Creado: {createdLabel}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-8 space-y-6">
                    {/* Información del huésped */}
                    <div className="bg-white rounded-xl border border-slate-300 card-shadow p-6">
                        <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400">person</span> Información del huésped
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-slate-400 mb-1 font-medium">Correo electrónico</p>
                                <p className="text-slate-800 font-medium">{guest?.email}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 mb-1 font-medium">Teléfono</p>
                                <p className="text-slate-800 font-medium">{guest?.phone}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 mb-1 font-medium">Nivel de fidelidad</p>
                                <p className="text-slate-800 font-medium flex items-center gap-1">
                                    <span className="material-symbols-outlined text-amber-500 text-[18px]">workspace_premium</span>
                                    <p>{guest?.loyalty?.tier ?? "—"}</p>
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Detalles de la estadía */}
                    <div className="bg-white rounded-xl border border-slate-300 card-shadow p-6">
                        <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400">bed</span> Detalles de la estadía
                        </h2>
                        <div className="flex flex-col md:flex-row justify-between mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex-1 text-center md:text-left mb-3 md:mb-0">
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">Check-in</p>
                                <p className="text-xl font-bold text-slate-900">{stay?.checkIn?.split("T")[0] ?? "-"}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{stay?.checkInTime}</p>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center relative my-2 md:my-0">
                                <div className="w-full h-px bg-slate-200 absolute top-1/2 -translate-y-1/2 z-0 hidden md:block"></div>
                                <div className="bg-slate-50 z-10 px-3 flex flex-col items-center">
                                    <span className="inline-block px-2.5 py-0.5 bg-slate-200 text-slate-800 rounded-full text-xs font-bold mb-1">{stay?.nights ?? "0"} Noches</span>
                                    <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
                                </div>
                            </div>
                            <div className="flex-1 text-center md:text-right">
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">Check-out</p>
                                <p className="text-xl font-bold text-slate-900">{stay?.checkOut?.split("T")[0] ?? "-"}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{stay?.checkOutTime}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3 border border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-slate-200/60 flex items-center justify-center text-slate-800">
                                    <span className="material-symbols-outlined">meeting_room</span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium">Tipo de habitación</p>
                                    <p className="font-bold text-slate-800">{room?.type}</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3 border border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-slate-200/60 flex items-center justify-center text-slate-800">
                                    <span className="material-symbols-outlined">tag</span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium">Número de habitación</p>
                                    <p className="font-bold text-slate-800">{room?.number}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notas internas */}
                    <div className="bg-white rounded-xl border border-slate-300 card-shadow p-6">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400">note_alt</span> Notas internas
                            </h2>
                            <button className="text-slate-950 font-semibold text-xs hover:underline">Agregar nota</button>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            {internalNotes && internalNotes.length > 0 ? (
                                <>
                                    <p className="text-slate-700 mb-2 leading-relaxed">{internalNotes[0].text}</p>
                                    <p className="text-xs text-slate-400 font-medium">- {internalNotes[0].author ?? "Sistema"} ({internalNotes[0].createdAt ? new Date(internalNotes[0].createdAt).toLocaleDateString() : "Sin fecha"})</p>
                                </>
                            ) : (
                                <p className="text-slate-700">Sin notas</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* BARRA LATERAL (Acciones y Pagos) */}
                <div className="xl:col-span-4 space-y-6">
                    {/* Acciones Rápidas */}
                    <div className="bg-white rounded-xl border border-slate-300 card-shadow p-6">
                        <h3 className="text-base font-bold text-slate-900 mb-4">Acciones rápidas</h3>
                        <div className="space-y-2">
                            {status === "Pending" ? (
                                <button className="w-full min-h-11 bg-amber-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-amber-700 transition-colors shadow-sm">
                                    <span className="material-symbols-outlined text-[20px]">payments</span> Registrar Pago
                                </button>
                            ) : (
                                <Button
                                    disabled={status === 'Pendiente' || status === 'Finalizada' ? true : false}
                                    onClick={status === 'Reservada' ? checkin : checkout}
                                    className="w-full min-h-11 bg-slate-950 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[20px]">login</span>
                                    {status === 'Reservada' ? 'Procesar Check-in' : status === 'Hospedado' ? 'Procesar Check-out' : status === 'Finalizada' ? 'Finalizada' : 'Procesar Check-in (Depósito faltante)'}
                                </Button>
                            )}
                            <Link href={`/bd/reservaciones/${id}/pagos`} className="w-full min-h-11 bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">edit</span> Gestionar pagos
                            </Link>
                            <button
                                type="button"
                                onClick={handleGenerarFactura}
                                className="w-full min-h-11 bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">receipt_long</span> Generar factura
                            </button>
                            {/*<button className="w-full min-h-11 text-red-600 hover:bg-red-50 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors mt-4">
                                <span className="material-symbols-outlined text-[20px]">cancel</span> Cancelar reserva
                            </button>*/}
                        </div>
                    </div>

                    {/* Resumen de Pago Mejorado con Abonos y Saldos */}
                    <div className="bg-white rounded-xl border border-slate-300 card-shadow p-6">
                        <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400">account_balance_wallet</span> Resumen de cuenta
                        </h3>

                        {/* Desglose de cargos */}
                        <div className="space-y-2.5 mb-4 text-sm">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal ({nights} noches × {formatLempiras(roomRate)})</span>
                                <span className="text-slate-900 font-medium">{formatLempiras(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Impuestos (15%)</span>
                                <span className="text-slate-900 font-medium">{formatLempiras(impuesto)}</span>
                            </div>
                            {extras > 0 ? (
                                <div className="flex justify-between text-slate-600">
                                    <span>Cargos adicionales</span>
                                    <span className="text-slate-900 font-medium">{formatLempiras(extras)}</span>
                                </div>
                            ) : null}
                            <div className="flex justify-between pt-2 border-t border-slate-100 font-semibold text-slate-900">
                                <span>Total de reserva</span>
                                <span>{formatLempiras(totalCargos)}</span>
                            </div>
                        </div>

                        {/* SECCIÓN DE ABONOS REALIZADOS */}
                        <div className="pt-3 border-t border-slate-200 space-y-2 text-sm bg-slate-50/50 -mx-6 px-6 py-3">
                            <div className="flex justify-between text-emerald-700 font-medium">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">check_circle</span> Total abonado
                                </span>
                                <span>{formatLempiras(amountPaid)}</span>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-200">
                                <span className="font-bold text-slate-900">Saldo pendiente</span>
                                <span className={`text-base font-bold px-2 py-0.5 rounded ${saldoPendiente > 0 ? "text-amber-700 bg-amber-50" : "text-emerald-700 bg-emerald-50"}`}>
                                    {formatLempiras(saldoPendiente)}
                                </span>
                            </div>
                        </div>

                        {/* Detalles de Garantía */}
                        <div className="mt-4 bg-slate-50 p-3 rounded-xl flex items-center gap-3 border border-slate-100 text-sm">
                            <span className="material-symbols-outlined text-slate-500">credit_card</span>
                            <div>
                                <p className="text-xs text-slate-400 font-medium">Método de garantía</p>
                                <p className="text-slate-800 font-medium">{payment?.guaranteeMethod || "No especificado"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Registro de actividad */}
                    <div className="bg-white rounded-xl border border-slate-300 card-shadow p-6">
                        <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400">history</span> Registro de actividad
                        </h3>
                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.75 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200 before:hidden md:before:block">
                            {activity && activity.length > 0 ? (
                                activity.map((a: { time?: string; text?: string }, i: number) => (
                                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-slate-300 bg-white text-slate-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                                        <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <p className="text-xs text-slate-400 mb-1 font-medium">{a.time ? new Date(a.time).toLocaleString() : "—"}</p>
                                            <p className="text-slate-700 text-xs">{a.text ?? "Sin detalle"}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-700 text-sm">Sin actividad</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}