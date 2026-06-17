import PageHeader from "@/components/pageheader";
import Link from "next/link";
import { ViewTransition } from "react";
import { ROOMS_LIST, getRoomCurrentReservation, getRoomNextReservation } from "@/data/rooms";

function getStatusBadge(status: string) {
  switch (status) {
    case "Available":
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "Occupied":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "Dirty":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "Maintenance":
      return "bg-rose-100 text-rose-800 border-rose-300";
    default:
      return "bg-slate-100 text-slate-800 border-slate-300";
  }
}

export default function Page() {
  const totalRooms = ROOMS_LIST.length;
  const occupiedRooms = ROOMS_LIST.filter((room) => room.status === "Occupied").length;
  const availableRooms = ROOMS_LIST.filter((room) => room.status === "Available").length;
  const maintenanceRooms = ROOMS_LIST.filter((room) => room.status === "Maintenance").length;

  return (
    <ViewTransition enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}>
      <PageHeader
        name="Habitaciones"
        subtitle="Controla el estado de cada habitación y revisa su historial de reservaciones"
        buttons={
          <Link href="/bd/habitaciones" className="hover:cursor-pointer hover:-translate-y-0.5 right-4 bottom-4 flex items-center justify-center gap-2 bg-[#000000] text-[#ffffff] py-4 px-6 rounded-[2.5rem] text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider transition-transform active:scale-95 shadow-lg">
            <span className="material-symbols-outlined">bed</span> Habitaciones
          </Link>
        }
      />

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold mb-3">Total de habitaciones</p>
          <p className="text-3xl font-bold text-slate-950">{totalRooms}</p>
        </div>
        <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold mb-3">Ocupadas</p>
          <p className="text-3xl font-bold text-blue-700">{occupiedRooms}</p>
        </div>
        <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold mb-3">Disponibles</p>
          <p className="text-3xl font-bold text-emerald-700">{availableRooms}</p>
        </div>
        <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold mb-3">Mantenimiento</p>
          <p className="text-3xl font-bold text-rose-700">{maintenanceRooms}</p>
        </div>
      </section>

      <section className="bg-white border border-slate-300 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Lista de habitaciones</h2>
            <p className="text-sm text-slate-600">Consulta el estado actual, la ocupación y las reservas vinculadas.</p>
          </div>
          <Link href="/bd/habitaciones" className="text-sm font-semibold text-[#008cc7] hover:underline">Refrescar vista</Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[12px]">
              <tr>
                <th className="px-6 py-4 text-left">Habitación</th>
                <th className="px-6 py-4 text-left">Tipo</th>
                <th className="px-6 py-4 text-left">Estado</th>
                <th className="px-6 py-4 text-left">Reserva actual</th>
                <th className="px-6 py-4 text-left">Próxima reserva</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {ROOMS_LIST.map((room) => {
                const currentReservation = getRoomCurrentReservation(room.id);
                const nextReservation = getRoomNextReservation(room.id);
                return (
                  <tr key={room.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{room.number}</td>
                    <td className="px-6 py-4 text-slate-600">{room.type}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadge(room.status)}`}>
                        <span className="w-2 h-2 rounded-full bg-current"></span>
                        {room.status === "Available" ? "Disponible" : room.status === "Occupied" ? "Ocupada" : room.status === "Dirty" ? "Sucio" : room.status === "Maintenance" ? "Mantenimiento" : room.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {currentReservation ? (
                        <span>{currentReservation.guest} · {currentReservation.status === "InHouse" ? "En estancia" : currentReservation.status === "Confirmed" ? "Confirmada" : "Pendiente"}</span>
                      ) : (
                        <span className="text-slate-400">Libre</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {nextReservation ? (
                        <span>{new Date(nextReservation.start).toLocaleDateString()} · {nextReservation.guest}</span>
                      ) : (
                        <span className="text-slate-400">Sin próximas reservas</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/bd/habitaciones/${room.id}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950 text-white text-xs font-semibold hover:bg-slate-800 transition-colors">
                        Ver detalles
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </ViewTransition>
  );
}
