"use client";

import { useState, useEffect, type ChangeEvent } from "react";
import { useForm, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/pageheader";
import Link from "next/link";
import { getHabitacionesDisponibles, crearReserva, EspacioHabitacion } from "@/functions/reservas";
import { getHuespedes, Huesped } from "@/functions/huesped";

const ROOM_TYPES = [
    "Básica",
    "Doble-Básica",
    "Estándar",
    "Doble-Estándar",
];

const guestSchema = z.object({
    nombres: z.string().trim().min(2, "Ingresa al menos 2 letras para los nombres."),
    apellidos: z.string().trim().min(2, "Ingresa al menos 2 letras para los apellidos."),
    email: z.string().trim().email("Ingresa un correo electrónico válido."),
    telefono: z.string().trim().refine((value) => value.replace(/\D/g, "").length >= 8, {
        message: "El teléfono debe tener al menos 8 dígitos.",
    }),
    dni: z.string().trim().min(13, "Ingresa un documento válido."),
});

type GuestFormValues = z.infer<typeof guestSchema>;

type ValidatedInputProps = {
    label: string;
    name: keyof GuestFormValues;
    type?: string;
    placeholder?: string;
    icon: string;
    register: UseFormRegister<GuestFormValues>;
    error?: string;
    isDirty?: boolean;
    isTouched?: boolean;
    inputClassName?: string;
    containerClassName?: string;
    autoComplete?: string;
};

function ValidatedInput({
    label,
    name,
    type = "text",
    placeholder,
    icon,
    register,
    error,
    isDirty,
    isTouched,
    inputClassName = "",
    containerClassName = "",
    autoComplete,
}: ValidatedInputProps) {
    const hasSuccess = Boolean(isTouched && isDirty && !error);
    const inputBaseClasses = "w-full h-11 bg-slate-50 border rounded-lg px-4 text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:outline-none";
    const stateClasses = error
        ? "border-red-400 bg-white focus:border-red-500 focus:ring-2 focus:ring-red-400/20"
        : hasSuccess
            ? "border-sky-400/80 bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            : "border-slate-300 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20";

    return (
        <div className={`flex flex-col gap-2 ${containerClassName}`}>
            <label className="text-sm font-bold text-slate-700" htmlFor={name}>{label}</label>
            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
                <input
                    {...register(name)}
                    autoComplete={autoComplete}
                    className={`${inputBaseClasses} ${stateClasses} ${inputClassName} ${icon ? "pl-10" : ""} ${hasSuccess ? "pr-10" : "pr-4"}`}
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    type={type}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${name}-error` : undefined}
                />
                {hasSuccess && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-500 material-symbols-outlined text-[18px] animate-in fade-in">
                        check
                    </span>
                )}
            </div>
            {error && (
                <p id={`${name}-error`} className="text-xs text-red-500 mt-1 animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
}

type GuestSuggestionsProps = {
    huespedes: Huesped[];
    search: string;
    onSelect: (guest: Huesped) => void;
};

function GuestSuggestions({ huespedes, search, onSelect }: GuestSuggestionsProps) {
    const normalizedSearch = search.trim().toLowerCase();
    const filteredHuespedes = huespedes.filter((guest) => {
        const searchText = [guest.nombres, guest.apellidos, guest.nombre, guest.email, guest.dni]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
        return searchText.includes(normalizedSearch);
    });

    if (!normalizedSearch) {
        return <div className="p-4 text-slate-500">Ingresa nombres, correo o DNI para buscar.</div>;
    }

    if (filteredHuespedes.length === 0) {
        return <div className="p-4 text-slate-500">No se encontraron huéspedes para esta búsqueda.</div>;
    }

    return (
        <ul className="divide-y divide-slate-200">
            {filteredHuespedes.map((guest) => (
                <li key={guest.huesped_id ?? `${guest.nombres}-${guest.apellidos}-${guest.dni}`}>
                    <button
                        type="button"
                        onClick={() => onSelect(guest)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-semibold text-slate-900">{guest.nombres ?? guest.nombre} {guest.apellidos}</p>
                                <p className="text-sm text-slate-500">{guest.email || guest.dni || guest.telefono}</p>
                            </div>
                            <span className="text-slate-400 material-symbols-outlined">arrow_forward_ios</span>
                        </div>
                    </button>
                </li>
            ))}
        </ul>
    );
}

export default function CrearReservacion() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedRoom, setSelectedRoom] = useState("");
    const [rooms, setRooms] = useState<EspacioHabitacion[]>([]);
    const [loadingRooms, setLoadingRooms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dateErrors, setDateErrors] = useState<{ fecha_entrada?: string; fecha_salida?: string }>({});
    const [roomError, setRoomError] = useState("");

    const {
        register,
        setValue,
        trigger,
        watch,
        formState: { errors, touchedFields, dirtyFields },
    } = useForm<GuestFormValues>({
        // @ts-expect-error - resolver typing mismatch between installed zod and @hookform/resolvers
        resolver: zodResolver(guestSchema),
        mode: "onTouched",
        reValidateMode: "onChange",
        defaultValues: {
            nombres: "",
            apellidos: "",
            email: "",
            telefono: "",
            dni: "",
        },
    });

    const guestValues = watch();

    const [formData, setFormData] = useState({
        fecha_entrada: "",
        fecha_salida: "",
        espacio_id: selectedRoom
    });
    const [selectedRoomType, setSelectedRoomType] = useState("");
    const [huespedes, setHuespedes] = useState<Huesped[]>([]);
    const [guestSearch, setGuestSearch] = useState("");
    const [selectedGuest, setSelectedGuest] = useState<Huesped | null>(null);
    const [isFetchingGuests, setIsFetchingGuests] = useState(false);

    const stepLabels = [
        "Fechas",
        "Habitación",
        "Huésped",
        "Confirmar"
    ];

    // Cálculos de fechas y precios
    const formatDateForInput = (date: Date) => {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, "0");
        const day = `${date.getDate()}`.padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const parseDateInput = (value: string) => {
        const [year, month, day] = value.split("-").map(Number);
        return new Date(year, month - 1, day);
    };

    const calculateNights = (start: string, end: string) => {
        if (!start || !end) return 0;
        const startDate = parseDateInput(start);
        const endDate = parseDateInput(end);
        const diffTime = endDate.getTime() - startDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const nights = calculateNights(formData.fecha_entrada, formData.fecha_salida);
    const selectedRoomData = rooms.find((room: EspacioHabitacion) => room.numero_espacio === selectedRoom);
    const totalPrice = selectedRoomData ? (selectedRoomData.precio_unidad || 0) * nights : 0;

    // Obtener la fecha de hoy en formato YYYY-MM-DD para restringir inputs
    const today = formatDateForInput(new Date());

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
            return `${baseClasses} border-sky-400/70 bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20`;
        }
        return `${baseClasses} border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20`;
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === "fecha_entrada") {
            setDateErrors(prev => ({ ...prev, fecha_entrada: "" }));
        }
        if (name === "fecha_salida") {
            setDateErrors(prev => ({ ...prev, fecha_salida: "" }));
        }
    };

    const validateDateField = (field: "fecha_entrada" | "fecha_salida") => {
        const nextDateErrors: { fecha_entrada?: string; fecha_salida?: string } = {}

        if (!formData.fecha_entrada) {
            nextDateErrors.fecha_entrada = "Selecciona la fecha de entrada.";
        }

        if (!formData.fecha_salida) {
            nextDateErrors.fecha_salida = "Selecciona la fecha de salida.";
        }

        if (formData.fecha_entrada && formData.fecha_salida) {
            const entrada = parseDateInput(formData.fecha_entrada);
            const salida = parseDateInput(formData.fecha_salida);

            if (salida <= entrada) {
                nextDateErrors.fecha_salida = "La fecha de salida debe ser posterior a la de entrada.";
            }
        }

        setDateErrors(nextDateErrors);
        return !nextDateErrors[field];
    };

    // Al cambiar las fechas, resetear la habitación si ya se había pasado del paso 1
    useEffect(() => {
        if (currentStep === 1 && selectedRoom) {
            setSelectedRoom("");
        }
    }, [currentStep, formData.fecha_entrada, formData.fecha_salida, selectedRoom]);

    const availableRoomTypes = ROOM_TYPES;

    const filteredRooms = selectedRoomType
        ? rooms.filter((room) => room.tipo === selectedRoomType)
        : rooms;

    useEffect(() => {
        if (!formData.fecha_entrada || !formData.fecha_salida) {
            setRooms([]);
            setSelectedRoomType("");
            return;
        }

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

        void fetchRooms();
    }, [formData.fecha_entrada, formData.fecha_salida]);

    useEffect(() => {
        if (selectedRoom && !rooms.some((room) => room.numero_espacio === selectedRoom)) {
            setSelectedRoom("");
        }
    }, [rooms, selectedRoom]);

    useEffect(() => {
        if (selectedRoomType && !availableRoomTypes.includes(selectedRoomType)) {
            setSelectedRoomType("");
        }
    }, [availableRoomTypes, selectedRoomType]);

    useEffect(() => {
        if (currentStep !== 3 || huespedes.length > 0) {
            return;
        }

        const fetchGuests = async () => {
            setIsFetchingGuests(true);
            try {
                const data = await getHuespedes();
                setHuespedes(data || []);
            } catch (error) {
                console.error("Error al cargar los huéspedes existentes:", error);
            } finally {
                setIsFetchingGuests(false);
            }
        };

        void fetchGuests();
    }, [currentStep, huespedes.length]);

    const handleConfirmReservation = async () => {
        if (!selectedRoomData) return;
        const isGuestValid = await trigger();
        if (!isGuestValid) return;

        setIsSubmitting(true);
        try {
            console.log("Datos a enviar al crear la reserva:", {
                ...formData,
                ...guestValues,
                espacio_id: selectedRoomData.espacio_id,
            });
            await crearReserva({
                ...formData,
                ...guestValues,
                espacio_id: selectedRoomData.espacio_id,
                // Puedes enviar el precio total si tu API lo requiere:
                // precio_total: totalPrice 
            });
            router.push("/bd/reservaciones");
        } catch (error) {
            toast.error("Hubo un problema al procesar la reserva.");
            console.error("Error al enviar la reserva:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNextStep = async () => {
        if (currentStep === 1) {
            const nextDateErrors: { fecha_entrada?: string; fecha_salida?: string } = {};
            if (!formData.fecha_entrada) {
                nextDateErrors.fecha_entrada = "Selecciona la fecha de entrada.";
            }
            if (!formData.fecha_salida) {
                nextDateErrors.fecha_salida = "Selecciona la fecha de salida.";
            } else if (nights <= 0) {
                nextDateErrors.fecha_salida = "La fecha de salida debe ser posterior a la de entrada.";
            }
            setDateErrors(nextDateErrors);
            if (Object.keys(nextDateErrors).length > 0) {
                return;
            }
        }
        if (currentStep === 2 && !selectedRoom) {
            setRoomError("Selecciona una habitación disponible.");
            return;
        }
        if (currentStep === 3) {
            const isGuestValid = await trigger();
            if (!isGuestValid) {
                return;
            }
        }
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const handlePrevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    return (
        <>
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
                                            onBlur={() => validateDateField("fecha_entrada")}
                                        />
                                        {dateErrors.fecha_entrada && <p className="text-xs text-red-500">{dateErrors.fecha_entrada}</p>}
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
                                            onBlur={() => validateDateField("fecha_salida")}
                                            disabled={!formData.fecha_entrada}
                                        />
                                        {dateErrors.fecha_salida && <p className="text-xs text-red-500">{dateErrors.fecha_salida}</p>}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <div className="flex items-center justify-between gap-4 mb-4">
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">Tipo de habitación</p>
                                            <p className="text-xs text-slate-500">Elige la categoría que quieres reservar.</p>
                                        </div>
                                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{selectedRoomType || "Todas"}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        {availableRoomTypes.map((tipo) => {
                                            const isActive = selectedRoomType === tipo;
                                            return (
                                                <button
                                                    key={tipo}
                                                    type="button"
                                                    onClick={() => setSelectedRoomType(tipo)}
                                                    className={`rounded-3xl border p-4 text-left transition-all duration-200 ${isActive ? 'border-sky-500 bg-sky-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}
                                                >
                                                    <p className={`font-semibold ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>{tipo}</p>
                                                    {/* <p className="text-xs leading-5 text-slate-500 mt-1"></p> */}
                                                </button>
                                            );
                                        })}
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

                                <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                                    <span className="font-semibold">Tipo seleccionado:</span>
                                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                                        {selectedRoomType || 'Todas'}
                                    </span>
                                </div>

                                {loadingRooms ? (
                                    <div className="text-center py-16 text-slate-500 font-medium flex flex-col items-center gap-3">
                                        <span className="material-symbols-outlined animate-spin text-[40px] text-sky-500">progress_activity</span>
                                        Buscando disponibilidad...
                                    </div>
                                ) : filteredRooms.length === 0 ? (
                                    <div className="text-center py-12 px-4 bg-rose-50 rounded-xl border border-rose-100 text-rose-600 font-medium flex flex-col items-center gap-3">
                                        <span className="material-symbols-outlined text-[40px]">search_off</span>
                                        {rooms.length === 0 ? (
                                            "No hay habitaciones disponibles para estas fechas."
                                        ) : (
                                            <>
                                                No hay habitaciones disponibles para el tipo seleccionado.
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedRoomType("")}
                                                    className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                                >
                                                    Ver todas las habitaciones
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {filteredRooms.map((room: EspacioHabitacion) => {
                                            const isSelected = selectedRoom === room.numero_espacio;
                                            const totalRoomPrice = (room.precio_unidad ?? 0) * nights;

                                            return (
                                                <div
                                                    key={room.espacio_id}
                                                    onClick={() => {
                                                        setSelectedRoom(room.numero_espacio ?? "");
                                                        setRoomError("");
                                                    }}
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
                                                        <p className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">
                                                            {room.tipo || 'Sin tipo'}
                                                        </p>
                                                        <p className="text-sm font-medium text-slate-500 mt-3 flex items-center gap-1.5">
                                                            <span className="material-symbols-outlined text-[18px]">group</span>
                                                            Capacidad: {room.capacidad_huespedes} personas
                                                        </p>
                                                    </div>

                                                    <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-end justify-between">
                                                        <div>
                                                            <p className="text-xs text-slate-500 font-medium mb-0.5">Precio x noche</p>
                                                            <p className="text-sm font-bold text-slate-700">L. {room.precio_unidad ?? 0}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-sky-600 font-bold mb-0.5 uppercase tracking-wide">Total ({nights} noches)</p>
                                                            <p className="text-2xl font-black text-slate-900">
                                                                L. {totalRoomPrice}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {roomError && <p className="mt-4 text-sm text-red-500">{roomError}</p>}

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

                                <div className="space-y-4 mb-6">
                                    <label className="text-sm font-bold text-slate-700" htmlFor="guest_search">Buscar huésped existente</label>
                                    <div className="relative">
                                        <input
                                            id="guest_search"
                                            value={guestSearch}
                                            onChange={(event) => {
                                                setGuestSearch(event.target.value);
                                                setSelectedGuest(null);
                                            }}
                                            placeholder="Nombre, correo o DNI"
                                            className="w-full h-11 bg-slate-50 border border-slate-300 rounded-lg px-4 text-slate-800 outline-none transition-all duration-200 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
                                        />
                                        {guestSearch && (
                                            <button
                                                type="button"
                                                onClick={() => setGuestSearch("")}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
                                            >
                                                <span className="material-symbols-outlined">close</span>
                                            </button>
                                        )}
                                    </div>

                                    {guestSearch && (
                                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm max-h-72 overflow-y-auto">
                                            {isFetchingGuests ? (
                                                <div className="p-4 text-slate-500">Cargando huéspedes...</div>
                                            ) : (
                                                <GuestSuggestions
                                                    huespedes={huespedes}
                                                    search={guestSearch}
                                                    onSelect={(guest) => {
                                                        setSelectedGuest(guest);
                                                        setGuestSearch(`${guest.nombres ?? guest.nombre ?? ""} ${guest.apellidos ?? ""}`);
                                                        setValue("nombres", guest.nombres ?? guest.nombre ?? "");
                                                        setValue("apellidos", guest.apellidos ?? "");
                                                        setValue("email", guest.email ?? "");
                                                        setValue("telefono", guest.telefono ?? "");
                                                        setValue("dni", guest.dni ?? "");
                                                    }}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>

                                {selectedGuest && (
                                    <div className="mb-6 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-slate-700">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">Huésped seleccionado</p>
                                                <p className="text-sm text-slate-600">{selectedGuest.nombres} {selectedGuest.apellidos}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedGuest(null);
                                                    setGuestSearch("");
                                                }}
                                                className="text-sky-700 text-sm font-semibold hover:underline"
                                            >
                                                Limpiar selección
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <ValidatedInput
                                        label="Nombres"
                                        name="nombres"
                                        placeholder="Ej. Orlando"
                                        icon="badge"
                                        register={register}
                                        error={errors.nombres?.message}
                                        isDirty={Boolean(dirtyFields.nombres)}
                                        isTouched={Boolean(touchedFields.nombres)}
                                        autoComplete="given-name"
                                    />
                                    <ValidatedInput
                                        label="Apellidos"
                                        name="apellidos"
                                        placeholder="Ej. Mendoza"
                                        icon="badge"
                                        register={register}
                                        error={errors.apellidos?.message}
                                        isDirty={Boolean(dirtyFields.apellidos)}
                                        isTouched={Boolean(touchedFields.apellidos)}
                                        autoComplete="family-name"
                                    />
                                    <ValidatedInput
                                        label="Correo electrónico"
                                        name="email"
                                        type="email"
                                        placeholder="correo@ejemplo.com"
                                        icon="mail"
                                        register={register}
                                        error={errors.email?.message}
                                        isDirty={Boolean(dirtyFields.email)}
                                        isTouched={Boolean(touchedFields.email)}
                                        autoComplete="email"
                                    />
                                    <ValidatedInput
                                        label="Teléfono"
                                        name="telefono"
                                        type="tel"
                                        placeholder="99999999"
                                        icon="call"
                                        register={register}
                                        error={errors.telefono?.message}
                                        isDirty={Boolean(dirtyFields.telefono)}
                                        isTouched={Boolean(touchedFields.telefono)}
                                        autoComplete="tel"
                                    />
                                    <ValidatedInput
                                        label="Documento de Identidad (DNI)"
                                        name="dni"
                                        placeholder="Número de identidad"
                                        icon="id_card"
                                        register={register}
                                        error={errors.dni?.message}
                                        isDirty={Boolean(dirtyFields.dni)}
                                        isTouched={Boolean(touchedFields.dni)}
                                        autoComplete="off"
                                        containerClassName="md:col-span-2"
                                    />
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
                                    <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="material-symbols-outlined text-[32px]">task_alt</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900">¡Todo listo para confirmar!</h3>
                                    <p className="text-slate-500 mt-2">Revisa que los datos estén correctos antes de guardar.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Huésped</p>
                                        <p className="text-lg font-bold text-slate-900">{guestValues.nombres} {guestValues.apellidos}</p>
                                        <p className="text-sm text-slate-600 flex items-center gap-1.5 mt-2"><span className="material-symbols-outlined text-[16px]">id_card</span> {guestValues.dni}</p>
                                        <p className="text-sm text-slate-600 flex items-center gap-1.5 mt-1"><span className="material-symbols-outlined text-[16px]">mail</span> {guestValues.email}</p>
                                        <p className="text-sm text-slate-600 flex items-center gap-1.5 mt-1"><span className="material-symbols-outlined text-[16px]">call</span> {guestValues.telefono}</p>
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
                                    <button disabled={isSubmitting} onClick={handlePrevStep} className="inline-flex h-11 items-center justify-center gap-2 rounded-[2.5rem] border border-slate-300 bg-white px-5 text-[14px] font-semibold leading-4 tracking-wider text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60">
                                        <span className="material-symbols-outlined text-[20px]">arrow_back</span> Modificar datos
                                    </button>
                                    <button
                                        onClick={handleConfirmReservation}
                                        disabled={isSubmitting}
                                        className="inline-flex h-11 items-center justify-center gap-2 rounded-[2.5rem] bg-slate-950 px-6 text-[14px] font-semibold leading-4 tracking-wider text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
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
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-slate-900 text-lg">Hab. {selectedRoomData.numero_espacio}</p>
                                                    <p className="text-xs text-slate-500 mt-1">Capacidad: {selectedRoomData.capacidad_huespedes} pax</p>
                                                </div>
                                                <p className="font-bold text-slate-700">L. {selectedRoomData.precio_unidad} <span className="text-xs font-normal text-slate-400">/noche</span></p>
                                            </div>
                                            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">
                                                {selectedRoomData.tipo || selectedRoomType || 'Sin tipo'}
                                            </div>
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
                                        <span className="font-bold text-slate-900">L. {selectedRoomData?.precio_unidad || "0.00"}</span>
                                    </div>

                                    <div className="pt-4 mt-2 border-t-2 border-slate-900 flex justify-between items-center">
                                        <span className="text-lg font-bold text-slate-900">Total</span>
                                        <span className="text-3xl font-black text-sky-600">
                                            L. {totalPrice.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Huésped rápido */}
                                {(guestValues.nombres || guestValues.apellidos) && (
                                    <div className="mt-6 pt-4 border-t border-slate-100">
                                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">A nombre de:</p>
                                        <p className="text-sm font-bold text-slate-900 truncate">
                                            {guestValues.nombres} {guestValues.apellidos}
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
        </>
    );
}