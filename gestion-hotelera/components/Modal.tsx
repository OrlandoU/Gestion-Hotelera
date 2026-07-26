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
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!open) return;

        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = "hidden";

        const previousActive = document.activeElement as HTMLElement | null;

        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onCloseRef.current();
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

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = originalStyle;
            previousActive?.focus();
        };
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6">
            <div
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                ref={containerRef}
                onClick={(event) => event.stopPropagation()}
                className="pointer-events-auto relative z-10 mx-auto flex w-full max-w-2xl flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.2)]"
            >
                <div className="flex items-start justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-5 py-4 sm:px-6">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-600">
                            Gestión hotelera
                        </p>
                        <h3 id="modal-title" className="mt-1 text-lg font-semibold text-slate-800">
                            {title}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>

                <div className="max-h-[calc(92vh-88px)] overflow-y-auto p-5 sm:p-6">{children}</div>
            </div>
        </div>
    );
}