"use client"
import PageHeader from "@/components/pageheader";
import NewFactura from "@/components/NewFactura";
import {ViewTransition} from "react"

export default function Page() {
    return (
        <ViewTransition onEnter={()=>console.log("animati")} enter={{
            'nav-forward': 'nav-forward',
            'nav-back': 'nav-back',
            default: 'none',
          }}
            exit={{
              'nav-forward': 'nav-forward',
              'nav-back': 'nav-back',
              default: 'none',
            }}
            default="none">
            <PageHeader name="Facturación" subtitle="Gestión de facturación" buttons={<NewFactura />} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#ffffff] border border-slate-300 card-shadow  rounded-xl p-6 shadow-level-1 duration-300 flex flex-col justify-between group hover:-translate-y-1 transition-transform">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 flex items-center bg-[#d5e3fd] rounded-lg text-[#57657b]">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                        <span className="text-[#008cc7] text-[12px] leading-3.5 font-medium font-['Hanken_Grotesk'] bg-[#c9e6ff] px-2 py-0.5 rounded-full">+12.5%</span>
                    </div>
                    <div>
                        <p className="text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider text-[#515f74]">Ingresos Totales (Mes)</p>
                        <h3 className="font-['Hanken_Grotesk'] text-[24px] leading-8 font-semibold text-[#000000] mt-2">€142,580.00</h3>
                    </div>
                </div>
                <div className="bg-[#ffffff] border border-slate-300 card-shadow  rounded-xl p-6 shadow-level-1 duration-300  flex flex-col justify-between group hover:-translate-y-1 transition-transform">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 flex items-center bg-[#ffdad6] rounded-lg text-[#93000a]">
                            <span className="material-symbols-outlined">pending_actions</span>
                        </div>
                        <span className="text-[#ba1a1a] text-[12px] leading-3.5 font-medium font-['Hanken_Grotesk'] bg-[#ffdad6] px-2 py-0.5 rounded-full">8 facturas</span>
                    </div>
                    <div>
                        <p className="text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider text-[#515f74]">Pendientes de Cobro</p>
                        <h3 className="font-['Hanken_Grotesk'] text-[24px] leading-8 font-semibold text-[#000000] mt-2">€12,440.50</h3>
                    </div>
                </div>
                <div className="bg-[#ffffff] border border-slate-300 card-shadow  rounded-xl shadow-level-1 duration-300 p-6 flex flex-col justify-between group hover:-translate-y-1 transition-transform">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 flex items-center bg-[#e6e8ea] rounded-lg text-[#45464d]">
                            <span className="material-symbols-outlined">receipt_long</span>
                        </div>
                        <span className="text-[#515f74] text-[12px] leading-3.5 font-medium font-['Hanken_Grotesk'] bg-[#eceef0] px-2 py-0.5 rounded-full">Este Mes</span>
                    </div>
                    <div>
                        <p className="text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider text-[#515f74]">Facturas Emitidas</p>
                        <h3 className="font-['Hanken_Grotesk'] text-[24px] leading-8 font-semibold text-[#000000] mt-2">342</h3>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
                <div className="lg:col-span-2 bg-[#ffffff] border border-slate-300 card-shadow  rounded-xl shadow-level-1 hover:-translate-y-1 transition-transform duration-300 p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-[#000000]">Ingresos Mensuales</h4>
                        <select className="bg-[#f2f4f6] border-none rounded-lg text-[12px] leading-3.5 font-medium font-['Hanken_Grotesk'] focus:ring-1 focus:ring-[#008cc7]">
                            <option>Año 2023</option>
                            <option>Año 2024</option>
                        </select>
                    </div>
                    <div className="flex-1 flex items-end justify-between gap-1 h-64 pt-6">
                        <div className="flex flex-col items-center flex-1">
                            <div className="chart-bar w-full max-w-10 bg-[#e0e3e5] rounded-t-sm" ></div>
                            <span className="text-[12px] leading-3.5 font-medium font-['Hanken_Grotesk'] text-[#515f74] mt-2">Ene</span>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                            <div className="chart-bar w-full max-w-10 bg-[#e0e3e5] rounded-t-sm" ></div>
                            <span className="text-[12px] leading-3.5 font-medium font-['Hanken_Grotesk'] text-[#515f74] mt-2">Feb</span>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                            <div className="chart-bar w-full max-w-10 bg-[#e0e3e5] rounded-t-sm" ></div>
                            <span className="text-[12px] leading-3.5 font-medium font-['Hanken_Grotesk'] text-[#515f74] mt-2">Mar</span>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                            <div className="chart-bar w-full max-w-10 bg-[#008cc7] rounded-t-sm" ></div>
                            <span className="text-[12px] leading-3.5 font-medium font-['Hanken_Grotesk'] text-[#515f74] mt-2">Abr</span>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                            <div className="chart-bar w-full max-w-10 bg-[#e0e3e5] rounded-t-sm" ></div>
                            <span className="text-[12px] leading-3.5 font-medium font-['Hanken_Grotesk'] text-[#515f74] mt-2">May</span>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                            <div className="chart-bar w-full max-w-10 bg-[#e0e3e5] rounded-t-sm" ></div>
                            <span className="text-[12px] leading-3.5 font-medium font-['Hanken_Grotesk'] text-[#515f74] mt-2">Jun</span>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                            <div className="chart-bar w-full max-w-10 bg-[#e0e3e5] rounded-t-sm" ></div>
                            <span className="text-[12px] leading-3.5 font-medium font-['Hanken_Grotesk'] text-[#515f74] mt-2">Jul</span>
                        </div>
                    </div>
                </div>
                <div className="bg-[#ffffff] border border-slate-300 card-shadow  rounded-xl shadow-level-1 hover:-translate-y-1 transition-transform duration-300 p-6 flex flex-col">
                    <h4 className="font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-[#000000] mb-8">Métodos de Pago</h4>
                    <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider">
                                <span className="text-[#515f74]">Tarjeta de Crédito</span>
                                <span className="text-[#000000] font-bold">65%</span>
                            </div>
                            <div className="w-full bg-[#eceef0] h-2 rounded-full overflow-hidden">
                                <div className="bg-[#008cc7] h-full"></div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider">
                                <span className="text-[#515f74]">Transferencia Bancaria</span>
                                <span className="text-[#000000] font-bold">25%</span>
                            </div>
                            <div className="w-full bg-[#eceef0] h-2 rounded-full overflow-hidden">
                                <div className="bg-[#000000] h-full" ></div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider">
                                <span className="text-[#515f74]">Efectivo / Otros</span>
                                <span className="text-[#000000] font-bold">10%</span>
                            </div>
                            <div className="w-full bg-[#eceef0] h-2 rounded-full overflow-hidden">
                                <div className="bg-[#76777d] h-full" ></div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-auto pt-8">
                        <div className="p-4 bg-[#f2f4f6] rounded-lg border border-slate-300 card-shadow ">
                            <p className="text-[14px] leading-5 font-normal font-['Hanken_Grotesk'] text-[#515f74] italic">&quot;Los pagos con tarjeta han aumentado un 5% respecto al trimestre anterior.&quot;</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-[#ffffff] border border-slate-300 card-shadow  rounded-xl p-6 shadow-level-1 hover:-translate-y-1 transition-transform duration-300 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-300 card-shadow  flex justify-between items-center bg-[#ffffff]">
                    <h4 className="font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-[#000000]">Transacciones Recientes</h4>
                    <button className="text-[#008cc7] text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider hover:underline">Ver todas</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#f2f4f6] text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider text-[#515f74]">
                                <th className="px-6 py-4 text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider">ID Factura</th>
                                <th className="px-6 py-4 text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider">Cliente</th>
                                <th className="px-6 py-4 text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider">Fecha</th>
                                <th className="px-6 py-4 text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider">Estado</th>
                                <th className="px-6 py-4 text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider text-right">Monto</th>
                                <th className="px-6 py-4 text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#c6c6cd]">
                            <tr className="hover:bg-[#f7f9fb] transition-colors group">
                                <td className="px-6 py-6 text-[16px] leading-6 font-normal font-['Hanken_Grotesk'] text-[#000000]">#INV-8821</td>
                                <td className="px-6 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#131b2e] text-[#bec6e0] flex items-center justify-center font-bold text-[12px]">JD</div>
                                        <span className="text-[16px] leading-6 font-normal font-['Hanken_Grotesk'] text-[#000000]">Julianna Duarte</span>
                                    </div>
                                </td>
                                <td className="px-6 py-6 text-[14px] leading-5 font-normal font-['Hanken_Grotesk'] text-[#515f74]">12 Abr, 2024</td>
                                <td className="px-6 py-6">
                                    <span className="gap-2 flex items-center text-[12px] leading-3.5 font-medium font-['Hanken_Grotesk'] text-[#008cc7] bg-[#c9e6ff] px-2 py-0.5 rounded-full w-fit">
                                        <span className="w-1.5 h-1.5 bg-[#008cc7] rounded-full"></span>
                                        Completado
                                    </span>
                                </td>
                                <td className="px-6 py-6 font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-right">€1,240.00</td>
                                <td className="px-6 py-6 text-right">
                                    <button className="material-symbols-outlined text-[#76777d] hover:text-[#000000] transition-colors">more_vert</button>
                                </td>
                            </tr>
                            <tr className="hover:bg-[#f7f9fb] transition-colors group">
                                <td className="px-6 py-6 text-[16px] leading-6 font-normal font-['Hanken_Grotesk'] text-[#000000]">#INV-8820</td>
                                <td className="px-6 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#d5e3fd] text-[#0d1c2f] flex items-center justify-center font-bold text-[12px]">MP</div>
                                        <span className="text-[16px] leading-6 font-normal font-['Hanken_Grotesk'] text-[#000000]">Marco Polo</span>
                                    </div>
                                </td>
                                <td className="px-6 py-6 text-[14px] leading-5 font-normal font-['Hanken_Grotesk'] text-[#515f74]">11 Abr, 2024</td>
                                <td className="px-6 py-6">
                                    <span className="flex items-center gap-2 text-[12px] leading-3.5 font-medium font-['Hanken_Grotesk'] text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded-full w-fit">
                                        <span className="w-1.5 h-1.5 bg-[#ba1a1a] rounded-full"></span>
                                        Pendiente
                                    </span>
                                </td>
                                <td className="px-6 py-6 font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-right">€850.50</td>
                                <td className="px-6 py-6 text-right">
                                    <button className="material-symbols-outlined text-[#76777d] hover:text-[#000000] transition-colors">more_vert</button>
                                </td>
                            </tr>
                            <tr className="hover:bg-[#f7f9fb] transition-colors group">
                                <td className="px-6 py-6 text-[16px] leading-6 font-normal font-['Hanken_Grotesk'] text-[#000000]">#INV-8819</td>
                                <td className="px-6 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#001e2f] text-[#001e2f] flex items-center justify-center font-bold text-[12px]">SL</div>
                                        <span className="text-[16px] leading-6 font-normal font-['Hanken_Grotesk'] text-[#000000]">Sophia Loren</span>
                                    </div>
                                </td>
                                <td className="px-6 py-6 text-[14px] leading-5 font-normal font-['Hanken_Grotesk'] text-[#515f74]">10 Abr, 2024</td>
                                <td className="px-6 py-6">
                                    <span className="flex items-center gap-2 text-[12px] leading-3.5 font-medium font-['Hanken_Grotesk'] text-[#008cc7] bg-[#c9e6ff] px-2 py-0.5 rounded-full w-fit">
                                        <span className="w-1.5 h-1.5 bg-[#008cc7] rounded-full"></span>
                                        Completado
                                    </span>
                                </td>
                                <td className="px-6 py-6 font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-right">€2,100.00</td>
                                <td className="px-6 py-6 text-right">
                                    <button className="material-symbols-outlined text-[#76777d] hover:text-[#000000] transition-colors">more_vert</button>
                                </td>
                            </tr>
                            <tr className="hover:bg-[#f7f9fb] transition-colors group">
                                <td className="px-6 py-6 text-[16px] leading-6 font-normal font-['Hanken_Grotesk'] text-[#000000]">#INV-8818</td>
                                <td className="px-6 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#e6e8ea] text-[#45464d] flex items-center justify-center font-bold text-[12px]">AG</div>
                                        <span className="text-[16px] leading-6 font-normal font-['Hanken_Grotesk'] text-[#000000]">Alejandro G.</span>
                                    </div>
                                </td>
                                <td className="px-6 py-6 text-[14px] leading-5 font-normal font-['Hanken_Grotesk'] text-[#515f74]">09 Abr, 2024</td>
                                <td className="px-6 py-6">
                                    <span className="flex items-center gap-2 text-[12px] leading-3.5 font-medium font-['Hanken_Grotesk'] text-[#515f74] bg-[#e6e8ea] px-2 py-0.5 rounded-full w-fit">
                                        <span className="w-1.5 h-1.5 bg-[#515f74] rounded-full"></span>
                                        Cancelado
                                    </span>
                                </td>
                                <td className="px-6 py-6 font-['Hanken_Grotesk'] text-[20px] leading-7 font-semibold text-right">€450.00</td>
                                <td className="px-6 py-6 text-right">
                                    <button className="material-symbols-outlined text-[#76777d] hover:text-[#000000] transition-colors">more_vert</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </ViewTransition>
    )
}

