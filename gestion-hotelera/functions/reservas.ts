import { useState, useEffect, useCallback } from 'react';

// URL base de la API - usa variable de entorno o localhost como fallback
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

// ============================================
// FUNCIONES DE RECURSOS ACTUALIZADAS (API)
// ============================================

/**
 * Antes: /reservas/obtener-reserva/?reserva_id=${id}
 * Ahora: /reservas/{reserva_id} (Path Parameter estándar REST)
 */
export async function getReserva(id: number): Promise<Reserva> {
    return fetchAPI<Reserva>(`/reservas/${id}`, { method: 'GET' });
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

/**
 * Antes: /reservas/listar-reservaciones
 * Ahora: /reservas (El verbo GET en la raíz del recurso implica listar)
 */
export async function getReservas(fecha_entrada: Date): Promise<Reserva[]> {
    return fetchAPI<Reserva[]>('/reservas', {
        method: 'GET',
        params: { fecha_entrada: fecha_entrada.toISOString().split('T')[0] }
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
    console.log(datos)
    return fetchAPI<{ message: string }>('/reservas', {
        method: 'POST',
        body: JSON.stringify(datos)
    });
}

// ============================================
// HOOKS PERSONALIZADOS (SIN CAMBIOS EN LÓGICA)
// ============================================

export function useReservas(fecha_entrada: Date) {
    const [state, setState] = useState<UseReporteState<Reserva[]>>({
        data: null,
        loading: true,
        error: null,
    });

    const refetch = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const data = await getReservas(fecha_entrada);
            setState({ data, loading: false, error: null });
        } catch (error) {
            setState({ data: null, loading: false, error: error as Error });
        }
    }, [fecha_entrada.toISOString().split('T')[0]]);

    useEffect(() => {
        refetch();
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
        refetch();
    }, [refetch]);

    return { ...state, refetch };
}