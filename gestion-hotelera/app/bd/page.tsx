import PageHeader from "@/components/pageheader";

export default function Page() {
    return (
        <>
            <PageHeader name="Dashboard" subtitle="Visión general de operaciones" buttons={<button className="flex items-center gap-2 bg-[#008cc7] text-white px-4 py-2 rounded transition-transform active:scale-95"><span className="material-symbols-outlined">add</span> Nueva Reserva</button>} />
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                <div className="bg-[#ffffff] border border-[#c6c6cd] rounded-xl p-[24px] shadow-level-1 hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex justify-between items-start mb-[16px]">
                        <span className="text-[14px] leading-[16px] font-[600] tracking-[0.05em] text-[#515f74]">Today's Occupancy</span>
                        <div className="p-[8px] bg-[#131b2e] rounded-lg text-[#000000]">
                            <span className="material-symbols-outlined text-[20px] text-white">meeting_room</span>
                        </div>
                    </div>
                    <div className="flex items-end gap-[16px]">
                        <h2 className="font-['Manrope'] text-[28px] leading-[40px] tracking-[-0.02em] font-[700] text-[#000000]">87%</h2>
                        <span className="text-[12px] leading-[14px] font-[500] text-[#001e2f] flex items-center mb-1">
                            <span className="material-symbols-outlined text-[16px]">trending_up</span> +2.4%
                        </span>
                    </div>
                </div>

                <div className="bg-[#ffffff] border border-[#c6c6cd] rounded-xl p-[24px] shadow-level-1 hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex justify-between items-start mb-[16px]">
                        <span className="text-[14px] leading-[16px] font-[600] tracking-[0.05em] text-[#515f74]">Total Revenue (MTD)</span>
                        <div className="p-[8px] bg-[#d5e3fd] rounded-lg text-[#515f74]">
                            <span className="material-symbols-outlined text-[20px]">payments</span>
                        </div>
                    </div>
                    <div className="flex items-end gap-[16px]">
                        <h2 className="font-['Manrope'] text-[28px] leading-[40px] tracking-[-0.02em] font-[700] text-[#000000]">$142.5k</h2>
                        <span className="text-[12px] leading-[14px] font-[500] text-[#001e2f] flex items-center mb-1">
                            <span className="material-symbols-outlined text-[16px]">trending_up</span> +8.1%
                        </span>
                    </div>
                </div>

                <div className="bg-[#ffffff] border border-[#c6c6cd] rounded-xl p-[24px] shadow-level-1 hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex justify-between items-start mb-[16px]">
                        <span className="text-[14px] leading-[16px] font-[600] tracking-[0.05em] text-[#515f74]">Pending Maintenance</span>
                        <div className="p-[8px] bg-[#ffdad6] rounded-lg text-[#93000a]">
                            <span className="material-symbols-outlined text-[20px]">build</span>
                        </div>
                    </div>
                    <div className="flex items-end gap-[16px]">
                        <h2 className="font-['Manrope'] text-[28px] leading-[40px] tracking-[-0.02em] font-[700] text-[#000000]">14</h2>
                        <span className="text-[12px] leading-[14px] font-[500] text-[#ba1a1a] flex items-center mb-1">
                            3 High Priority
                        </span>
                    </div>
                </div>

                <div className="bg-[#ffffff] border border-[#c6c6cd] rounded-xl p-[24px] shadow-level-1 hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex justify-between items-start mb-[16px]">
                        <span className="text-[14px] leading-[16px] font-[600] tracking-[0.05em] text-[#515f74]">Low Stock Alerts</span>
                        <div className="p-[8px] bg-[#e0e3e5] rounded-lg text-[#565e74]">
                            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                        </div>
                    </div>
                    <div className="flex items-end gap-[16px]">
                        <h2 className="font-['Manrope'] text-[28px] leading-[40px] tracking-[-0.02em] font-[700] text-[#000000]">8</h2>
                        <span className="text-[12px] leading-[14px] font-[500] text-[#515f74] flex items-center mb-1">
                            Items need review
                        </span>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-12 gap-[32px]">
                <div className="col-span-12 lg:col-span-8 bg-[#ffffff] border border-[#c6c6cd] rounded-xl p-[24px] shadow-level-1 flex flex-col">
                    <div className="flex justify-between items-center mb-[24px] pb-[16px] border-b border-[#c6c6cd]">
                        <h3 className="font-['Manrope'] text-[20px] leading-[28px] font-[600] text-[#000000]">Room Status</h3>
                        <div className="flex gap-[16px]">
                            <div className="flex items-center gap-[8px]">
                                <span className="w-3 h-3 rounded-full bg-[#001e2f]"></span>
                                <span className="text-[12px] leading-[14px] font-[500] text-[#515f74]">Clean</span>
                            </div>
                            <div className="flex items-center gap-[8px]">
                                <span className="w-3 h-3 rounded-full bg-[#131b2e]"></span>
                                <span className="text-[12px] leading-[14px] font-[500] text-[#515f74]">Occupied</span>
                            </div>
                            <div className="flex items-center gap-[8px]">
                                <span className="w-3 h-3 rounded-full bg-[#c6c6cd]"></span>
                                <span className="text-[12px] leading-[14px] font-[500] text-[#515f74]">Dirty</span>
                            </div>
                            <div className="flex items-center gap-[8px]">
                                <span className="w-3 h-3 rounded-full bg-[#ffdad6] border border-[#ba1a1a]"></span>
                                <span className="text-[12px] leading-[14px] font-[500] text-[#515f74]">Maintenance</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-6 md:grid-cols-10 gap-2 flex-1">
                        <div className="aspect-square border-t-4 border-[#001e2f] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-[14px] font-[500] text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">101</div>
                        <div className="aspect-square border-t-4 border-[#131b2e] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-[14px] font-[500] text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">102</div>
                        <div className="aspect-square border-t-4 border-[#c6c6cd] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-[14px] font-[500] text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">103</div>
                        <div className="aspect-square border-t-4 border-[#001e2f] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-[14px] font-[500] text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">104</div>
                        <div className="aspect-square border-t-4 border-[#ffdad6] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-[14px] font-[500] text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">105</div>
                        <div className="aspect-square border-t-4 border-[#001e2f] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-[14px] font-[500] text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">106</div>
                        <div className="aspect-square border-t-4 border-[#131b2e] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-[14px] font-[500] text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">107</div>
                        <div className="aspect-square border-t-4 border-[#131b2e] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-[14px] font-[500] text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">108</div>
                        <div className="aspect-square border-t-4 border-[#c6c6cd] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-[14px] font-[500] text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">109</div>
                        <div className="aspect-square border-t-4 border-[#001e2f] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-[14px] font-[500] text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">110</div>
                        <div className="aspect-square border-t-4 border-[#131b2e] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-[14px] font-[500] text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">201</div>
                        <div className="aspect-square border-t-4 border-[#131b2e] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-[14px] font-[500] text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">202</div>
                        <div className="aspect-square border-t-4 border-[#001e2f] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-[14px] font-[500] text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">203</div>
                        <div className="aspect-square border-t-4 border-[#001e2f] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-[14px] font-[500] text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">204</div>
                        <div className="aspect-square border-t-4 border-[#c6c6cd] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-[14px] font-[500] text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">205</div>
                        <div className="aspect-square border-t-4 border-[#c6c6cd] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-[14px] font-[500] text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">206</div>
                        <div className="aspect-square border-t-4 border-[#131b2e] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-[14px] font-[500] text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">207</div>
                        <div className="aspect-square border-t-4 border-[#131b2e] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-[14px] font-[500] text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">208</div>
                        <div className="aspect-square border-t-4 border-[#ffdad6] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-[14px] font-[500] text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">209</div>
                        <div className="aspect-square border-t-4 border-[#001e2f] bg-[#f7f9fb] flex items-center justify-center rounded-sm text-[12px] leading-[14px] font-[500] text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors">210</div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-4 bg-[#ffffff] border border-[#c6c6cd] rounded-xl p-[24px] shadow-level-1 flex flex-col">
                    <h3 className="font-['Manrope'] text-[20px] leading-[28px] font-[600] text-[#000000] mb-[24px]">Weekly Occupancy</h3>
                    <div className="flex-1 flex items-end gap-2 mt-4 pt-4 border-t border-[#c6c6cd] h-[200px]">
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-[#bec6e0] rounded-t-sm h-[60%] hover:bg-[#131b2e] transition-colors cursor-pointer"></div>
                            <span className="text-[12px] leading-[14px] font-[500] text-[#515f74]">Mon</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-[#bec6e0] rounded-t-sm h-[75%] hover:bg-[#131b2e] transition-colors cursor-pointer"></div>
                            <span className="text-[12px] leading-[14px] font-[500] text-[#515f74]">Tue</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-[#131b2e] rounded-t-sm h-[90%] hover:bg-[#000000] transition-colors cursor-pointer relative group">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2d3133] text-[#eff1f3] text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">90%</div>
                            </div>
                            <span className="text-[12px] leading-[14px] font-bold text-[#000000]">Wed</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-[#bec6e0] rounded-t-sm h-[85%] hover:bg-[#131b2e] transition-colors cursor-pointer"></div>
                            <span className="text-[12px] leading-[14px] font-[500] text-[#515f74]">Thu</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-[#bec6e0] rounded-t-sm h-[95%] hover:bg-[#131b2e] transition-colors cursor-pointer"></div>
                            <span className="text-[12px] leading-[14px] font-[500] text-[#515f74]">Fri</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-[#bec6e0] rounded-t-sm h-[100%] hover:bg-[#131b2e] transition-colors cursor-pointer"></div>
                            <span className="text-[12px] leading-[14px] font-[500] text-[#515f74]">Sat</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-[#bec6e0] rounded-t-sm h-[70%] hover:bg-[#131b2e] transition-colors cursor-pointer"></div>
                            <span className="text-[12px] leading-[14px] font-[500] text-[#515f74]">Sun</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#ffffff] border border-[#c6c6cd] rounded-xl shadow-level-1 overflow-hidden">
                <div className="px-[24px] py-[16px] border-b border-[#c6c6cd] flex justify-between items-center bg-[#f7f9fb]">
                    <h3 className="font-['Manrope'] text-[20px] leading-[28px] font-[600] text-[#000000]">Recent Activity</h3>
                    <button className="border border-[#c6c6cd] text-[#515f74] px-[16px] py-1 rounded-lg text-[14px] leading-[16px] font-[600] tracking-[0.05em] hover:bg-[#f2f4f6] transition-colors">View All</button>
                </div>

                <div className="flex flex-col">
                    <div className="px-[24px] py-[16px] border-b border-[#c6c6cd] flex items-start gap-[24px] hover:bg-[#f2f4f6] transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-[#c9e6ff] flex items-center justify-center text-[#008cc7] mt-1">
                            <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-[14px] leading-[20px] font-[400] text-[#191c1e]"><span className="font-bold">Check-in complete:</span> Eleanor Vance (Room 201)</p>
                            <p className="text-[12px] leading-[14px] font-[500] text-[#515f74] mt-1">10 minutes ago • Front Desk</p>
                        </div>
                    </div>

                    <div className="px-[24px] py-[16px] border-b border-[#c6c6cd] flex items-start gap-[24px] hover:bg-[#f2f4f6] transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#93000a] mt-1">
                            <span className="material-symbols-outlined text-[18px]">plumbing</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-[14px] leading-[20px] font-[400] text-[#191c1e]"><span className="font-bold">Maintenance Request:</span> Leak reported in Room 105</p>
                            <p className="text-[12px] leading-[14px] font-[500] text-[#515f74] mt-1">45 minutes ago • Housekeeping</p>
                        </div>
                    </div>

                    <div className="px-[24px] py-[16px] flex items-start gap-[24px] hover:bg-[#f2f4f6] transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-[#e0e3e5] flex items-center justify-center text-[#565e74] mt-1">
                            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-[14px] leading-[20px] font-[400] text-[#191c1e]"><span className="font-bold">Stock Alert:</span> Premium Linens falling below threshold</p>
                            <p className="text-[12px] leading-[14px] font-[500] text-[#515f74] mt-1">2 hours ago • System Auto-Alert</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}