import { useState, useEffect, useCallback } from 'react';
import { fetchAPI } from './http-base';

export interface Usuario {
    usuario_id?: number;
    primer_nombre?: string;
    segundo_nombre?: string;
    primer_apellido?: string;
    segundo_apellido?: string;
    email?: string;
    telefono?: string;
    rol?: string;
    estado?: string;
    [key: string]: any;
}

interface UseReporteState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

export async function getUsuarios(): Promise<Usuario[]> {
    return fetchAPI<Usuario[]>(`/usuarios`, { method: 'GET' });
}

export function useUsuarios() {
    const [state, setState] = useState<UseReporteState<Usuario[]>>({
        data: null,
        loading: true,
        error: null,
    });

    const refetch = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const data = await getUsuarios();
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

export function crearUsuario(usuario: Usuario) {
    return fetchAPI<Usuario>(`/usuarios`, {
        method: 'POST',
        body: JSON.stringify(usuario)
    });
}

export function updateUsuario(usuario_id: number, usuario: Usuario) {
    return fetchAPI<Usuario>(`/usuarios/${usuario_id}`, {
        method: 'PUT',
        body: JSON.stringify(usuario)
    });
}