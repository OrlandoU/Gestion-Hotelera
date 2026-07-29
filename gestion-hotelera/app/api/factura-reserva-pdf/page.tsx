'use client';

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logo.png";

interface ReservaPdfData {
    reserva_id?: number | string;
    nombres?: string;
    apellidos?: string;
    email_huesped?: string;
    telefono_huesped?: string;
    numero_espacio?: string;
    fecha_entrada?: string;
    fecha_salida?: string;
    cantidad_unidades?: number;
    precio_unidad?: number;
    total_pagar?: number;
    monto_pagado?: number;
    reserva_estado?: string;
    numero_reserva?: string;
    [key: string]: unknown;
}

interface PagoPdfData {
    pago_id?: number | string;
    fecha_pago?: string;
    metodo?: string;
    monto?: number;
    [key: string]: unknown;
}

export default function Page() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-slate-100 text-xs text-slate-500 font-medium">
                Cargando factura…
            </div>
        }>
            <FacturaReservaPdfContent />
        </Suspense>
    );
}

function FacturaReservaPdfContent() {
    const searchParams = useSearchParams();

    const reservaParam = searchParams.get("reserva") || "";
    const pagosParam = searchParams.get("pagos") || "";

    const reserva = useMemo<ReservaPdfData | null>(() => {
        if (!reservaParam) return null;
        try {
            return JSON.parse(decodeURIComponent(reservaParam));
        } catch {
            return null;
        }
    }, [reservaParam]);

    const pagos = useMemo<PagoPdfData[]>(() => {
        if (!pagosParam) return [];
        try {
            const parsed = JSON.parse(decodeURIComponent(pagosParam));
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }, [pagosParam]);

    const formatFecha = (value?: string) => {
        if (!value) return "—";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return date.toLocaleDateString("es-HN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatFechaHora = (value?: string) => {
        if (!value) return "—";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return date.toLocaleString("es-HN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatMoneda = (value?: number | null) =>
        new Intl.NumberFormat("es-HN", {
            style: "currency",
            currency: "HNL",
            maximumFractionDigits: 2,
        }).format(Number(value ?? 0));

    const totalPagar = Number(reserva?.total_pagar ?? 0);
    const montoPagado = Number(reserva?.monto_pagado ?? 0);
    const saldoPendiente = Math.max(0, totalPagar - montoPagado);
    const noches = Number(reserva?.cantidad_unidades ?? 1);
    const precioUnidad = Number(reserva?.precio_unidad ?? totalPagar);
    const subtotal = noches > 0 && precioUnidad > 0 ? noches * precioUnidad : totalPagar;
    const pagosTotal = pagos.reduce((acc, pago) => acc + Number(pago.monto ?? 0), 0);

    const fechaEmitido = new Date().toLocaleDateString("es-HN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 text-slate-900 antialiased print:bg-white print:p-0">
            <div className="w-full max-w-3xl rounded-none border border-slate-200 bg-white p-8 shadow-sm print:border-none print:shadow-none text-xs font-sans">

                {/* Encabezado Principal */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-8">
                    <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-blue-50 p-2">
                            <Image fill alt="Hotel San Pedro Logo" className="object-contain" src={logo} priority />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900">Hotel San Pedro</h1>
                            <p className="text-[11px] text-slate-500 mt-0.5">Hospitalidad y comodidad</p>
                            <p className="text-[11px] text-slate-500">San Pedro Sula, Honduras</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Factura comercial</h2>
                        <div className="mt-2 space-y-1 text-[11px]">
                            <div className="flex justify-end gap-4">
                                <span className="text-slate-400">Factura no.:</span>
                                <span className="font-semibold text-slate-700">#{reserva?.reserva_id ?? "001"}</span>
                            </div>
                            <div className="flex justify-end gap-4">
                                <span className="text-slate-400">Fecha de factura:</span>
                                <span className="font-semibold text-slate-700">{fechaEmitido}</span>
                            </div>
                            <div className="flex justify-end gap-4">
                                <span className="text-slate-400">Vence:</span>
                                <span className="font-semibold text-slate-700">{formatFecha(reserva?.fecha_salida)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secciones From / Bill to / Ship to */}
                <div className="grid grid-cols-3 gap-8 py-6 text-[11px] border-b border-slate-100">
                    <div>
                        <p className="font-bold text-slate-900 uppercase tracking-wider mb-2">De</p>
                        <p className="font-bold text-slate-800 text-sm">Hotel San Pedro</p>
                        <p className="text-slate-600 mt-1">Recepción principal</p>
                        <p className="text-slate-600">+504 3233-6742</p>
                        <p className="text-slate-600">reservas@hotelsanpedro.com</p>
                        <p className="text-slate-600">Avenida Circunvalación, San Pedro Sula</p>
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 uppercase tracking-wider mb-2">Facturar a</p>
                        <p className="font-bold text-slate-800 text-sm">{reserva?.nombres || "Huésped"} {reserva?.apellidos || ""}</p>
                        <p className="text-slate-600 mt-1">{reserva?.email_huesped || "correo@huesped.com"}</p>
                        <p className="text-slate-600">{reserva?.telefono_huesped || "—"}</p>
                        <p className="text-slate-600">Ref: {reserva?.numero_reserva || `#${reserva?.reserva_id ?? "—"}`}</p>
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 uppercase tracking-wider mb-2">Hospedaje</p>
                        <p className="text-slate-800">Espacio asignado: <span className="font-semibold">{reserva?.numero_espacio || "—"}</span></p>
                        <p className="text-slate-600 mt-1">Check-in: {formatFecha(reserva?.fecha_entrada)}</p>
                        <p className="text-slate-600">Check-out: {formatFecha(reserva?.fecha_salida)}</p>
                        <p className="text-slate-600 mt-1">Ref. #: RES-{reserva?.reserva_id ?? "000"}</p>
                    </div>
                </div>

                {/* Tabla de Artículos / Estadía */}
                <div className="mt-6 overflow-hidden">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-[#5f03bb] text-white text-[11px] uppercase tracking-wider">
                                <th className="py-2.5 px-4 text-left font-semibold rounded-l-md">Descripción</th>
                                <th className="py-2.5 px-4 text-right font-semibold">Tarifa, c/u</th>
                                <th className="py-2.5 px-4 text-center font-semibold">Cant.</th>
                                <th className="py-2.5 px-4 text-right font-semibold rounded-r-md">Monto, c/u</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[11px]">
                            <tr className="bg-slate-50/50">
                                <td className="py-3 px-4">
                                    <p className="font-bold text-slate-900">Estadía en Espacio {reserva?.numero_espacio || "—"}</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">Reservación de habitación/espacio por {noches} noche(s) del {formatFecha(reserva?.fecha_entrada)} al {formatFecha(reserva?.fecha_salida)}.</p>
                                </td>
                                <td className="py-3 px-4 text-right text-slate-700">{formatMoneda(precioUnidad)}</td>
                                <td className="py-3 px-4 text-center text-slate-700">{noches}</td>
                                <td className="py-3 px-4 text-right font-bold text-slate-900">{formatMoneda(subtotal)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Sección Inferior: Instrucciones de Pago y Totales */}
                <div className="mt-8 grid grid-cols-2 gap-12 pt-6 border-t border-slate-100">
                    <div>
                        <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">Instrucciones de pago</h3>
                        <div className="space-y-3 text-[11px] text-slate-600">
                            <div>
                                <p className="font-semibold text-slate-800">Pago en línea</p>
                                <p>pay@hotelsanpedro.com</p>
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800">Hacer los cheques pagaderos a</p>
                                <p>Hotel San Pedro S.A.</p>
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800">Transferencia bancaria</p>
                                <p>Ruta (ABA): 061120084 (Banco Atlántida)</p>
                            </div>
                        </div>

                        {/* Historial de pagos integrados */}
                        <div className="mt-6">
                            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] mb-2">Historial de pagos recientes</h4>
                            {pagos.length > 0 ? (
                                <ul className="space-y-1 text-[10px] text-slate-600">
                                    {pagos.map((pago, index) => (
                                        <li key={pago.pago_id ?? index} className="flex justify-between border-b border-slate-100 pb-1">
                                            <span>{formatFechaHora(pago.fecha_pago)} ({pago.metodo || "Efectivo"})</span>
                                            <span className="font-semibold text-slate-900">{formatMoneda(pago.monto)}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-[10px] text-slate-400 italic">No hay pagos registrados adicionales.</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="space-y-2 text-[11px]">
                            <div className="flex justify-between py-1">
                                <span className="text-slate-500">Subtotal:</span>
                                <span className="font-semibold text-slate-900">{formatMoneda(subtotal * .85)}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-slate-500">Descuento (0%):</span>
                                <span className="font-semibold text-slate-900">{formatMoneda(0)}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-slate-500">Impuestos:</span>
                                <span className="font-semibold text-slate-900">{formatMoneda(totalPagar*0.15)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-t border-slate-200 text-sm">
                                <span className="font-bold text-slate-900">Total:</span>
                                <span className="font-bold text-slate-900">{formatMoneda(totalPagar || subtotal)}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-slate-500">Monto pagado:</span>
                                <span className="font-semibold text-slate-900">{formatMoneda(montoPagado > 0 ? montoPagado : pagosTotal)}</span>
                            </div>
                            <div className="flex justify-between py-3 px-4 bg-slate-100 rounded-lg text-sm mt-2">
                                <span className="font-bold text-slate-900">Saldo pendiente:</span>
                                <span className="font-bold text-blue-600">{formatMoneda(saldoPendiente)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notas y Firma */}
                <div className="mt-12 pt-6 border-t border-slate-100 flex justify-between items-end">
                    <div className="max-w-md">
                        <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px] mb-1">Notas</p>
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                            Gracias por su preferencia. Esta factura comercial refleja el estado de cuenta actual de la reserva en Hotel San Pedro. Conserve este documento para cualquier aclaración o salida.
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="h-16 w-36 relative inline-block">
                            {/* Simulación de firma estilizada */}
                            <svg className="absolute inset-0 w-full h-full text-blue-500 opacity-80" viewBox="0 0 150 50" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10 35 C 30 10, 40 40, 60 20 C 80 0, 90 30, 110 15 C 120 10, 130 25, 140 20" />
                            </svg>
                        </div>
                        <p className="text-[10px] font-semibold text-slate-400 border-t border-slate-200 pt-1">Firma autorizada</p>
                    </div>
                </div>

            </div>
        </div>
    );
}