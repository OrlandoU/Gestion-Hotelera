"use client";

import { useState, useEffect, ViewTransition } from "react";
import PageHeader from "@/components/pageheader";
import Link from "next/link";
import { getHabitacionesDisponibles, crearReserva, EspacioHabitacion } from "@/functions/reservas";

export default function CrearReservacion() {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedRoom, setSelectedRoom] = useState("");
    const [rooms, setRooms] = useState<EspacioHabitacion[]>([]);
    const [loadingRooms, setLoadingRooms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        nombres: "",
        apellidos: "",
        email: "",
        telefono: "",
        dni: "",
        fecha_entrada: "",
        fecha_salida: "",
        espacio_id: selectedRoom
    });

    const stepLabels = [
        "Fechas",
        "Habitación",
        "Huésped",
        "Confirmar"
    ];

    // Cálculos de fechas y precios
    const calculateNights = (start: string, end: string) => {
        if (!start || !end) return 0;
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = endDate.getTime() - startDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const nights = calculateNights(formData.fecha_entrada, formData.fecha_salida);
    const selectedRoomData = rooms.find((room: any) => room.numero_espacio === selectedRoom);
    const totalPrice = selectedRoomData ? (selectedRoomData.precio_unidad ||  0) * nights : 0;

    // Obtener la fecha de hoy en formato YYYY-MM-DD para restringir inputs
    const today = new Date().toISOString().split('T')[0];

    const isValidField = (name: string, value: string) => {
        if (!value.trim()) return false;
        switch (name) {
            case "email":
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            case "telefono":
                return value.replace(/\D/g, "").length >= 8;
            case "dni":
                return value.trim().length >= 5;
            default:
                return value.trim().length > 1;
        }
    };

    const getInputClasses = (name: string, value: string) => {
        const baseClasses = "w-full h-11 bg-slate-50 border rounded-lg px-4 text-slate-800 placeholder-slate-400 outline-none transition-all";
        if (value && isValidField(name, value)) {
            return `${baseClasses} border-emerald-400/70 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`;
        }
        return `${baseClasses} border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Al cambiar las fechas, resetear la habitación si ya se había pasado del paso 1
    useEffect(() => {
        if (currentStep === 1 && selectedRoom) {
            setSelectedRoom("");
        }
    }, [formData.fecha_entrada, formData.fecha_salida]);

    useEffect(() => {
        if (currentStep === 2 && formData.fecha_entrada && formData.fecha_salida) {
            const fetchRooms = async () => {
                setLoadingRooms(true);
                try {
                    const data = await getHabitacionesDisponibles(formData.fecha_entrada, formData.fecha_salida);
                    setRooms(data);
                } catch (error) {
                    console.error("Error al buscar habitaciones disponibles:", error);
                } finally {
                    setLoadingRooms(false);
                }
            };
            fetchRooms();
        }
    }, [currentStep, formData.fecha_entrada, formData.fecha_salida]);

    const handleConfirmReservation = async () => {
        if (!selectedRoomData) return;
        setIsSubmitting(true);
        try {
            await crearReserva({
                ...formData,
                espacio_id: selectedRoomData.espacio_id,
                // Puedes enviar el precio total si tu API lo requiere:
                // precio_total: totalPrice 
            });
            window.location.href = "/bd/reservaciones";
        } catch (error) {
            console.error("Error al enviar la reserva:", error);
            alert("Hubo un problema al procesar la reserva.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNextStep = () => {
        if (currentStep === 1) {
            if (!formData.fecha_entrada || !formData.fecha_salida) {
                alert("Por favor selecciona ambas fechas antes de continuar.");
                return;
            }
            if (nights <= 0) {
                alert("La fecha de salida debe ser posterior a la de entrada.");
                return;
            }
        }
        if (currentStep === 2 && !selectedRoom) {
            alert("Por favor selecciona una habitación disponible.");
            return;
        }
        if (currentStep === 3) {
            const requiredFields = ["nombres", "apellidos", "email", "telefono", "dni"];
            const hasErrors = requiredFields.some(field => !isValidField(field, formData[field as keyof typeof formData]));
            if (hasErrors) {
                alert("Por favor rellena correctamente todos los campos obligatorios del huésped.");
                return;
            }
        }
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const handlePrevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    return (
        <ViewTransition enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}>
            <div className="pb-12">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                    <Link className="hover:text-sky-600 font-medium transition-colors" href="/bd/reservaciones" transitionTypes={["nav-back"]}>Reservaciones</Link>
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    <span className="text-slate-800 font-semibold">Nueva reserva</span>
                </div>

                <PageHeader name="Crear nueva reservación" subtitle="Completa la información para procesar la estadía del huésped." buttons={null} />

                <div className="flex flex-col lg:flex-row gap-8 mt-6">
                    {/* Contenido Principal (Formulario) */}
                    <div className="flex-1 space-y-6">

                        {/* Stepper Header Mejorado */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <div className="flex items-center justify-between relative">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full -z-10"></div>
                                {/* Barra de progreso activa */}
                                <div
                                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-sky-500 rounded-full -z-10 transition-all duration-500 ease-in-out"
                                    style={{ width: `${((currentStep - 1) / (stepLabels.length - 1)) * 100}%` }}
                                ></div>

                                {stepLabels.map((label, idx) => {
                                    const stepNumber = idx + 1;
                                    const isCompleted = stepNumber < currentStep;
                                    const isCurrent = stepNumber === currentStep;

                                    return (
                                        <div key={idx} className="flex flex-col items-center gap-2 bg-white px-2">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-all duration-300 ${isCompleted ? 'bg-sky-500 text-white shadow-md' :
                                                    isCurrent ? 'bg-slate-900 text-white shadow-md ring-4 ring-slate-900/10' :
                                                        'bg-slate-100 text-slate-400'
                                                }`}>
                                                {isCompleted ? <span className="material-symbols-outlined text-[20px]">check</span> : stepNumber}
                                            </div>
                                            <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${isCurrent ? 'text-slate-900' :
                                                    isCompleted ? 'text-sky-600' : 'text-slate-400'
                                                }`}>
                                                {label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* PASO 1: Fechas */}
                        {currentStep === 1 && (
                            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sky-500">calendar_month</span>
                                    ¿Cuándo será la estadía?
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-slate-700" htmlFor="fecha_entrada">Fecha de entrada</label>
                                        <input
                                            className={getInputClasses("fecha_entrada", formData.fecha_entrada)}
                                            id="fecha_entrada"
                                            name="fecha_entrada"
                                            type="date"
                                            min={today}
                                            value={formData.fecha_entrada}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-slate-700" htmlFor="fecha_salida">Fecha de salida</label>
                                        <input
                                            className={getInputClasses("fecha_salida", formData.fecha_salida)}
                                            id="fecha_salida"
                                            name="fecha_salida"
                                            type="date"
                                            min={formData.fecha_entrada || today}
                                            value={formData.fecha_salida}
                                            onChange={handleInputChange}
                                            disabled={!formData.fecha_entrada}
                                        />
                                    </div>
                                </div>

                                {nights > 0 && (
                                    <div className="mt-6 p-4 bg-sky-50 rounded-xl border border-sky-100 flex items-center gap-3 text-sky-800">
                                        <span className="material-symbols-outlined">night_shelter</span>
                                        <p className="font-medium">La estadía será de <strong>{nights} noche{nights > 1 ? 's' : ''}</strong>.</p>
                                    </div>
                                )}

                                <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
                                    <button onClick={handleNextStep} className="h-11 px-6 rounded-xl bg-slate-900 text-white font-bold hover:bg-sky-600 hover:shadow-md transition-all flex items-center gap-2">
                                        Buscar habitaciones disponibles
                                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* PASO 2: Habitaciones */}
                        {currentStep === 2 && (
                            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                                <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sky-500">meeting_room</span>
                                    Selecciona una habitación
                                </h3>
                                <p className="text-slate-500 text-sm mb-6 pb-6 border-b border-slate-100">
                                    Mostrando opciones disponibles para {nights} noche{nights > 1 ? 's' : ''}.
                                </p>

                                {loadingRooms ? (
                                    <div className="text-center py-16 text-slate-500 font-medium flex flex-col items-center gap-3">
                                        <span className="material-symbols-outlined animate-spin text-[40px] text-sky-500">progress_activity</span>
                                        Buscando disponibilidad...
                                    </div>
                                ) : rooms.length === 0 ? (
                                    <div className="text-center py-12 px-4 bg-rose-50 rounded-xl border border-rose-100 text-rose-600 font-medium flex flex-col items-center gap-3">
                                        <span className="material-symbols-outlined text-[40px]">search_off</span>
                                        No hay habitaciones disponibles para estas fechas.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {rooms.map((room: any) => {
                                            const isSelected = selectedRoom === room.numero_espacio;
                                            const totalRoomPrice = room.precio_unidad * nights;

                                            return (
                                                <div
                                                    key={room.espacio_id}
                                                    onClick={() => setSelectedRoom(room.numero_espacio)}
                                                    className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col gap-2
                                                        ${isSelected
                                                            ? 'border-sky-500 bg-sky-50/50 shadow-md ring-4 ring-sky-500/10'
                                                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'
                                                        }`}
                                                >
                                                    {isSelected && (
                                                        <div className="absolute top-4 right-4 w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center text-white shadow-sm">
                                                            <span className="material-symbols-outlined text-[16px]">check</span>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <h4 className="text-xl font-bold text-slate-900">Habitación {room.numero_espacio}</h4>
                                                        <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                                                            <span className="material-symbols-outlined text-[18px]">group</span>
                                                            Capacidad: {room.capacidad_huespedes} personas
                                                        </p>
                                                    </div>

                                                    <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-end justify-between">
                                                        <div>
                                                            <p className="text-xs text-slate-500 font-medium mb-0.5">Precio x noche</p>
                                                            <p className="text-sm font-bold text-slate-700">${room.precio_unidad}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-sky-600 font-bold mb-0.5 uppercase tracking-wide">Total ({nights} noches)</p>
                                                            <p className="text-2xl font-black text-slate-900">
                                                                ${totalRoomPrice}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                <div className="mt-8 flex justify-between gap-3 pt-6 border-t border-slate-100">
                                    <button onClick={handlePrevStep} className="h-11 px-5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[20px]">arrow_back</span> Atrás
                                    </button>
                                    <button onClick={handleNextStep} disabled={!selectedRoom} className="h-11 px-6 rounded-xl bg-slate-900 text-white font-bold hover:bg-sky-600 hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:bg-slate-900 disabled:cursor-not-allowed">
                                        Siguiente paso <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* PASO 3: Huésped */}
                        {currentStep === 3 && (
                            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sky-500">person</span>
                                    Datos del huésped
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-slate-700" htmlFor="nombres">Nombres</label>
                                        <div className="relative flex items-center">
                                            <span className="material-symbols-outlined absolute left-3 text-slate-400">badge</span>
                                            <input className={`${getInputClasses("nombres", formData.nombres)} pl-10`} id="nombres" name="nombres" placeholder="Ej. Orlando" type="text" value={formData.nombres} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-slate-700" htmlFor="apellidos">Apellidos</label>
                                        <div className="relative flex items-center">
                                            <span className="material-symbols-outlined absolute left-3 text-slate-400">badge</span>
                                            <input className={`${getInputClasses("apellidos", formData.apellidos)} pl-10`} id="apellidos" name="apellidos" placeholder="Ej. Mendoza" type="text" value={formData.apellidos} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-slate-700" htmlFor="email">Correo electrónico</label>
                                        <div className="relative flex items-center">
                                            <span className="material-symbols-outlined absolute left-3 text-slate-400">mail</span>
                                            <input className={`${getInputClasses("email", formData.email)} pl-10`} id="email" name="email" placeholder="correo@ejemplo.com" type="email" value={formData.email} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-slate-700" htmlFor="telefono">Teléfono</label>
                                        <div className="relative flex items-center">
                                            <span className="material-symbols-outlined absolute left-3 text-slate-400">call</span>
                                            <input className={`${getInputClasses("telefono", formData.telefono)} pl-10`} id="telefono" name="telefono" placeholder="+504 9999-9999" type="tel" value={formData.telefono} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-sm font-bold text-slate-700" htmlFor="dni">Documento de Identidad (DNI)</label>
                                        <div className="relative flex items-center">
                                            <span className="material-symbols-outlined absolute left-3 text-slate-400">id_card</span>
                                            <input className={`${getInputClasses("dni", formData.dni)} pl-10`} id="dni" name="dni" placeholder="Número de identidad" type="text" value={formData.dni} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-between gap-3 pt-6 border-t border-slate-100">
                                    <button onClick={handlePrevStep} className="h-11 px-5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[20px]">arrow_back</span> Atrás
                                    </button>
                                    <button onClick={handleNextStep} className="h-11 px-6 rounded-xl bg-slate-900 text-white font-bold hover:bg-sky-600 hover:shadow-md transition-all flex items-center gap-2">
                                        Revisar reservación <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* PASO 4: Confirmar */}
                        {currentStep === 4 && (
                            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="material-symbols-outlined text-[32px]">task_alt</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900">¡Todo listo para confirmar!</h3>
                                    <p className="text-slate-500 mt-2">Revisa que los datos estén correctos antes de guardar.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Huésped</p>
                                        <p className="text-lg font-bold text-slate-900">{formData.nombres} {formData.apellidos}</p>
                                        <p className="text-sm text-slate-600 flex items-center gap-1.5 mt-2"><span className="material-symbols-outlined text-[16px]">id_card</span> {formData.dni}</p>
                                        <p className="text-sm text-slate-600 flex items-center gap-1.5 mt-1"><span className="material-symbols-outlined text-[16px]">mail</span> {formData.email}</p>
                                        <p className="text-sm text-slate-600 flex items-center gap-1.5 mt-1"><span className="material-symbols-outlined text-[16px]">call</span> {formData.telefono}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Estadía</p>
                                        <p className="text-lg font-bold text-slate-900">Habitación {selectedRoom}</p>
                                        <p className="text-sm text-slate-600 mt-2"><strong>Entrada:</strong> {formData.fecha_entrada}</p>
                                        <p className="text-sm text-slate-600 mt-1"><strong>Salida:</strong> {formData.fecha_salida}</p>
                                        <p className="text-sm font-medium text-sky-700 bg-sky-100/50 inline-block px-2 py-1 rounded mt-2">
                                            {nights} noche{nights > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-between gap-3 pt-6 border-t border-slate-100">
                                    <button disabled={isSubmitting} onClick={handlePrevStep} className="h-11 px-5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors flex items-center gap-2 disabled:opacity-50">
                                        <span className="material-symbols-outlined text-[20px]">arrow_back</span> Modificar datos
                                    </button>
                                    <button
                                        onClick={handleConfirmReservation}
                                        disabled={isSubmitting}
                                        className="h-11 px-8 rounded-xl bg-emerald-500 text-white font-black hover:bg-emerald-600 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:transform-none"
                                    >
                                        {isSubmitting ? (
                                            <>Procesando... <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span></>
                                        ) : (
                                            <>Confirmar reservación <span className="material-symbols-outlined text-[20px]">check_circle</span></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar del Resumen (Tipo Ticket/Recibo) */}
                    <aside className="w-full lg:w-[380px] shrink-0">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg sticky top-24 overflow-hidden">
                            <div className="bg-slate-900 p-5 text-white">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined">receipt_long</span>
                                    Resumen de reserva
                                </h3>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Fechas */}
                                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <div className="text-center flex-1">
                                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Check-in</p>
                                        <p className="text-sm font-bold text-slate-900">{formData.fecha_entrada || "--/--/----"}</p>
                                    </div>
                                    <div className="w-[1px] h-8 bg-slate-200 mx-2"></div>
                                    <div className="text-center flex-1">
                                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Check-out</p>
                                        <p className="text-sm font-bold text-slate-900">{formData.fecha_salida || "--/--/----"}</p>
                                    </div>
                                </div>

                                <hr className="border-slate-100 border-dashed" />

                                {/* Detalles Habitacion */}
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase mb-2">Detalles de Habitación</p>
                                    {selectedRoomData ? (
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-slate-900 text-lg">Hab. {selectedRoomData.numero_espacio}</p>
                                                <p className="text-xs text-slate-500 mt-1">Capacidad: {selectedRoomData.capacidad_huespedes} pax</p>
                                            </div>
                                            <p className="font-bold text-slate-700">${selectedRoomData.precio_unidad} <span className="text-xs font-normal text-slate-400">/noche</span></p>
                                        </div>
                                    ) : (
                                        <p className="text-sm font-medium text-slate-400 italic">No seleccionada aún</p>
                                    )}
                                </div>

                                <hr className="border-slate-100 border-dashed" />

                                {/* Detalles Precio */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Cantidad de noches</span>
                                        <span className="font-bold text-slate-900">{nights}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Precio por noche</span>
                                        <span className="font-bold text-slate-900">${selectedRoomData?.precio_unidad || "0.00"}</span>
                                    </div>

                                    <div className="pt-4 mt-2 border-t-2 border-slate-900 flex justify-between items-center">
                                        <span className="text-lg font-bold text-slate-900">Total</span>
                                        <span className="text-3xl font-black text-sky-600">
                                            ${totalPrice.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Huésped rápido */}
                                {formData.nombres && (
                                    <div className="mt-6 pt-4 border-t border-slate-100">
                                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">A nombre de:</p>
                                        <p className="text-sm font-bold text-slate-900 truncate">
                                            {formData.nombres} {formData.apellidos}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Borde inferior decorativo estilo ticket */}
                            <div className="h-3 w-full bg-[radial-gradient(circle,transparent_4px,#fff_5px)] bg-[length:12px_12px] -mt-1 relative z-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.05)]"></div>
                        </div>
                    </aside>
                </div>
            </div>
        </ViewTransition>
    );
}