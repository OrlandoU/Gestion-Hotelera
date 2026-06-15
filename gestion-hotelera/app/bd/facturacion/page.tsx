import Footer from "@/components/footer";
import Header from "@/components/header";
import PageHeader from "@/components/pageheader";

export default function Page() {
    return (
            <>
                <PageHeader name="Facturación" subtitle="Gestión de facturación" buttons={<button className="flex items-center gap-2 bg-[#008cc7] text-white px-4 py-2 rounded transition-transform active:scale-95"><span className="material-symbols-outlined">add</span> Nueva Factura</button>} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
                    <div className="bg-[#ffffff] border border-[#c6c6cd] rounded-xl p-[24px] shadow-level-1 hover:-translate-y-1 transition-transform duration-300 p-[24px] rounded-[0.75rem] flex flex-col justify-between group hover:-translate-y-1 transition-transform">
                        <div className="flex justify-between items-start mb-[16px]">
                            <div className="p-[8px] bg-[#d5e3fd] rounded-[0.5rem] text-[#57657b]">
                                <span className="material-symbols-outlined">payments</span>
                            </div>
                            <span className="text-[#008cc7] text-[12px] leading-[14px] font-medium font-['Hanken_Grotesk'] bg-[#c9e6ff] px-[8px] py-[2px] rounded-full">+12.5%</span>
                        </div>
                        <div>
                            <p className="text-[14px] leading-[16px] font-semibold font-['Hanken_Grotesk'] tracking-[0.05em] text-[#515f74]">Ingresos Totales (Mes)</p>
                            <h3 className="font-['Manrope'] text-[24px] leading-[32px] font-semibold text-[#000000] mt-[8px]">€142,580.00</h3>
                        </div>
                    </div>
                    <div className="bg-[#ffffff] border border-[#c6c6cd] rounded-xl p-[24px] shadow-level-1 hover:-translate-y-1 transition-transform duration-300 p-[24px] rounded-[0.75rem] flex flex-col justify-between group hover:-translate-y-1 transition-transform">
                        <div className="flex justify-between items-start mb-[16px]">
                            <div className="p-[8px] bg-[#ffdad6] rounded-[0.5rem] text-[#93000a]">
                                <span className="material-symbols-outlined">pending_actions</span>
                            </div>
                            <span className="text-[#ba1a1a] text-[12px] leading-[14px] font-medium font-['Hanken_Grotesk'] bg-[#ffdad6] px-[8px] py-[2px] rounded-full">8 facturas</span>
                        </div>
                        <div>
                            <p className="text-[14px] leading-[16px] font-semibold font-['Hanken_Grotesk'] tracking-[0.05em] text-[#515f74]">Pendientes de Cobro</p>
                            <h3 className="font-['Manrope'] text-[24px] leading-[32px] font-semibold text-[#000000] mt-[8px]">€12,440.50</h3>
                        </div>
                    </div>
                    <div className="bg-[#ffffff] border border-[#c6c6cd] rounded-xl p-[24px] shadow-level-1 hover:-translate-y-1 transition-transform duration-300 p-[24px] rounded-[0.75rem] flex flex-col justify-between group hover:-translate-y-1 transition-transform">
                        <div className="flex justify-between items-start mb-[16px]">
                            <div className="p-[8px] bg-[#e6e8ea] rounded-[0.5rem] text-[#45464d]">
                                <span className="material-symbols-outlined">receipt_long</span>
                            </div>
                            <span className="text-[#515f74] text-[12px] leading-[14px] font-medium font-['Hanken_Grotesk'] bg-[#eceef0] px-[8px] py-[2px] rounded-full">Este Mes</span>
                        </div>
                        <div>
                            <p className="text-[14px] leading-[16px] font-semibold font-['Hanken_Grotesk'] tracking-[0.05em] text-[#515f74]">Facturas Emitidas</p>
                            <h3 className="font-['Manrope'] text-[24px] leading-[32px] font-semibold text-[#000000] mt-[8px]">342</h3>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px] ">
                    <div className="lg:col-span-2 bg-[#ffffff] border border-[#c6c6cd] rounded-xl p-[24px] shadow-level-1 hover:-translate-y-1 transition-transform duration-300 p-[24px] rounded-[0.75rem] flex flex-col">
                        <div className="flex justify-between items-center mb-[32px]">
                            <h4 className="font-['Manrope'] text-[20px] leading-[28px] font-semibold text-[#000000]">Ingresos Mensuales</h4>
                            <select className="bg-[#f2f4f6] border-none rounded-[0.5rem] text-[12px] leading-[14px] font-medium font-['Hanken_Grotesk'] focus:ring-1 focus:ring-[#008cc7]">
                                <option>Año 2023</option>
                                <option>Año 2024</option>
                            </select>
                        </div>
                        <div className="flex-1 flex items-end justify-between gap-[4px] h-64 pt-[24px]">
                            <div className="flex flex-col items-center flex-1">
                                <div className="chart-bar w-full max-w-[40px] bg-[#e0e3e5] rounded-t-sm" ></div>
                                <span className="text-[12px] leading-[14px] font-medium font-['Hanken_Grotesk'] text-[#515f74] mt-[8px]">Ene</span>
                            </div>
                            <div className="flex flex-col items-center flex-1">
                                <div className="chart-bar w-full max-w-[40px] bg-[#e0e3e5] rounded-t-sm" ></div>
                                <span className="text-[12px] leading-[14px] font-medium font-['Hanken_Grotesk'] text-[#515f74] mt-[8px]">Feb</span>
                            </div>
                            <div className="flex flex-col items-center flex-1">
                                <div className="chart-bar w-full max-w-[40px] bg-[#e0e3e5] rounded-t-sm" ></div>
                                <span className="text-[12px] leading-[14px] font-medium font-['Hanken_Grotesk'] text-[#515f74] mt-[8px]">Mar</span>
                            </div>
                            <div className="flex flex-col items-center flex-1">
                                <div className="chart-bar w-full max-w-[40px] bg-[#008cc7] rounded-t-sm" ></div>
                                <span className="text-[12px] leading-[14px] font-medium font-['Hanken_Grotesk'] text-[#515f74] mt-[8px] font-bold">Abr</span>
                            </div>
                            <div className="flex flex-col items-center flex-1">
                                <div className="chart-bar w-full max-w-[40px] bg-[#e0e3e5] rounded-t-sm" ></div>
                                <span className="text-[12px] leading-[14px] font-medium font-['Hanken_Grotesk'] text-[#515f74] mt-[8px]">May</span>
                            </div>
                            <div className="flex flex-col items-center flex-1">
                                <div className="chart-bar w-full max-w-[40px] bg-[#e0e3e5] rounded-t-sm" ></div>
                                <span className="text-[12px] leading-[14px] font-medium font-['Hanken_Grotesk'] text-[#515f74] mt-[8px]">Jun</span>
                            </div>
                            <div className="flex flex-col items-center flex-1">
                                <div className="chart-bar w-full max-w-[40px] bg-[#e0e3e5] rounded-t-sm" ></div>
                                <span className="text-[12px] leading-[14px] font-medium font-['Hanken_Grotesk'] text-[#515f74] mt-[8px]">Jul</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#ffffff] border border-[#c6c6cd] rounded-xl p-[24px] shadow-level-1 hover:-translate-y-1 transition-transform duration-300 p-[24px] rounded-[0.75rem] flex flex-col">
                        <h4 className="font-['Manrope'] text-[20px] leading-[28px] font-semibold text-[#000000] mb-[32px]">Métodos de Pago</h4>
                        <div className="space-y-[24px]">
                            <div className="flex flex-col gap-[8px]">
                                <div className="flex justify-between text-[14px] leading-[16px] font-semibold font-['Hanken_Grotesk'] tracking-[0.05em]">
                                    <span className="text-[#515f74]">Tarjeta de Crédito</span>
                                    <span className="text-[#000000] font-bold">65%</span>
                                </div>
                                <div className="w-full bg-[#eceef0] h-2 rounded-full overflow-hidden">
                                    <div className="bg-[#008cc7] h-full"></div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-[8px]">
                                <div className="flex justify-between text-[14px] leading-[16px] font-semibold font-['Hanken_Grotesk'] tracking-[0.05em]">
                                    <span className="text-[#515f74]">Transferencia Bancaria</span>
                                    <span className="text-[#000000] font-bold">25%</span>
                                </div>
                                <div className="w-full bg-[#eceef0] h-2 rounded-full overflow-hidden">
                                    <div className="bg-[#000000] h-full" ></div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-[8px]">
                                <div className="flex justify-between text-[14px] leading-[16px] font-semibold font-['Hanken_Grotesk'] tracking-[0.05em]">
                                    <span className="text-[#515f74]">Efectivo / Otros</span>
                                    <span className="text-[#000000] font-bold">10%</span>
                                </div>
                                <div className="w-full bg-[#eceef0] h-2 rounded-full overflow-hidden">
                                    <div className="bg-[#76777d] h-full" ></div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-auto pt-[32px]">
                            <div className="p-[16px] bg-[#f2f4f6] rounded-[0.5rem] border border-[#c6c6cd]">
                                <p className="text-[14px] leading-[20px] font-normal font-['Hanken_Grotesk'] text-[#515f74] italic">"Los pagos con tarjeta han aumentado un 5% respecto al trimestre anterior."</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-[#ffffff] border border-[#c6c6cd] rounded-xl p-[24px] shadow-level-1 hover:-translate-y-1 transition-transform duration-300 rounded-[0.75rem] overflow-hidden">
                    <div className="px-[24px] py-[16px] border-b border-[#c6c6cd] flex justify-between items-center bg-[#ffffff]">
                        <h4 className="font-['Manrope'] text-[20px] leading-[28px] font-semibold text-[#000000]">Transacciones Recientes</h4>
                        <button className="text-[#008cc7] text-[14px] leading-[16px] font-semibold font-['Hanken_Grotesk'] tracking-[0.05em] hover:underline">Ver todas</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#f2f4f6] text-[14px] leading-[16px] font-semibold font-['Hanken_Grotesk'] tracking-[0.05em] text-[#515f74]">
                                    <th className="px-[24px] py-[16px] text-[14px] leading-[16px] font-semibold font-['Hanken_Grotesk'] tracking-[0.05em]">ID Factura</th>
                                    <th className="px-[24px] py-[16px] text-[14px] leading-[16px] font-semibold font-['Hanken_Grotesk'] tracking-[0.05em]">Cliente</th>
                                    <th className="px-[24px] py-[16px] text-[14px] leading-[16px] font-semibold font-['Hanken_Grotesk'] tracking-[0.05em]">Fecha</th>
                                    <th className="px-[24px] py-[16px] text-[14px] leading-[16px] font-semibold font-['Hanken_Grotesk'] tracking-[0.05em]">Estado</th>
                                    <th className="px-[24px] py-[16px] text-[14px] leading-[16px] font-semibold font-['Hanken_Grotesk'] tracking-[0.05em] text-right">Monto</th>
                                    <th className="px-[24px] py-[16px] text-[14px] leading-[16px] font-semibold font-['Hanken_Grotesk'] tracking-[0.05em]"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#c6c6cd]">
                                <tr className="hover:bg-[#f7f9fb] transition-colors group">
                                    <td className="px-[24px] py-[24px] text-[16px] leading-[24px] font-normal font-['Hanken_Grotesk'] text-[#000000]">#INV-8821</td>
                                    <td className="px-[24px] py-[24px]">
                                        <div className="flex items-center gap-[16px]">
                                            <div className="w-8 h-8 rounded-full bg-[#131b2e] text-[#bec6e0] flex items-center justify-center font-bold text-[12px]">JD</div>
                                            <span className="text-[16px] leading-[24px] font-normal font-['Hanken_Grotesk'] text-[#000000]">Julianna Duarte</span>
                                        </div>
                                    </td>
                                    <td className="px-[24px] py-[24px] text-[14px] leading-[20px] font-normal font-['Hanken_Grotesk'] text-[#515f74]">12 Abr, 2024</td>
                                    <td className="px-[24px] py-[24px]">
                                        <span className="flex items-center gap-[8px] text-[12px] leading-[14px] font-medium font-['Hanken_Grotesk'] text-[#008cc7] bg-[#c9e6ff] px-[8px] py-[2px] rounded-full w-fit">
                                            <span className="w-1.5 h-1.5 bg-[#008cc7] rounded-full"></span>
                                            Completado
                                        </span>
                                    </td>
                                    <td className="px-[24px] py-[24px] font-['Manrope'] text-[20px] leading-[28px] font-semibold text-right">€1,240.00</td>
                                    <td className="px-[24px] py-[24px] text-right">
                                        <button className="material-symbols-outlined text-[#76777d] hover:text-[#000000] transition-colors">more_vert</button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-[#f7f9fb] transition-colors group">
                                    <td className="px-[24px] py-[24px] text-[16px] leading-[24px] font-normal font-['Hanken_Grotesk'] text-[#000000]">#INV-8820</td>
                                    <td className="px-[24px] py-[24px]">
                                        <div className="flex items-center gap-[16px]">
                                            <div className="w-8 h-8 rounded-full bg-[#d5e3fd] text-[#0d1c2f] flex items-center justify-center font-bold text-[12px]">MP</div>
                                            <span className="text-[16px] leading-[24px] font-normal font-['Hanken_Grotesk'] text-[#000000]">Marco Polo</span>
                                        </div>
                                    </td>
                                    <td className="px-[24px] py-[24px] text-[14px] leading-[20px] font-normal font-['Hanken_Grotesk'] text-[#515f74]">11 Abr, 2024</td>
                                    <td className="px-[24px] py-[24px]">
                                        <span className="flex items-center gap-[8px] text-[12px] leading-[14px] font-medium font-['Hanken_Grotesk'] text-[#ba1a1a] bg-[#ffdad6] px-[8px] py-[2px] rounded-full w-fit">
                                            <span className="w-1.5 h-1.5 bg-[#ba1a1a] rounded-full"></span>
                                            Pendiente
                                        </span>
                                    </td>
                                    <td className="px-[24px] py-[24px] font-['Manrope'] text-[20px] leading-[28px] font-semibold text-right">€850.50</td>
                                    <td className="px-[24px] py-[24px] text-right">
                                        <button className="material-symbols-outlined text-[#76777d] hover:text-[#000000] transition-colors">more_vert</button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-[#f7f9fb] transition-colors group">
                                    <td className="px-[24px] py-[24px] text-[16px] leading-[24px] font-normal font-['Hanken_Grotesk'] text-[#000000]">#INV-8819</td>
                                    <td className="px-[24px] py-[24px]">
                                        <div className="flex items-center gap-[16px]">
                                            <div className="w-8 h-8 rounded-full bg-[#001e2f] text-[#001e2f] flex items-center justify-center font-bold text-[12px]">SL</div>
                                            <span className="text-[16px] leading-[24px] font-normal font-['Hanken_Grotesk'] text-[#000000]">Sophia Loren</span>
                                        </div>
                                    </td>
                                    <td className="px-[24px] py-[24px] text-[14px] leading-[20px] font-normal font-['Hanken_Grotesk'] text-[#515f74]">10 Abr, 2024</td>
                                    <td className="px-[24px] py-[24px]">
                                        <span className="flex items-center gap-[8px] text-[12px] leading-[14px] font-medium font-['Hanken_Grotesk'] text-[#008cc7] bg-[#c9e6ff] px-[8px] py-[2px] rounded-full w-fit">
                                            <span className="w-1.5 h-1.5 bg-[#008cc7] rounded-full"></span>
                                            Completado
                                        </span>
                                    </td>
                                    <td className="px-[24px] py-[24px] font-['Manrope'] text-[20px] leading-[28px] font-semibold text-right">€2,100.00</td>
                                    <td className="px-[24px] py-[24px] text-right">
                                        <button className="material-symbols-outlined text-[#76777d] hover:text-[#000000] transition-colors">more_vert</button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-[#f7f9fb] transition-colors group">
                                    <td className="px-[24px] py-[24px] text-[16px] leading-[24px] font-normal font-['Hanken_Grotesk'] text-[#000000]">#INV-8818</td>
                                    <td className="px-[24px] py-[24px]">
                                        <div className="flex items-center gap-[16px]">
                                            <div className="w-8 h-8 rounded-full bg-[#e6e8ea] text-[#45464d] flex items-center justify-center font-bold text-[12px]">AG</div>
                                            <span className="text-[16px] leading-[24px] font-normal font-['Hanken_Grotesk'] text-[#000000]">Alejandro G.</span>
                                        </div>
                                    </td>
                                    <td className="px-[24px] py-[24px] text-[14px] leading-[20px] font-normal font-['Hanken_Grotesk'] text-[#515f74]">09 Abr, 2024</td>
                                    <td className="px-[24px] py-[24px]">
                                        <span className="flex items-center gap-[8px] text-[12px] leading-[14px] font-medium font-['Hanken_Grotesk'] text-[#515f74] bg-[#e6e8ea] px-[8px] py-[2px] rounded-full w-fit">
                                            <span className="w-1.5 h-1.5 bg-[#515f74] rounded-full"></span>
                                            Cancelado
                                        </span>
                                    </td>
                                    <td className="px-[24px] py-[24px] font-['Manrope'] text-[20px] leading-[28px] font-semibold text-right">€450.00</td>
                                    <td className="px-[24px] py-[24px] text-right">
                                        <button className="material-symbols-outlined text-[#76777d] hover:text-[#000000] transition-colors">more_vert</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
    )
}

