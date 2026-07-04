import { useState, useEffect, useCallback } from 'react';
import { fetchAPI } from './http-base';

export interface Producto {
    producto_id?: number;
    //proveedor_id?: number;
    nombre?: string;
    cantidad?: number;
    categoria?: string;
    costo_unitario?: number;
    unidad?: string;
    [key: string]: any;
}

export interface DetalleCompra {
    producto_id: number;
    cantidad: number;
    costo_unitario: number;
}

export interface Compra {
    proveedor_id: number;
    numero_factura_proveedor: string;
    fecha_compra: string; // Se envía como string (ISO o formato YYYY-MM-DD HH:mm:ss)
    detalles: DetalleCompra[];
}

export async function getProductos(proveedor_id?: number): Promise<Producto[]> {
    return fetchAPI<Producto[]>('/productos/listar', { params: { proveedor_id } });
}

export interface RespuestaCompra {
    message: string;
    compra_id: number;
}

export async function registrarCompra(compra: Compra) {
    // Cambiamos <Producto[]> por <RespuestaCompra>
    return fetchAPI<RespuestaCompra>('/productos/registrar-compra', {
        method: 'POST',
        body: JSON.stringify(compra),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}