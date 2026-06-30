"use client";

import { useState } from "react";
import Image from "next/image";
import adminPhoto from "@/public/admin.jpg";
import Link from "next/link";

export default function Header() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Estado para controlar el menú desplegable de notificaciones
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const adminData = {
        name: "Admin Jefe",
        role: "Administrador General",
        hotel: "Hotel San Pedro",
        email: "gerencia@hotelsanpedro.com",
        phone: "+504 9778-4680",
        department: "Recepcion y Administración",
        since: "2026"
    };

    // Notificación estática solicitada
    const notifications = [
        {
            id: 1,
            title: "¡Celebración de Aniversario! 🎉",
            description: "Maynor Josue Padilla cumple 3 años en el equipo.",
            time: "Hace un momento"
        },
        {
            id: 2,
            title: "Reporte de Habitación ⚠️",
            description: "Habitación 204 reporta problemas con el aire acondicionado. Se requiere soporte.",
            time: "Hace 15 minutos"
        }
    ];

    return (
        <>
            <header className="sticky top-0 z-40 w-full bg-[#ffffff] border-b border-slate-300 card-shadow shadow-sm flex justify-between items-center px-10 py-2">
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#76777d]">
                            <span className="material-symbols-outlined">search</span>
                        </span>
                        <input readOnly className="pl-10 pr-6 py-2 bg-[#f2f4f6] border-none rounded-full text-[14px] leading-5 font-normal font-['Hanken_Grotesk'] w-64 focus:ring-2 focus:ring-[#008cc7] transition-all" placeholder="Buscar en Base de Datos..." type="text" />
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        {/* Contenedor relativo para posicionar la lista flotante */}
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className="p-2 text-[#515f74] hover:bg-[#f2f4f6] rounded-full transition-colors relative cursor-pointer flex items-center"
                            >
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-1 right-1 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
                            </button>

                            {/* Desplegable de Notificaciones */}
                            {isNotificationsOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden font-['Hanken_Grotesk']">
                                    <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
                                        <span className="text-sm font-bold text-slate-800">Notificaciones</span>
                                        <span className="text-[11px] bg-blue-100 text-[#008cc7] px-2 py-0.5 rounded-full font-semibold">Nueva</span>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {notifications.map((notif) => (
                                            <div key={notif.id} className="p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 text-left">
                                                <p className="text-xs font-bold text-slate-900 leading-tight mb-1">{notif.title}</p>
                                                <p className="text-xs text-slate-600 leading-normal">{notif.description}</p>
                                                <span className="text-[10px] text-slate-400 block mt-2">{notif.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button className="p-2 text-[#515f74] hover:bg-[#f2f4f6] rounded-full transition-colors cursor-pointer flex items-center">
                            <span className="material-symbols-outlined">help_outline</span>
                        </button>
                        <Link href="/" className="p-2 text-[#515f74] hover:bg-[#f2f4f6] rounded-full transition-colors cursor-pointer flex items-center">
                            <span className="material-symbols-outlined">web</span>
                        </Link>
                    </div>
                    <div className="h-8 w-px bg-[#c6c6cd] mx-2"></div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-4 cursor-pointer hover:bg-[#f2f4f6] p-1 px-2 rounded-xl transition-colors text-left focus:outline-none focus:ring-2 focus:ring-slate-300"
                    >
                        <Image height={34} width={34} alt="Administrator Profile" className="rounded-full object-cover aspect-square" src={adminPhoto} />
                        <div className="hidden lg:block">
                            <p className="text-[14px] font-semibold font-['Hanken_Grotesk'] tracking-wider text-[#000000] leading-none">{adminData.name}</p>
                            <p className="text-[12px] leading-3.5 font-medium font-['Hanken_Grotesk'] text-[#515f74] mt-0.5">{adminData.hotel}</p>
                        </div>
                    </button>
                </div>
            </header>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl border border-slate-300 shadow-xl w-full max-w-2xl overflow-hidden md:flex"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-75 bg-slate-100">
                            <Image
                                fill
                                src={adminPhoto}
                                alt="Admin Photo Large"
                                className="object-cover"
                                sizes="(max-w-768px) 100vw, 50vw"
                                priority
                            />
                        </div>

                        <div className="p-6 md:w-1/2 flex flex-col justify-between relative">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="cursor-pointer absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>

                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-widest text-[#008cc7] bg-blue-50 px-2 py-0.5 rounded">
                                    {adminData.department}
                                </span>
                                <h2 className="text-2xl font-bold text-slate-900 font-['Hanken_Grotesk'] mt-2 mb-1">
                                    {adminData.name}
                                </h2>
                                <p className="text-sm font-medium text-slate-500 font-['Hanken_Grotesk'] mb-6">
                                    {adminData.role}
                                </p>

                                <div className="space-y-3 border-t border-slate-100 pt-4 text-[13px] font-['Hanken_Grotesk']">
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <span className="material-symbols-outlined text-slate-400 text-[18px]">apartment</span>
                                        <span>{adminData.hotel}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <span className="material-symbols-outlined text-slate-400 text-[18px]">mail</span>
                                        <a href={`mailto:${adminData.email}`} className="hover:underline text-slate-800 font-medium">{adminData.email}</a>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <span className="material-symbols-outlined text-slate-400 text-[18px]">call</span>
                                        <span>{adminData.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <span className="material-symbols-outlined text-slate-400 text-[18px]">history</span>
                                        <span className="text-xs text-slate-500">Miembro desde: {adminData.since}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors"
                                >
                                    Cerrar perfil
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}