"use client";

import React, { useState, useEffect, use } from "react";
import PageHeader from "@/components/pageheader";
import { getReserva, Reserva } from "@/functions/reservas";
import Link from "next/link";

interface Props {
    params: Promise<{ slug: string }>;
}

export default function CheckInReservaPage({ params }: Props) {
    const resolvedParams = use(params);
    const idNumero = parseInt(resolvedParams.slug, 10);

    // Estados de Carga y Reserva
    const [reserva, setReserva] = useState<Reserva | null>(null);
    const [cargando, setCargando] = useState(true);
    const [procesando, setProcesando] = useState(false);
    const [checkInRealizado, setCheckInRealizado] = useState(false);

    // Formulario de Check-In
    const [tipoDocumento, setTipoDocumento] = useState("DNI");
    const [documentoIdentidad, setDocumentoIdentidad] = useState("");
    const [numeroLlave, setNumeroLlave] = useState("");
    const [depositoGarantia, setDepositoGarantia] = useState<number>(0);
    const [observaciones, setObservaciones] = useState("");

    // Lista de Huéspedes Acompañantes
    const [acompanantes, setAcompanantes] = useState<string[]>([]);
    const [nuevoAcompanante, setNuevoAcompanante] = useState("");

    // Cargar Reserva
    useEffect(() => {
        const cargarReserva = async () => {
            try {
                setCargando(true);
                if (!isNaN(idNumero)) {
                    const data = await getReserva(idNumero);
                    setReserva(data);
                    if (data?.identificacion) {
                        setDocumentoIdentidad(data.identificacion);
                    }
                    if (data?.estado_reserva === "checked_in" || data?.checkin_completado) {
                        setCheckInRealizado(true);
                    }
                }
            } catch (error) {
                console.error("Error al cargar la reserva:", error);
            } finally {
                setCargando(false);
            }
        };
        cargarReserva();
    }, [idNumero]);

    // Manejadores para acompañantes
    const handleAgregarAcompanante = () => {
        if (nuevoAcompanante.trim()) {
            setAcompanantes([...acompanantes, nuevoAcompanante.trim()]);
            setNuevoAcompanante("");
        }
    };

    const handleEliminarAcompanante = (index: number) => {
        setAcompanantes(acompanantes.filter((_, i) => i !== index));
    };

    // Procesar Check-in
    const handleProcesarCheckIn = async () => {
        if (!documentoIdentidad.trim()) {
            alert("Por favor confirma o ingresa el número de documento de identidad.");
            return;
        }

        try {
            setProcesando(true);
            // Aquí conectarías con tu Server Action o API endpoint de Check-In
            // await registrarCheckIn({ reservaId: reserva?.reserva_id, documentoIdentidad, numeroLlave, depositoGarantia, acompanantes, observaciones });

            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulación API

            setCheckInRealizado(true);
            alert("¡Check-in registrado con éxito! La habitación está oficialmente ocupada.");
        } catch (error) {
            console.error("Error al procesar Check-in:", error);
            alert("Ocurrió un error al procesar el Check-in.");
        } finally {
            setProcesando(false);
        }
    };

    // Cálculos Financieros
    const totalPagar = (reserva?.cantidad_unidades ?? 0) * (reserva?.precio_unidad ?? 0) || (reserva?.total_pagar ?? 0);
    const montoPagado = reserva?.monto_pagado ?? 0;
    const saldoPendiente = Math.max(0, totalPagar - montoPagado);

    const formatLempiras = (val: number) =>
        `L. ${val.toLocaleString("es-HN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // ==========================================
    // ESTADOS DE CARGA Y NO ENCONTRADO
    // ==========================================
    if (cargando) {
        return (
            <div className="flex flex-col justify-center items-center h-96 gap-3">
                <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium text-sm">Preparando expediente para Check-in...</p>
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
                    <p className="text-sm text-slate-500">No se pudo encontrar la reservación #{idNumero}.</p>
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
        <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
            {/* HEADER DE LA PÁGINA */}
            <PageHeader
                name="Procesar Check-in"
                subtitle={`Registro de llegada y entrega de llave para la reserva #${reserva.reserva_id}`}
                buttons={
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/bd/reservaciones/${reserva.reserva_id}/pago`}
                            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-all"
                        >
                            <span className="material-symbols-outlined text-base">payments</span>
                            Ver Pagos
                        </Link>
                        <Link
                            href="/bd/reservaciones"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs"
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            Volver
                        </Link>
                    </div>
                }
            />

            {/* ADVERTENCIA SI TIENE SALDO PENDIENTE */}
            {saldoPendiente > 0 && !checkInRealizado && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined">warning</span>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-amber-900">Saldo pendiente de pago</h4>
                            <p className="text-xs text-amber-700">
                                La reserva tiene un saldo pendiente de <span className="font-bold">{formatLempiras(saldoPendiente)}</span>. Puedes recaudarlo antes o después de confirmar el Check-in.
                            </p>
                        </div>
                    </div>
                    <Link
                        href={`/bd/reservaciones/${reserva.reserva_id}/pago`}
                        className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-xs"
                    >
                        <span className="material-symbols-outlined text-sm">add_card</span>
                        Cobrar Saldo
                    </Link>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ==========================================
                    COLUMNA IZQUIERDA: TARJETAS INFORMATIVAS
                   ========================================== */}
                <div className="lg:col-span-1 flex flex-col gap-6">

                    {/* Tarjeta 1: Huésped Principal */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Huésped Principal</span>
                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
                                ID #{reserva.reserva_id}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center font-bold text-lg border border-emerald-200">
                                {reserva.nombres?.charAt(0)}{reserva.apellidos?.charAt(0)}
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-slate-800 leading-snug">
                                    {reserva.nombres} {reserva.apellidos}
                                </h4>
                                <p className="text-xs text-slate-500">{reserva.telefono || "Sin teléfono registrado"}</p>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                            <div className="flex justify-between text-slate-600">
                                <span className="text-slate-400">Entrada (Check-in):</span>
                                <span className="font-semibold text-slate-800">{reserva.fecha_entrada || "Hoy"}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span className="text-slate-400">Salida (Check-out):</span>
                                <span className="font-semibold text-slate-800">{reserva.fecha_salida || "N/A"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta 2: Habitación Asignada */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-600">bed</span>
                                Espacio Asignado
                            </h3>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded border border-emerald-100 uppercase">
                                Lista / Limpia
                            </span>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                            <div>
                                <span className="text-xs text-slate-400 block font-medium">Habitación / Unidad</span>
                                <span className="text-xl font-extrabold text-slate-800">
                                    {reserva.numero_espacio || "Sin Asignar"}
                                </span>
                            </div>
                            <span className="material-symbols-outlined text-3xl text-slate-300">key</span>
                        </div>

                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between text-slate-600">
                                <span className="text-slate-400">Total Hospedaje:</span>
                                <span className="font-bold text-slate-800">{formatLempiras(totalPagar)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span className="text-slate-400">Estado de Pago:</span>
                                <span className={`font-bold ${saldoPendiente === 0 ? "text-emerald-600" : "text-amber-600"}`}>
                                    {saldoPendiente === 0 ? "100% Pagado" : `Pendiente: ${formatLempiras(saldoPendiente)}`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta 3: Acciones Rápidas */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Acciones Rápidas</span>
                        <div className="grid grid-cols-1 gap-2">
                            <Link
                                href={`/bd/reservaciones/${reserva.reserva_id}/pago`}
                                className="flex items-center gap-3 p-2.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-2xs"
                            >
                                <span className="material-symbols-outlined text-blue-600 text-lg">payments</span>
                                Procesar Cobro / Abono
                            </Link>
                            <button
                                type="button"
                                className="flex items-center gap-3 p-2.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all text-left shadow-2xs"
                            >
                                <span className="material-symbols-outlined text-slate-500 text-lg">print</span>
                                Imprimir Ficha de Registro
                            </button>
                        </div>
                    </div>

                </div>

                {/* ==========================================
                    COLUMNA DERECHA: FORMULARIO O CONFIRMACIÓN
                   ========================================== */}
                <div className="lg:col-span-2 space-y-6">

                    {!checkInRealizado ? (
                        /* FORMULARIO DE CHECK-IN */
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="border-b border-slate-100 p-5 bg-slate-50/50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-slate-800">Verificación e Ingreso</h3>
                                    <p className="text-xs text-slate-500">Confirma los datos del cliente y asignación para autorizar la entrada.</p>
                                </div>
                                <span className="material-symbols-outlined text-emerald-600">sensor_door</span>
                            </div>

                            <div className="p-6 space-y-6">

                                {/* SECCIÓN 1: DOCUMENTO DE IDENTIFICACIÓN */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-base text-slate-500">badge</span>
                                        1. Identificación del Huésped
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 mb-1 block">Tipo Documento</label>
                                            <select
                                                value={tipoDocumento}
                                                onChange={(e) => setTipoDocumento(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                            >
                                                <option value="DNI">DNI / Identidad</option>
                                                <option value="Pasaporte">Pasaporte</option>
                                                <option value="Licencia">Licencia de Conducir</option>
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="text-xs font-semibold text-slate-600 mb-1 block">Número de Documento</label>
                                            <input
                                                type="text"
                                                placeholder="Ej: 0801-1995-12345"
                                                value={documentoIdentidad}
                                                onChange={(e) => setDocumentoIdentidad(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* SECCIÓN 2: ENTREGA DE LLAVE Y DEPÓSITO */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-base text-slate-500">vpn_key</span>
                                        2. Llaves y Garantía
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 mb-1 block">
                                                Número / Código de Llave o Tarjeta
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Ej: Tarjeta #04 / Llave A-12"
                                                value={numeroLlave}
                                                onChange={(e) => setNumeroLlave(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 mb-1 block">
                                                Depósito en Garantía (Opcional)
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">L.</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder="0.00"
                                                    value={depositoGarantia || ""}
                                                    onChange={(e) => setDepositoGarantia(Number(e.target.value))}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* SECCIÓN 3: HUÉSPEDES ACOMPAÑANTES */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-base text-slate-500">group</span>
                                        3. Acompañantes Adicionales
                                    </h4>

                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Nombre completo del acompañante..."
                                            value={nuevoAcompanante}
                                            onChange={(e) => setNuevoAcompanante(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAgregarAcompanante())}
                                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 outline-none focus:bg-white focus:border-emerald-500 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAgregarAcompanante}
                                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-all flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-base">add</span>
                                            Agregar
                                        </button>
                                    </div>

                                    {acompanantes.length > 0 && (
                                        <ul className="space-y-2 pt-1">
                                            {acompanantes.map((nombre, idx) => (
                                                <li key={idx} className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/60 text-xs font-medium text-slate-700">
                                                    <span className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-slate-400 text-sm">person</span>
                                                        {nombre}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEliminarAcompanante(idx)}
                                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-base">close</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <hr className="border-slate-100" />

                                {/* SECCIÓN 4: OBSERVACIONES */}
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                                        Observaciones de Entrada / Requerimientos Especiales
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="Ej: Se entregó control de aire acondicionado, solicitó cobijas extra..."
                                        value={observaciones}
                                        onChange={(e) => setObservaciones(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none"
                                    ></textarea>
                                </div>

                                {/* BOTÓN DE PROCESAR CHECK-IN */}
                                <button
                                    type="button"
                                    disabled={procesando}
                                    onClick={handleProcesarCheckIn}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-4"
                                >
                                    {procesando ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Registrando entrada...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-lg">login</span>
                                            Confirmar y Procesar Check-in
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* VISTA ESTADO COMPLETADO */
                        <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200/80 p-8 text-center space-y-5 shadow-xs">
                            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                <span className="material-symbols-outlined text-4xl font-bold">check_circle</span>
                            </div>
                            <div className="max-w-md mx-auto space-y-2">
                                <h3 className="text-xl font-bold text-emerald-900">¡Huésped Hospedado Correctamente!</h3>
                                <p className="text-xs text-emerald-700 leading-relaxed">
                                    El Check-in para la reserva <span className="font-bold">#{reserva.reserva_id}</span> ha sido completado. La habitación <span className="font-bold">{reserva.numero_espacio}</span> se encuentra ocupada.
                                </p>
                            </div>

                            <div className="pt-4 flex justify-center gap-3">
                                <Link
                                    href="/bd/reservaciones"
                                    className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                                >
                                    Volver al listado
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setCheckInRealizado(false)}
                                    className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl transition-all"
                                >
                                    Editar Check-in
                                </button>
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}