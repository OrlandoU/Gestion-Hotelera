import { useState, useEffect, useCallback } from 'react';
import { fetchAPI } from "./http-base";

export interface KPI {
    total_tickets?: number;
    total_progreso?: number;
    total_urgente?: number;
}

export interface Mantenimiento {
    mantenimiento_id?: number | null;
    usuario_id?: number;
    responsable_id?: number | null;
    nombre_responsable?: string | null;
    telefono_responsable?: string | null;
    tipo?: string;
    prioridad?: string;
    estado?: string;
    fecha_inicio?: string | null;
    fecha_final?: string | null;
    espacio_id?: number;
    descripcion?: string;
    [key: string]: any;
}

interface UseReporteState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

export async function getMantenimientos(fecha_inicio?: string | null, fecha_final?: string | null, tipo?: string | null, usuario_id?: number | null): Promise<Mantenimiento[]> {
    return fetchAPI<Mantenimiento[]>(`/mantenimientos`, {
        method: 'GET',
        params: {
            fecha_inicio: fecha_inicio,
            fecha_final: fecha_final,
            tipo: tipo,
            usuario_id: usuario_id
        }
    });
}


export function useMantenimientos(fecha_inicio?: string, fecha_final?: string, tipo?: string | null, usuario_id?: number | null) {
    const [state, setState] = useState<UseReporteState<Mantenimiento[]>>({
        data: null,
        loading: true,
        error: null,
    });

    const refetch = useCallback(async () => {
        setState({ data: null, loading: true, error: null });
        try {
            const data = await getMantenimientos(fecha_inicio, fecha_final, tipo, usuario_id);
            setState({ data, loading: false, error: null });
        } catch (error) {
            setState({ data: null, loading: false, error: error as Error });
        }
    }, [fecha_inicio, fecha_final, tipo, usuario_id]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { ...state, refetch };
}

export async function getKPI(): Promise<KPI> {
    return fetchAPI<KPI>(`/mantenimientos/kpi`, {
        method: 'GET'
    });
}

export function useKPI() {
    const [state, setState] = useState<UseReporteState<KPI>>({
        data: null,
        loading: true,
        error: null,
    });

    const refetch = useCallback(async () => {
        setState({ data: null, loading: true, error: null });
        try {
            const data = await getKPI();
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

export async function crearMantenimiento(datos: Mantenimiento): Promise<{ message: string }> {
    return fetchAPI<{ message: string }>('/mantenimientos', {
        method: 'POST',
        body: JSON.stringify(datos)
    });
}