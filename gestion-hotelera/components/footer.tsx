"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import Modal from "./Modal";
import Button from "./ui/button";
import { ValidatedInput, ValidatedSelect } from "./ui/validated-field";
import { getCurrentUser } from "@/functions/auth";
import { crearIncidente } from "@/functions/reportes-api";

const getDefaultForm = () => ({
    usuario_id: getCurrentUser()?.usuario_id ? String(getCurrentUser()!.usuario_id) : "",
    tipo: "",
    detalles: "",
    causas: "",
    recomendaciones: "",
    fecha: "",
});

type IncidenteFormFields = keyof ReturnType<typeof getDefaultForm>;

const tipoIncidenteOptions = [
    { label: "Electricidad / Apagón", value: "Electricidad" },
    { label: "Red / Sistema / Internet", value: "Red" },
    { label: "Incendio / Fuego / Humo", value: "Incendio" },
    { label: "Agua / Fuga / Inundación", value: "Agua" },
    { label: "Seguridad / Robo / Intrusión", value: "Seguridad" },
    { label: "Otro", value: "Otro" },
];

export default function Footer() {
    const [isIncidentOpen, setIsIncidentOpen] = useState(false);
    const [formData, setFormData] = useState(getDefaultForm);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<string | null>(null);

    const resetForm = () => {
        setFormData(getDefaultForm());
        setTouched({});
        setFormErrors({});
        setSubmitMessage(null);
    };

    const handleFieldChange = (field: IncidenteFormFields, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setFormErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const validateField = (field: IncidenteFormFields) => {
        const nextErrors: Record<string, string> = { ...formErrors };

        switch (field) {
            case "tipo": {
                if (!formData.tipo.trim() || formData.tipo.trim().length < 3) {
                    nextErrors.tipo = "Indica un tipo de incidente válido.";
                } else {
                    delete nextErrors.tipo;
                }
                break;
            }
            case "detalles": {
                if (!formData.detalles.trim() || formData.detalles.trim().length < 10) {
                    nextErrors.detalles = "Describe el incidente con al menos 10 caracteres.";
                } else {
                    delete nextErrors.detalles;
                }
                break;
            }
            case "causas": {
                if (formData.causas.trim() && formData.causas.trim().length < 6) {
                    nextErrors.causas = "La causa debe tener al menos 6 caracteres.";
                } else {
                    delete nextErrors.causas;
                }
                break;
            }
            case "recomendaciones": {
                if (formData.recomendaciones.trim() && formData.recomendaciones.trim().length < 6) {
                    nextErrors.recomendaciones = "La recomendación debe tener al menos 6 caracteres.";
                } else {
                    delete nextErrors.recomendaciones;
                }
                break;
            }
            case "fecha": {
                if (!formData.fecha.trim()) {
                    nextErrors.fecha = "Selecciona la fecha del incidente.";
                } else {
                    delete nextErrors.fecha;
                }
                break;
            }
            default:
                break;
        }

        setFormErrors(nextErrors);
        setTouched((prev) => ({ ...prev, [field]: true }));
        return !nextErrors[field];
    };

    const validateForm = () => {
        const nextErrors: Record<string, string> = {};

        if (!formData.tipo.trim() || formData.tipo.trim().length < 3) {
            nextErrors.tipo = "Indica un tipo de incidente válido.";
        }
        if (!formData.detalles.trim() || formData.detalles.trim().length < 10) {
            nextErrors.detalles = "Describe el incidente con al menos 10 caracteres.";
        }
        if (formData.causas.trim() && formData.causas.trim().length < 6) {
            nextErrors.causas = "La causa debe tener al menos 6 caracteres.";
        }
        if (formData.recomendaciones.trim() && formData.recomendaciones.trim().length < 6) {
            nextErrors.recomendaciones = "La recomendación debe tener al menos 6 caracteres.";
        }
        if (!formData.fecha.trim()) {
            nextErrors.fecha = "Selecciona la fecha del incidente.";
        }

        setFormErrors(nextErrors);
        setTouched({ tipo: true, detalles: true, causas: true, recomendaciones: true, fecha: true });
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateForm()) return;
        if (!formData.usuario_id) {
            toast.error("No se encontró el usuario actual. Vuelve a iniciar sesión.");
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage(null);

        try {
            await crearIncidente({
                usuario_id: Number(formData.usuario_id),
                tipo: formData.tipo,
                detalles: formData.detalles,
                causas: formData.causas || undefined,
                recomendaciones: formData.recomendaciones || undefined,
                fecha: formData.fecha,
            });
            setIsSubmitting(false);
            setSubmitMessage("Incidente registrado correctamente.");
            setIsIncidentOpen(false);
            resetForm();
            toast.success("Incidente registrado. Se añadirá al reporte correspondiente.");
        } catch (error) {
            setIsSubmitting(false);
            const message = error instanceof Error ? error.message : "No se pudo registrar el incidente.";
            toast.error(message);
        }
    };

    return (
        <>
            <footer className="mt-auto flex items-center justify-between border-t border-slate-300 px-10 py-6 text-[12px] font-medium leading-3.5 text-[#515f74] card-shadow">
                <p>© 2024 Hotel San Pedro Management System. Todos los derechos reservados.</p>
                <div className="flex items-center gap-6">
                    <button
                        type="button"
                        onClick={() => {
                            resetForm();
                            setIsIncidentOpen(true);
                        }}
                        className="transition-colors hover:text-[#000000]"
                    >
                        Registrar incidente
                    </button>
                    <a className="transition-colors hover:text-[#000000]" href="#">Soporte Técnico</a>
                    <a className="transition-colors hover:text-[#000000]" href="#">Privacidad</a>
                </div>
            </footer>

            <Modal open={isIncidentOpen} onClose={() => setIsIncidentOpen(false)} title="Registrar incidente">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                        <p className="text-sm font-medium text-slate-700">Registra el incidente con la información necesaria para seguimiento y control.</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <ValidatedSelect
                            label="Tipo"
                            value={formData.tipo}
                            onChange={(value) => handleFieldChange("tipo", value)}
                            onBlur={() => validateField("tipo")}
                            onFocus={() => setTouched((prev) => ({ ...prev, tipo: true }))}
                            error={formErrors.tipo}
                            touched={touched.tipo || Boolean(formErrors.tipo)}
                            placeholder="Selecciona un tipo"
                            options={tipoIncidenteOptions}
                            required
                        />
                    </div>

                    <ValidatedInput
                        label="Detalles"
                        value={formData.detalles}
                        onChange={(value) => handleFieldChange("detalles", value)}
                        onBlur={() => validateField("detalles")}
                        onFocus={() => setTouched((prev) => ({ ...prev, detalles: true }))}
                        error={formErrors.detalles}
                        touched={touched.detalles || Boolean(formErrors.detalles)}
                        placeholder="Describe el incidente"
                        required
                        multiline
                    />

                    <ValidatedInput
                        label="Causas"
                        value={formData.causas}
                        onChange={(value) => handleFieldChange("causas", value)}
                        onBlur={() => validateField("causas")}
                        onFocus={() => setTouched((prev) => ({ ...prev, causas: true }))}
                        error={formErrors.causas}
                        touched={touched.causas || Boolean(formErrors.causas)}
                        placeholder="Opcional"
                    />

                    <ValidatedInput
                        label="Recomendaciones"
                        value={formData.recomendaciones}
                        onChange={(value) => handleFieldChange("recomendaciones", value)}
                        onBlur={() => validateField("recomendaciones")}
                        onFocus={() => setTouched((prev) => ({ ...prev, recomendaciones: true }))}
                        error={formErrors.recomendaciones}
                        touched={touched.recomendaciones || Boolean(formErrors.recomendaciones)}
                        placeholder="Opcional"
                    />

                    <ValidatedInput
                        label="Fecha"
                        value={formData.fecha}
                        type="datetime-local"
                        onChange={(value) => handleFieldChange("fecha", value)}
                        onBlur={() => validateField("fecha")}
                        onFocus={() => setTouched((prev) => ({ ...prev, fecha: true }))}
                        error={formErrors.fecha}
                        touched={touched.fecha || Boolean(formErrors.fecha)}
                        required
                    />

                    {submitMessage && (
                        <div className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-700">
                            {submitMessage}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsIncidentOpen(false)}
                            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600"
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" disabled={isSubmitting} className="rounded-xl px-4 py-2 text-sm font-semibold">
                            {isSubmitting ? "Guardando..." : "Guardar incidente"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}