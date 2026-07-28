"use client";
import React, { useState } from "react";
import Button from "@/components/ui/button";
import Modal from "./Modal";
import Link from "next/link";

const fieldClassName = (hasError: boolean) =>
    `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition ${hasError
        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
        : "border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
    }`;

export default function NewReservation() {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ guest: "", checkin: "", checkout: "", room: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const nextErrors: Record<string, string> = {};

        if (!formData.guest.trim()) nextErrors.guest = "Ingresa el nombre del huésped.";
        if (!formData.checkin) nextErrors.checkin = "Selecciona una fecha de ingreso.";
        if (!formData.checkout) nextErrors.checkout = "Selecciona una fecha de salida.";
        else if (formData.checkin && formData.checkout <= formData.checkin) nextErrors.checkout = "La salida debe ser posterior al ingreso.";
        if (!formData.room.trim()) nextErrors.room = "Selecciona o escribe una habitación.";

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
            setFormData({ guest: "", checkin: "", checkout: "", room: "" });
            setErrors({});
        }, 700);
    }

    return (
        <>
            <Link href={"/bd/reservaciones/crear"} transitionTypes={['nav-forward']} className="hover:cursor-pointer hover:-translate-y-0.5 right-4 bottom-4 flex items-center justify-center gap-2 rounded-[2.5rem] bg-[#000000] px-6 py-4 text-[14px] font-semibold leading-4 tracking-wider text-[#ffffff] shadow-lg transition-transform active:scale-95">
                <span className="material-symbols-outlined">add</span> Nueva Reserva
            </Link>
            <Modal open={open} onClose={() => setOpen(false)} title="Nueva Reserva">
                <form onSubmit={handleSave} className="space-y-5">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                        <p className="text-sm font-medium text-slate-700">Registra la información básica para confirmar la reserva.</p>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Nombre del huésped</label>
                        <input
                            name="guest"
                            value={formData.guest}
                            onChange={handleChange}
                            placeholder="Nombre del huésped"
                            className={fieldClassName(Boolean(errors.guest))}
                        />
                        {errors.guest ? <p className="mt-1 text-xs text-red-500">{errors.guest}</p> : null}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Check-in</label>
                            <input
                                type="date"
                                name="checkin"
                                value={formData.checkin}
                                onChange={handleChange}
                                className={fieldClassName(Boolean(errors.checkin))}
                            />
                            {errors.checkin ? <p className="mt-1 text-xs text-red-500">{errors.checkin}</p> : null}
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Check-out</label>
                            <input
                                type="date"
                                name="checkout"
                                value={formData.checkout}
                                onChange={handleChange}
                                className={fieldClassName(Boolean(errors.checkout))}
                            />
                            {errors.checkout ? <p className="mt-1 text-xs text-red-500">{errors.checkout}</p> : null}
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Habitación</label>
                        <input
                            name="room"
                            value={formData.room}
                            onChange={handleChange}
                            placeholder="Número o tipo de habitación"
                            className={fieldClassName(Boolean(errors.room))}
                        />
                        {errors.room ? <p className="mt-1 text-xs text-red-500">{errors.room}</p> : null}
                    </div>

                    <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={saving}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={saving} variant="primary">
                            {saving ? (
                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" opacity="0.25"></circle>
                                    <path d="M22 12a10 10 0 00-10-10" stroke="white" strokeWidth="4" strokeLinecap="round"></path>
                                </svg>
                            ) : null}
                            Guardar
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
