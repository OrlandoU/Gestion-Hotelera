export default function MantenimientoPage() {
    return (
        <>
            <div class="max-w-[1440px] mx-auto w-full flex flex-col gap-6">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 class="text-xl md:text-2xl font-bold text-slate-950">Maintenance Operations</h2>
                        <p class="text-slate-500 mt-0.5">Manage and track hotel facility issues.</p>
                    </div>
                    <button class="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2.5 rounded-lg font-bold transition-colors shadow-sm flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[20px]">add</span>
                        Report Issue
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-white rounded-xl border border-slate-200 p-6 card-shadow hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-[140px]">
                        <div class="flex justify-between items-start">
                            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tickets</span>
                            <div class="p-2 bg-slate-50 rounded-lg text-slate-600 border border-slate-100">
                                <span class="material-symbols-outlined">confirmation_number</span>
                            </div>
                        </div>
                        <div>
                            <span class="text-2xl font-bold text-slate-950">124</span>
                            <span class="text-xs text-slate-400 ml-2">This month</span>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl border border-slate-200 p-6 card-shadow hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-[140px]">
                        <div class="flex justify-between items-start">
                            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Progress</span>
                            <div class="p-2 bg-amber-50 rounded-lg text-amber-700 border border-amber-100">
                                <span class="material-symbols-outlined">autorenew</span>
                            </div>
                        </div>
                        <div>
                            <span class="text-2xl font-bold text-slate-950">18</span>
                            <span class="text-xs text-amber-600 font-medium ml-2">Active tasks</span>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl border border-red-200 p-6 card-shadow hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-[140px] relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-bl-full"></div>
                        <div class="flex justify-between items-start relative z-10">
                            <span class="text-xs font-bold text-red-600 uppercase tracking-wider">Urgent / High</span>
                            <div class="p-2 bg-red-50 rounded-lg text-red-700 border border-red-100">
                                <span class="material-symbols-outlined">warning</span>
                            </div>
                        </div>
                        <div class="relative z-10">
                            <span class="text-2xl font-bold text-red-600">3</span>
                            <span class="text-xs text-red-500/80 font-medium ml-2">Requires attention</span>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl border border-slate-200 card-shadow overflow-hidden flex flex-col">
                    <div class="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                        <h3 class="text-base font-bold text-slate-950">Active Requests</h3>
                        <button class="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 bg-white">
                            <span class="material-symbols-outlined text-[20px]">filter_list</span>
                        </button>
                    </div>

                    <div class="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <div class="col-span-2">Room / Area</div>
                        <div class="col-span-4">Issue Description</div>
                        <div class="col-span-2">Priority</div>
                        <div class="col-span-2">Assigned Staff</div>
                        <div class="col-span-2 text-right">Status</div>
                    </div>

                    <div class="flex flex-col divide-y divide-slate-100">
                        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors items-center cursor-pointer">
                            <div class="md:col-span-2 flex flex-col md:flex-row md:items-center gap-1">
                                <span class="font-semibold text-slate-900">Suite 402</span>
                                <span class="md:hidden text-xs text-slate-500 font-medium">Master Bath Leak</span>
                            </div>
                            <div class="md:col-span-4 hidden md:block text-slate-600">
                                Master Bath Leak - Water spreading to hallway carpet.
                            </div>
                            <div class="md:col-span-2 flex items-center">
                                <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                                    <span class="w-1.5 h-1.5 rounded-full bg-red-600 mr-1.5"></span>
                                    Urgent
                                </span>
                            </div>
                            <div class="md:col-span-2 hidden md:flex items-center gap-2">
                                <div class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">MJ</div>
                                <span class="text-slate-600">Mike J.</span>
                            </div>
                            <div class="md:col-span-2 flex justify-between md:justify-end items-center mt-1 md:mt-0">
                                <span class="md:hidden text-slate-500">Mike J.</span>
                                <span class="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                                    <span class="material-symbols-outlined text-[14px]">autorenew</span>
                                    Working
                                </span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors items-center cursor-pointer">
                            <div class="md:col-span-2 flex flex-col md:flex-row md:items-center gap-1">
                                <span class="font-semibold text-slate-900">Lobby</span>
                                <span class="md:hidden text-xs text-slate-500 font-medium">HVAC Clicking</span>
                            </div>
                            <div class="md:col-span-4 hidden md:block text-slate-600">
                                Main HVAC unit clicking loudly near front desk.
                            </div>
                            <div class="md:col-span-2 flex items-center">
                                <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-100">
                                    <span class="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5"></span>
                                    High
                                </span>
                            </div>
                            <div class="md:col-span-2 hidden md:flex items-center gap-2">
                                <div class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">SD</div>
                                <span class="text-slate-600">Sarah D.</span>
                            </div>
                            <div class="md:col-span-2 flex justify-between md:justify-end items-center mt-1 md:mt-0">
                                <span class="md:hidden text-slate-500">Sarah D.</span>
                                <span class="inline-flex items-center gap-1 text-xs font-medium text-sky-600 bg-sky-50 px-2 py-1 rounded-md border border-sky-100">
                                    <span class="material-symbols-outlined text-[14px]">schedule</span>
                                    Pending
                                </span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors items-center cursor-pointer bg-slate-50/30">
                            <div class="md:col-span-2 flex flex-col md:flex-row md:items-center gap-1">
                                <span class="font-semibold text-slate-500">Room 215</span>
                                <span class="md:hidden text-xs text-slate-400 font-medium">TV Remote Broken</span>
                            </div>
                            <div class="md:col-span-4 hidden md:block text-slate-400">
                                TV remote missing volume down button.
                            </div>
                            <div class="md:col-span-2 flex items-center">
                                <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
                                    <span class="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
                                    Medium
                                </span>
                            </div>
                            <div class="md:col-span-2 hidden md:flex items-center gap-2">
                                <div class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-200/60">Un</div>
                                <span class="text-slate-400 italic">Unassigned</span>
                            </div>
                            <div class="md:col-span-2 flex justify-between md:justify-end items-center mt-1 md:mt-0">
                                <span class="md:hidden text-slate-400 italic">Unassigned</span>
                                <span class="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                                    <span class="material-symbols-outlined text-[14px]">check_circle</span>
                                    Resolved
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="p-4 flex justify-center bg-slate-50 border-t border-slate-200">
                        <button class="text-slate-600 hover:text-slate-950 font-semibold text-xs transition-colors px-4 py-2">
                            View All Requests
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}