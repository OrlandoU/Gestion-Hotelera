import { fetchAPI } from '@/functions/http-base'

export interface Huesped {
    huesped_id?: number;
    nombre?: string;
    email?: string;
    telefono?: string;
    estancias?: number;
    total_gastado?: number;
    [key: string]: any;
}

export async function getHuespedes(): Promise<Huesped[]> {
    return fetchAPI<Huesped[]>('/huespedes/listar');
}
