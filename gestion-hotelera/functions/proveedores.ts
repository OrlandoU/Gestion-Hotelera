import { useState, useEffect, useCallback } from 'react';
import { fetchAPI } from './http-base';

export interface Proveedor {
    proveedor_id?: number;
    nombre?: string;
    telefono?: string;
    email?: string;
    categoria?: string;
    [key: string]: any;
}

export async function getProveedores(): Promise<Proveedor[]> {
    return fetchAPI<Proveedor[]>('/proveedores/listar');
}
