import { useState, useEffect, useCallback } from 'react';

// URL base de la API - usa variable de entorno o localhost como fallback
const API_BASE_URL = "https://gestion-hotelera.fastapicloud.dev";

// ============================================
// TIPOS E INTERFACES
// ============================================

export interface Reserva {
    id_huesped: number;
    espacio_id: number;
    fecha_entrada: Date;
    fecha_salida: Date;
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

export async function getHabitacionesDisponibles(): Promise<Reserva[]> {
    return fetchAPI<Reserva[]>('/reservas/mostrar-habitaciones-disponibles');
}

export function useHabitacionesDisponibles() {
    const [state, setState] = useState<UseReporteState<Reserva[]>>({
        data: null,
        loading: true,
        error: null,
    });

    const refetch = useCallback(async () => {
        setState({ data: null, loading: true, error: null });
        try {
            const data = await getHabitacionesDisponibles();
            setState({ data, loading: false, error: null });
        } catch (error) {
            setState({ data: null, loading: false, error: error as Error });
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { ...state, refetch };
}

export async function crearReserva(datos: Reserva): Promise<{ message: string }> {
    const limpiarFecha = (f: Date | string) => {
        return f instanceof Date ? f.toISOString().split('T')[0] : String(f).split('T')[0];
    };

    return fetchAPI<{ message: string }>('/reservas/crear-reserva', {
        method: 'POST',
        params: {
            huesped_id: Number(datos.id_huesped),
            espacio_id: Number(datos.espacio_id),
            fecha_entrada: limpiarFecha(datos.fecha_entrada),
            fecha_salida: limpiarFecha(datos.fecha_salida)
        }
    });
}