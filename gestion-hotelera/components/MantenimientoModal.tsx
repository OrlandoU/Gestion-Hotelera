"use client";
import React, { useState, useEffect } from "react";
import { getHabitaciones, Habitacion } from "@/functions/espacios";
import { useUsuarios } from "@/functions/usuarios"
import { crearTicket, Ticket } from "@/functions/tickets"
import Modal from "./Modal"; // Importa la base de arriba
import Button from "@/components/ui/button";

type TicketForm = Ticket & {
    tipo: string;
    prioridad: string;
    fecha_inicio: string | null;
    fecha_final: string | null;
    fecha_limite: string | null;
};

interface FormModalProps {
    open: boolean;
    onClose: () => void;
    onSave?: (data: Ticket) => void;
}

const fieldClassName = (hasError: boolean) =>
    `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition ${hasError
        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
        : "border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
    }`;

export default function MantenimientoModal({ open, onClose, onSave }: FormModalProps) {
    const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
    const [ticket, setTicket] = useState<TicketForm>({
        usuario_id: 1,
        responsable_id: null,
        nombre_responsable: null,
        telefono_responsable: null,
        titulo: null,
        tipo: "",
        descripcion: "",
        fecha_inicio: null,
        fecha_final: null,
        fecha_limite: null,
        prioridad: "",
        estado: "",
        espacio_id: 34,
    });
    const [esInterno, setEsInterno] = useState<boolean>(true);
    const [errors, setErrors] = useState<Record<string, string>>({});

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

    const { data } = useUsuarios();
    const empleados = data ?? [];

    const handleTipoResponsableChange = (isInternal: boolean) => {
        setEsInterno(isInternal);
        setTicket((prev) => ({
            ...prev,
            responsable_id: isInternal ? prev.responsable_id : null,
            nombre_responsable: !isInternal ? prev.nombre_responsable : null,
            telefono_responsable: !isInternal ? prev.telefono_responsable : null,
        }));
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        const normalizedValue = name === "espacio_id"
            ? Number(value)
            : name === "responsable_id"
                ? (value ? Number(value) : null)
                : value;

        setTicket((prev) => ({
            ...prev,
            [name]: normalizedValue,
        }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateField = (field: string) => {
        const nextErrors: Record<string, string> = { ...errors };

        switch (field) {
            case "titulo":
                if (!ticket.titulo?.trim()) {
                    nextErrors.titulo = "Ingresa un título para el ticket.";
                } else {
                    delete nextErrors.titulo;
                }
                break;
            case "tipo":
                if (!ticket.tipo) {
                    nextErrors.tipo = "Selecciona un tipo de mantenimiento.";
                } else {
                    delete nextErrors.tipo;
                }
                break;
            case "prioridad":
                if (!ticket.prioridad) {
                    nextErrors.prioridad = "Selecciona una prioridad.";
                } else {
                    delete nextErrors.prioridad;
                }
                break;
            case "estado":
                if (!ticket.estado) {
                    nextErrors.estado = "Selecciona un estado inicial.";
                } else {
                    delete nextErrors.estado;
                }
                break;
            case "espacio_id":
                if (!ticket.espacio_id) {
                    nextErrors.espacio_id = "Selecciona un espacio.";
                } else {
                    delete nextErrors.espacio_id;
                }
                break;
            case "descripcion":
                if (!ticket.descripcion || !ticket.descripcion.trim()) {
                    nextErrors.descripcion = "Describe el trabajo a realizar.";
                } else {
                    delete nextErrors.descripcion;
                }
                break;
            case "responsable_id":
                if (esInterno) {
                    if (!ticket.responsable_id) {
                        nextErrors.responsable_id = "Selecciona un empleado responsable.";
                    } else {
                        delete nextErrors.responsable_id;
                    }
                }
                break;
            case "nombre_responsable":
                if (!esInterno) {
                    if (!ticket.nombre_responsable?.trim()) {
                        nextErrors.nombre_responsable = "Ingresa el nombre del responsable externo.";
                    } else {
                        delete nextErrors.nombre_responsable;
                    }
                }
                break;
            case "telefono_responsable":
                if (!esInterno) {
                    if (!ticket.telefono_responsable?.trim()) {
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

        if (!ticket.titulo?.trim()) nextErrors.titulo = "Ingresa un título para el ticket.";
        if (!ticket.tipo) nextErrors.tipo = "Selecciona un tipo de mantenimiento.";
        if (!ticket.prioridad) nextErrors.prioridad = "Selecciona una prioridad.";
        if (!ticket.estado) nextErrors.estado = "Selecciona un estado inicial.";
        if (!ticket.espacio_id) nextErrors.espacio_id = "Selecciona un espacio.";
        if (!ticket.descripcion || !ticket.descripcion.trim()) nextErrors.descripcion = "Describe el trabajo a realizar.";

        if (esInterno) {
            if (!ticket.responsable_id) nextErrors.responsable_id = "Selecciona un empleado responsable.";
        } else {
            if (!ticket.nombre_responsable?.trim()) nextErrors.nombre_responsable = "Ingresa el nombre del responsable externo.";
            if (!ticket.telefono_responsable?.trim()) nextErrors.telefono_responsable = "Ingresa un teléfono válido.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const datosAEnviar = {
            ...ticket,
            responsable_id: ticket.responsable_id ? Number(ticket.responsable_id) : null,
            nombre_responsable: esInterno ? null : ticket.nombre_responsable?.trim() || null,
            telefono_responsable: esInterno ? null : ticket.telefono_responsable?.trim() || null,
        };

        await crearTicket(datosAEnviar);
        onSave?.(datosAEnviar as Ticket);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose} title="Nuevo ticket de mantenimiento">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-sm font-medium text-slate-700">Define el ticket de mantenimiento, el responsable y los datos del espacio.</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        ¿El responsable es personal interno?
                    </label>
                    <div className="flex flex-col gap-3 text-sm text-slate-700 sm:flex-row sm:items-center sm:gap-6">
                        <label className="flex cursor-pointer items-center gap-2 font-medium">
                            <input
                                type="radio"
                                name="tipo_responsable_toggle"
                                checked={esInterno}
                                onChange={() => handleTipoResponsableChange(true)}
                                className="h-4 w-4 text-sky-600"
                            />
                            <span>Sí, empleado interno</span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-2 font-medium">
                            <input
                                type="radio"
                                name="tipo_responsable_toggle"
                                checked={!esInterno}
                                onChange={() => handleTipoResponsableChange(false)}
                                className="h-4 w-4 text-sky-600"
                            />
                            <span>No, técnico o proveedor externo</span>
                        </label>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {esInterno ? (
                        <div className="sm:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Empleado responsable</label>
                            <select
                                name="responsable_id"
                                value={ticket.responsable_id ?? ""}
                                onChange={handleChange}
                                onBlur={() => validateField("responsable_id")}
                                required={esInterno}
                                className={fieldClassName(Boolean(errors.responsable_id))}
                            >
                                <option value="" disabled>Selecciona un empleado</option>
                                {empleados?.map((emp) => (
                                    <option key={emp.usuario_id} value={emp.usuario_id}>
                                        {`${emp.primer_nombre} ${emp.primer_apellido}`}
                                    </option>
                                ))}
                            </select>
                            {errors.responsable_id ? <p className="mt-1 text-xs text-red-500">{errors.responsable_id}</p> : null}
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Nombre del responsable</label>
                                <input
                                    type="text"
                                    name="nombre_responsable"
                                    value={ticket.nombre_responsable ?? ""}
                                    onChange={handleChange}
                                    onBlur={() => validateField("nombre_responsable")}
                                    placeholder="Ej. Juan Pérez"
                                    required={!esInterno}
                                    className={fieldClassName(Boolean(errors.nombre_responsable))}
                                />
                                {errors.nombre_responsable ? <p className="mt-1 text-xs text-red-500">{errors.nombre_responsable}</p> : null}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Teléfono</label>
                                <input
                                    type="tel"
                                    name="telefono_responsable"
                                    value={ticket.telefono_responsable ?? ""}
                                    onChange={handleChange}
                                    onBlur={() => validateField("telefono_responsable")}
                                    placeholder="Ej. +504 9999-9999"
                                    required={!esInterno}
                                    className={fieldClassName(Boolean(errors.telefono_responsable))}
                                />
                                {errors.telefono_responsable ? <p className="mt-1 text-xs text-red-500">{errors.telefono_responsable}</p> : null}
                            </div>
                        </>
                    )}

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Número de espacio</label>
                        <select
                            name="espacio_id"
                            value={ticket.espacio_id ?? ""}
                            onChange={handleChange}
                            onBlur={() => validateField("espacio_id")}
                            required
                            className={fieldClassName(Boolean(errors.espacio_id))}
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

                    <div className="sm:col-span-2">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Título</label>
                        <input
                            type="text"
                            name="titulo"
                            value={ticket.titulo ?? ""}
                            onChange={handleChange}
                            onBlur={() => validateField("titulo")}
                            placeholder="Ej. Fuga de agua en habitación"
                            required
                            className={fieldClassName(Boolean(errors.titulo))}
                        />
                        {errors.titulo ? <p className="mt-1 text-xs text-red-500">{errors.titulo}</p> : null}
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Tipo</label>
                        <select
                            name="tipo"
                            value={ticket.tipo}
                            onChange={handleChange}
                            onBlur={() => validateField("tipo")}
                            required
                            className={fieldClassName(Boolean(errors.tipo))}
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
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Prioridad</label>
                        <select
                            name="prioridad"
                            value={ticket.prioridad}
                            onChange={handleChange}
                            onBlur={() => validateField("prioridad")}
                            required
                            className={fieldClassName(Boolean(errors.prioridad))}
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
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Fecha de inicio</label>
                        <input
                            type="date"
                            name="fecha_inicio"
                            value={ticket.fecha_inicio || ""}
                            onChange={handleChange}
                            className={fieldClassName(false)}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Fecha límite</label>
                        <input
                            type="date"
                            name="fecha_limite"
                            value={ticket.fecha_limite || ""}
                            onChange={handleChange}
                            className={fieldClassName(false)}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Estado</label>
                        <select
                            name="estado"
                            value={ticket.estado ?? ""}
                            onChange={handleChange}
                            onBlur={() => validateField("estado")}
                            required
                            className={fieldClassName(Boolean(errors.estado))}
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
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Descripción</label>
                        <textarea
                            name="descripcion"
                            rows={4}
                            value={ticket.descripcion ?? ""}
                            onChange={handleChange}
                            onBlur={() => validateField("descripcion")}
                            placeholder="Escribe los detalles del trabajo o la falla a reparar..."
                            className={fieldClassName(Boolean(errors.descripcion))}
                        />
                        {errors.descripcion ? <p className="mt-1 text-xs text-red-500">{errors.descripcion}</p> : null}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary">
                        Guardar ticket
                    </Button>
                </div>
            </form>
        </Modal>
    );
}