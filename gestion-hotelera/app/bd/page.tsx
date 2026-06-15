import PageHeader from "@/components/pageheader";
import NewReservation from "@/components/NewReservation";

export default function Page() {
    return (
        <>
            <PageHeader name="Dashboard" subtitle="Visión general de operaciones" buttons={<NewReservation />} />
            <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-[#ffffff] border border-slate-300 card-shadow  rounded-xl p-6 shadow-level-1 hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex justify-between items-start gap-4 flex-col-reverse">
                        <span className="text-[14px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Ocupación hoy</span>
                        <div className="p-2 bg-[#131b2e] rounded-lg flex items-center text-[#000000]">
                            <span className="material-symbols-outlined text-[20px] text-white">meeting_room</span>
                        </div>
                    </div>
                    <div className="flex items-end gap-4">
                        <h2 className="font-['Hanken_Grotesk'] text-[24px] leading-10 tracking-[-0.02em] font-semibold text-[#000000]">87%</h2>
                        <span className="text-[12px] leading-3.5 font-medium text-[#001e2f] flex items-center mb-1">
                            <span className="material-symbols-outlined text-[16px]">trending_up</span> +2.4%
                        </span>
                    </div>
                </div>

                <div className="bg-[#ffffff] border border-slate-300 card-shadow  rounded-xl p-6 shadow-level-1 hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex justify-between items-start gap-4 flex-col-reverse">
                        <span className="text-[14px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Ingresos totales (Mes)</span>
                        <div className="p-2 bg-[#d5e3fd] rounded-lg flex items-center text-[#515f74]">
                            <span className="material-symbols-outlined text-[20px]">payments</span>
                        </div>
                    </div>
                    <div className="flex items-end gap-4">
                        <h2 className="font-['Hanken_Grotesk'] text-[24px] leading-10 tracking-[-0.02em] font-semibold text-[#000000]">$142.5k</h2>
                        <span className="text-[12px] leading-3.5 font-medium text-[#001e2f] flex items-center mb-1">
                            <span className="material-symbols-outlined text-[16px]">trending_up</span> +8.1%
                        </span>
                    </div>
                </div>

                <div className="bg-[#ffffff] border border-slate-300 card-shadow  rounded-xl p-6 shadow-level-1 hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex justify-between items-start gap-4 flex-col-reverse">
                        <span className="text-[14px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Mantenimiento pendiente</span>
                        <div className="p-2 bg-[#ffdad6] rounded-lg flex items-center text-[#93000a]">
                            <span className="material-symbols-outlined text-[20px]">build</span>
                        </div>
                    </div>
                    <div className="flex items-end gap-4">
                        <h2 className="font-['Hanken_Grotesk'] text-[24px] leading-10 tracking-[-0.02em] font-semibold text-[#000000]">14</h2>
                        <span className="text-[12px] leading-3.5 font-medium text-[#ba1a1a] flex items-center mb-1">
                            3 High Priority
                        </span>
                    </div>
                </div>

                <div className="bg-[#ffffff] border border-slate-300 card-shadow  rounded-xl p-6 shadow-level-1 hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex justify-between items-start gap-4 flex-col-reverse">
                        <span className="text-[14px] leading-4 font-semibold tracking-wider text-[#515f74] font-['Hanken_Grotesk']">Alertas de stock bajas</span>
                        <div className="p-2 bg-[#e0e3e5] rounded-lg flex items-center text-[#565e74]">
                            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                        </div>
                    </div>
                    <div className="flex items-end gap-4">
                        <h2 className="font-['Hanken_Grotesk'] text-[24px] leading-10 tracking-[-0.02em] font-semibold text-[#000000]">8</h2>
                        <span className="text-[12px] leading-3.5 font-medium text-[#515f74] flex items-center mb-1">
                            Items need review
                        </span>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-8 bg-[#ffffff] border border-slate-300 card-shadow  rounded-xl p-6 shadow-level-1 flex flex-col">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-300 card-shadow ">
                        <h3 className="font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-[#000000]">Estado de habitaciones</h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#001e2f]"></span>
                                <span className="text-[12px] leading-3.5 font-medium text-[#515f74]">Clean</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#131b2e]"></span>
                                <span className="text-[12px] leading-3.5 font-medium text-[#515f74]">Occupied</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#c6c6cd]"></span>
                                <span className="text-[12px] leading-3.5 font-medium text-[#515f74]">Dirty</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#ffdad6] border border-[#ba1a1a]"></span>
                                <span className="text-[12px] leading-3.5 font-medium text-[#515f74]">Maintenance</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-6 md:grid-cols-10 gap-2 flex-1">
                        <div className="aspect-square border-t-4 border-[#001e2f] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-3.5 font-medium text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">101</div>
                        <div className="aspect-square border-t-4 border-[#131b2e] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-3.5 font-medium text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">102</div>
                        <div className="aspect-square border-t-4 border-slate-300 card-shadow  bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-3.5 font-medium text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">103</div>
                        <div className="aspect-square border-t-4 border-[#001e2f] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-3.5 font-medium text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">104</div>
                        <div className="aspect-square border-t-4 border-[#ffdad6] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-3.5 font-medium text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">105</div>
                        <div className="aspect-square border-t-4 border-[#001e2f] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-3.5 font-medium text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">106</div>
                        <div className="aspect-square border-t-4 border-[#131b2e] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-3.5 font-medium text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">107</div>
                        <div className="aspect-square border-t-4 border-[#131b2e] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-3.5 font-medium text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">108</div>
                        <div className="aspect-square border-t-4 border-slate-300 card-shadow  bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-3.5 font-medium text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">109</div>
                        <div className="aspect-square border-t-4 border-[#001e2f] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-3.5 font-medium text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">110</div>
                        <div className="aspect-square border-t-4 border-[#131b2e] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-3.5 font-medium text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">201</div>
                        <div className="aspect-square border-t-4 border-[#131b2e] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-3.5 font-medium text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">202</div>
                        <div className="aspect-square border-t-4 border-[#001e2f] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-3.5 font-medium text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">203</div>
                        <div className="aspect-square border-t-4 border-[#001e2f] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-3.5 font-medium text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">204</div>
                        <div className="aspect-square border-t-4 border-slate-300 card-shadow  bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-3.5 font-medium text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">205</div>
                        <div className="aspect-square border-t-4 border-slate-300 card-shadow  bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-3.5 font-medium text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">206</div>
                        <div className="aspect-square border-t-4 border-[#131b2e] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-3.5 font-medium text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">207</div>
                        <div className="aspect-square border-t-4 border-[#131b2e] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-3.5 font-medium text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">208</div>
                        <div className="aspect-square border-t-4 border-[#ffdad6] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-3.5 font-medium text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">209</div>
                        <div className="aspect-square border-t-4 border-[#001e2f] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-3.5 font-medium text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">210</div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-4 bg-[#ffffff] border border-slate-300 card-shadow  rounded-xl p-6 shadow-level-1 flex flex-col">
                    <h3 className="font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-[#000000] mb-6">Ocupación semanal</h3>
                    <div className="flex-1 flex items-end gap-2 mt-4 pt-4 border-t border-slate-300 card-shadow  h-50">
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-[#bec6e0] rounded-t-sm h-[60%] hover:bg-[#131b2e] transition-colors cursor-pointer"></div>
                            <span className="text-[12px] leading-3.5 font-medium text-[#515f74]">Mon</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-[#bec6e0] rounded-t-sm h-[75%] hover:bg-[#131b2e] transition-colors cursor-pointer"></div>
                            <span className="text-[12px] leading-3.5 font-medium text-[#515f74]">Tue</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-[#131b2e] rounded-t-sm h-[90%] hover:bg-[#000000] transition-colors cursor-pointer relative group">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2d3133] text-[#eff1f3] text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">90%</div>
                            </div>
                            <span className="text-[12px] leading-3.5 font-bold text-[#000000]">Wed</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-[#bec6e0] rounded-t-sm h-[85%] hover:bg-[#131b2e] transition-colors cursor-pointer"></div>
                            <span className="text-[12px] leading-3.5 font-medium text-[#515f74]">Thu</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-[#bec6e0] rounded-t-sm h-[95%] hover:bg-[#131b2e] transition-colors cursor-pointer"></div>
                            <span className="text-[12px] leading-3.5 font-medium text-[#515f74]">Fri</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-[#bec6e0] rounded-t-sm h-full hover:bg-[#131b2e] transition-colors cursor-pointer"></div>
                            <span className="text-[12px] leading-3.5 font-medium text-[#515f74]">Sat</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-[#bec6e0] rounded-t-sm h-[70%] hover:bg-[#131b2e] transition-colors cursor-pointer"></div>
                            <span className="text-[12px] leading-3.5 font-medium text-[#515f74]">Sun</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#ffffff] border border-slate-300 card-shadow  rounded-xl shadow-level-1 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-300 card-shadow  flex justify-between items-center bg-[#f7f9fb]">
                    <h3 className="font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-[#000000]">Actividad Reciente</h3>
                    <button className="border border-slate-300 card-shadow  text-[#515f74] px-4 py-1 rounded-lg flex items-center text-[14px] leading-4 font-semibold tracking-wider hover:bg-[#f2f4f6] transition-colors">Ver todo</button>
                </div>

                <div className="flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-300 card-shadow  flex items-start gap-6 hover:bg-[#f2f4f6] transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-[#c9e6ff] flex items-center justify-center text-[#008cc7] mt-1">
                            <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-[14px] leading-5 font-normal text-[#191c1e]"><span className="font-bold">Check-in completo:</span> Eleanor Vance (Hab. 201)</p>
                            <p className="text-[12px] leading-3.5 font-medium text-[#515f74] mt-1">Hace 10 minutos • Recepción</p>
                        </div>
                    </div>

                    <div className="px-6 py-4 border-b border-slate-300 card-shadow  flex items-start gap-6 hover:bg-[#f2f4f6] transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#93000a] mt-1">
                            <span className="material-symbols-outlined text-[18px]">plumbing</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-[14px] leading-5 font-normal text-[#191c1e]"><span className="font-bold">Solicitud de mantenimiento:</span> Fuga reportada en Hab. 105</p>
                            <p className="text-[12px] leading-3.5 font-medium text-[#515f74] mt-1">Hace 45 minutos • Servicio de limpieza</p>
                        </div>
                    </div>

                    <div className="px-6 py-4 flex items-start gap-6 hover:bg-[#f2f4f6] transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-[#e0e3e5] flex items-center justify-center text-[#565e74] mt-1">
                            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-[14px] leading-5 font-normal text-[#191c1e]"><span className="font-bold">Alerta de stock:</span> Ropa de cama premium por debajo del umbral</p>
                            <p className="text-[12px] leading-3.5 font-medium text-[#515f74] mt-1">Hace 2 horas • Alerta automática del sistema</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}