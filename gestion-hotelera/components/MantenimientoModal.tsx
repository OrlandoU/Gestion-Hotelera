"use client";
import React, { useState, useEffect } from "react";
import { getHabitaciones, Habitacion } from "@/functions/espacios";
import { useUsuarios } from "@/functions/usuarios"
import { crearMantenimiento, Mantenimiento } from "@/functions/mantenimientos"
import Modal from "./Modal"; // Importa la base de arriba

interface FormModalProps {
    open: boolean;
    onClose: () => void;
    onSave?: (data: Mantenimiento) => void;
}

export default function MantenimientoModal({ open, onClose, onSave }: FormModalProps) {
    const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);

    useEffect(() => {
        let isMounted = true;

        const cargarHabitaciones = async () => {
            const datos = await getHabitaciones();
            if (isMounted) {
                setHabitaciones(datos);
            }
        };

        void cargarHabitaciones();

        return () => {
            isMounted = false;
        };
    }, []);

    const [mantenimiento, setMantenimiento] = useState<Mantenimiento>({
        usuario_id: 1,
        responsable_id: null,
        nombre_responsable: null,
        telefono_responsable: null,
        tipo: "",
        descripcion: "",
        fecha_inicio: null,
        fecha_final: null,
        prioridad: "",
        estado: "",
        espacio_id: 34,
    });

    const { data } = useUsuarios();
    const empleados = data ?? [];

    const [esInterno, setEsInterno] = useState<boolean>(true);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Función para alternar entre Interno y Externo
    const handleTipoResponsableChange = (isInternal: boolean) => {
        setEsInterno(isInternal);
        setMantenimiento((prev) => ({
            ...prev,
            // Limpiamos los campos opuestos
            responsable_id: isInternal ? prev.responsable_id : null,
            nombre_responsable: !isInternal ? prev.nombre_responsable : null,
            telefono_responsable: !isInternal ? prev.telefono_responsable : null,
        }));
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        const normalizedValue = name === "espacio_id" || name === "responsable_id"
            ? (value ? Number(value) : null)
            : value;

        setMantenimiento((prev) => ({
            ...prev,
            [name]: normalizedValue,
        }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateField = (field: string) => {
        const nextErrors: Record<string, string> = { ...errors };

        switch (field) {
            case "tipo":
                if (!mantenimiento.tipo) {
                    nextErrors.tipo = "Selecciona un tipo de mantenimiento.";
                } else {
                    delete nextErrors.tipo;
                }
                break;
            case "prioridad":
                if (!mantenimiento.prioridad) {
                    nextErrors.prioridad = "Selecciona una prioridad.";
                } else {
                    delete nextErrors.prioridad;
                }
                break;
            case "estado":
                if (!mantenimiento.estado) {
                    nextErrors.estado = "Selecciona un estado inicial.";
                } else {
                    delete nextErrors.estado;
                }
                break;
            case "espacio_id":
                if (!mantenimiento.espacio_id) {
                    nextErrors.espacio_id = "Selecciona un espacio.";
                } else {
                    delete nextErrors.espacio_id;
                }
                break;
            case "descripcion":
                if (!mantenimiento.descripcion || !mantenimiento.descripcion.trim()) {
                    nextErrors.descripcion = "Describe el trabajo a realizar.";
                } else {
                    delete nextErrors.descripcion;
                }
                break;
            case "responsable_id":
                if (esInterno) {
                    if (!mantenimiento.responsable_id) {
                        nextErrors.responsable_id = "Selecciona un empleado responsable.";
                    } else {
                        delete nextErrors.responsable_id;
                    }
                }
                break;
            case "nombre_responsable":
                if (!esInterno) {
                    if (!mantenimiento.nombre_responsable?.trim()) {
                        nextErrors.nombre_responsable = "Ingresa el nombre del responsable externo.";
                    } else {
                        delete nextErrors.nombre_responsable;
                    }
                }
                break;
            case "telefono_responsable":
                if (!esInterno) {
                    if (!mantenimiento.telefono_responsable?.trim()) {
                        nextErrors.telefono_responsable = "Ingresa un teléfono válido.";
                    } else {
                        delete nextErrors.telefono_responsable;
                    }
                }
                break;
            default:
                break;
        }

        setErrors(nextErrors);
        return !nextErrors[field];
    };

    const validateForm = () => {
        const nextErrors: Record<string, string> = {};

        if (!mantenimiento.tipo) nextErrors.tipo = "Selecciona un tipo de mantenimiento.";
        if (!mantenimiento.prioridad) nextErrors.prioridad = "Selecciona una prioridad.";
        if (!mantenimiento.estado) nextErrors.estado = "Selecciona un estado inicial.";
        if (!mantenimiento.espacio_id) nextErrors.espacio_id = "Selecciona un espacio.";
        if (!mantenimiento.descripcion || !mantenimiento.descripcion.trim()) nextErrors.descripcion = "Describe el trabajo a realizar.";

        if (esInterno) {
            if (!mantenimiento.responsable_id) nextErrors.responsable_id = "Selecciona un empleado responsable.";
        } else {
            if (!mantenimiento.nombre_responsable?.trim()) nextErrors.nombre_responsable = "Ingresa el nombre del responsable externo.";
            if (!mantenimiento.telefono_responsable?.trim()) nextErrors.telefono_responsable = "Ingresa un teléfono válido.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const datosAEnviar = {
            ...mantenimiento,
            responsable_id: mantenimiento.responsable_id ? Number(mantenimiento.responsable_id) : null,
        };

        await crearMantenimiento(datosAEnviar);
        onSave?.(datosAEnviar as Mantenimiento);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose} title="Nuevo Mantenimiento">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                        ¿El responsable es personal interno?
                    </label>
                    <div className="flex items-center gap-6 text-sm text-slate-700">
                        <label className="flex items-center gap-2 cursor-pointer font-medium">
                            <input
                                type="radio"
                                name="tipo_responsable_toggle"
                                checked={esInterno}
                                onChange={() => handleTipoResponsableChange(true)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span>Sí, empleado interno</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer font-medium">
                            <input
                                type="radio"
                                name="tipo_responsable_toggle"
                                checked={!esInterno}
                                onChange={() => handleTipoResponsableChange(false)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span>No, técnico/personal externo</span>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {esInterno ? (
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                                Empleado Responsable
                            </label>
                            <select
                                name="responsable_id"
                                value={mantenimiento.responsable_id ?? ""}
                                onChange={handleChange}
                                onBlur={() => validateField("responsable_id")}
                                required={esInterno}
                                className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all cursor-pointer text-slate-700 ${errors.responsable_id ? "border-red-400 focus:ring-red-500" : "border-slate-200 focus:ring-blue-500 focus:border-transparent"}`}
                            >
                                <option value="" disabled>Selecciona un empleado</option>
                                {empleados?.map((emp) => (
                                    <option key={emp.usuario_id} value={emp.usuario_id}>
                                        {emp.primer_nombre + ' ' + emp.primer_apellido}
                                    </option>
                                ))}
                            </select>
                            {errors.responsable_id ? <p className="mt-1 text-xs text-red-500">{errors.responsable_id}</p> : null}
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                                    Nombre del Responsable Externo
                                </label>
                                <input
                                    type="text"
                                    name="nombre_responsable"
                                    value={mantenimiento.nombre_responsable ?? ""}
                                    onChange={handleChange}
                                    onBlur={() => validateField("nombre_responsable")}
                                    placeholder="Ej. Juan Pérez"
                                    required={!esInterno}
                                    className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 ${errors.nombre_responsable ? "border-red-400 focus:ring-red-500" : "border-slate-200 focus:ring-blue-500 focus:border-transparent"}`}
                                />
                                {errors.nombre_responsable ? <p className="mt-1 text-xs text-red-500">{errors.nombre_responsable}</p> : null}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                                    Teléfono del Responsable
                                </label>
                                <input
                                    type="tel"
                                    name="telefono_responsable"
                                    value={mantenimiento.telefono_responsable ?? ""}
                                    onChange={handleChange}
                                    onBlur={() => validateField("telefono_responsable")}
                                    placeholder="Ej. +504 9999-9999"
                                    required={!esInterno}
                                    className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 ${errors.telefono_responsable ? "border-red-400 focus:ring-red-500" : "border-slate-200 focus:ring-blue-500 focus:border-transparent"}`}
                                />
                                {errors.telefono_responsable ? <p className="mt-1 text-xs text-red-500">{errors.telefono_responsable}</p> : null}
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                            Número de Espacio
                        </label>
                        <select
                            name="espacio_id"
                            value={mantenimiento.espacio_id ?? ""}
                            onChange={handleChange}
                            onBlur={() => validateField("espacio_id")}
                            required
                            className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all cursor-pointer text-slate-700 ${errors.espacio_id ? "border-red-400 focus:ring-red-500" : "border-slate-200 focus:ring-blue-500 focus:border-transparent"}`}
                        >
                            <option value="" disabled>Selecciona un espacio</option>
                            {habitaciones.map((habitacion) => (
                                <option key={habitacion.espacio_id} value={habitacion.espacio_id}>
                                    {habitacion.numero_espacio}
                                </option>
                            ))}
                        </select>
                        {errors.espacio_id ? <p className="mt-1 text-xs text-red-500">{errors.espacio_id}</p> : null}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                            Tipo
                        </label>
                        <select
                            name="tipo"
                            value={mantenimiento.tipo ?? ""}
                            onChange={handleChange}
                            onBlur={() => validateField("tipo")}
                            required
                            className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all cursor-pointer text-slate-700 ${errors.tipo ? "border-red-400 focus:ring-red-500" : "border-slate-200 focus:ring-blue-500 focus:border-transparent"}`}
                        >
                            <option value="" disabled>Selecciona tipo</option>
                            <option value="Correctivo">Correctivo</option>
                            <option value="Preventivo">Preventivo</option>
                            <option value="Predictivo">Predictivo</option>
                            <option value="Aseo">Aseo</option>
                        </select>
                        {errors.tipo ? <p className="mt-1 text-xs text-red-500">{errors.tipo}</p> : null}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                            Prioridad
                        </label>
                        <select
                            name="prioridad"
                            value={mantenimiento.prioridad ?? ""}
                            onChange={handleChange}
                            onBlur={() => validateField("prioridad")}
                            required
                            className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all cursor-pointer text-slate-700 ${errors.prioridad ? "border-red-400 focus:ring-red-500" : "border-slate-200 focus:ring-blue-500 focus:border-transparent"}`}
                        >
                            <option value="" disabled>Selecciona prioridad</option>
                            <option value="Baja">Baja</option>
                            <option value="Media">Media</option>
                            <option value="Alta">Alta</option>
                            <option value="Urgente">Urgente</option>
                        </select>
                        {errors.prioridad ? <p className="mt-1 text-xs text-red-500">{errors.prioridad}</p> : null}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                            Fecha de Inicio
                        </label>
                        <input
                            type="date"
                            name="fecha_inicio"
                            value={mantenimiento.fecha_inicio ?? ""}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                            Fecha Final
                        </label>
                        <input
                            type="date"
                            name="fecha_final"
                            value={mantenimiento.fecha_final ?? ""}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                            Estado
                        </label>
                        <select
                            name="estado"
                            value={mantenimiento.estado ?? ""}
                            onChange={handleChange}
                            onBlur={() => validateField("estado")}
                            required
                            className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all cursor-pointer text-slate-700 ${errors.estado ? "border-red-400 focus:ring-red-500" : "border-slate-200 focus:ring-blue-500 focus:border-transparent"}`}
                        >
                            <option value="" disabled>Selecciona estado inicial</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="En Proceso">En Proceso</option>
                            <option value="Finalizado">Finalizado</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                        {errors.estado ? <p className="mt-1 text-xs text-red-500">{errors.estado}</p> : null}
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                            Descripción
                        </label>
                        <textarea
                            name="descripcion"
                            rows={3}
                            value={mantenimiento.descripcion ?? ""}
                            onChange={handleChange}
                            onBlur={() => validateField("descripcion")}
                            placeholder="Escribe los detalles del trabajo o falla a reparar..."
                            className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none placeholder:text-slate-400 ${errors.descripcion ? "border-red-400 focus:ring-red-500" : "border-slate-200 focus:ring-blue-500 focus:border-transparent"}`}
                        />
                        {errors.descripcion ? <p className="mt-1 text-xs text-red-500">{errors.descripcion}</p> : null}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                        Guardar Mantenimiento
                    </button>
                </div>
            </form>
        </Modal>
    );
}
