
export default function InventarioPage() {
    return (
    <>
        <div className="flex-1 flex flex-col gap-6 max-w-[1440px] mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6 card-shadow flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-base font-bold text-slate-950">Inventory Audit</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Last run: Today, 08:00 AM</p>
                        </div>
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white rounded-lg font-bold text-xs hover:bg-sky-500 transition-all shadow-sm">
                            <span className="material-symbols-outlined text-[18px]">sync</span> Run Audit
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-1">
                        <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-1 border border-slate-100">
                            <span className="text-xs font-medium text-slate-500">Total Assets</span>
                            <span className="text-xl font-bold text-slate-950">12,450</span>
                        </div>
                        <div className="bg-red-50 rounded-xl p-4 flex flex-col gap-1 border border-red-100">
                            <span className="text-xs font-bold text-red-600">Critical Low</span>
                            <span className="text-xl font-bold text-red-600">14</span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-1 border border-slate-100">
                            <span className="text-xs font-medium text-slate-500">Pending Orders</span>
                            <span className="text-xl font-bold text-slate-950">8</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 card-shadow flex flex-col gap-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Storage Capacity</h3>
                    <div className="flex-1 flex flex-col justify-center gap-2">
                        <div className="flex justify-between items-end">
                            <span className="text-2xl font-bold text-slate-950">78%</span>
                            <span className="text-xs text-slate-500 mb-0.5">Utilization</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/40">
                            <div className="bg-slate-950 h-full rounded-full" style={{ width: "78%" }}></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 card-shadow flex flex-col gap-2">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Urgent Alerts</h3>
                    <ul className="flex flex-col gap-2.5">
                        <li className="flex items-center gap-2 text-xs font-medium text-slate-800">
                            <div className="w-2 h-2 rounded-full bg-red-600"></div> Hand Sanitizer (Lobby)
                        </li>
                        <li className="flex items-center gap-2 text-xs font-medium text-slate-800">
                            <div className="w-2 h-2 rounded-full bg-red-600"></div> Bath Towels (Floor 4)
                        </li>
                    </ul>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 card-shadow overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h3 className="text-base font-bold text-slate-950">Asset Master List</h3>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input readOnly className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent rounded-lg text-sm transition-colors" placeholder="Search inventory..." type="text" />
                        </div>
                        <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined">filter_list</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="text-xs font-bold text-slate-500 py-3 px-6">Item Name</th>
                                <th className="text-xs font-bold text-slate-500 py-3 px-6">Category</th>
                                <th className="text-xs font-bold text-slate-500 py-3 px-6 text-right">Current Stock</th>
                                <th className="text-xs font-bold text-slate-500 py-3 px-6">Unit</th>
                                <th className="text-xs font-bold text-slate-500 py-3 px-6">Status</th>
                                <th className="text-xs font-bold text-slate-500 py-3 px-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-800 divide-y divide-slate-100">
                            <tr className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-3.5 px-6 font-medium text-slate-900">Bleach Solution Pro</td>
                                <td className="py-3.5 px-6 text-slate-500">Cleaning Supplies</td>
                                <td className="py-3.5 px-6 text-right font-bold text-red-600">12</td>
                                <td className="py-3.5 px-6 text-slate-500">Gallons</td>
                                <td className="py-3.5 px-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-600"></div>
                                        <span className="text-xs font-semibold text-red-600">Low Stock</span>
                                    </div>
                                </td>
                                <td className="py-3.5 px-6 text-right">
                                    <button className="bg-sky-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-sky-500 transition-all shadow-sm">Reorder</button>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-3.5 px-6 font-medium text-slate-900">Premium Coffee Beans</td>
                                <td className="py-3.5 px-6 text-slate-500">Food & Beverage</td>
                                <td className="py-3.5 px-6 text-right font-semibold">45</td>
                                <td className="py-3.5 px-6 text-slate-500">Lbs</td>
                                <td className="py-3.5 px-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <span className="text-xs font-medium text-slate-500">In Stock</span>
                                    </div>
                                </td>
                                <td className="py-3.5 px-6 text-right">
                                    <button className="border border-slate-200 text-slate-600 font-semibold text-xs px-3 py-1.5 hover:bg-slate-50 rounded-lg transition-colors">Details</button>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50/80 transition-colors bg-red-50/30">
                                <td className="py-3.5 px-6 font-medium text-red-600">King Size Duvet Cover</td>
                                <td className="py-3.5 px-6 text-slate-500">Furniture/Linens</td>
                                <td className="py-3.5 px-6 text-right font-bold text-red-600">0</td>
                                <td className="py-3.5 px-6 text-slate-500">Pieces</td>
                                <td className="py-3.5 px-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-600 flex items-center justify-center"></div>
                                        <span className="text-xs font-bold text-red-600">Out of Stock</span>
                                    </div>
                                </td>
                                <td className="py-3.5 px-6 text-right">
                                    <button className="bg-sky-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-sky-500 transition-all shadow-sm">Reorder</button>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-3.5 px-6 font-medium text-slate-900">Glass Cleaner spray</td>
                                <td className="py-3.5 px-6 text-slate-500">Cleaning Supplies</td>
                                <td className="py-3.5 px-6 text-right font-semibold">88</td>
                                <td className="py-3.5 px-6 text-slate-500">Bottles</td>
                                <td className="py-3.5 px-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <span className="text-xs font-medium text-slate-500">In Stock</span>
                                    </div>
                                </td>
                                <td className="py-3.5 px-6 text-right">
                                    <button className="border border-slate-200 text-slate-600 font-semibold text-xs px-3 py-1.5 hover:bg-slate-50 rounded-lg transition-colors">Details</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-200 bg-white flex justify-between items-center text-xs text-slate-500">
                    <span>Showing 1 to 4 of 124 entries</span>
                    <div className="flex gap-1">
                        <button className="p-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>
                            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                        </button>
                        <button className="px-3 py-1 bg-slate-950 text-white rounded font-medium">1</button>
                        <button className="px-3 py-1 hover:bg-slate-100 rounded transition-colors">2</button>
                        <button className="px-3 py-1 hover:bg-slate-100 rounded transition-colors">3</button>
                        <button className="p-1 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}