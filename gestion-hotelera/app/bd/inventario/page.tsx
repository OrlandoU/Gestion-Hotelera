"use client";

import PageHeader from "@/components/pageheader";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getProductosStock, type Producto } from "@/functions/productos";

export default function InventarioPage() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const cargarProductos = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getProductosStock();
                if (isMounted) {
                    setProductos(data);
                }
            } catch (err) {
                if (isMounted) {
                    setError("No se pudo cargar el inventario en este momento.");
                    console.error("Error al obtener productos en stock:", err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        cargarProductos();

        return () => {
            isMounted = false;
        };
    }, []);

    const resumen = useMemo(() => {
        const stockBajo = productos.filter((producto) => (producto.cantidad ?? 0) <= 5).length;
        const agotados = productos.filter((producto) => (producto.cantidad ?? 0) === 0).length;
        const activos = productos.filter((producto) => producto.estado_activo !== false).length;
        const alertas = [...productos]
            .filter((producto) => (producto.cantidad ?? 0) <= 5)
            .sort((a, b) => (a.cantidad ?? 0) - (b.cantidad ?? 0))
            .slice(0, 3);

        return { stockBajo, agotados, activos, alertas };
    }, [productos]);

    const getEstadoStock = (producto: Producto) => {
        const cantidad = producto.cantidad ?? 0;
        if (!producto.estado_activo) return { label: "Inactivo", color: "bg-slate-400", text: "text-slate-600" };
        if (cantidad === 0) return { label: "Agotado", color: "bg-red-600", text: "text-red-600" };
        if (cantidad <= 5) return { label: "Stock bajo", color: "bg-amber-500", text: "text-amber-600" };
        return { label: "En stock", color: "bg-emerald-500", text: "text-emerald-600" };
    };

    return (
        <>
            <PageHeader name="Inventario" subtitle="Gestione y supervise los activos del hotel en tiempo real" buttons={<Link href="/bd/inventario/nuevo" className="hover:cursor-pointer hover:-translate-y-0.5 right-4 bottom-4 flex items-center justify-center gap-2 bg-[#000000] text-[#ffffff] py-4 px-6 rounded-[2.5rem] text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider transition-transform active:scale-95 shadow-lg">
                <span className="material-symbols-outlined text-[18px]">add</span> Nuevo Activo
            </Link>} />
            <div className="flex-1 flex flex-col gap-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <div className="md:col-span-2 bg-white rounded-xl border border-slate-300 card-shadow  p-6 card-shadow flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-base font-bold text-slate-950">Auditoría de inventario</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Última ejecución: Hoy, 08:00</p>
                            </div>
                            <button className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white rounded-lg font-bold text-xs hover:bg-sky-500 transition-all shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">sync</span> Ejecutar auditoría
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-1">
                            <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-1 border border-slate-100">
                                <span className="text-xs font-medium text-slate-500">Total de activos</span>
                                <span className="text-xl font-bold text-slate-950">{productos.length}</span>
                            </div>
                            <div className="bg-red-50 rounded-xl p-4 flex flex-col gap-1 border border-red-100">
                                <span className="text-xs font-bold text-red-600">Críticamente bajo</span>
                                <span className="text-xl font-bold text-red-600">{resumen.stockBajo}</span>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-1 border border-slate-100">
                                <span className="text-xs font-medium text-slate-500">Activos habilitados</span>
                                <span className="text-xl font-bold text-slate-950">{resumen.activos}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-300 card-shadow  p-6 card-shadow flex flex-col gap-4">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Capacidad de almacenamiento</h3>
                        <div className="flex-1 flex flex-col justify-center gap-2">
                            <div className="flex justify-between items-end">
                                <span className="text-2xl font-bold text-slate-950">78%</span>
                                <span className="text-xs text-slate-500 mb-0.5">Utilización</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-300 card-shadow /40">
                                <div className="bg-slate-950 h-full rounded-full" style={{ width: "78%" }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-300 card-shadow  p-6 card-shadow flex flex-col gap-2">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Alertas urgentes</h3>
                        <ul className="flex flex-col gap-2.5">
                            {resumen.alertas.length > 0 ? (
                                resumen.alertas.map((producto) => (
                                    <li key={producto.producto_id ?? producto.nombre} className="flex items-center gap-2 text-xs font-medium text-slate-800">
                                        <div className="w-2 h-2 rounded-full bg-red-600"></div>
                                        {producto.nombre} ({producto.cantidad ?? 0} {producto.unidad})
                                    </li>
                                ))
                            ) : (
                                <li className="text-xs font-medium text-slate-500">No hay alertas de stock por el momento.</li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-300 card-shadow  card-shadow overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-300 card-shadow  flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h3 className="text-base font-bold text-slate-950">Lista maestra de activos</h3>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative w-full md:w-64">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                <input readOnly className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 card-shadow  focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent rounded-lg text-sm transition-colors" placeholder="Buscar inventario..." type="text" />
                            </div>
                            <button className="p-2 border border-slate-300 card-shadow  rounded-lg hover:bg-slate-50 text-slate-500 flex items-center justify-center transition-colors">
                                <span className="material-symbols-outlined">filter_list</span>
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="py-10 text-center text-sm text-slate-500">Cargando inventario...</div>
                        ) : error ? (
                            <div className="py-10 text-center text-sm text-red-600">{error}</div>
                        ) : productos.length === 0 ? (
                            <div className="py-10 text-center text-sm text-slate-500">No hay productos disponibles en stock.</div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-300 card-shadow ">
                                        <th className="text-xs font-bold text-slate-500 py-3 px-6">Nombre</th>
                                        <th className="text-xs font-bold text-slate-500 py-3 px-6">Categoría</th>
                                        <th className="text-xs font-bold text-slate-500 py-3 px-6 text-right">Stock actual</th>
                                        <th className="text-xs font-bold text-slate-500 py-3 px-6">Unidad</th>
                                        <th className="text-xs font-bold text-slate-500 py-3 px-6">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-800 divide-y divide-slate-100">
                                    {productos.map((producto) => {
                                        const estado = getEstadoStock(producto);
                                        return (
                                            <tr key={producto.producto_id ?? producto.nombre} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="py-3.5 px-6 font-medium text-slate-900">
                                                    <div className="flex flex-col">
                                                        <span>{producto.nombre}</span>
                                                        <span className="text-xs text-slate-500">Proveedor #{producto.proveedor_id ?? "—"}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-6 text-slate-500">{producto.categoria ?? "Sin categoría"}</td>
                                                <td className="py-3.5 px-6 text-right font-bold text-slate-900">{producto.cantidad ?? 0}</td>
                                                <td className="py-3.5 px-6 text-slate-500">{producto.unidad ?? "—"}</td>
                                                <td className="py-3.5 px-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${estado.color}`}></div>
                                                        <span className={`text-xs font-semibold ${estado.text}`}>{estado.label}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="p-4 border-t border-slate-300 card-shadow  bg-white flex justify-between items-center text-xs text-slate-500">
                        <span>Mostrando 1 a 4 de 124 entradas</span>
                        <div className="flex gap-1">
                            <button className="p-1 border border-slate-300 card-shadow  rounded hover:bg-slate-50 disabled:opacity-50" disabled>
                                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                            </button>
                            <button className="px-3 py-1 bg-slate-950 text-white rounded font-medium">1</button>
                            <button className="px-3 py-1 hover:bg-slate-100 rounded transition-colors">2</button>
                            <button className="px-3 py-1 hover:bg-slate-100 rounded transition-colors">3</button>
                            <button className="p-1 border border-slate-300 card-shadow  rounded hover:bg-slate-50 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}