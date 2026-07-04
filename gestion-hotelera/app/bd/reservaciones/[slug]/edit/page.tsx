"use client";

import React, { useState, useEffect, use } from "react";
import PageHeader from "@/components/pageheader";
import { getReserva, Reserva, registrarPago } from "@/functions/reservas";
import Link from "next/link";

interface Props {
    params: Promise<{ slug: string }>; // 2. Actualizamos la interfaz indicando que es una Promise
}

export default function PagoReservaPage({ params }: Props) {
    const resolvedParams = use(params);
    const idNumero = parseInt(resolvedParams.slug, 10);

    // Estado para guardar la reserva real de la base de datos
    const [reserva, setReserva] = useState<Reserva | null>(null);
    const [cargando, setCargando] = useState(true);

    // Estados del formulario
    const [tipoPago, setTipoPago] = useState<"parcial" | "completo">("parcial");
    const [metodoPago, setMetodoPago] = useState("Efectivo");
    const [monto, setMonto] = useState<number>(0);
    const [fecha, setFecha] = useState("");

    // Asigna la fecha real en el cliente
    useEffect(() => {
        setFecha(new Date().toISOString().split("T")[0]);
    }, []);

    // Carga la reserva de la BD al montar el componente
    useEffect(() => {
        const cargarReserva = async () => {
            try {
                if (!isNaN(idNumero)) {
                    const data = await getReserva(idNumero);
                    console.log("Datos recibidos de la API:", data); // Imprimimos 'data', no 'reserva'
                    setReserva(data);
                }
            } catch (error) {
                console.error("Error cargando la reserva desde la API:", error);
            } finally {
                setCargando(false);
            }
        };
        cargarReserva();
    }, [idNumero]);

    // Al cambiar a "Pago Completo", se autocompleta con el saldo pendiente de la BD
    useEffect(() => {
        if (tipoPago === "completo" && reserva) {
            setMonto(reserva.saldo_pendiente); // <-- CORREGIDO: Usar 'reserva'
        }
    }, [tipoPago, reserva]);

    const handleGuardarPago = async () => {
        if (!reserva) return;

        const pago = await registrarPago(reserva!.reserva_id!, metodoPago, monto);
        alert("Pago registrado correctamente");
    };

    // ==========================================
    // GUARDIANES DE RENDERIZADO
    // ==========================================
    if (cargando) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50">
                <p className="text-slate-600 font-medium animate-pulse">Cargando datos de la reserva...</p>
            </div>
        );
    }

    // Si la API respondió un objeto vacío, null o undefined
    if (!reserva || Object.keys(reserva).length === 0) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50">
                <p className="text-red-500 font-medium">No se encontró ninguna reserva con el ID {idNumero}.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                name="Gestión de Pagos"
                subtitle={`Registro de pago para la reserva ${reserva.reserva_id}`}
                buttons={
                    <Link
                        href="/bd/reservaciones"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-md">arrow_back</span>
                        Volver a lista
                    </Link>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* COLUMNA IZQUIERDA: Resumen de Cuenta */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-5">
                        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-500">info</span>
                            Detalles del Huésped
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-slate-400 block">Huésped</label>
                                <p className="text-sm font-semibold text-slate-700">{reserva?.nombres + " " + reserva?.apellidos}</p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 block">Habitación</label>
                                <p className="text-sm font-semibold text-slate-700">{reserva?.numero_espacio}</p>
                            </div>
                            <div className="pt-3 border-t border-slate-100">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-slate-500">Total Reserva:</span>
                                    <span className="text-sm font-bold text-slate-800">L. {(reserva!.cantidad_unidades! * reserva!.precio_unidad!).toLocaleString('es-HN')}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">Saldo Pendiente:</span>
                                    <span className="text-lg font-black text-red-600">L. {(reserva!.total_pagar! - reserva!.monto_pagado!).toLocaleString('es-HN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Otras Opciones Rápidas */}
                    <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-5">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Opciones Adicionales</h3>
                        <div className="grid grid-cols-1 gap-2">
                            <button className="flex items-center gap-3 p-2 text-sm text-slate-600 hover:bg-white hover:shadow-sm rounded-lg transition-all text-left">
                                <span className="material-symbols-outlined text-slate-400">receipt_long</span>
                                Generar Factura
                            </button>
                            <button className="flex items-center gap-3 p-2 text-sm text-slate-600 hover:bg-white hover:shadow-sm rounded-lg transition-all text-left">
                                <span className="material-symbols-outlined text-slate-400">add_shopping_cart</span>
                                Cargar consumos extra
                            </button>
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA: Formulario de Registro */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden">
                        <div className="border-b border-slate-100 p-5 bg-slate-50/50">
                            <h3 className="text-sm font-bold text-slate-800">Registrar Nuevo Movimiento</h3>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Selección de Tipo de Pago */}
                            <div className="md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Tipo de Registro</label>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setTipoPago("parcial")}
                                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${tipoPago === "parcial" ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm" : "border-slate-200 text-slate-500"}`}
                                    >
                                        <span className="material-symbols-outlined">payments</span>
                                        <span className="text-sm font-medium">Pago Parcial</span>
                                    </button>
                                    <button
                                        onClick={() => setTipoPago("completo")}
                                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${tipoPago === "completo" ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : "border-slate-200 text-slate-500"}`}
                                    >
                                        <span className="material-symbols-outlined">check_circle</span>
                                        <span className="text-sm font-medium">Pago Completo</span>
                                    </button>
                                </div>
                            </div>

                            {/* Método de Pago */}
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Método de Pago</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    value={metodoPago}
                                    onChange={(e) => setMetodoPago(e.target.value)}
                                >
                                    <option>Efectivo</option>
                                    <option>Transferencia</option>
                                    <option>Deposito</option>
                                </select>
                            </div>

                            {/* Fecha */}
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Fecha de Cobro</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                />
                            </div>

                            {/* Monto */}
                            <div className="md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Monto a Recibir (Lempiras)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">L.</span>
                                    <input
                                        type="number"
                                        disabled={tipoPago === "completo"}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-xl font-bold text-slate-800 outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-70"
                                        placeholder="0.00"
                                        value={monto}
                                        onChange={(e) => setMonto(Number(e.target.value))}
                                    />
                                </div>
                                {tipoPago === "completo" && (
                                    <p className="text-[11px] text-emerald-600 mt-2 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">info</span>
                                        El monto se ha ajustado automáticamente para liquidar el saldo.
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2 pt-4">
                                <button
                                    onClick={handleGuardarPago}
                                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">save</span>
                                    Confirmar y Registrar Pago
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Historial de Pagos de esta reserva */}
                    <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Fecha</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Método</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Monto</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-slate-600">01/07/2026</td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">Transferencia</td>
                                    <td className="px-6 py-4 font-bold text-emerald-600">L. 2,500.00</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-blue-500 transition-colors">
                                            <span className="material-symbols-outlined text-md">print</span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}