import PageHeader from "@/components/pageheader"
import NewSolicitud from "@/components/NewSolicitud"

export default function MantenimientoPage() {
    return (
        <>
            <div className="max-w-360 mx-auto w-full flex flex-col gap-6">
                <PageHeader name="Mantenimiento" subtitle="Gestión de solicitudes y tareas de mantenimiento" buttons={<NewSolicitud />} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl border border-slate-300 card-shadow  p-6 card-shadow hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-35">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tickets Totales</span>
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-600 border border-slate-100">
                                <span className="material-symbols-outlined">confirmation_number</span>
                            </div>
                        </div>
                        <div>
                            <span className="text-2xl font-bold text-slate-950">124</span>
                            <span className="text-xs text-slate-400 ml-2">Este mes</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-300 card-shadow  p-6 card-shadow hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-35">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">En progreso</span>
                            <div className="p-2 bg-amber-50 rounded-lg text-amber-700 border border-amber-100">
                                <span className="material-symbols-outlined">autorenew</span>
                            </div>
                        </div>
                        <div>
                            <span className="text-2xl font-bold text-slate-950">18</span>
                            <span className="text-xs text-amber-600 font-medium ml-2">Tareas activas</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-red-200 p-6 card-shadow hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-35 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-bl-full"></div>
                        <div className="flex justify-between items-start relative z-10">
                            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Urgente / Alta</span>
                            <div className="p-2 bg-red-50 rounded-lg text-red-700 border border-red-100">
                                <span className="material-symbols-outlined">warning</span>
                            </div>
                        </div>
                        <div className="relative z-10">
                            <span className="text-2xl font-bold text-red-600">3</span>
                            <span className="text-xs text-red-500/80 font-medium ml-2">Requiere atención</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-300 card-shadow  card-shadow overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-300 card-shadow  flex justify-between items-center bg-slate-50">
                        <h3 className="text-base font-bold text-slate-950">Solicitudes activas</h3>
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors border border-slate-300 card-shadow  bg-white">
                            <span className="material-symbols-outlined text-[20px]">filter_list</span>
                        </button>
                    </div>

                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-300 card-shadow  bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <div className="col-span-2">Habitación / Área</div>
                        <div className="col-span-4">Descripción</div>
                        <div className="col-span-2">Prioridad</div>
                        <div className="col-span-2">Encargado</div>
                        <div className="col-span-2 text-right">Estado</div>
                    </div>

                    <div className="flex flex-col divide-y divide-slate-100">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors items-center cursor-pointer">
                            <div className="md:col-span-2 flex flex-col md:flex-row md:items-center gap-1">
                                <span className="font-semibold text-slate-900">Suite 402</span>
                                <span className="md:hidden text-xs text-slate-500 font-medium">Fuga en baño principal</span>
                            </div>
                            <div className="md:col-span-4 hidden md:block text-slate-600">
                                Fuga en baño principal - El agua se está extendiendo hacia la alfombra del pasillo.
                            </div>
                            <div className="md:col-span-2 flex items-center">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs  bg-red-50 text-red-700 border border-red-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-1.5"></span>
                                    Urgente
                                </span>
                            </div>
                            <div className="md:col-span-2 hidden md:flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-300 card-shadow ">MJ</div>
                                <span className="text-slate-600">Mike J.</span>
                            </div>
                            <div className="md:col-span-2 flex justify-between md:justify-end items-center mt-1 md:mt-0">
                                <span className="md:hidden text-slate-500">Mike J.</span>
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                                    <span className="material-symbols-outlined text-[14px]">autorenew</span>
                                    En proceso
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors items-center cursor-pointer">
                            <div className="md:col-span-2 flex flex-col md:flex-row md:items-center gap-1">
                                <span className="font-semibold text-slate-900">Lobby</span>
                                <span className="md:hidden text-xs text-slate-500 font-medium">Ruido en HVAC</span>
                            </div>
                            <div className="md:col-span-4 hidden md:block text-slate-600">
                                La unidad HVAC hace un ruido fuerte cerca de la recepción.
                            </div>
                            <div className="md:col-span-2 flex items-center">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs  bg-orange-50 text-orange-700 border border-orange-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5"></span>
                                    Alta
                                </span>
                            </div>
                            <div className="md:col-span-2 hidden md:flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-300 card-shadow ">SD</div>
                                <span className="text-slate-600">Sarah D.</span>
                            </div>
                            <div className="md:col-span-2 flex justify-between md:justify-end items-center mt-1 md:mt-0">
                                <span className="md:hidden text-slate-500">Sarah D.</span>
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 bg-sky-50 px-2 py-1 rounded-md border border-sky-100">
                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                    Pendiente
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors items-center cursor-pointer bg-slate-50/30">
                            <div className="md:col-span-2 flex flex-col md:flex-row md:items-center gap-1">
                                <span className="font-semibold text-slate-500">Room 215</span>
                                <span className="md:hidden text-xs text-slate-400 font-medium">Control remoto de TV roto</span>
                            </div>
                            <div className="md:col-span-4 hidden md:block text-slate-400">
                                Control remoto de TV sin el botón de bajar volumen.
                            </div>
                            <div className="md:col-span-2 flex items-center">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs  bg-slate-100 text-slate-600 border border-slate-300 card-shadow /60">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
                                    Media
                                </span>
                            </div>
                            <div className="md:col-span-2 hidden md:flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-300 card-shadow /60">Un</div>
                                <span className="text-slate-400 italic">Sin asignar</span>
                            </div>
                            <div className="md:col-span-2 flex justify-between md:justify-end items-center mt-1 md:mt-0">
                                <span className="md:hidden text-slate-400 italic">Sin asignar</span>
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                    Resuelto
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 flex justify-center bg-slate-50 border-t border-slate-300 card-shadow ">
                        <button className="text-slate-600 hover:text-slate-950 font-semibold text-xs transition-colors px-4 py-2">
                            Ver todas las solicitudes
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}