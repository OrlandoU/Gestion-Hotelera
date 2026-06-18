"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getClientById, getClientReservations } from "@/data/clients";

const STATUS_CONFIG: Record<string, { label: string; badge: string; dot: string }> = {
  Pending: { label: "Pendiente", badge: "bg-amber-100 text-amber-800 border-amber-300", dot: "bg-amber-500" },
  Confirmed: { label: "Confirmada", badge: "bg-blue-100 text-blue-800 border-blue-300", dot: "bg-blue-500" },
  InHouse: { label: "En estancia", badge: "bg-emerald-100 text-emerald-800 border-emerald-300", dot: "bg-emerald-500" },
  Completed: { label: "Finalizada", badge: "bg-slate-100 text-slate-800 border-slate-300", dot: "bg-slate-400" },
};

export default function ClientDetailPage() {
  const params = useParams();
  const rawSlug = params?.slug;
  const clientId = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  const client = useMemo(() => (clientId ? getClientById(clientId) : undefined), [clientId]);
  const reservations = useMemo(() => (client ? getClientReservations(client.name) : []), [client]);

  if (!client) {
    return (
      <div className="bg-white border border-slate-300 rounded-3xl p-6 shadow-sm">
        <div className="text-slate-900 font-semibold">Cliente no encontrado.</div>
        <Link href="/bd/clientes" className="inline-flex mt-4 px-4 py-2 rounded-lg bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800 transition-colors">
          Volver a Clientes
        </Link>
      </div>
    );
  }

  const initials = client.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-1 text-slate-500 text-xs mb-2">
            <Link className="hover:text-slate-900 transition-colors" href="/bd/clientes">Clientes</Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-slate-800 font-medium">{client.name}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-950">{client.name}</h1>
          <p className="text-sm text-slate-600 mt-1">{client.email} · {client.phone}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={`mailto:${client.email}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-[18px]">mail</span> Contactar
          </a>
          <Link href="/bd/clientes" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span> Volver
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-12 space-y-6">
          <div className="bg-white border border-slate-300 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-6 mb-6 pb-4 border-b border-slate-100">
              <div className="w-14 h-14 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-lg">
                {initials}
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold bg-amber-50 text-amber-800 border-amber-200">
                <span className="material-symbols-outlined text-[16px]">star</span>
                Nivel {client.loyaltyTier}
              </span>
              <span className="text-sm text-slate-600 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-slate-400">calendar_month</span>
                Estancias: <strong className="text-slate-900 font-semibold">{client.totalStays}</strong>
              </span>
              <span className="text-sm text-slate-600 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-slate-400">payments</span>
                Total gastado: <strong className="text-slate-900 font-semibold">${client.totalSpent.toLocaleString()}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">contact_page</span> Información de contacto
                </p>
                <ul className="flex flex-col gap-2 text-sm text-slate-700">
                  <li className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">mail</span>
                    <span className="truncate">{client.email}</span>
                  </li>
                  <li className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">call</span>
                    <span className="truncate">{client.phone}</span>
                  </li>
                  <li className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">event</span>
                    <span className="truncate">
                      Última visita: {client.lastVisit}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200 flex flex-col justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">edit_note</span> Notas internas
                </p>
                {client.notes.length > 0 ? (
                  <ul className="flex flex-col gap-2 text-sm text-slate-700">
                    {client.notes.map((note, idx) => (
                      <li key={idx} className="bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                        {note}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400">Sin notas registradas para este cliente.</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Historial de reservaciones</h2>
                <p className="text-sm text-slate-500">Estancias pasadas y futuras asociadas a este cliente.</p>
              </div>
              <span className="text-xs uppercase tracking-[0.15em] bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-full border border-slate-200">
                {reservations.length} registros
              </span>
            </div>

            {reservations.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full text-sm text-left divide-y divide-slate-200">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                    <tr>
                      <th className="px-5 py-3.5">Habitación</th>
                      <th className="px-5 py-3.5">Entrada</th>
                      <th className="px-5 py-3.5">Salida</th>
                      <th className="px-5 py-3.5">Total</th>
                      <th className="px-5 py-3.5">Estado</th>
                      <th className="px-5 py-3.5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {reservations.map((reservation) => {
                      const cfg = STATUS_CONFIG[reservation.status] || {
                        label: reservation.status,
                        badge: "bg-slate-100 text-slate-700 border-slate-200",
                        dot: "bg-slate-400",
                      };
                      return (
                        <tr key={reservation.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-4 font-medium text-slate-900">{reservation.room.name}</td>
                          <td className="px-5 py-4 text-slate-600">{reservation.stay.checkIn}</td>
                          <td className="px-5 py-4 text-slate-600">{reservation.stay.checkOut}</td>
                          <td className="px-5 py-4 text-slate-600">${reservation.payment.total.toLocaleString()}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${cfg.badge}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                              {cfg.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <Link href={`/bd/reservaciones/${reservation.id}`} className="text-[#008cc7] hover:underline font-bold text-xs">
                              Ver reserva
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500 text-sm flex flex-col items-center justify-center gap-2">
                <span className="material-symbols-outlined text-slate-300 text-3xl">calendar_today</span>
                No hay historial de reservas registrado para este cliente.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
