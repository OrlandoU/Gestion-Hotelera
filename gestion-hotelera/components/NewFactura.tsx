"use client";
import React, { useState } from "react";
import Modal from "./Modal";

const fieldClassName = (hasError: boolean) =>
    `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition ${hasError
        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
        : "border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
    }`;

export default function NewFactura() {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ client: "", date: "", amount: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const nextErrors: Record<string, string> = {};

        if (!formData.client.trim()) nextErrors.client = "Ingresa el nombre del cliente.";
        if (!formData.date) nextErrors.date = "Selecciona una fecha válida.";
        if (!formData.amount) nextErrors.amount = "Ingresa un monto mayor a cero.";
        else if (Number(formData.amount) <= 0) nextErrors.amount = "El monto debe ser mayor a cero.";

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (saving) return;
        if (!validateForm()) return;

        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setOpen(false);
            setFormData({ client: "", date: "", amount: "" });
            setErrors({});
        }, 700);
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="hover:cursor-pointer hover:-translate-y-0.5 right-4 bottom-4 flex items-center justify-center gap-2 rounded-[2.5rem] bg-[#000000] px-6 py-4 text-[14px] font-semibold leading-4 tracking-wider text-[#ffffff] shadow-lg transition-transform active:scale-95"
            >
                <span className="material-symbols-outlined">add</span> Nueva Factura
            </button>
            <Modal open={open} onClose={() => setOpen(false)} title="Nueva Factura">
                <form onSubmit={handleSave} className="space-y-5">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                        <p className="text-sm font-medium text-slate-700">Completa los datos para registrar una factura nueva.</p>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Cliente</label>
                        <input
                            name="client"
                            value={formData.client}
                            onChange={handleChange}
                            placeholder="Nombre del cliente"
                            className={fieldClassName(Boolean(errors.client))}
                        />
                        {errors.client ? <p className="mt-1 text-xs text-red-500">{errors.client}</p> : null}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Fecha</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className={fieldClassName(Boolean(errors.date))}
                            />
                            {errors.date ? <p className="mt-1 text-xs text-red-500">{errors.date}</p> : null}
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Monto</label>
                            <input
                                name="amount"
                                type="number"
                                step="0.01"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="0.00"
                                className={fieldClassName(Boolean(errors.amount))}
                            />
                            {errors.amount ? <p className="mt-1 text-xs text-red-500">{errors.amount}</p> : null}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            disabled={saving}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-60"
                        >
                            {saving ? (
                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" opacity="0.25"></circle>
                                    <path d="M22 12a10 10 0 00-10-10" stroke="white" strokeWidth="4" strokeLinecap="round"></path>
                                </svg>
                            ) : null}
                            Guardar
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
