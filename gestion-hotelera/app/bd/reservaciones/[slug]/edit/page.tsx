"use client";

import React, { useState, useEffect, use, useMemo } from "react";
import PageHeader from "@/components/pageheader";
import { toast } from "sonner";
import { getReserva, Reserva, registrarPago } from "@/functions/reservas";
import { usePagos, Pago } from "@/functions/pagos";
import Link from "next/link";

interface Props {
    params: Promise<{ slug: string }>;
}

export default function PagoReservaPage({ params }: Props) {
    const resolvedParams = use(params);
    const idNumero = parseInt(resolvedParams.slug, 10);

    // Estados de Datos
    const [reserva, setReserva] = useState<Reserva | null>(null);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);

    // Estados del Formulario
    const [tipoPago, setTipoPago] = useState<"parcial" | "completo">("parcial");
    const [metodoPago, setMetodoPago] = useState("Efectivo");
    const [monto, setMonto] = useState<number>(0);
    const [fecha, setFecha] = useState("");
    const [saldoPendiente, setSaldoPendiente] = useState<number>(0);

    // Asigna fecha inicial
    useEffect(() => {
        setFecha(new Date().toISOString().split("T")[0]);
    }, []);

    // Carga inicial de la reserva
    useEffect(() => {
        const cargarReserva = async () => {
            try {
                setCargando(true);
                if (!isNaN(idNumero)) {
                    const data = await getReserva(idNumero);
                    setReserva(data);
                    if (data) {
                        const total = data.total_pagar ?? 0;
                        const pagado = data.monto_pagado ?? 0;
                        setSaldoPendiente(total - pagado);
                    }
                }
            } catch (error) {
                console.error("Error cargando la reserva desde la API:", error);
            } finally {
                setCargando(false);
            }
        };
        cargarReserva();
    }, [idNumero]);

    // Hook de pagos registrados (se activa cuando reserva?.reserva_id existe)
    const { data: pagosApi, loading: pagosLoading, refetch: pagosRefetch } = usePagos(null, null, reserva?.reserva_id);
    const pagosData = useMemo(() => pagosApi || [], [pagosApi]);

    // Autocompletar monto si selecciona "Pago Completo"
    useEffect(() => {
        if (tipoPago === "completo") {
            setMonto(saldoPendiente);
        }
    }, [tipoPago, saldoPendiente]);

    // Guardar Pago
    const handleGuardarPago = async () => {
        if (!reserva || monto <= 0) {
            toast.error("Por favor ingresa un monto válido mayor a L. 0.00");
            return;
        }

        if (monto > saldoPendiente) {
            toast.error(`El monto ingresado (L. ${monto}) supera el saldo pendiente (L. ${saldoPendiente}).`);
            return;
        }

        try {
            setGuardando(true);
            await registrarPago(reserva.reserva_id!, metodoPago, monto);

            // Actualizamos estado local
            const nuevoSaldo = saldoPendiente - monto;
            setSaldoPendiente(nuevoSaldo);
            setMonto(0);
            setTipoPago("parcial");

            // Refrescar historial
            await pagosRefetch();
            toast.success("¡Pago registrado correctamente!");
        } catch (err) {
            console.error("Error al registrar pago:", err);
            toast.error("Ocurrió un error al intentar registrar el pago.");
        } finally {
            setGuardando(false);
        }
    };

    // Cálculo de Porcentaje de Pago
    const totalPagar = (reserva?.cantidad_unidades ?? 0) * (reserva?.precio_unidad ?? 0) || (reserva?.total_pagar ?? 0);
    const montoPagado = totalPagar - saldoPendiente;
    const porcentajePagado = totalPagar > 0 ? Math.min(100, Math.round((montoPagado / totalPagar) * 100)) : 0;

    // Formatting Helper
    const formatLempiras = (val: number) =>
        `L. ${val.toLocaleString("es-HN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // ==========================================
    // ESTADOS DE CARGA Y ERROR
    // ==========================================

    // Muestra pantalla de carga si:
    // 1. Está cargando la reserva (cargando === true)
    // 2. O si ya tenemos reserva pero el hook de pagos aún está descargando su información
    const estaCargando = cargando || (!!reserva?.reserva_id && pagosLoading);

    if (estaCargando) {
        return (
            <div className="flex flex-col justify-center items-center h-96 gap-3">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium text-sm">Cargando expediente de pago...</p>
            </div>
        );
    }

    if (!reserva || Object.keys(reserva).length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl">search_off</span>
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-bold text-slate-800">Reserva no encontrada</h3>
                    <p className="text-sm text-slate-500">No existe ninguna reservación asociada al ID #{idNumero}.</p>
                </div>
                <Link
                    href="/bd/reservaciones"
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-all"
                >
                    Regresar a la lista
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 pb-12">
            {/* HEADER DE LA PÁGINA */}
            <PageHeader
                name="Gestión de Pagos"
                subtitle={`Registro y control financiero para la reserva #${reserva.reserva_id}`}
                buttons={
                    <Link
                        href="/bd/reservaciones"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Volver a la lista
                    </Link>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ==========================================
            COLUMNA IZQUIERDA: RESUMEN Y HUÉSPED
           ========================================== */}
                <div className="lg:col-span-1 flex flex-col gap-6">

                    {/* Tarjeta 1: Detalles del Huésped */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Información General</span>
                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                Reserva #{reserva.reserva_id}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-lg border border-slate-200">
                                {reserva.nombres?.charAt(0)}{reserva.apellidos?.charAt(0)}
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-slate-800 leading-snug">
                                    {reserva.nombres} {reserva.apellidos}
                                </h4>
                                <p className="text-xs text-slate-500">Huésped Principal</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Habitación / Espacio</span>
                                <span className="text-sm font-bold text-slate-700 flex items-center gap-1 mt-0.5">
                                    <span className="material-symbols-outlined text-slate-400 text-sm">bed</span>
                                    {reserva.numero_espacio || "N/A"}
                                </span>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Estado Cuenta</span>
                                <span className={`text-sm font-bold flex items-center gap-1 mt-0.5 ${saldoPendiente === 0 ? "text-emerald-600" : "text-amber-600"}`}>
                                    <span className="material-symbols-outlined text-sm">
                                        {saldoPendiente === 0 ? "check_circle" : "pending_actions"}
                                    </span>
                                    {saldoPendiente === 0 ? "Pagado" : "Pendiente"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta 2: Balance Financiero y Progreso */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-600">account_balance_wallet</span>
                            Estado de Cuenta
                        </h3>

                        {/* Barra de Progreso */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold">
                                <span className="text-slate-500">Progreso de Pago</span>
                                <span className="text-blue-600">{porcentajePagado}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-blue-600 h-full transition-all duration-500 rounded-full"
                                    style={{ width: `${porcentajePagado}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Total Hospedaje:</span>
                                <span className="font-semibold text-slate-800">{formatLempiras(totalPagar)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Monto Abonado:</span>
                                <span className="font-semibold text-emerald-600">{formatLempiras(montoPagado)}</span>
                            </div>
                            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                                <span className="text-sm font-bold text-slate-700">Saldo Pendiente:</span>
                                <span className={`text-xl font-extrabold ${saldoPendiente > 0 ? "text-red-600" : "text-emerald-600"}`}>
                                    {formatLempiras(saldoPendiente)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta 3: Acciones Rápidas */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Acciones Adicionales</span>
                        <div className="grid grid-cols-1 gap-2">
                            <button className="flex items-center gap-3 p-2.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-100/80 hover:text-slate-900 border border-slate-200 rounded-xl transition-all text-left shadow-2xs">
                                <span className="material-symbols-outlined text-slate-500 text-lg">receipt_long</span>
                                Generar Factura / Recibo
                            </button>
                            <button className="flex items-center gap-3 p-2.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-100/80 hover:text-slate-900 border border-slate-200 rounded-xl transition-all text-left shadow-2xs">
                                <span className="material-symbols-outlined text-slate-500 text-lg">add_shopping_cart</span>
                                Agregar Consumo Extra
                            </button>
                        </div>
                    </div>
                </div>

                {/* ==========================================
            COLUMNA DERECHA: FORMULARIO O RESERVA LIQUIDADA
           ========================================== */}
                <div className="lg:col-span-2 space-y-6">
                    {saldoPendiente > 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="border-b border-slate-100 p-5 bg-slate-50/50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-slate-800">Registrar Nuevo Abono</h3>
                                    <p className="text-xs text-slate-500">Ingresa los detalles de la transacción efectuada por el cliente.</p>
                                </div>
                                <span className="material-symbols-outlined text-slate-400">payments</span>
                            </div>

                            <div className="p-6 space-y-6">

                                {/* Selector Tipo de Pago */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 block">
                                        Modalidad de Cobro
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setTipoPago("parcial")}
                                            className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border font-medium text-sm transition-all ${tipoPago === "parcial"
                                                ? "border-blue-600 bg-blue-50/60 text-blue-700 font-bold shadow-xs"
                                                : "border-slate-200 hover:bg-slate-50 text-slate-600"
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-lg">pie_chart</span>
                                            Pago Parcial (Abono)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setTipoPago("completo")}
                                            className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border font-medium text-sm transition-all ${tipoPago === "completo"
                                                ? "border-emerald-600 bg-emerald-50/60 text-emerald-700 font-bold shadow-xs"
                                                : "border-slate-200 hover:bg-slate-50 text-slate-600"
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-lg">task_alt</span>
                                            Liquidación Completa
                                        </button>
                                    </div>
                                </div>

                                {/* Campos Formulario */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Método de Pago */}
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                                            Método de Pago
                                        </label>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                            value={metodoPago}
                                            onChange={(e) => setMetodoPago(e.target.value)}
                                        >
                                            <option value="Efectivo">Efectivo</option>
                                            <option value="Transferencia">Transferencia Bancaria</option>
                                            <option value="Tarjeta">Tarjeta de Crédito / Débito</option>
                                            <option value="Deposito">Depósito Bancario</option>
                                        </select>
                                    </div>

                                    {/* Fecha */}
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                                            Fecha del Registro
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                            value={fecha}
                                            onChange={(e) => setFecha(e.target.value)}
                                        />
                                    </div>

                                    {/* Campo Monto */}
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                                            Monto a Ingresar
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">L.</span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                disabled={tipoPago === "completo"}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 text-2xl font-extrabold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all disabled:bg-slate-100 disabled:text-slate-500"
                                                placeholder="0.00"
                                                value={monto || ""}
                                                onChange={(e) => setMonto(Number(e.target.value))}
                                            />
                                        </div>

                                        {/* Feedback Dinámico del Saldo Restante */}
                                        {monto > 0 && tipoPago === "parcial" && (
                                            <div className="mt-2 text-xs flex justify-between items-center text-slate-500 px-1">
                                                <span>Nuevo saldo pendiente estimado:</span>
                                                <span className="font-bold text-slate-700">
                                                    {formatLempiras(Math.max(0, saldoPendiente - monto))}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Botón de Submit */}
                                <button
                                    type="button"
                                    disabled={guardando || monto <= 0}
                                    onClick={handleGuardarPago}
                                    className="flex w-full items-center justify-center gap-2 rounded-[2.5rem] bg-slate-950 px-5 py-3 text-[14px] font-semibold leading-4 tracking-wider text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {guardando ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Registrando movimiento...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-lg">save</span>
                                            Confirmar y Registrar Pago
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Vista Estado Liquidado Completo */
                        <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200/80 p-8 text-center space-y-4 shadow-xs">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                <span className="material-symbols-outlined text-3xl font-bold">verified</span>
                            </div>
                            <div className="max-w-md mx-auto space-y-1">
                                <h3 className="text-lg font-bold text-emerald-900">Reserva Totalmente Pagada</h3>
                                <p className="text-xs text-emerald-700 leading-relaxed">
                                    Esta cuenta no presenta ningún saldo pendiente. Puedes consultar el historial completo de transacciones en la tabla inferior.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ==========================================
            SECCIÓN INFERIOR: HISTORIAL DE PAGOS
           ========================================== */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Historial Transaccional</h3>
                            <p className="text-xs text-slate-400">Registros de pagos asociados a esta reserva</p>
                        </div>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-200/60 px-2.5 py-1 rounded-full">
                            {pagosData.length} {pagosData.length === 1 ? "Registro" : "Registros"}
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50/80 text-slate-400 font-bold uppercase text-[11px] tracking-wider border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3.5">ID Pago</th>
                                    <th className="px-6 py-3.5">Fecha de Cobro</th>
                                    <th className="px-6 py-3.5">Método de Pago</th>
                                    <th className="px-6 py-3.5">Monto Recibido</th>
                                    <th className="px-6 py-3.5 text-right">Comprobante</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {pagosLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-xs">
                                            Cargando historial de pagos...
                                        </td>
                                    </tr>
                                ) : pagosData.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                            <span className="material-symbols-outlined text-3xl text-slate-300 block mb-1">
                                                receipt_long
                                            </span>
                                            <p className="text-xs">No hay abonados o pagos registrados para esta reserva todavía.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    pagosData.map((pago: Pago) => (
                                        <tr key={pago.pago_id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs font-medium text-slate-400">
                                                #{pago.pago_id}
                                            </td>
                                            <td className="px-6 py-4 text-slate-700 font-medium">
                                                {pago.fecha_pago || fecha}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                                                    <span className="material-symbols-outlined text-sm text-slate-400">payments</span>
                                                    {pago.metodo}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-emerald-600">
                                                {formatLempiras(Number(pago.monto))}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    title="Imprimir Recibo"
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-lg">print</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}