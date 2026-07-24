"use client";
import React, { useState, useEffect } from "react";
import { getHabitaciones, Habitacion } from "@/functions/espacios";
import { useUsuarios, Usuario } from "@/functions/usuarios"
import { crearMantenimiento, Mantenimiento } from "@/functions/mantenimientos"
import Modal from "./Modal"; // Importa la base de arriba

interface FormModalProps {
    open: boolean;
    onClose: () => void;
    onSave?: (data: Mantenimiento) => void;
}

export default function MantenimientoModal({ open, onClose, onSave }: FormModalProps) {
    const [habitaciones, SetHabitaciones] = useState<Habitacion[]>([]);

    async function getListaHabitaciones() {
        const habitaciones = await getHabitaciones();
        SetHabitaciones(habitaciones);
    }

    useEffect(() => {
        getListaHabitaciones();
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

    const { data, loading, error } = useUsuarios();
    const [empleados, setEmpleados] = useState<Usuario[]>([]);

    useEffect(() => {
        if (data) {
            setEmpleados(data);
        }
    }, [data]);

    const [esInterno, setEsInterno] = useState<boolean>(true);

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
        setMantenimiento((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Limpiamos y transformamos los datos al formato que espera FastAPI
        const datosAEnviar = {
            ...mantenimiento,
            // Convertir a número si existe, de lo contrario null
            responsable_id: mantenimiento.responsable_id ? Number(mantenimiento.responsable_id) : null
        };

        console.log("Datos limpios enviados:", datosAEnviar);
        const data = await crearMantenimiento(datosAEnviar);

        onClose();
    };

    return (
        <Modal open={open} onClose={onClose} title="Nuevo Mantenimiento">
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Selector de Tipo de Responsable */}
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

                    {/* CAMPOS CONDICIONALES DE RESPONSABLE */}
                    {esInterno ? (
                        /* Responsable Interno (SELECT) */
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                                Empleado Responsable
                            </label>
                            <select
                                name="responsable_id"
                                value={mantenimiento.responsable_id ?? ''}
                                onChange={handleChange}
                                required={esInterno}
                                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer text-slate-700"
                            >
                                <option value="" disabled>Selecciona un empleado</option>
                                {empleados?.map((emp) => (
                                    <option key={emp.usuario_id} value={emp.usuario_id}>
                                        {emp.primer_nombre + ' ' + emp.primer_apellido}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        /* Responsable Externo (NOMBRE Y TELÉFONO) */
                        <>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                                    Nombre del Responsable Externo
                                </label>
                                <input
                                    type="text"
                                    name="nombre_responsable"
                                    value={mantenimiento.nombre_responsable ?? ''}
                                    onChange={handleChange}
                                    placeholder="Ej. Juan Pérez"
                                    required={!esInterno}
                                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                                    Teléfono del Responsable
                                </label>
                                <input
                                    type="tel"
                                    name="telefono_responsable"
                                    value={mantenimiento.telefono_responsable ?? ''}
                                    onChange={handleChange}
                                    placeholder="Ej. +504 9999-9999"
                                    required={!esInterno}
                                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </>
                    )}

                    {/* Número de Espacio (SELECT) */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                            Número de Espacio
                        </label>
                        <select
                            name="numero_espacio"
                            value={mantenimiento.numero_espacio}
                            onChange={handleChange}
                            required
                            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer text-slate-700"
                        >
                            <option value="" disabled>Selecciona un espacio</option>
                            {habitaciones.map((habitacion) => (
                                <option key={habitacion.espacio_id} value={habitacion.espacio_id}>
                                    {habitacion.numero_espacio}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tipo de Mantenimiento */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                            Tipo
                        </label>
                        <select
                            name="tipo"
                            value={mantenimiento.tipo}
                            onChange={handleChange}
                            required
                            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer text-slate-700"
                        >
                            <option value="" disabled>Selecciona tipo</option>
                            <option value="Correctivo">Correctivo</option>
                            <option value="Preventivo">Preventivo</option>
                            <option value="Predictivo">Predictivo</option>
                            <option value="Aseo">Aseo</option>
                        </select>
                    </div>

                    {/* Prioridad */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                            Prioridad
                        </label>
                        <select
                            name="prioridad"
                            value={mantenimiento.prioridad}
                            onChange={handleChange}
                            required
                            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer text-slate-700"
                        >
                            <option value="" disabled>Selecciona prioridad</option>
                            <option value="Baja">Baja</option>
                            <option value="Media">Media</option>
                            <option value="Alta">Alta</option>
                            <option value="Urgente">Urgente</option>
                        </select>
                    </div>

                    {/* Fecha Inicio */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                            Fecha de Inicio
                        </label>
                        <input
                            type="date"
                            name="fecha_inicio"
                            value={mantenimiento.fecha_inicio || ""}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700"
                        />
                    </div>

                    {/* Fecha Final */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                            Fecha Final
                        </label>
                        <input
                            type="date"
                            name="fecha_final"
                            value={mantenimiento.fecha_final || ""}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700"
                        />
                    </div>

                    {/* Estado */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                            Estado
                        </label>
                        <select
                            name="estado"
                            value={mantenimiento.estado}
                            onChange={handleChange}
                            required
                            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer text-slate-700"
                        >
                            <option value="" disabled>Selecciona estado inicial</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="En Proceso">En Proceso</option>
                            <option value="Finalizado">Finalizado</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                    </div>

                    {/* Descripción */}
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                            Descripción
                        </label>
                        <textarea
                            name="descripcion"
                            rows={3}
                            value={mantenimiento.descripcion}
                            onChange={handleChange}
                            placeholder="Escribe los detalles del trabajo o falla a reparar..."
                            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none placeholder:text-slate-400"
                        />
                    </div>

                </div>

                {/* Botones de acción */}
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