'use client'

import { useState } from "react"
import MantenimientoModal from "@/components/MantenimientoModal" // Ajusta la ruta a tu modal

export default function NewSolicitud() {
    const [openModal, setOpenModal] = useState(false);

    const handleSave = (data: any) => {
        console.log("Nueva solicitud guardada:", data);
        // Aquí puedes refrescar la tabla o hacer revalidate de tus datos
    };

    return (
        <>
            {/* Botón en la esquina superior derecha */}
            <button
                onClick={() => setOpenModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
            >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>Solicitar mantenimiento</span>
            </button>

            {/* Modal que se muestra cuando openModal es true */}
            <MantenimientoModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSave={handleSave}
            />
        </>
    );
}