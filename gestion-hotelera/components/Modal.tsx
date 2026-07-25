"use client";
import React, { useEffect, useRef } from "react";

export interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!open) return;

        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = "hidden";

        const previousActive = document.activeElement as HTMLElement | null;

        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
            if (e.key === "Tab") {
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

        const timer = setTimeout(() => {
            const first = containerRef.current?.querySelector<HTMLElement>(
                "input, select, textarea, button:not([aria-label='Cerrar'])"
            );
            first?.focus();
        }, 50);

        return () => {
            clearTimeout(timer);
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = originalStyle;
            previousActive?.focus();
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                ref={containerRef}
                className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-auto flex flex-col max-h-[90vh] z-10 overflow-hidden border border-slate-100 transition-all transform scale-100"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 id="modal-title" className="text-lg font-semibold text-slate-800">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-full p-1.5 transition-colors cursor-pointer flex items-center justify-center"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">{children}</div>
            </div>
        </div>
    );
}