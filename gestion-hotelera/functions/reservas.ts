import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { fetchAPI } from "./http-base";


// URL base de la API - usa variable de entorno o localhost como fallback
export const API_BASE_URL = "https://gestion-hotelera.fastapicloud.dev";

// ============================================
// TIPOS E INTERFACES
// ============================================

export interface Reserva {
    reserva_id?: number;
    huesped_id?: number;
    nombre_huesped?: string;
    nombres?: string;
    apellidos?: string;
    apellido_huesped?: string;
    telefono_huesped?: string;
    email_huesped?: string;
    huesped_dni?: string;
    espacio_id?: number;
    numero_reserva?: string;
    numero_espacio?: string;
    numero_huespedes?: number;
    fecha_entrada?: string;
    fecha_salida?: string;
    cantidad_unidades?: number;
    reserva_estado?: string;
    tarifa?: number;
    monto_pagado?: number;
    total_pagar?: number;
    precio_unidad?: number;
    bookingId?: string;
    status?: string;
    reservationStatus?: string;
    createdAt?: string;
    email?: string;
    telefono?: string;
    loyalty_tier?: string;
    tier?: string;
    guest?: {
        name?: string;
        email?: string;
        telefono?: string;
        loyalty?: { tier?: string };
    };
    stay?: {
        checkIn?: string;
        checkOut?: string;
        checkInTime?: string;
        checkOutTime?: string;
        nights?: number;
        specialRequests?: string;
    };
    room?: {
        type?: string;
        number?: string;
    };
    party?: {
        adults?: number;
    };
    internalNotes?: Array<{ id?: string; text?: string; author?: string; createdAt?: string }>;
    notas_internas?: Array<{ id?: string; text?: string; author?: string; createdAt?: string }>;
    payment?: {
        breakdown?: { roomRate?: number; taxesAndFees?: number; extras?: number };
        total?: number;
        amountPaid?: number;
        guaranteeMethod?: string;
    };
    activity?: Array<{ time?: string; text?: string }>;
    historial_actividad?: Array<{ time?: string; text?: string }>;
    solicitudes_especiales?: string;
    impuestos?: number;
    extras?: number;
    tipo_espacio?: string;
    tipo?: string;
    cantidad_huespedes?: number;
    metodos_garantia?: string;
    metodo_garantia?: string;
    identificacion?: string;
    [key: string]: unknown;
}

export interface EspacioHabitacion {
    espacio_id?: number;
    numero_espacio?: string;
    tipo?: string;
    estado?: string;
    capacidad_huespedes?: number;
    precio_unidad?: number;
    [key: string]: unknown;
}

interface UseReporteState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}
/*
interface FetchOptions extends RequestInit {
    params?: Record<string, string | number | boolean | null | undefined>;
}

async function fetchAPI<T = unknown>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const { params, ...fetchOptions } = options;

    // Construir URL con parámetros de query
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    try {
        const token = typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;
        console.log("Token de autenticación:", token); // Depuración: mostrar el token en la consola
        const response = await fetch(url.toString(), {
            ...fetchOptions,
            headers: {
                'Content-Type': 'application/json',
                ...fetchOptions.headers,
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data as T;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
}
*/
// ============================================
// FUNCIONES DE RECURSOS ACTUALIZADAS (API)
// ============================================

/**
 * Antes: /reservas/obtener-reserva/?reserva_id=${id}
 * Ahora: /reservas/{reserva_id} (Path Parameter estándar REST)
 */

export async function getReserva(reserva_id: number): Promise<Reserva> {
    return fetchAPI<Reserva>(`/reservas/${reserva_id}`, { method: 'GET' });
}

export function useReserva(id?: number) {
    const [state, setState] = useState<UseReporteState<Reserva>>({
        data: null,
        loading: true,
        error: null,
    });

    const refetch = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const data = await getReserva(id!);
            setState({ data, loading: false, error: null });
        } catch (error) {
            setState({ data: null, loading: false, error: error as Error });
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            void refetch();
        }
    }, [refetch, id]);

    // Retorna el estado y añade explícitamente el tipo de refetch
    return {
        ...state,
        refetch,
    } as const; // O tiparlo con el tipo de la función refetch si lo prefieres
}

/**
 * Antes: /reservas/registrar-pago (con id, método y monto mezclados en Query)
 * Ahora: /reservas/{reserva_id}/pagos (Recurso anidado REST correcto)
 */
export async function registrarPago(reserva_id: number, metodo: string, monto: number): Promise<{ message: string }> {
    return fetchAPI<{ message: string }>(`/reservas/${reserva_id}/pagos`, {
        method: 'POST',
        params: {
            metodo: metodo,
            monto: monto.toString()
        }
    });
}

export async function modificarReserva(reserva_id: number, es_entrada: boolean): Promise<{ message: string }> {
    return fetchAPI<{ message: string }>(`/reservas/${reserva_id}`, {
        method: 'PUT',
        params: {
            es_entrada: es_entrada.toString()
        }
    });
}

/**
 * Antes: /reservas/listar-reservaciones
 * Ahora: /reservas (El verbo GET en la raíz del recurso implica listar)
 */
export async function getReservas(fecha_entrada?: Date | null): Promise<Reserva[]> {
    const params = fecha_entrada
        ? { fecha_entrada: fecha_entrada.toISOString().split('T')[0] }
        : undefined;

    return fetchAPI<Reserva[]>('/reservas', {
        method: 'GET',
        params,
    });
}

/**
 * Antes: /reservas/mostrar-habitaciones-disponibles
 * Ahora: /reservas/habitaciones-disponibles (Sub-ruta limpia de consulta)
 */
export async function getHabitacionesDisponibles(
    fechaEntrada: string,
    fechaSalida: string
): Promise<EspacioHabitacion[]> {
    const extraerSoloFecha = (f: Date | string) => {
        return f instanceof Date ? f.toISOString().split('T')[0] : String(f).split('T')[0];
    };

    return fetchAPI<EspacioHabitacion[]>('/reservas/habitaciones-disponibles', {
        method: 'GET',
        params: {
            fecha_entrada: extraerSoloFecha(fechaEntrada),
            fecha_salida: extraerSoloFecha(fechaSalida)
        }
    });
}

/**
 * Antes: /reservas/crear-reserva
 * Ahora: /reservas (El método POST a la raíz crea el elemento)
 */
export async function crearReserva(datos: Reserva): Promise<{ message: string }> {
    return fetchAPI<{ message: string }>('/reservas', {
        method: 'POST',
        body: JSON.stringify(datos)
    }).then(response => {
        toast.success("Reservación creada exitosamente.");
        return response;
    }).catch(error => {
        toast.error("Hubo un problema al procesar la reserva.");
        throw error;
    });
}

// ============================================
// HOOKS PERSONALIZADOS (SIN CAMBIOS EN LÓGICA)
// ============================================

export function useReservas(fecha_entrada?: Date | null) {
    const [state, setState] = useState<UseReporteState<Reserva[]>>({
        data: null,
        loading: true,
        error: null,
    });

    const refetch = useCallback(async (fecha_entrada_new?: Date | null) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const data = await getReservas(fecha_entrada_new || fecha_entrada);
            setState({ data, loading: false, error: null });
        } catch (error) {
            setState({ data: null, loading: false, error: error as Error });
        }
    }, [fecha_entrada]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void refetch();
    }, [refetch]);

    return { ...state, refetch };
}

const formatearFecha = (fecha: Date | string): string => {
    if (typeof fecha === 'string') return fecha;
    return fecha.toISOString().split('T')[0];
};

export function useHabitacionesDisponibles(
    fechaEntrada: Date | string,
    fechaSalida: Date | string
) {
    const [state, setState] = useState<UseReporteState<EspacioHabitacion[]>>({
        data: null,
        loading: true,
        error: null,
    });

    const refetch = useCallback(async () => {
        setState({ data: null, loading: true, error: null });
        try {
            const fechaIn = formatearFecha(fechaEntrada);
            const fechaOut = formatearFecha(fechaSalida);

            const data = await getHabitacionesDisponibles(fechaIn, fechaOut);
            setState({ data, loading: false, error: null });
        } catch (error) {
            setState({ data: null, loading: false, error: error as Error });
        }
    }, [fechaEntrada, fechaSalida]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void refetch();
    }, [refetch]);

    return { ...state, refetch };
}