"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/pageheader";
import { ViewTransition } from "react";
import Link from "next/link";
import { getProveedores, Proveedor } from "@/functions/proveedores";
import { getProductos, Producto, Compra, registrarCompra, DetalleCompra } from "@/functions/productos";
import { ValidatedInput, ValidatedSelect } from "@/components/ui/validated-field";

export default function NuevoActivoPage() {
    const [proveedores, setProveedores] = useState<Proveedor>([]);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState<number>();
    const [factura, setFactura] = useState<string>('');
    const [productos, setProductos] = useState<Producto>([]);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const cargarProveedores = async () => {
            try {
                const data = await getProveedores();
                console.log("Datos recibidos de la API:", data);
                setProveedores(data);
            } catch (error) {
                console.error("Error cargando la reserva desde la API:", error);
            }
        };
        cargarProveedores();
    }, []);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const data = await getProductos(proveedorSeleccionado);
                console.log("Datos recibidos de la API:", data);
                setProductos(data);
            } catch (error) {
                console.error("Error cargando los productos desde la API:", error);
            }
        };
        cargarProductos();
    }, [proveedorSeleccionado])

    // Fecha por defecto del sistema (Hoy)
    const today = new Date().toISOString().split('T')[0];
    const [fechaEntrada, setFechaEntrada] = useState(today);

    // Estado para manejar la tabla de productos comprados
    const [entradas, setEntradas] = useState<Producto[]>([
        { id: "1", producto_id: 0, cantidad: 25, costo_unitario: 8.50 },
    ]);

    // Agregar nueva fila vacía
    const agregarFila = () => {
        const nuevaFila: Producto = {
            id: crypto.randomUUID(),
            producto_id: 0,
            cantidad: 1,
            costo_unitario: 0
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
    const actualizarValor = (id: string, campo: keyof Producto, valor: string | number | boolean | null) => {
        setEntradas(entradas.map(item => {
            if (item.id === id) {
                return { ...item, [campo]: valor };
            }
            return item;
        }));
    };

    // Cálculos totales
    const totalItems = entradas.reduce((acc, item) => acc + (Number(item.cantidad) || 0), 0);
    const costoTotalFactura = entradas.reduce((acc, item) => acc + ((Number(item.cantidad) || 0) * (Number(item.costo_unitario) || 0)), 0);

    const validateCompraForm = () => {
        const nextErrors: Record<string, string> = {};

        if (!proveedorSeleccionado) {
            nextErrors.proveedorSeleccionado = "Selecciona un proveedor.";
        }
        if (!factura.trim()) {
            nextErrors.factura = "Ingresa el número de factura.";
        } else if (!/^[A-Za-z0-9-]{2,25}$/.test(factura.trim())) {
            nextErrors.factura = "El número de factura debe tener solo letras, números o guiones.";
        }
        if (!fechaEntrada) {
            nextErrors.fechaEntrada = "Selecciona la fecha de entrada.";
        }

        entradas.forEach((item) => {
            if (!item.producto_id || Number(item.producto_id) <= 0) {
                nextErrors[`producto_${item.id}`] = "Selecciona un producto.";
            }
            const cantidad = Number(item.cantidad);
            if (!Number.isFinite(cantidad) || !Number.isInteger(cantidad) || cantidad <= 0 || cantidad > 1000) {
                nextErrors[`cantidad_${item.id}`] = "La cantidad debe ser un entero entre 1 y 1000.";
            }
            const costo = Number(item.costo_unitario);
            if (!Number.isFinite(costo) || costo <= 0 || costo > 100000) {
                nextErrors[`costo_${item.id}`] = "El costo debe ser mayor a cero y menor o igual a 100,000.";
            }
        });

        setFormErrors(nextErrors);
        setTouched({ proveedorSeleccionado: true, factura: true, fechaEntrada: true });
        return Object.keys(nextErrors).length === 0;
    };

    const validateCompraField = (field: string) => {
        const nextErrors: Record<string, string> = { ...formErrors };

        switch (field) {
            case "proveedorSeleccionado":
                if (!proveedorSeleccionado) {
                    nextErrors.proveedorSeleccionado = "Selecciona un proveedor.";
                } else {
                    delete nextErrors.proveedorSeleccionado;
                }
                break;
            case "factura":
                if (!factura.trim()) {
                    nextErrors.factura = "Ingresa el número de factura.";
                } else if (!/^[A-Za-z0-9-]{2,25}$/.test(factura.trim())) {
                    nextErrors.factura = "El número de factura debe tener solo letras, números o guiones.";
                } else {
                    delete nextErrors.factura;
                }
                break;
            case "fechaEntrada":
                if (!fechaEntrada) {
                    nextErrors.fechaEntrada = "Selecciona la fecha de entrada.";
                } else {
                    delete nextErrors.fechaEntrada;
                }
                break;
        }

        setFormErrors(nextErrors);
        setTouched((prev) => ({ ...prev, [field]: true }));
        return !nextErrors[field];
    };

    const handleDetalleBlur = (id: string, detailField: "producto" | "cantidad" | "costo") => {
        const nextErrors: Record<string, string> = { ...formErrors };
        const item = entradas.find((entrada) => entrada.id === id);
        if (!item) {
            return false;
        }

        const key = detailField === "producto"
            ? `producto_${id}`
            : detailField === "cantidad"
                ? `cantidad_${id}`
                : `costo_${id}`;

        switch (detailField) {
            case "producto":
                if (!item.producto_id || Number(item.producto_id) <= 0) {
                    nextErrors[key] = "Selecciona un producto.";
                } else {
                    delete nextErrors[key];
                }
                break;
            case "cantidad":
                {
                    const cantidad = Number(item.cantidad);
                    if (!Number.isFinite(cantidad) || !Number.isInteger(cantidad) || cantidad <= 0 || cantidad > 1000) {
                        nextErrors[key] = "La cantidad debe ser un entero entre 1 y 1000.";
                    } else {
                        delete nextErrors[key];
                    }
                }
                break;
            case "costo":
                {
                    const costo = Number(item.costo_unitario);
                    if (!Number.isFinite(costo) || costo <= 0 || costo > 100000) {
                        nextErrors[key] = "El costo debe ser mayor a cero y menor o igual a 100,000.";
                    } else {
                        delete nextErrors[key];
                    }
                }
                break;
        }

        setFormErrors(nextErrors);
        setTouched((prev) => ({ ...prev, [key]: true }));
        return !nextErrors[key];
    };

    // Esta función se ejecutaría, por ejemplo, al hacer submit en tu formulario
    async function handleGuardarCompra() {
        if (!validateCompraForm()) {
            return;
        }

        try {
            // 1. Limpiamos y formateamos los detalles del estado 'entradas'
            // Desestructuramos para quitar el 'id' local de la tabla y quedarnos con el resto
            const detallesFormateados: DetalleCompra[] = entradas.map((entrada) => ({
                producto_id: Number(entrada.producto_id),
                cantidad: Number(entrada.cantidad),
                costo_unitario: Number(entrada.costo_unitario)
            }));

            // Opcional: Validación rápida antes de enviar
            if (detallesFormateados.some(d => d.producto_id === 0 || d.cantidad <= 0)) {
                alert("Por favor, asegúrate de seleccionar un producto y colocar cantidades válidas.");
                return;
            }

            // 2. Armamos el objeto final combinando tus estados
            const nuevaCompra: Compra = {
                proveedor_id: proveedorSeleccionado!, // Tu estado del proveedor
                numero_factura_proveedor: factura.trim(),
                fecha_compra: new Date().toISOString(),
                detalles: detallesFormateados // Los detalles ya limpios sin el id temporal
            };

            // 3. Enviamos a la API
            const respuesta = await registrarCompra(nuevaCompra);

            alert(`¡Compra guardada con éxito! ID: ${respuesta.compra_id}`);

            // Opcional: Reiniciar la tabla a su estado inicial tras guardar con éxito
            setEntradas([{ id: crypto.randomUUID(), producto_id: 0, cantidad: 1, costo_unitario: 0 }]);

        } catch (error) {
            console.error("Error al guardar la compra:", error);
            alert("Hubo un error al registrar la compra.");
        }
    }

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

                    <div className="p-6 flex gap-5 items-center justify-start">
                        <p className="font-bold">Proveedor: </p>
                        <ValidatedSelect
                            label=""
                            value={proveedorSeleccionado ? String(proveedorSeleccionado) : ""}
                            onChange={(value) => {
                                setProveedorSeleccionado(Number(value));
                                setFormErrors((prev) => ({ ...prev, proveedorSeleccionado: "" }));
                            }}
                            onBlur={() => {
                                setTouched((prev) => ({ ...prev, proveedorSeleccionado: true }));
                                validateCompraField("proveedorSeleccionado");
                            }}
                            onFocus={() => setTouched((prev) => ({ ...prev, proveedorSeleccionado: true }))}
                            error={formErrors.proveedorSeleccionado}
                            touched={touched.proveedorSeleccionado || Boolean(formErrors.proveedorSeleccionado)}
                            className="w-1/3 px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-950 rounded-lg text-sm transition-colors"
                            containerClassName="w-1/3"
                            placeholder="-- Seleccione un proveedor --"
                            options={proveedores.map((p: Proveedor) => ({ label: p.nombre, value: String(p.proveedor_id) }))}
                        />
                        <ValidatedInput
                            label=""
                            value={factura}
                            onChange={(value) => {
                                setFactura(value);
                                setFormErrors((prev) => ({ ...prev, factura: "" }));
                            }}
                            onBlur={() => {
                                setTouched((prev) => ({ ...prev, factura: true }));
                                validateCompraField("factura");
                            }}
                            onFocus={() => setTouched((prev) => ({ ...prev, factura: true }))}
                            error={formErrors.factura}
                            touched={touched.factura || Boolean(formErrors.factura)}
                            placeholder="Número de factura"
                            className="px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-950 rounded-lg text-sm transition-colors"
                            containerClassName="flex-1"
                        />
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
                                    const prodSeleccionado = productos.find((p: Producto) => p.producto_id === item.producto_id);
                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3 px-6">
                                                <select
                                                    value={item.producto_id}
                                                    onChange={(e) => {
                                                        actualizarValor(item.id, "producto_id", Number(e.target.value));
                                                        setFormErrors((prev) => ({ ...prev, [`producto_${item.id}`]: "" }));
                                                    }}
                                                    onBlur={() => handleDetalleBlur(item.id, "producto")}
                                                    className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm transition-colors ${formErrors[`producto_${item.id}`] ? "border-red-400 focus:ring-red-500" : "border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-950"}`}
                                                >
                                                    <option value="" disabled>-- Seleccione un producto --</option>
                                                    {productos.map((p: Producto) => (
                                                        <option key={p.producto_id} value={p.producto_id}>{p.nombre} ({p.categoria})</option>
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
                                                    onChange={(e) => {
                                                        actualizarValor(item.id, "cantidad", parseInt(e.target.value) || 0);
                                                        setFormErrors((prev) => ({ ...prev, [`cantidad_${item.id}`]: "" }));
                                                    }}
                                                    onBlur={() => handleDetalleBlur(item.id, "cantidad")}
                                                    className={`w-full text-right px-3 py-2 bg-slate-50 border rounded-lg text-sm font-semibold ${formErrors[`cantidad_${item.id}`] ? "border-red-400 focus:ring-red-500" : "border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-950"}`}
                                                />
                                                {formErrors[`cantidad_${item.id}`] ? <p className="mt-2 text-xs text-red-500">{formErrors[`cantidad_${item.id}`]}</p> : null}
                                            </td>
                                            <td className="py-3 px-6">
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">L.</span>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={item.costo_unitario}
                                                        onChange={(e) => {
                                                            actualizarValor(item.id, "costo_unitario", parseFloat(e.target.value) || 0);
                                                            setFormErrors((prev) => ({ ...prev, [`costo_${item.id}`]: "" }));
                                                        }}
                                                        onBlur={() => handleDetalleBlur(item.id, "costo")}
                                                        className={`w-full text-right pl-6 pr-3 py-2 bg-slate-50 border rounded-lg text-sm font-semibold ${formErrors[`costo_${item.id}`] ? "border-red-400 focus:ring-red-500" : "border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-950"}`}
                                                    />
                                                    {formErrors[`costo_${item.id}`] ? <p className="mt-2 text-xs text-red-500">{formErrors[`costo_${item.id}`]}</p> : null}
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-right font-bold text-slate-950 text-sm">
                                                L. {((item.cantidad || 0) * (item.costo_unitario || 0)).toFixed(2)}
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
                            <ValidatedInput
                                label=""
                                type="date"
                                value={fechaEntrada}
                                onChange={(value) => {
                                    setFechaEntrada(value);
                                    setFormErrors((prev) => ({ ...prev, fechaEntrada: "" }));
                                }}
                                onBlur={() => {
                                    setTouched((prev) => ({ ...prev, fechaEntrada: true }));
                                    validateCompraField("fechaEntrada");
                                }}
                                onFocus={() => setTouched((prev) => ({ ...prev, fechaEntrada: true }))}
                                error={formErrors.fechaEntrada}
                                touched={touched.fechaEntrada || Boolean(formErrors.fechaEntrada)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-950 rounded-lg text-sm transition-colors"
                                containerClassName=""
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

                        <button onClick={handleGuardarCompra} className="w-full mt-2 flex items-center justify-center gap-2 bg-white text-slate-950 py-3.5 px-4 rounded-xl text-sm leading-4 font-bold tracking-wide hover:bg-slate-100 transition-all active:scale-98 shadow-md">
                            <span className="material-symbols-outlined text-[18px]">save</span> Guardar en Inventario
                        </button>
                    </div>
                </div>
            </div>
        </ViewTransition>
    );
}