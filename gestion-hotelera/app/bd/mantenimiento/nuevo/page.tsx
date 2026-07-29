"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ViewTransition } from "react";
import Link from "next/link";
import PageHeader from "@/components/pageheader";
import { ValidatedInput, ValidatedSelect } from "@/components/ui/validated-field";
import { getHabitaciones, Habitacion } from "@/functions/espacios";
import { useUsuarios } from "@/functions/usuarios";
import { crearTicket, Ticket } from "@/functions/tickets";
import { toast } from "sonner";

type TicketForm = Ticket & {
    tipo?: string | null;
    prioridad?: string | null;
    fecha_inicio?: string | null;
    fecha_limite?: string | null;
};

export default function NuevoMantenimientoPage() {
    const router = useRouter();
    const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
    const [formData, setFormData] = useState<TicketForm>({
        usuario_id: 1,
        responsable_id: null,
        nombre_responsable: null,
        telefono_responsable: null,
        titulo: null,
        tipo: "",
        descripcion: "",
        fecha_inicio: null,
        fecha_limite: null,
        prioridad: "",
        estado: "",
        espacio_id: 34,
    });
    const [esInterno, setEsInterno] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [submitting, setSubmitting] = useState(false);

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

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        const normalizedValue = name === "espacio_id"
            ? Number(value)
            : name === "responsable_id"
                ? (value ? Number(value) : null)
                : value;

        setFormData((prev) => ({ ...prev, [name]: normalizedValue }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleResponsableTypeChange = (isInternal: boolean) => {
        setEsInterno(isInternal);
        setFormData((prev) => ({
            ...prev,
            responsable_id: isInternal ? prev.responsable_id : null,
            nombre_responsable: !isInternal ? prev.nombre_responsable : null,
            telefono_responsable: !isInternal ? prev.telefono_responsable : null,
        }));
        setErrors((prev) => ({ ...prev, responsable_id: "", nombre_responsable: "", telefono_responsable: "" }));
    };

    const validateField = (field: string) => {
        const nextErrors: Record<string, string> = { ...errors };

        switch (field) {
            case "titulo":
                if (!formData.titulo?.trim()) {
                    nextErrors.titulo = "Ingresa un título para el ticket.";
                } else {
                    delete nextErrors.titulo;
                }
                break;
            case "tipo":
                if (!formData.tipo) {
                    nextErrors.tipo = "Selecciona un tipo de mantenimiento.";
                } else {
                    delete nextErrors.tipo;
                }
                break;
            case "prioridad":
                if (!formData.prioridad) {
                    nextErrors.prioridad = "Selecciona una prioridad.";
                } else {
                    delete nextErrors.prioridad;
                }
                break;
            case "estado":
                if (!formData.estado) {
                    nextErrors.estado = "Selecciona un estado inicial.";
                } else {
                    delete nextErrors.estado;
                }
                break;
            case "espacio_id":
                if (!formData.espacio_id) {
                    nextErrors.espacio_id = "Selecciona un espacio.";
                } else {
                    delete nextErrors.espacio_id;
                }
                break;
            case "descripcion":
                if (!formData.descripcion || !formData.descripcion.trim()) {
                    nextErrors.descripcion = "Describe el trabajo a realizar.";
                } else {
                    delete nextErrors.descripcion;
                }
                break;
            case "responsable_id":
                if (esInterno && !formData.responsable_id) {
                    nextErrors.responsable_id = "Selecciona un empleado responsable.";
                } else {
                    delete nextErrors.responsable_id;
                }
                break;
            case "nombre_responsable":
                if (!esInterno && !formData.nombre_responsable?.trim()) {
                    nextErrors.nombre_responsable = "Ingresa el nombre del responsable externo.";
                } else {
                    delete nextErrors.nombre_responsable;
                }
                break;
            case "telefono_responsable":
                if (!esInterno && !formData.telefono_responsable?.trim()) {
                    nextErrors.telefono_responsable = "Ingresa un teléfono válido.";
                } else {
                    delete nextErrors.telefono_responsable;
                }
                break;
            default:
                break;
        }

        setErrors(nextErrors);
        setTouched((prev) => ({ ...prev, [field]: true }));
        return !nextErrors[field];
    };

    const validateForm = () => {
        const nextErrors: Record<string, string> = {};

        if (!formData.titulo?.trim()) nextErrors.titulo = "Ingresa un título para el ticket.";
        if (!formData.tipo) nextErrors.tipo = "Selecciona un tipo de mantenimiento.";
        if (!formData.prioridad) nextErrors.prioridad = "Selecciona una prioridad.";
        if (!formData.estado) nextErrors.estado = "Selecciona un estado inicial.";
        if (!formData.espacio_id) nextErrors.espacio_id = "Selecciona un espacio.";
        if (!formData.descripcion || !formData.descripcion.trim()) nextErrors.descripcion = "Describe el trabajo a realizar.";

        if (esInterno) {
            if (!formData.responsable_id) nextErrors.responsable_id = "Selecciona un empleado responsable.";
        } else {
            if (!formData.nombre_responsable?.trim()) nextErrors.nombre_responsable = "Ingresa el nombre del responsable externo.";
            if (!formData.telefono_responsable?.trim()) nextErrors.telefono_responsable = "Ingresa un teléfono válido.";
        }

        setErrors(nextErrors);
        setTouched({ tipo: true, prioridad: true, estado: true, espacio_id: true, descripcion: true, responsable_id: true, nombre_responsable: true, telefono_responsable: true });
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            const datosAEnviar = {
                ...formData,
                responsable_id: formData.responsable_id ? Number(formData.responsable_id) : null,
                nombre_responsable: esInterno ? null : formData.nombre_responsable?.trim() || null,
                telefono_responsable: esInterno ? null : formData.telefono_responsable?.trim() || null,
            };
            console.log("Datos a enviar al crear el ticket:", datosAEnviar);

            await crearTicket(datosAEnviar);
            toast.success("Ticket de mantenimiento creado correctamente.");
            router.push("/bd/mantenimiento");
        } catch (error) {
            console.error(error);
            toast.error("No se pudo crear el ticket de mantenimiento.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ViewTransition enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}>
            <div className=" flex w-full flex-col">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                    <Link className="hover:text-sky-600 font-medium transition-colors" href="/bd/mantenimiento" transitionTypes={["nav-back"]}>Mantenimiento</Link>
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    <span className="text-slate-800 font-semibold">Nuevo ticket</span>
                </div>
                <PageHeader
                    name="Crear ticket de mantenimiento"
                    subtitle="Genera una solicitud de mantenimiento desde una vista independiente"
                    buttons={
                        <button
                            type="button"
                            onClick={() => router.push("/bd/mantenimiento")}
                            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                            Volver a mantenimiento
                        </button>
                    }
                />

                <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] mt-6">
                    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                            <p className="text-sm font-semibold text-slate-700">Define el tipo, el responsable y el espacio afectado para abrir el ticket.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">¿El responsable es personal interno?</label>
                                <div className="flex flex-col gap-3 text-sm text-slate-700 sm:flex-row sm:items-center sm:gap-6">
                                    <label className="flex cursor-pointer items-center gap-2 font-medium">
                                        <input type="radio" name="tipo_responsable_toggle" checked={esInterno} onChange={() => handleResponsableTypeChange(true)} className="h-4 w-4 text-sky-600" />
                                        <span>Sí, empleado interno</span>
                                    </label>
                                    <label className="flex cursor-pointer items-center gap-2 font-medium">
                                        <input type="radio" name="tipo_responsable_toggle" checked={!esInterno} onChange={() => handleResponsableTypeChange(false)} className="h-4 w-4 text-sky-600" />
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
                                            value={formData.responsable_id ?? ""}
                                            onChange={(event) => {
                                                handleSelectChange(event);
                                                void validateField("responsable_id");
                                            }}
                                            onBlur={() => {
                                                setTouched((prev) => ({ ...prev, responsable_id: true }));
                                                void validateField("responsable_id");
                                            }}
                                            onFocus={() => setTouched((prev) => ({ ...prev, responsable_id: true }))}
                                            className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition ${errors.responsable_id ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100" : "border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"}`}
                                            required={esInterno}
                                        >
                                            <option value="" disabled>Selecciona un empleado</option>
                                            {empleados?.map((empleado) => (
                                                <option key={empleado.usuario_id} value={empleado.usuario_id}>
                                                    {`${empleado.primer_nombre} ${empleado.primer_apellido}`}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.responsable_id ? <p className="mt-1 text-xs text-red-500">{errors.responsable_id}</p> : null}
                                    </div>
                                ) : (
                                    <>
                                        <ValidatedInput
                                            label="Nombre del responsable"
                                            value={formData.nombre_responsable ?? ""}
                                            onChange={(value) => {
                                                setFormData((prev) => ({ ...prev, nombre_responsable: value }));
                                                setErrors((prev) => ({ ...prev, nombre_responsable: "" }));
                                            }}
                                            onBlur={() => {
                                                setTouched((prev) => ({ ...prev, nombre_responsable: true }));
                                                validateField("nombre_responsable");
                                            }}
                                            onFocus={() => setTouched((prev) => ({ ...prev, nombre_responsable: true }))}
                                            error={errors.nombre_responsable}
                                            touched={touched.nombre_responsable || Boolean(errors.nombre_responsable)}
                                            placeholder="Ej. Juan Pérez"
                                        />
                                        <ValidatedInput
                                            label="Teléfono"
                                            value={formData.telefono_responsable ?? ""}
                                            onChange={(value) => {
                                                setFormData((prev) => ({ ...prev, telefono_responsable: value }));
                                                setErrors((prev) => ({ ...prev, telefono_responsable: "" }));
                                            }}
                                            onBlur={() => {
                                                setTouched((prev) => ({ ...prev, telefono_responsable: true }));
                                                validateField("telefono_responsable");
                                            }}
                                            onFocus={() => setTouched((prev) => ({ ...prev, telefono_responsable: true }))}
                                            error={errors.telefono_responsable}
                                            touched={touched.telefono_responsable || Boolean(errors.telefono_responsable)}
                                            placeholder="Ej. 96751977"
                                        />
                                    </>
                                )}

                                <ValidatedInput
                                    label="Título"
                                    value={formData.titulo ?? ""}
                                    onChange={(value) => {
                                        setFormData((prev) => ({ ...prev, titulo: value }));
                                        setErrors((prev) => ({ ...prev, titulo: "" }));
                                    }}
                                    onBlur={() => {
                                        setTouched((prev) => ({ ...prev, titulo: true }));
                                        validateField("titulo");
                                    }}
                                    onFocus={() => setTouched((prev) => ({ ...prev, titulo: true }))}
                                    error={errors.titulo}
                                    touched={touched.titulo || Boolean(errors.titulo)}
                                    placeholder="Ej. Fuga de agua en habitación"
                                />
                                <ValidatedSelect
                                    label="Tipo de mantenimiento"
                                    value={formData.tipo ?? ""}
                                    onChange={(value) => {
                                        setFormData((prev) => ({ ...prev, tipo: value }));
                                        setErrors((prev) => ({ ...prev, tipo: "" }));
                                    }}
                                    onBlur={() => {
                                        setTouched((prev) => ({ ...prev, tipo: true }));
                                        validateField("tipo");
                                    }}
                                    onFocus={() => setTouched((prev) => ({ ...prev, tipo: true }))}
                                    error={errors.tipo}
                                    touched={touched.tipo || Boolean(errors.tipo)}
                                    placeholder="Selecciona un tipo"
                                    options={[
                                        { label: "Preventivo", value: "Preventivo" },
                                        { label: "Correctivo", value: "Correctivo" },
                                        { label: "Urgente", value: "Urgente" },
                                        { label: "Limpieza", value: "Limpieza" },
                                    ]}
                                />
                                <ValidatedSelect
                                    label="Prioridad"
                                    value={formData.prioridad ?? ""}
                                    onChange={(value) => {
                                        setFormData((prev) => ({ ...prev, prioridad: value }));
                                        setErrors((prev) => ({ ...prev, prioridad: "" }));
                                    }}
                                    onBlur={() => {
                                        setTouched((prev) => ({ ...prev, prioridad: true }));
                                        validateField("prioridad");
                                    }}
                                    onFocus={() => setTouched((prev) => ({ ...prev, prioridad: true }))}
                                    error={errors.prioridad}
                                    touched={touched.prioridad || Boolean(errors.prioridad)}
                                    placeholder="Selecciona una prioridad"
                                    options={[
                                        { label: "Baja", value: "Baja" },
                                        { label: "Media", value: "Media" },
                                        { label: "Alta", value: "Alta" },
                                        { label: "Urgente", value: "Urgente" },
                                    ]}
                                />
                                <ValidatedInput
                                    label="Fecha de inicio"
                                    type="date"
                                    value={formData.fecha_inicio ?? ""}
                                    onChange={(value) => {
                                        setFormData((prev) => ({ ...prev, fecha_inicio: value }));
                                    }}
                                    className="w-full"
                                />
                                <ValidatedInput
                                    label="Fecha límite"
                                    type="date"
                                    value={formData.fecha_limite ?? ""}
                                    onChange={(value) => {
                                        setFormData((prev) => ({ ...prev, fecha_limite: value }));
                                    }}
                                    className="w-full"
                                />
                                <ValidatedSelect
                                    label="Estado inicial"
                                    value={formData.estado ?? ""}
                                    onChange={(value) => {
                                        setFormData((prev) => ({ ...prev, estado: value }));
                                        setErrors((prev) => ({ ...prev, estado: "" }));
                                    }}
                                    onBlur={() => {
                                        setTouched((prev) => ({ ...prev, estado: true }));
                                        validateField("estado");
                                    }}
                                    onFocus={() => setTouched((prev) => ({ ...prev, estado: true }))}
                                    error={errors.estado}
                                    touched={touched.estado || Boolean(errors.estado)}
                                    placeholder="Selecciona un estado"
                                    options={[
                                        { label: "Pendiente", value: "Pendiente" },
                                        { label: "En progreso", value: "En progreso" },
                                        { label: "Completado", value: "Completado" },
                                    ]}
                                />
                                <ValidatedSelect
                                    label="Espacio o habitación"
                                    value={formData.espacio_id ? String(formData.espacio_id) : ""}
                                    onChange={(value) => {
                                        const normalizedValue = value ? Number(value) : 0;
                                        setFormData((prev) => ({ ...prev, espacio_id: normalizedValue }));
                                        setErrors((prev) => ({ ...prev, espacio_id: "" }));
                                    }}
                                    onBlur={() => {
                                        setTouched((prev) => ({ ...prev, espacio_id: true }));
                                        validateField("espacio_id");
                                    }}
                                    onFocus={() => setTouched((prev) => ({ ...prev, espacio_id: true }))}
                                    error={errors.espacio_id}
                                    touched={touched.espacio_id || Boolean(errors.espacio_id)}
                                    placeholder="Selecciona un espacio"
                                    options={habitaciones.map((habitacion) => ({
                                        label: habitacion.numero_espacio || String(habitacion.espacio_id),
                                        value: String(habitacion.espacio_id),
                                    }))}
                                />
                            </div>

                            <ValidatedInput
                                label="Descripción"
                                value={formData.descripcion ?? ""}
                                onChange={(value) => {
                                    setFormData((prev) => ({ ...prev, descripcion: value }));
                                    setErrors((prev) => ({ ...prev, descripcion: "" }));
                                }}
                                onBlur={() => {
                                    setTouched((prev) => ({ ...prev, descripcion: true }));
                                    validateField("descripcion");
                                }}
                                onFocus={() => setTouched((prev) => ({ ...prev, descripcion: true }))}
                                error={errors.descripcion}
                                touched={touched.descripcion || Boolean(errors.descripcion)}
                                placeholder="Describe el problema o la tarea a resolver."
                                multiline
                                rows={5}
                            />

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => router.push("/bd/mantenimiento")} className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Cancelar</button>
                                <button type="submit" disabled={submitting} className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70">
                                    {submitting ? "Guardando..." : "Guardar ticket"}
                                </button>
                            </div>
                        </form>
                    </section>

                    <aside className="rounded-[28px] border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
                                <span className="material-symbols-outlined">build</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Seguimiento de tareas</h3>
                                <p className="text-sm text-slate-300">Los tickets creados aquí quedan listos para ser revisados en la sección de mantenimiento.</p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                                <p className="text-sm font-semibold">1. Tipo de solicitud</p>
                                <p className="mt-1 text-sm text-slate-300">Preventivo, correctivo o urgente.</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                                <p className="text-sm font-semibold">2. Responsable</p>
                                <p className="mt-1 text-sm text-slate-300">Personal interno o técnico externo.</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                                <p className="text-sm font-semibold">3. Espacio afectado</p>
                                <p className="mt-1 text-sm text-slate-300">Se asocia al área o habitación correcta.</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

        </ViewTransition>
    );
}
