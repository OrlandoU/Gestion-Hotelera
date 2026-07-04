"use client";

import { useState } from "react";
import PageHeader from "@/components/pageheader";
import { ViewTransition } from "react";
import Link from "next/link";

interface EntradaProducto {
    id: string;
    productoId: string;
    cantidad: number;
    costoUnitario: number;
}

export default function NuevoActivoPage() {
    // Lista maestra de productos harcodeada (simulando BD)
    const productosBD = [
        { id: "p1", nombre: "Cloro Magia Blanca", categoria: "Suministros de limpieza", unidad: "Galones" },
        { id: "p2", nombre: "Café Oro Premium", categoria: "Alimentos y bebidas", unidad: "Libras" },
        { id: "p3", nombre: "Edredón King Size", categoria: "Muebles / Ropa de cama", unidad: "Piezas" },
        { id: "p4", nombre: "Limpia Vidrios Industrial", categoria: "Suministros de limpieza", unidad: "Botellas" },
        { id: "p5", nombre: "Toallas de baño (Piso 4)", categoria: "Muebles / Ropa de cama", unidad: "Piezas" }
    ];

    // Fecha por defecto del sistema (Hoy)
    const today = new Date().toISOString().split('T')[0];
    const [fechaEntrada, setFechaEntrada] = useState(today);

    // Estado para manejar la tabla de productos comprados
    const [entradas, setEntradas] = useState<EntradaProducto[]>([
        { id: "1", productoId: "p1", cantidad: 50, costoUnitario: 8.50 },
        { id: "2", productoId: "p2", cantidad: 100, costoUnitario: 4.20 }
    ]);

    // Agregar nueva fila vacía
    const agregarFila = () => {
        const nuevaFila: EntradaProducto = {
            id: Math.random().toString(),
            productoId: "",
            cantidad: 1,
            costoUnitario: 0
        };
        setEntradas([...entradas, nuevaFila]);
    };

    // Eliminar fila
    const eliminarFila = (id: string) => {
        if (entradas.length > 1) {
            setEntradas(entradas.filter(item => item.id !== id));
        }
    };

    // Actualizar valores reactivos de la tabla
    const actualizarValor = (id: string, campo: keyof EntradaProducto, valor: string | number) => {
        setEntradas(entradas.map(item => {
            if (item.id === id) {
                return { ...item, [campo]: valor };
            }
            return item;
        }));
    };

    // Cálculos totales
    const totalItems = entradas.reduce((acc, item) => acc + (Number(item.cantidad) || 0), 0);
    const costoTotalFactura = entradas.reduce((acc, item) => acc + ((Number(item.cantidad) || 0) * (Number(item.costoUnitario) || 0)), 0);

    return (
        <ViewTransition enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}>
            <PageHeader
                name="Nueva Entrada de Activos"
                subtitle="Registre el ingreso de insumos y mercadería comprada al almacén central"
                buttons={
                    <Link href="/bd/inventario" className="hover:cursor-pointer hover:-translate-y-0.5 flex items-center justify-center gap-2 border border-slate-300 text-slate-700 py-3 px-5 rounded-[2.5rem] text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider transition-transform active:scale-95 bg-white shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span> Cancelar
                    </Link>
                }
            />

            <div className="flex-1 flex flex-col lg:flex-row gap-6 max-w-360 mx-auto w-full mt-2">
                {/* Columna Principal: Formulario de la tabla de compras */}
                <div className="flex-1 flex flex-col gap-4 bg-white rounded-xl border border-slate-300 card-shadow overflow-hidden">
                    <div className="p-6 border-b border-slate-300 card-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h3 className="text-base font-bold text-slate-950">Desglose de Productos Comprados</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Asigne cantidades y costos unitarios reales de factura</p>
                        </div>
                        <button
                            onClick={agregarFila}
                            type="button"
                            className="flex items-center gap-1.5 px-4 py-2 bg-slate-950 text-white rounded-lg font-bold text-xs hover:bg-slate-800 transition-all shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span> Agregar fila
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-300 card-shadow">
                                    <th className="text-xs font-bold text-slate-500 py-3 px-6 w-1/3">Producto</th>
                                    <th className="text-xs font-bold text-slate-500 py-3 px-6">Unidad</th>
                                    <th className="text-xs font-bold text-slate-500 py-3 px-6 text-right w-28">Cantidad</th>
                                    <th className="text-xs font-bold text-slate-500 py-3 px-6 text-right w-36">Costo Unitario</th>
                                    <th className="text-xs font-bold text-slate-500 py-3 px-6 text-right w-36">Total</th>
                                    <th className="text-xs font-bold text-slate-500 py-3 px-6 text-center w-16">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-800 divide-y divide-slate-100">
                                {entradas.map((item) => {
                                    const prodSeleccionado = productosBD.find(p => p.id === item.productoId);
                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3 px-6">
                                                <select
                                                    value={item.productoId}
                                                    onChange={(e) => actualizarValor(item.id, "productoId", e.target.value)}
                                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-950 rounded-lg text-sm transition-colors"
                                                >
                                                    <option value="" disabled>-- Seleccione un producto --</option>
                                                    {productosBD.map(p => (
                                                        <option key={p.id} value={p.id}>{p.nombre} ({p.categoria})</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="py-3 px-6 text-slate-500 text-sm font-medium">
                                                {prodSeleccionado ? prodSeleccionado.unidad : "—"}
                                            </td>
                                            <td className="py-3 px-6">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.cantidad}
                                                    onChange={(e) => actualizarValor(item.id, "cantidad", parseInt(e.target.value) || 0)}
                                                    className="w-full text-right px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-950 rounded-lg text-sm font-semibold"
                                                />
                                            </td>
                                            <td className="py-3 px-6">
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={item.costoUnitario}
                                                        onChange={(e) => actualizarValor(item.id, "costoUnitario", parseFloat(e.target.value) || 0)}
                                                        className="w-full text-right pl-6 pr-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-950 rounded-lg text-sm font-semibold"
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-right font-bold text-slate-950 text-sm">
                                                ${((item.cantidad || 0) * (item.costoUnitario || 0)).toFixed(2)}
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <button
                                                    type="button"
                                                    disabled={entradas.length === 1}
                                                    onClick={() => eliminarFila(item.id)}
                                                    className="text-red-500 hover:text-red-700 disabled:opacity-30 p-1 rounded-md hover:bg-red-50 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                        <p className="text-xs text-slate-400 italic">Cada producto guardado actualizará automáticamente el stock maestro actual del hotel.</p>
                    </div>
                </div>

                {/* Columna Lateral: Resumen Financiero y Datos Metadatos */}
                <div className="w-full lg:w-96 flex flex-col gap-6">
                    {/* Tarjeta de Datos de Sello de Entrada */}
                    <div className="bg-white rounded-xl border border-slate-300 card-shadow p-6 flex flex-col gap-4">
                        <h3 className="text-sm font-bold text-slate-950">Información del Registro</h3>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha de Entrada</label>
                            <input
                                type="date"
                                value={fechaEntrada}
                                onChange={(e) => setFechaEntrada(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-950 rounded-lg text-sm transition-colors"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Responsable del Almacén</label>
                            <input
                                type="text"
                                readOnly
                                value="Auditor de Turno (Sistema)"
                                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed rounded-lg text-sm font-medium"
                            />
                        </div>
                    </div>

                    {/* Tarjeta de Totales */}
                    <div className="bg-slate-950 text-white rounded-xl card-shadow p-6 flex flex-col gap-4">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resumen de Cargo</h3>

                        <div className="flex flex-col gap-2 mt-1">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Filas activas</span>
                                <span className="font-medium">{entradas.length}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Total unidades ingresadas</span>
                                <span className="font-medium">{totalItems}</span>
                            </div>
                            <hr className="border-slate-800 my-2" />
                            <div className="flex justify-between items-end">
                                <span className="text-sm text-slate-400 font-medium">Inversión Total</span>
                                <span className="text-3xl font-bold text-white tracking-tight">${costoTotalFactura.toFixed(2)}</span>
                            </div>
                        </div>

                        <button className="w-full mt-2 flex items-center justify-center gap-2 bg-white text-slate-950 py-3.5 px-4 rounded-xl text-sm leading-4 font-bold tracking-wide hover:bg-slate-100 transition-all active:scale-98 shadow-md">
                            <span className="material-symbols-outlined text-[18px]">save</span> Guardar en Inventario
                        </button>
                    </div>
                </div>
            </div>
        </ViewTransition>
    );
}