'use client'

import { useState } from "react"
import MantenimientoModal from "@/components/MantenimientoModal" // Ajusta la ruta a tu modal
import { Ticket } from "@/functions/tickets"

export default function NewSolicitud() {
    const [openModal, setOpenModal] = useState(false);

    const handleSave = (data: Ticket) => {
        console.log("Nueva solicitud guardada:", data);
        // Aquí puedes refrescar la tabla o hacer revalidate de tus datos
    };

    return (
        <>
            {/* Botón en la esquina superior derecha */}

            <button
                onClick={() => setOpenModal(true)}
                className="hover:cursor-pointer hover:-translate-y-0.5 right-4 bottom-4 flex items-center justify-center gap-2 bg-[#000000] text-[#ffffff] py-4 px-6 rounded-[2.5rem] text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider transition-transform active:scale-95 shadow-lg"
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