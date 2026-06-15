"use client";

import { useParams } from "next/navigation";
import { RESERVATIONS_DETAIL } from "@/data/reservations";

export default function ReservationPage() {
    const params = useParams();
    const rawId = params?.slug as string | string[] | undefined;
    const id = (Array.isArray(rawId) ? rawId[0] : rawId);

    const data = id ? RESERVATIONS_DETAIL[id] : null;

    if (!data) {
        return <div className="p-6">Reservation not found.</div>;
    }

    const { bookingId, guest, status, createdAt, stay, room, party, internalNotes, payment, activity } = data;

    const createdLabel = createdAt ? new Date(createdAt).toLocaleDateString() : "";

    return (
        <>
            <div className="mb-6">
                <div className="flex items-center gap-1 text-slate-500 text-xs mb-2">
                    <a className="hover:text-slate-900 transition-colors" href="#">Reservations</a>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <span className="text-slate-800 font-medium">{bookingId}</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">{guest?.name}</h1>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md text-xs font-semibold">
                                <span className={`w-2 h-2 rounded-full ${status === "Confirmed" ? "bg-emerald-500" : "bg-amber-500"}`}></span> {status}
                            </span>
                            <span className="text-xs text-slate-500">Booking ID: {bookingId}</span>
                            <span className="text-xs text-slate-500">• Created: {createdLabel}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-8 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200/60 card-shadow p-6">
                        <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400">person</span> Guest Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-slate-400 mb-1 font-medium">Email</p>
                                <p className="text-slate-800 font-medium">{guest?.email}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 mb-1 font-medium">Phone</p>
                                <p className="text-slate-800 font-medium">{guest?.phone}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 mb-1 font-medium">Loyalty Tier</p>
                                <p className="text-slate-800 font-medium flex items-center gap-1">
                                    <span className="material-symbols-outlined text-amber-500 text-[18px]">workspace_premium</span> {guest?.loyalty?.tier ?? "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 mb-1 font-medium">Special Requests</p>
                                <p className="text-slate-800">{stay?.specialRequests ?? "—"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200/60 card-shadow p-6">
                        <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400">bed</span> Stay Details
                        </h2>
                        <div className="flex flex-col md:flex-row justify-between mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex-1 text-center md:text-left mb-3 md:mb-0">
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">Check-in</p>
                                <p className="text-xl font-bold text-slate-900">{new Date(stay?.checkIn).toLocaleDateString()}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{stay?.checkInTime}</p>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center relative my-2 md:my-0">
                                <div className="w-full h-px bg-slate-200 absolute top-1/2 -translate-y-1/2 z-0 hidden md:block"></div>
                                <div className="bg-slate-50 z-10 px-3 flex flex-col items-center">
                                    <span className="inline-block px-2.5 py-0.5 bg-slate-200 text-slate-800 rounded-full text-xs font-bold mb-1">{stay?.nights ?? "0"} Nights</span>
                                    <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
                                </div>
                            </div>
                            <div className="flex-1 text-center md:text-right">
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">Check-out</p>
                                <p className="text-xl font-bold text-slate-900">{new Date(stay?.checkOut).toLocaleDateString()}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{stay?.checkOutTime}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3 border border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-slate-200/60 flex items-center justify-center text-slate-800">
                                    <span className="material-symbols-outlined">meeting_room</span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium">Room Type</p>
                                    <p className="font-bold text-slate-800">{room?.type}</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3 border border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-slate-200/60 flex items-center justify-center text-slate-800">
                                    <span className="material-symbols-outlined">tag</span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium">Room Number</p>
                                    <p className="font-bold text-slate-800">{room?.number}</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3 border border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-slate-200/60 flex items-center justify-center text-slate-800">
                                    <span className="material-symbols-outlined">group</span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium">Guests</p>
                                    <p className="font-bold text-slate-800">{party?.adults ?? 0} Adults</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200/60 card-shadow p-6">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400">note_alt</span> Internal Notes
                            </h2>
                            <button className="text-slate-950 font-semibold text-xs hover:underline">Add Note</button>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            {internalNotes && internalNotes.length > 0 ? (
                                <>
                                    <p className="text-slate-700 mb-2 leading-relaxed">{internalNotes[0].text}</p>
                                    <p className="text-xs text-slate-400 font-medium">- {internalNotes[0].author} ({new Date(internalNotes[0].createdAt).toLocaleDateString()})</p>
                                </>
                            ) : (
                                <p className="text-slate-700">No notes</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-4 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200/60 card-shadow p-6">
                        <h3 className="text-base font-bold text-slate-900 mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <button className="w-full min-h-[44px] bg-slate-950 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-sm">
                                <span className="material-symbols-outlined text-[20px]">login</span> Process Check-in
                            </button>
                            <button className="w-full min-h-[44px] bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">edit</span> Edit Reservation
                            </button>
                            <button className="w-full min-h-[44px] bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">receipt_long</span> Generate Invoice
                            </button>
                            <button className="w-full min-h-[44px] text-red-600 hover:bg-red-50 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors mt-4">
                                <span className="material-symbols-outlined text-[20px]">cancel</span> Cancel Booking
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200/60 card-shadow p-6">
                        <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400">account_balance_wallet</span> Payment Summary
                        </h3>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-slate-600">
                                <span>Room Rate ({stay?.nights ?? "0"} nights)</span>
                                <span className="text-slate-900 font-medium">${(payment?.breakdown?.roomRate ?? 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Taxes & Fees</span>
                                <span className="text-slate-900 font-medium">${(payment?.breakdown?.taxesAndFees ?? 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Extras</span>
                                <span className="text-slate-900 font-medium">${(payment?.breakdown?.extras ?? 0).toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="pt-3 border-t border-slate-100 mb-4">
                            <div className="flex justify-between items-center">
                                <span className="text-base font-bold text-slate-900">Total</span>
                                <span className="text-xl font-bold text-slate-900">${(payment?.total ?? 0).toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3 border border-slate-100">
                            <span className="material-symbols-outlined text-slate-500">credit_card</span>
                            <div>
                                <p className="text-xs text-slate-400 font-medium">Guarantee Method</p>
                                <p className="text-slate-800 font-medium">{payment?.guaranteeMethod}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200/60 card-shadow p-6">
                        <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400">history</span> Activity Log
                        </h3>
                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200 before:hidden md:before:block">
                            {activity && activity.length > 0 ? (
                                activity.map((a: { time: string; text: string }, i: number) => (
                                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-slate-200 bg-white text-slate-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                        </div>
                                        <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <p className="text-xs text-slate-400 mb-1 font-medium">{new Date(a.time).toLocaleString()}</p>
                                            <p className="text-slate-700">{a.text}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-700">No activity</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}