import { useState, useEffect, useCallback } from 'react';
import { fetchAPI } from "./http-base";


export interface Ticket {
    numero_ticket?: string;
    espacio_id: number;
    reserva_id: number | null;
    usuario_id: number;
    responsable_id: number | null;
    nombre_responsable: string | null;
    telefono_responsable: string | null;
    titulo: string | null;
    descripcion: string | null;
    estado: string | null;
    fecha_creacion: string | null;
    fecha_limite: string | null;
    [key: string]: unknown;
}

export interface Comentario {
    comentario_id: number;
    numero_ticket: string;
    usuario_id: number;
    contenido: string;
    fecha_creacion: string;
    [key: string]: unknown;
}

interface UseReporteState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

export async function getTickets(numero_ticket?: string | null, fecha_creacion?: string | null, estado?: string | null): Promise<Ticket[]> {
    return fetchAPI<Ticket[]>(`/tickets`, {
        method: 'GET',
        params: {
            numero_ticket: numero_ticket,
            fecha_creacion: fecha_creacion,
            estado: estado
        }
    });
}

export async function getComentarios(numero_ticket?: string | null, fecha_creacion?: string | null, usuario_id?: number | null): Promise<Comentario[]> {
    return fetchAPI<Comentario[]>(`/tickets/comentarios`, {
        method: 'GET',
        params: {
            numero_ticket: numero_ticket,
            fecha_creacion: fecha_creacion,
            usuario: usuario_id ?? null,
        }
    });
}

export async function createComentario(comentario: {
    numero_ticket: string;
    usuario_id: number;
    contenido: string;
    fecha_creacion?: string;
}): Promise<Comentario> {
    return fetchAPI<Comentario>(`/tickets/comentarios`, {
        method: 'POST',
        body: JSON.stringify(comentario),
    });
}

export function useTickets(numero_ticket?: string | null, fecha_creacion?: string | null, estado?: string | null) {
    const [state, setState] = useState<UseReporteState<Ticket[]>>({
        data: null,
        loading: true,
        error: null,
    });

    const refetch = useCallback(async () => {
        setState({ data: null, loading: true, error: null });
        try {
            const data = await getTickets(numero_ticket, fecha_creacion, estado);
            setState({ data, loading: false, error: null });
        } catch (error) {
            setState({ data: null, loading: false, error: error as Error });
        }
    }, [numero_ticket, fecha_creacion, estado]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void refetch();
    }, [refetch]);

    return { ...state, refetch };
}
