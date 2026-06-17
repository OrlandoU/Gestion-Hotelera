"use client";

import { useState, ViewTransition } from "react";
import PageHeader from "@/components/pageheader";
import Link from "next/link";

export default function CrearReservacion() {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedRoom, setSelectedRoom] = useState("104");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        docType: "passport",
        docId: "",
        checkInDate: "",
        checkOutDate: "",
        specialRequests: "",
        extras: [] as string[]
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNextStep = () => {
        if (currentStep < 5) setCurrentStep(currentStep + 1);
    };

    const handlePrevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const getStepStatus = (step: number) => {
        if (currentStep === step) return "bg-slate-950 text-white";
        if (step < currentStep) return "bg-emerald-500 text-white";
        return "bg-slate-100 text-slate-400";
    };

    const getStepTextColor = (step: number) => {
        if (currentStep === step) return "text-slate-950";
        if (step < currentStep) return "text-emerald-600";
        return "text-slate-400";
    };

    return (
        <ViewTransition enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}>
            <div>
                <div className="flex items-center gap-1 text-slate-500 text-xs mb-2">
                    <Link className="hover:text-slate-900 transition-colors" href="/bd/reservaciones" transitionTypes={["nav-back"]}>Reservaciones</Link>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <span className="text-slate-800 font-medium">Crear reserva</span>
                </div>
            <PageHeader name="Crear nueva reservación" subtitle="Completa los pasos para crear una nueva reserva." buttons={null} />
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-6">

                    <div className="bg-white rounded-xl border border-slate-200 p-4 card-shadow">
                        <div className="flex items-start justify-between relative text-center">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-slate-100 -z-10"></div>

                            <div className="flex flex-col items-center gap-1.5 bg-white px-3 flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 shadow-sm transition-colors ${getStepStatus(1)}`}>1</div>
                                <span className={`text-xs font-semibold transition-colors ${getStepTextColor(1)}`}>Seleccionar habitación</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 bg-white px-3 flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs z-10 transition-colors ${getStepStatus(2)}`}>2</div>
                                <span className={`text-xs font-medium transition-colors ${getStepTextColor(2)}`}>Información del huésped</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 bg-white px-3 flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs z-10 transition-colors ${getStepStatus(3)}`}>3</div>
                                <span className={`text-xs font-medium transition-colors ${getStepTextColor(3)}`}>Detalles de la estadía</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 bg-white px-3 flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs z-10 transition-colors ${getStepStatus(4)}`}>4</div>
                                <span className={`text-xs font-medium transition-colors ${getStepTextColor(4)}`}>Extras</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 bg-white px-3 flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs z-10 transition-colors ${getStepStatus(5)}`}>5</div>
                                <span className={`text-xs font-medium transition-colors ${getStepTextColor(5)}`}>Confirmar</span>
                            </div>
                        </div>
                    </div>

                    {currentStep === 1 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-6 card-shadow">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                                <h3 className="text-base font-bold text-slate-950">Seleccionar habitación</h3>
                                
                                <div className="flex flex-wrap gap-3">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                        <span className="text-xs text-slate-500 font-medium">Limpia</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                                        <span className="text-xs text-slate-500 font-medium">Ocupada</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                                        <span className="text-xs text-slate-500 font-medium">Sucia</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                                        <span className="text-xs text-slate-500 font-medium">Mant.</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 mb-6">
                                {["101", "102", "103", "104", "105", "106", "107", "108", "201", "202", "203", "204", "205", "206", "207", "208"].map((room) => {
                                    const roomStatus = {
                                        "101": "emerald-500", "102": "slate-400", "103": "amber-500", "104": "sky-500",
                                        "105": "rose-500", "106": "emerald-500", "107": "slate-400", "108": "slate-400",
                                        "201": "amber-500", "202": "emerald-500", "203": "slate-400", "204": "slate-400",
                                        "205": "emerald-500", "206": "emerald-500", "207": "amber-500", "208": "amber-500"
                                    }[room] || "slate-400";
                                    const isSelected = selectedRoom === room;
                                    return (
                                        <button
                                            key={room}
                                            onClick={() => setSelectedRoom(room)}
                                            className={`aspect-square border-t-4 flex items-center justify-center rounded text-xs font-semibold cursor-pointer transition-colors ${
                                                isSelected
                                                    ? "border-sky-500 bg-sky-600 text-white shadow-md ring-2 ring-sky-600 ring-offset-2"
                                                    : `border-${roomStatus} bg-slate-50 hover:bg-slate-100 text-slate-600`
                                            }`}
                                            style={{borderTopColor: `var(--color-${roomStatus})`}}
                                        >
                                            {room}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <Link href="/bd/reservaciones" transitionTypes={["nav-back"]} className="flex items-center h-10 px-5 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors cursor-pointer">
                                    Cancelar
                                </Link>
                                <button onClick={handleNextStep} className="h-10 px-5 rounded-lg bg-sky-600 text-white font-bold hover:bg-sky-500 hover:shadow-sm hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer">
                                    Siguiente paso
                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-6 card-shadow">
                            <h3 className="text-base font-bold text-slate-950 mb-4">Información del huésped</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-slate-500" htmlFor="firstName">Nombre</label>
                                    <input className="w-full h-10 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white focus:ring-0 rounded-lg px-3 text-slate-800 placeholder-slate-400 outline-none transition-all" id="firstName" name="firstName" placeholder="Ej. Eleanor" type="text" value={formData.firstName} onChange={handleInputChange} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-slate-500" htmlFor="lastName">Apellidos</label>
                                    <input className="w-full h-10 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white focus:ring-0 rounded-lg px-3 text-slate-800 placeholder-slate-400 outline-none transition-all" id="lastName" name="lastName" placeholder="Ej. Vance" type="text" value={formData.lastName} onChange={handleInputChange} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-slate-500" htmlFor="email">Correo electrónico</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">mail</span>
                                        <input className="w-full h-10 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white focus:ring-0 rounded-lg pl-9 pr-3 text-slate-800 placeholder-slate-400 outline-none transition-all" id="email" name="email" placeholder="invitado@ejemplo.com" type="email" value={formData.email} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-slate-500" htmlFor="phone">Teléfono</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">phone</span>
                                        <input className="w-full h-10 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white focus:ring-0 rounded-lg pl-9 pr-3 text-slate-800 placeholder-slate-400 outline-none transition-all" id="phone" name="phone" placeholder="+504 9778-4680" type="tel" value={formData.phone} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-slate-500" htmlFor="docType">Tipo de documento</label>
                                    <div className="relative">
                                        <select className="w-full h-10 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white focus:ring-0 rounded-lg px-3 text-slate-800 outline-none transition-all appearance-none cursor-pointer" id="docType" name="docType" value={formData.docType} onChange={handleInputChange}>
                                            <option value="passport">Pasaporte</option>
                                            <option value="id">Documento de identidad</option>
                                            <option value="driver">Licencia de conducir</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-slate-500" htmlFor="docId">Número de documento</label>
                                    <input className="w-full h-10 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white focus:ring-0 rounded-lg px-3 text-slate-800 placeholder-slate-400 outline-none transition-all" id="docId" name="docId" placeholder="Ingresa el número de documento" type="text" value={formData.docId} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-between gap-3 border-t border-slate-100 pt-4">
                                <button onClick={handlePrevStep} className="h-10 px-5 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer">
                                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                    Atrás
                                </button>
                                <div className="flex gap-3">
                                    <Link href="/bd/reservaciones" transitionTypes={["nav-back"]} className="flex items-center h-10 px-5 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors cursor-pointer">
                                        Cancelar
                                    </Link>
                                    <button onClick={handleNextStep} className="h-10 px-5 rounded-lg bg-sky-600 text-white font-bold hover:bg-sky-500 hover:shadow-sm hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer">
                                        Siguiente paso
                                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-6 card-shadow">
                            <h3 className="text-base font-bold text-slate-950 mb-4">Detalles de la estadía</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-slate-500" htmlFor="checkInDate">Fecha de entrada</label>
                                    <input className="w-full h-10 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white focus:ring-0 rounded-lg px-3 text-slate-800 placeholder-slate-400 outline-none transition-all" id="checkInDate" name="checkInDate" type="date" value={formData.checkInDate} onChange={handleInputChange} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-slate-500" htmlFor="checkOutDate">Fecha de salida</label>
                                    <input className="w-full h-10 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white focus:ring-0 rounded-lg px-3 text-slate-800 placeholder-slate-400 outline-none transition-all" id="checkOutDate" name="checkOutDate" type="date" value={formData.checkOutDate} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-between gap-3 border-t border-slate-100 pt-4">
                                <button onClick={handlePrevStep} className="h-10 px-5 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer">
                                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                    Atrás
                                </button>
                                <div className="flex gap-3">
                                    <Link href="/bd/reservaciones" transitionTypes={["nav-back"]} className="flex items-center h-10 px-5 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors cursor-pointer">
                                        Cancelar
                                    </Link>
                                    <button onClick={handleNextStep} className="h-10 px-5 rounded-lg bg-sky-600 text-white font-bold hover:bg-sky-500 hover:shadow-sm hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer">
                                        Siguiente paso
                                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-6 card-shadow">
                            <h3 className="text-base font-bold text-slate-950 mb-4">Servicios adicionales</h3>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                    <input type="checkbox" id="wifi" className="w-4 h-4 cursor-pointer" />
                                    <label htmlFor="wifi" className="flex-1 cursor-pointer">
                                        <span className="text-sm font-semibold text-slate-800">WiFi Premium</span>
                                        <p className="text-xs text-slate-500">Conexión de alta velocidad</p>
                                    </label>
                                    <span className="text-sm font-bold text-slate-900">$5.00</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                    <input type="checkbox" id="parking" className="w-4 h-4 cursor-pointer" />
                                    <label htmlFor="parking" className="flex-1 cursor-pointer">
                                        <span className="text-sm font-semibold text-slate-800">Estacionamiento</span>
                                        <p className="text-xs text-slate-500">Acceso a estacionamiento privado</p>
                                    </label>
                                    <span className="text-sm font-bold text-slate-900">$10.00</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                    <input type="checkbox" id="spa" className="w-4 h-4 cursor-pointer" />
                                    <label htmlFor="spa" className="flex-1 cursor-pointer">
                                        <span className="text-sm font-semibold text-slate-800">Acceso a spa</span>
                                        <p className="text-xs text-slate-500">Uso de piscina y sauna</p>
                                    </label>
                                    <span className="text-sm font-bold text-slate-900">$15.00</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 mb-4">
                                <label className="text-xs font-semibold text-slate-500" htmlFor="specialRequests">Solicitudes especiales</label>
                                <textarea className="w-full h-24 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white focus:ring-0 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 outline-none transition-all resize-none" id="specialRequests" name="specialRequests" placeholder="Ingresa cualquier solicitud especial..." value={formData.specialRequests} onChange={handleInputChange} />
                            </div>

                            <div className="mt-6 flex justify-between gap-3 border-t border-slate-100 pt-4">
                                <button onClick={handlePrevStep} className="h-10 px-5 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer">
                                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                    Atrás
                                </button>
                                <div className="flex gap-3">
                                    <Link href="/bd/reservaciones" transitionTypes={["nav-back"]} className="flex items-center h-10 px-5 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors cursor-pointer">
                                        Cancelar
                                    </Link>
                                    <button onClick={handleNextStep} className="h-10 px-5 rounded-lg bg-sky-600 text-white font-bold hover:bg-sky-500 hover:shadow-sm hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer">
                                        Siguiente paso
                                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-6 card-shadow">
                            <h3 className="text-base font-bold text-slate-950 mb-4">Revisar y confirmar</h3>

                            <div className="space-y-4 mb-6">
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <p className="text-xs text-slate-500 font-semibold mb-2">Habitación seleccionada</p>
                                    <p className="text-lg font-bold text-slate-900">Habitación {selectedRoom}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <p className="text-xs text-slate-500 font-semibold mb-2">Huésped</p>
                                    <p className="text-lg font-bold text-slate-900">{formData.firstName} {formData.lastName}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <p className="text-xs text-slate-500 font-semibold mb-2">Contacto</p>
                                    <p className="text-sm text-slate-800">{formData.email}</p>
                                    <p className="text-sm text-slate-800">{formData.phone}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <p className="text-xs text-slate-500 font-semibold mb-2">Fechas</p>
                                    <p className="text-sm text-slate-800">Entrada: {formData.checkInDate}</p>
                                    <p className="text-sm text-slate-800">Salida: {formData.checkOutDate}</p>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-between gap-3 border-t border-slate-100 pt-4">
                                <button onClick={handlePrevStep} className="h-10 px-5 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer">
                                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                    Atrás
                                </button>
                                <div className="flex gap-3">
                                    <Link href="/bd/reservaciones" transitionTypes={["nav-back"]} className="flex items-center h-10 px-5 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors cursor-pointer">
                                        Cancelar
                                    </Link>
                                    <button onClick={() => {}} className="h-10 px-5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 hover:shadow-sm hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer">
                                        Confirmar reservación
                                        <span className="material-symbols-outlined text-[18px]">check</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <aside className="w-full lg:w-[360px] shrink-0">
                    <div className="bg-white rounded-xl border border-slate-200 p-5 card-shadow sticky top-24">
                        <h3 className="text-base font-bold text-slate-950 border-b border-slate-100 pb-3 mb-3">Resumen de reservación</h3>

                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Paso {currentStep} de 5</span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="text-slate-500">
                                    <span className="material-symbols-outlined text-[18px] align-middle mr-1">meeting_room</span>
                                    <span className="text-xs font-semibold">Habitación</span>
                                    <p className="text-xs font-medium text-slate-900 mt-1">{selectedRoom || "Seleccionar"}</p>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500">Huésped</span>
                                <span className="font-semibold text-slate-900">{formData.firstName || "--"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500">Correo</span>
                                <span className="font-semibold text-slate-900 text-right text-xs truncate">{formData.email || "--"}</span>
                            </div>

                            <hr className="border-slate-100" />

                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500">Entrada</span>
                                <span className="text-slate-900 text-xs">{formData.checkInDate || "--"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500">Salida</span>
                                <span className="text-slate-900 text-xs">{formData.checkOutDate || "--"}</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200">
                            <p className="text-xs text-slate-500 mb-2">Paso actual: <strong>{["Seleccionar habitación", "Información del huésped", "Detalles de la estadía", "Servicios adicionales", "Confirmar"][currentStep - 1]}</strong></p>
                        </div>
                    </div>
                </aside>

            </div>
        </ ViewTransition>);
}