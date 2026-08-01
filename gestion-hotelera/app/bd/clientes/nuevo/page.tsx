"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// removed ViewTransition import (not available in this React version)
import Link from "next/link";
import PageHeader from "@/components/pageheader";
import { ValidatedInput } from "@/components/ui/validated-field";
import { createHuesped } from "@/functions/huesped";
import { toast } from "sonner";

export default function NuevoClientePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nombres: "",
        apellidos: "",
        telefono: "",
        email: "",
        dni: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const validateGuestField = (field: string) => {
        const nextErrors: Record<string, string> = { ...formErrors };

        switch (field) {
            case "nombres":
                if (!formData.nombres.trim() || formData.nombres.trim().length < 2 || formData.nombres.trim().length > 60) {
                    nextErrors.nombres = "Ingresa un nombre válido de 2 a 60 caracteres.";
                } else {
                    delete nextErrors.nombres;
                }
                break;
            case "apellidos":
                if (!formData.apellidos.trim() || formData.apellidos.trim().length < 2 || formData.apellidos.trim().length > 80) {
                    nextErrors.apellidos = "Ingresa un apellido válido de 2 a 80 caracteres.";
                } else {
                    delete nextErrors.apellidos;
                }
                break;
            case "telefono": {
                const tel = formData.telefono?.trim() || "";
                // Limpia cualquier carácter que no sea número
                const digits = tel.replace(/\D/g, "");

                if (!tel || !/^[0-9]{8}$/.test(digits)) {
                    nextErrors.telefono = "El teléfono debe tener exactamente 8 dígitos.";
                } else {
                    delete nextErrors.telefono;
                }
                break;
            }
            case "email":
                if (!formData.email.trim()) {
                    nextErrors.email = "Ingresa un correo electrónico.";
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    nextErrors.email = "El correo electrónico no es válido.";
                } else if (formData.email.trim().length > 120) {
                    nextErrors.email = "El correo electrónico no puede superar 120 caracteres.";
                } else {
                    delete nextErrors.email;
                }
                break;
            case "dni":
                if (!formData.dni.trim() || !/^([0-9]{13}|[0-9]{4}-[0-9]{4}-[0-9]{5})$/.test(formData.dni.trim())) {
                    nextErrors.dni = "El documento debe tener formato válido (13 dígitos o 4-4-5).";
                } else {
                    delete nextErrors.dni;
                }
                break;
            default:
                break;
        }

        setFormErrors(nextErrors);
        setTouched((prev) => ({ ...prev, [field]: true }));
        return !nextErrors[field];
    };

    const validateGuestForm = () => {
        const nextErrors: Record<string, string> = {};

        if (!formData.nombres.trim() || formData.nombres.trim().length < 2 || formData.nombres.trim().length > 60) {
            nextErrors.nombres = "Ingresa un nombre válido de 2 a 60 caracteres.";
        }
        if (!formData.apellidos.trim() || formData.apellidos.trim().length < 2 || formData.apellidos.trim().length > 80) {
            nextErrors.apellidos = "Ingresa un apellido válido de 2 a 80 caracteres.";
        }
        const telefonoDigits = formData.telefono.replace(/\D/g, "");
        if (!telefonoDigits) {
            nextErrors.telefono = "Ingresa un teléfono.";
        } else if (telefonoDigits.length < 8 || telefonoDigits.length > 12) {
            nextErrors.telefono = "El teléfono debe tener entre 8 y 12 dígitos.";
        }
        if (!formData.email.trim()) {
            nextErrors.email = "Ingresa un correo electrónico.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            nextErrors.email = "El correo electrónico no es válido.";
        } else if (formData.email.trim().length > 120) {
            nextErrors.email = "El correo electrónico no puede superar 120 caracteres.";
        }
        if (!formData.dni.trim() || !/^([0-9]{13}|[0-9]{4}-[0-9]{4}-[0-9]{5})$/.test(formData.dni.trim())) {
            nextErrors.dni = "El documento debe tener formato válido (13 dígitos).";
        }

        setFormErrors(nextErrors);
        setTouched({ nombres: true, apellidos: true, telefono: true, email: true, dni: true });
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validateGuestForm()) {
            return;
        }

        setSubmitting(true);
        try {
            await createHuesped(formData);
            toast.success("Cliente creado correctamente.");
            router.push("/bd/clientes");
        } catch (error) {
            console.error(error);
            toast.error("No se pudo crear el cliente. Intenta de nuevo.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className=" flex w-full flex-col gap-6">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                    <Link className="hover:text-sky-600 font-medium transition-colors" href="/bd/clientes" transitionTypes={["nav-back"]}>Clientes</Link>
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    <span className="text-slate-800 font-semibold">Nuevo cliente</span>
                </div>
                <PageHeader
                    name="Crear cliente"
                    subtitle="Registra un nuevo huésped o cliente desde una vista dedicada"
                    buttons={
                        <button
                            type="button"
                            onClick={() => router.push("/bd/clientes")}
                            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                            Volver a clientes
                        </button>
                    }
                />


                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                            <p className="text-sm font-semibold text-slate-700">Completa los datos del cliente para registrarlo en el hotel.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <ValidatedInput
                                    label="Nombres"
                                    value={formData.nombres}
                                    onChange={(value) => {
                                        setFormData((prev) => ({ ...prev, nombres: value }));
                                        setFormErrors((prev) => ({ ...prev, nombres: "" }));
                                    }}
                                    onBlur={() => {
                                        setTouched((prev) => ({ ...prev, nombres: true }));
                                        validateGuestField("nombres");
                                    }}
                                    onFocus={() => setTouched((prev) => ({ ...prev, nombres: true }))}
                                    error={formErrors.nombres}
                                    touched={touched.nombres || Boolean(formErrors.nombres)}
                                    placeholder="Ej. Orlando"
                                    required
                                />
                                <ValidatedInput
                                    label="Apellidos"
                                    value={formData.apellidos}
                                    onChange={(value) => {
                                        setFormData((prev) => ({ ...prev, apellidos: value }));
                                        setFormErrors((prev) => ({ ...prev, apellidos: "" }));
                                    }}
                                    onBlur={() => {
                                        setTouched((prev) => ({ ...prev, apellidos: true }));
                                        validateGuestField("apellidos");
                                    }}
                                    onFocus={() => setTouched((prev) => ({ ...prev, apellidos: true }))}
                                    error={formErrors.apellidos}
                                    touched={touched.apellidos || Boolean(formErrors.apellidos)}
                                    placeholder="Ej. Mendoza"
                                    required
                                />
                                <ValidatedInput
                                    label="Teléfono"
                                    value={formData.telefono}
                                    onChange={(value) => {
                                        setFormData((prev) => ({ ...prev, telefono: value }));
                                        setFormErrors((prev) => ({ ...prev, telefono: "" }));
                                    }}
                                    onBlur={() => {
                                        setTouched((prev) => ({ ...prev, telefono: true }));
                                        validateGuestField("telefono");
                                    }}
                                    onFocus={() => setTouched((prev) => ({ ...prev, telefono: true }))}
                                    error={formErrors.telefono}
                                    touched={touched.telefono || Boolean(formErrors.telefono)}
                                    placeholder="96751977"
                                    required
                                />
                                <ValidatedInput
                                    label="Correo"
                                    type="email"
                                    value={formData.email}
                                    onChange={(value) => {
                                        setFormData((prev) => ({ ...prev, email: value }));
                                        setFormErrors((prev) => ({ ...prev, email: "" }));
                                    }}
                                    onBlur={() => {
                                        setTouched((prev) => ({ ...prev, email: true }));
                                        validateGuestField("email");
                                    }}
                                    onFocus={() => setTouched((prev) => ({ ...prev, email: true }))}
                                    error={formErrors.email}
                                    touched={touched.email || Boolean(formErrors.email)}
                                    placeholder="cliente@hotel.com"
                                    required
                                />
                            </div>

                            <ValidatedInput
                                label="Documento"
                                value={formData.dni}
                                onChange={(value) => {
                                    setFormData((prev) => ({ ...prev, dni: value }));
                                    setFormErrors((prev) => ({ ...prev, dni: "" }));
                                }}
                                onBlur={() => {
                                    setTouched((prev) => ({ ...prev, dni: true }));
                                    validateGuestField("dni");
                                }}
                                onFocus={() => setTouched((prev) => ({ ...prev, dni: true }))}
                                error={formErrors.dni}
                                touched={touched.dni || Boolean(formErrors.dni)}
                                placeholder="0501200001234"
                                required
                            />

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => router.push("/bd/clientes")}
                                    className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {submitting ? "Guardando..." : "Guardar cliente"}
                                </button>
                            </div>
                        </form>
                    </section>

                    <aside className="rounded-[28px] border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
                                <span className="material-symbols-outlined">person_add</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Registro rápido</h3>
                                <p className="text-sm text-slate-300">Crea clientes directamente desde una vista dedicada y luego continúas con reservas o servicios.</p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                                <p className="text-sm font-semibold">1. Datos básicos</p>
                                <p className="mt-1 text-sm text-slate-300">Nombres, apellidos y documento.</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                                <p className="text-sm font-semibold">2. Contacto</p>
                                <p className="mt-1 text-sm text-slate-300">Teléfono y correo para comunicación inmediata.</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                                <p className="text-sm font-semibold">3. Uso posterior</p>
                                <p className="mt-1 text-sm text-slate-300">El perfil queda listo para reservas o facturación.</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}
