import { fetchAPI } from "./http-base";

export interface Habitacion {
    espacio_id?: number;
    numero_espacio?: string;
    estado_habitacion?: string;
    tipo?: string;
    categoria?: string;
    huesped_actual_nombres?: string;
    huesped_actual_apellidos?: string;
    actual_fecha_entrada?: string;
    estado_reserva?: string;
    proxima_fecha_entrada?: string;
    proximo_huesped_nombres?: string;
    proximo_huesped_apellidos?: string;
    [key: string]: any;
}

export const getHabitaciones = async (): Promise<Habitacion[]> => {
    return fetchAPI<Habitacion[]>("/espacios/habitaciones");
}