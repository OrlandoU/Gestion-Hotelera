import { useState, useEffect, useCallback } from 'react';
import { fetchAPI } from "./http-base";

export interface Pago {
    pago_id?: number | null;
    reserva_id?: number | null;
    metodo?: string | null;
    fecha_pago?: string | null;
    monto?: number | null;
}

interface UseReporteState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}


export async function getPagos(fecha?: string | null, metodo_pago?: string | null, reserva_id?: number | null): Promise<Pago[]> {
    return fetchAPI<Pago[]>(`/pagos`, {
        method: 'GET',
        params: {
            fecha: fecha,
            metodo_pago: metodo_pago,
            reserva_id: reserva_id
        }
    });
}


export function usePagos(fecha?: string | null, metodo_pago?: string | null, reserva_id?: number | null) {
    const [state, setState] = useState<UseReporteState<Pago[]>>({
        data: null,
        loading: true,
        error: null,
    });

    const refetch = useCallback(async () => {
        setState({ data: null, loading: true, error: null });
        try {
            const data = await getPagos(fecha, metodo_pago, reserva_id);
            setState({ data, loading: false, error: null });
        } catch (error) {
            setState({ data: null, loading: false, error: error as Error });
        }
    }, [fecha, metodo_pago, reserva_id]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { ...state, refetch };
}