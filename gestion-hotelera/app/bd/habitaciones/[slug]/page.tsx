"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ROOMS_LIST, getRoomCurrentReservation, getRoomHistory, getRoomNextReservation, Room } from "@/data/rooms";

// Diccionario visual para el estado físico de la habitación
const STATUS_BADGE: Record<string, { label: string; classes: string }> = {
  Available: { label: "Disponible", classes: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  Occupied: { label: "Ocupada", classes: "bg-blue-100 text-blue-800 border-blue-300" },
  Dirty: { label: "Sucia", classes: "bg-amber-100 text-amber-800 border-amber-300" },
  Maintenance: { label: "Mantenimiento", classes: "bg-rose-100 text-rose-800 border-rose-300" },
};

// Diccionario visual para los estados de las RESERVACIONES (Configuración unificada)
const RESERVATION_STATUS_CONFIG: Record<string, { label: string; badge: string; dot: string }> = {
  Pending: { label: "Pendiente", badge: "bg-amber-100 text-amber-800 border-amber-300", dot: "bg-amber-500" },
  Confirmed: { label: "Confirmada", badge: "bg-blue-100 text-blue-800 border-blue-300", dot: "bg-blue-500" },
  InHouse: { label: "En estancia", badge: "bg-emerald-100 text-emerald-800 border-emerald-300", dot: "bg-emerald-500" },
  Completed: { label: "Finalizada", badge: "bg-slate-100 text-slate-800 border-slate-300", dot: "bg-slate-400" },
};

const STATUS_OPTIONS = ["Available", "Occupied", "Dirty", "Maintenance"] as const;

export default function RoomDetailPage() {
  const params = useParams();
  const rawSlug = params?.slug;
  const roomId = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  const room = useMemo(() => ROOMS_LIST.find((item) => item.id === roomId), [roomId]);
  const [editMode, setEditMode] = useState(false);
  const [roomData, setRoomData] = useState<Room | null>(room ?? null);
  const [message, setMessage] = useState<string | null>(null);

  const currentReservation = useMemo(() => roomData ? getRoomCurrentReservation(roomData.id) : null, [roomData]);
  const nextReservation = useMemo(() => roomData ? getRoomNextReservation(roomData.id) : null, [roomData]);
  const history = useMemo(() => roomData ? getRoomHistory(roomData.id) : [], [roomData]);

  if (!roomData) {
    return (
      <div className="bg-white border border-slate-300 rounded-3xl p-6 shadow-sm">
        <div className="text-slate-900 font-semibold">Habitación no encontrada.</div>
        <Link href="/bd/habitaciones" className="inline-flex mt-4 px-4 py-2 rounded-lg bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800 transition-colors">
          Volver a Habitaciones
        </Link>
      </div>
    );
  }

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!roomData) return;
    const formData = new FormData(event.currentTarget);
    const updated: Room = {
      ...roomData,
      type: String(formData.get("type") ?? roomData.type),
      status: String(formData.get("status")) as Room["status"],
      capacity: String(formData.get("capacity") ?? roomData.capacity),
      price: Number(formData.get("price") ?? roomData.price),
      amenities: String(formData.get("amenities") ?? roomData.amenities.join(", "))
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };
    setRoomData(updated);
    setEditMode(false);
    setMessage("Cambios guardados localmente.");
    setTimeout(() => setMessage(null), 3200);
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-1 text-slate-500 text-xs mb-2">
            <Link className="hover:text-slate-900 transition-colors" href="/bd/habitaciones">Habitaciones</Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-slate-800 font-medium">{roomData.number}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-950">Habitación {roomData.number}</h1>
          <p className="text-sm text-slate-600 mt-1">{roomData.type} · Piso {roomData.floor} · {roomData.view}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setEditMode((current) => !current)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-[18px]">{editMode ? "close" : "edit"}</span> {editMode ? "Cerrar edición" : "Editar habitación"}
          </button>
          <Link href="/bd/habitaciones" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span> Volver
          </Link>
        </div>
      </div>

      {message ? (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {message}
        </div>
      ) : null}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-12 space-y-6">
          <div className="bg-white border border-slate-300 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-6 mb-6 pb-4 border-b border-slate-100">
              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${STATUS_BADGE[roomData.status]?.classes}`}>
                <span className="w-2 h-2 rounded-full bg-current"></span>
                {STATUS_BADGE[roomData.status]?.label || roomData.status}
              </span>
              <span className="text-sm text-slate-600 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-slate-400">group</span>
                Capacidad: <strong className="text-slate-900 font-semibold">{roomData.capacity}</strong>
              </span>
              <span className="text-sm text-slate-600 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-slate-400">payments</span>
                Precio: <strong className="text-slate-900 font-semibold">${roomData.price}/noche</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bloque: Amenidades */}
              <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">grid_view</span> Amenidades
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
                  {roomData.amenities.map((amenity) => (
                    <li key={amenity} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600 font-bold">check</span>
                      <span className="truncate">{amenity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bloque: Estado de las reservas del día */}
              <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200 flex flex-col justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold mb-4 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">calendar_today</span> Estado de Ocupación
                  </p>
                  
                  <div className="space-y-4">
                    {/* Reserva Activa */}
                    <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-200 last:border-0 last:pb-0">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Reserva Activa Hoy</p>
                        <p className="text-sm font-semibold text-slate-900 mt-0.5">
                          {currentReservation ? currentReservation.guest : "Hospedaje libre"}
                        </p>
                      </div>
                      {currentReservation ? (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${RESERVATION_STATUS_CONFIG[currentReservation.status]?.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${RESERVATION_STATUS_CONFIG[currentReservation.status]?.dot}`}></span>
                          {RESERVATION_STATUS_CONFIG[currentReservation.status]?.label}
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-slate-400 bg-slate-200 px-2 py-0.5 rounded">Ninguna</span>
                      )}
                    </div>

                    {/* Próxima Reserva */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Próxima Llegada</p>
                        <p className="text-sm font-semibold text-slate-900 mt-0.5">
                          {nextReservation ? nextReservation.guest : "Sin asignaciones futuras"}
                        </p>
                        {nextReservation && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            Check-in: {new Date(nextReservation.start).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {nextReservation && (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${RESERVATION_STATUS_CONFIG[nextReservation.status]?.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${RESERVATION_STATUS_CONFIG[nextReservation.status]?.dot}`}></span>
                          {RESERVATION_STATUS_CONFIG[nextReservation.status]?.label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de Edición */}
          {editMode ? (
            <div className="bg-white border border-slate-300 rounded-3xl p-6 shadow-sm anim-fade-in">
              <h2 className="text-xl font-bold text-slate-950 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">edit_note</span>Editar detalles de habitación
              </h2>
              <form className="space-y-5" onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block text-sm font-medium text-slate-700">
                    Tipo de habitación
                    <input name="type" defaultValue={roomData.type} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 transition-all" />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Estado de Limpieza/Mantenimiento
                    <select name="status" defaultValue={roomData.status} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 transition-all">
                      {STATUS_OPTIONS.map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {STATUS_BADGE[statusOption]?.label || statusOption}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block text-sm font-medium text-slate-700">
                    Capacidad
                    <input name="capacity" defaultValue={roomData.capacity} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 transition-all" />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Precio por noche ($)
                    <input name="price" type="number" defaultValue={roomData.price} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 transition-all" />
                  </label>
                </div>
                <label className="block text-sm font-medium text-slate-700">
                  Amenidades (separadas por comas)
                  <input name="amenities" defaultValue={roomData.amenities.join(", ")} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 transition-all" />
                </label>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button type="submit" className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#008cc7] text-white text-sm font-semibold hover:bg-[#006f9d] transition-colors shadow-sm">
                    Guardar cambios
                  </button>
                  <button type="button" onClick={() => setEditMode(false)} className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-colors">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          ) : null}

          {/* Tabla de Historial */}
          <div className="bg-white border border-slate-300 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Historial de reservaciones</h2>
                <p className="text-sm text-slate-500">Ver todas las reservas pasadas y futuras asociadas.</p>
              </div>
              <span className="text-xs uppercase tracking-[0.15em] bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-full border border-slate-200">
                {history.length} registros
              </span>
            </div>
            
            {history.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full text-sm text-left divide-y divide-slate-200">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                    <tr>
                      <th className="px-5 py-3.5">Huésped</th>
                      <th className="px-5 py-3.5">Entrada / Llegada</th>
                      <th className="px-5 py-3.5">Salida / Salida Realizada</th>
                      <th className="px-5 py-3.5">Estado Reserva</th>
                      <th className="px-5 py-3.5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {history.map((reservation) => {
                      const cfg = RESERVATION_STATUS_CONFIG[reservation.status] || {
                        label: reservation.status,
                        badge: "bg-slate-100 text-slate-700 border-slate-200",
                        dot: "bg-slate-400"
                      };
                      return (
                        <tr key={reservation.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-4 font-medium text-slate-900">{reservation.guest}</td>
                          <td className="px-5 py-4 text-slate-600">{new Date(reservation.start).toLocaleDateString()}</td>
                          <td className="px-5 py-4 text-slate-600">{new Date(reservation.end).toLocaleDateString()}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${cfg.badge}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                              {cfg.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <Link href={`/bd/reservaciones/${reservation.id}`} className="text-[#008cc7] hover:underline font-bold text-xs">
                              Ver detalles
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
                No hay historial de reservas registrado para esta habitación.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}