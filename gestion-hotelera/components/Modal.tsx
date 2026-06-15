"use client";
import React, { useEffect, useRef } from "react";

export default function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!open) return;
        const previousActive = document.activeElement as HTMLElement | null;

        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
            if (e.key === "Tab") {
                // basic focus trap
                const focusable = containerRef.current?.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
                );
                if (!focusable || focusable.length === 0) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            }
        }

        document.addEventListener("keydown", onKey);

        // focus the first input/button in modal
        const timer = setTimeout(() => {
            const first = containerRef.current?.querySelector<HTMLElement>(
                'input, textarea, select, button'
            );
            first?.focus();
        }, 50);

        return () => {
            clearTimeout(timer);
            document.removeEventListener("keydown", onKey);
            previousActive?.focus();
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                ref={containerRef}
                className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full mx-auto p-6 transform transition-transform duration-200 ease-out scale-100"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 id="modal-title" className="text-lg font-semibold text-slate-900">{title}</h3>
                    <button onClick={onClose} aria-label="Cerrar" className="text-slate-500 hover:text-slate-800 rounded-full p-1 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="space-y-4 text-sm text-slate-700">{children}</div>
            </div>
        </div>
    );
}
