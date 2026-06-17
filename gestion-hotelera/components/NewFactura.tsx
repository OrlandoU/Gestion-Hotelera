"use client";
import React, { useState } from "react";
import Modal from "./Modal";

export default function NewFactura() {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (saving) return;
        const data = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries());
        setSaving(true);
        // console.log removed for production
        setTimeout(() => {
            setSaving(false);
            setOpen(false);
        }, 700);
    }

    return (
        <>
            <button onClick={() => setOpen(true)} className="hover:cursor-pointer hover:-translate-y-0.5 right-4 bottom-4 flex items-center justify-center gap-2 bg-[#000000] text-[#ffffff] py-4 px-6 rounded-[2.5rem] text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider transition-transform active:scale-95 shadow-lg">
                <span className="material-symbols-outlined">add</span> Nueva Factura
            </button>
            <Modal open={open} onClose={() => setOpen(false)} title="Nueva Factura">
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Cliente</label>
                        <input name="client" required className="mt-1 w-full border rounded px-3 py-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Fecha</label>
                            <input type="date" name="date" required className="mt-1 w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Monto</label>
                            <input name="amount" type="number" step="0.01" className="mt-1 w-full border rounded px-3 py-2" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setOpen(false)} disabled={saving} className="px-4 py-2 rounded border text-sm hover:bg-slate-50 transition-colors cursor-pointer">Cancelar</button>
                        <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-[#008cc7] text-white text-sm flex items-center gap-2 disabled:opacity-60 cursor-pointer">
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
