import { fetchAPI } from '@/functions/http-base'

export interface Huesped {
    huesped_id?: number;
    nombre?: string;
    nombres?: string;
    apellidos?: string;
    email?: string;
    telefono?: string;
    dni?: string;
    estancias?: number;
    total_gastado?: number;
    [key: string]: unknown;
}

export async function getHuespedes(): Promise<Huesped[]> {
    return fetchAPI<Huesped[]>('/huespedes');
}

export async function getHuesped(id: number): Promise<Huesped> {
    return fetchAPI<Huesped>('/huespedes/' + id);
}

export async function createHuesped(huesped: Huesped): Promise<Huesped> {
    return fetchAPI<Huesped>('/huespedes', {
        method: 'POST',
        body: JSON.stringify(huesped),
    });
}