import { useState, useEffect, useCallback } from 'react';

// URL base de la API - usa variable de entorno o localhost como fallback
//const API_BASE_URL = "https://gestion-hotelera.fastapicloud.dev";
const API_BASE_URL = "http://127.0.0.1:8000";

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
    [key: string]: any;
}

export interface EspacioHabitacion {
    espacio_id?: number;
    numero_espacio?: string;
    tipo?: string;
    estado?: string;
    capacidad_huespedes?: number;
    precio_unidad?: number;
    [key: string]: any;
}

interface UseReporteState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

interface FetchOptions extends RequestInit {
    params?: Record<string, any>;
}

async function fetchAPI<T = any>(
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

    console.log("URL final generada:", url.toString());

    try {
        const response = await fetch(url.toString(), {
            ...fetchOptions,
            headers: {
                'Content-Type': 'application/json',
                ...fetchOptions.headers,
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

export async function getReserva(id: number): Promise<Reserva> {
    return fetchAPI<Reserva>(`/reservas/obtener-reserva/?reserva_id=${id}`);
}

export async function registrarPago(reserva_id: number, metodo: string, monto: number): Promise<{ message: string }> {
    return fetchAPI<{ message: string }>('/reservas/registrar-pago', {
        method: 'POST',
        params: {
            reserva_id: reserva_id.toString(),
            metodo: metodo,
            monto: monto.toString()
        }
    });
}

export async function getReservas(fecha_entrada: Date): Promise<Reserva[]> {
    return fetchAPI<Reserva[]>('/reservas/listar-reservaciones', {
        method: 'GET',
        params: { fecha_entrada: fecha_entrada.toISOString().split('T')[0] }
    });
}

export function useReservas(fecha_entrada: Date) {
    const [state, setState] = useState<UseReporteState<Reserva[]>>({
        data: null,
        loading: true,
        error: null,
    });

    const refetch = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null })); // Evita parpadeos borrando data
        try {
            const data = await getReservas(fecha_entrada);
            setState({ data, loading: false, error: null });
        } catch (error) {
            setState({ data: null, loading: false, error: error as Error });
        }
        // PASAMOS EL STRING DE LA FECHA COMO DEPENDENCIA
    }, [fecha_entrada.toISOString().split('T')[0]]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { ...state, refetch };
}

const formatearFecha = (fecha: Date | string): string => {
    if (typeof fecha === 'string') return fecha; // Si ya es string, asumimos que viene bien
    return fecha.toISOString().split('T')[0]; // Convierte a "YYYY-MM-DD"
};

export async function getHabitacionesDisponibles(
    fechaEntrada: string,
    fechaSalida: string
): Promise<EspacioHabitacion[]> {
    // 1. Limpiar y formatear las fechas con la hora exacta obligatoria
    const formatoFechaSQL = (f: Date | string) => {
        const base = f instanceof Date ? f.toISOString().split('T')[0] : String(f).split('T')[0];
        return `${base}T00:00:00`;
    };

    return fetchAPI<EspacioHabitacion[]>('/reservas/mostrar-habitaciones-disponibles', {
        method: 'GET',
        params: {
            fecha_entrada: formatoFechaSQL(fechaEntrada),
            fecha_salida: formatoFechaSQL(fechaSalida)
        }
    });
}

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
            // 🛠️ Formateamos las fechas antes de enviarlas
            const fechaIn = formatearFecha(fechaEntrada);
            const fechaOut = formatearFecha(fechaSalida);

            const data = await getHabitacionesDisponibles(fechaIn, fechaOut);
            setState({ data, loading: false, error: null });
        } catch (error) {
            setState({ data: null, loading: false, error: error as Error });
        }
    }, [fechaEntrada, fechaSalida]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { ...state, refetch };
}

export async function crearReserva(datos: Reserva): Promise<{ message: string }> {
    return fetchAPI<{ message: string }>('/reservas/crear-reserva', {
        method: 'POST',
        body: JSON.stringify(datos)
    });
}