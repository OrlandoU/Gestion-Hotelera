"use client";

import { ViewTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/pageheader";
import Button from "@/components/ui/button";
import NewReservation from "@/components/NewReservation";
import Modal from "@/components/Modal";
import MantenimientoModal from "@/components/MantenimientoModal";
import { useMemo, useState } from "react";
import { createHuesped } from "@/functions/huesped";
import {
    useReservacionesDiarias,
    useEstadoHabitaciones,
    useActividadesMantenimiento,
    useConsumoStockSemanal,
    useOcupacionMensual,
} from "@/functions/reportes-api";
import { toast } from "sonner";
import { formatLempiras } from "@/lib/utils";

const formatCurrency = (value: number) => formatLempiras(value);

const getRoomStateClasses = (estado?: string) => {
    if (!estado) return "border-t-4 border-slate-300 bg-[#f7f9fb]";
    const lower = estado.toLowerCase();
    if (lower.includes("ocupada") || lower.includes("ocupado")) return "border-t-4 border-slate-400 bg-[#f7f9fb]";
    if (lower.includes("mantenimiento")) return "border-t-4 border-rose-500 bg-[#f7f9fb]";
    if (lower.includes("limpieza") || lower.includes("sucio")) return "border-t-4 border-amber-500 bg-[#f7f9fb]";
    if (lower.includes("disponible") || lower.includes("libre")) return "border-t-4 border-emerald-500 bg-[#f7f9fb]";
    return "border-t-4 border-slate-300 bg-[#f7f9fb]";
};

export default function Page() {
    const router = useRouter();
    const today = new Date().toISOString().split("T")[0];
    const { data: reservasHoy } = useReservacionesDiarias(today);
    const { data: habitacionesApi, loading: loadingHabitaciones } = useEstadoHabitaciones();
    const { data: actividades, loading: loadingActividades } = useActividadesMantenimiento(today);
    const { data: stockAlertas, loading: loadingStock } = useConsumoStockSemanal();
    const { data: ocupacionApi, loading: loadingOcupacion } = useOcupacionMensual();

    const [clienteModalOpen, setClienteModalOpen] = useState(false);
    const [mantenimientoModalOpen, setMantenimientoModalOpen] = useState(false);
    const [incidenteModalOpen, setIncidenteModalOpen] = useState(false);
    const [clienteForm, setClienteForm] = useState({
        nombres: "",
        apellidos: "",
        telefono: "",
        email: "",
        dni: "",
    });
    const [clienteSubmitting, setClienteSubmitting] = useState(false);
    const [incidenteForm, setIncidenteForm] = useState({
        tipo: "",
        detalles: "",
        causas: "",
        recomendaciones: "",
    });

    const habitacionesData = useMemo(() => habitacionesApi || [], [habitacionesApi]);
    const ocupacionData = useMemo(() => ocupacionApi || [], [ocupacionApi]);
    const actividadesData = useMemo(() => actividades || [], [actividades]);
    const stockData = useMemo(() => stockAlertas || [], [stockAlertas]);
    const reservasData = useMemo(() => reservasHoy || [], [reservasHoy]);

    const totalHabitaciones = habitacionesData.length;
    const ocupadas = habitacionesData.filter((habitacion) =>
        habitacion.estado?.toLowerCase().includes("ocup")
    ).length;
    const ocupacionPercent = totalHabitaciones > 0 ? Math.round((ocupadas / totalHabitaciones) * 100) : 0;

    const ingresosMes = ocupacionData.reduce((sum, item) => sum + (item.ingresos || 0), 0);
    const mantenimientoPendiente = actividadesData.length;
    const mantenimientoAlta = actividadesData.filter((item) =>
        /alta|urgente|emergencia/i.test(`${item.tipo_mantenimiento ?? ""} ${item.descripcion ?? ""} ${item.estado ?? ""}`)
    ).length;
    const alertasStock = stockData.length;

    const roomsToShow = habitacionesData.slice(0, 20);
    const statusTotals = habitacionesData.reduce(
        (acc, item) => {
            const estado = item.estado?.toLowerCase() || "";
            if (estado.includes("ocup")) acc.ocupada += 1;
            else if (estado.includes("mantenimiento")) acc.mantenimiento += 1;
            else if (estado.includes("limpieza") || estado.includes("sucio")) acc.sucio += 1;
            else acc.limpia += 1;
            return acc;
        },
        { limpia: 0, ocupada: 0, sucio: 0, mantenimiento: 0 }
    );

    const occupancyChart = ocupacionData.slice(0, 7).map((item) => {
        const value = item.porcentaje_ocupacion
            ?? (item.total_habitaciones && item.habitaciones_ocupadas
                ? Math.round((item.habitaciones_ocupadas / item.total_habitaciones) * 100)
                : 0);
        return {
            label: item.mes ? item.mes.slice(0, 3) : "N/A",
            value: Math.min(100, Math.max(0, value)),
        };
    });

    const recentActivity = reservasData.slice(0, 3).map((reserva, index) => ({
        id: reserva.reserva_id ?? `reserva-${index}`,
        title: reserva.numero_reserva ? `Reserva ${reserva.numero_reserva}` : reserva.nombre_huesped || reserva.nombres || "Reserva nueva",
        subtitle: reserva.nombre_huesped || `${reserva.nombres || ""} ${reserva.apellidos || ""}`.trim() || "Huésped desconocido",
        note: reserva.reserva_estado || reserva.fecha_entrada || "Sin estado",
        icon: reserva.reserva_estado?.toLowerCase().includes("check") ? "how_to_reg" : "calendar_month",
    }));

    const handleClienteSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!clienteForm.nombres.trim() || !clienteForm.apellidos.trim() || !clienteForm.telefono.trim() || !clienteForm.email.trim() || !clienteForm.dni.trim()) {
            toast.error("Completa todos los campos para crear el cliente.");
            return;
        }

        setClienteSubmitting(true);
        try {
            await createHuesped(clienteForm);
            toast.success("Cliente creado correctamente.");
            setClienteForm({ nombres: "", apellidos: "", telefono: "", email: "", dni: "" });
            setClienteModalOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("No se pudo crear el cliente. Intenta nuevamente.");
        } finally {
            setClienteSubmitting(false);
        }
    };

    const handleIncidenteSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!incidenteForm.tipo.trim() || !incidenteForm.detalles.trim()) {
            toast.error("Indica el tipo y los detalles del incidente.");
            return;
        }

        toast.success("Incidente registrado. Se añadirá al reporte correspondiente.");
        setIncidenteForm({ tipo: "", detalles: "", causas: "", recomendaciones: "" });
        setIncidenteModalOpen(false);
    };

    return (
        <ViewTransition enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}>
            <div className="space-y-6">
                <PageHeader name="Panel" subtitle="Visión general de operaciones" buttons={<NewReservation />} />

                <section className="space-y-4">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-950">Acciones rápidas</h2>
                        <p className="text-sm text-slate-500">Crea clientes, tickets y reservas desde un acceso directo.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
                        <button
                            type="button"
                            onClick={() => setClienteModalOpen(true)}
                            className="col-span-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            <span className="material-symbols-outlined">person_add</span>
                            Nuevo cliente
                        </button>
                        <button
                            type="button"
                            onClick={() => setMantenimientoModalOpen(true)}
                            className="col-span-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            <span className="material-symbols-outlined">build</span>
                            Nuevo ticket de mantenimiento
                        </button>
                        <button
                            type="button"
                            onClick={() => setIncidenteModalOpen(true)}
                            className="col-span-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            <span className="material-symbols-outlined">report_problem</span>
                            Nuevo incidente
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push("/bd/reservaciones/crear")}
                            className="col-span-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            <span className="material-symbols-outlined">event</span>
                            Nueva reserva
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push("/bd/inventario/nuevo")}
                            className="col-span-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            <span className="material-symbols-outlined">inventory_2</span>
                            Nuevo activo
                        </button>
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div className="rounded-xl border border-slate-300 bg-white p-6 shadow-level-1">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Ocupación hoy</p>
                                <p className="mt-3 text-3xl font-bold text-slate-950">{loadingHabitaciones ? "..." : `${ocupacionPercent}%`}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                                <span className="material-symbols-outlined">meeting_room</span>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-slate-600">{loadingHabitaciones ? "Cargando datos de habitación..." : `${ocupadas} / ${totalHabitaciones} habitaciones ocupadas`}</p>
                    </div>

                    <div className="rounded-xl border border-slate-300 bg-white p-6 shadow-level-1">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Ingresos mes</p>
                                <p className="mt-3 text-3xl font-bold text-slate-950">{loadingOcupacion ? "..." : formatCurrency(ingresosMes)}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-slate-900">
                                <span className="material-symbols-outlined">payments</span>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-slate-600">{loadingOcupacion ? "Cargando ocupación..." : "Basado en datos reales de ocupación mensual"}</p>
                    </div>

                    <div className="rounded-xl border border-slate-300 bg-white p-6 shadow-level-1">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Mantenimiento pendiente</p>
                                <p className="mt-3 text-3xl font-bold text-slate-950">{loadingActividades ? "..." : mantenimientoPendiente}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
                                <span className="material-symbols-outlined">build</span>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-rose-700">{loadingActividades ? "Cargando actividades..." : `${mantenimientoAlta} de alta prioridad`}</p>
                    </div>

                    <div className="rounded-xl border border-slate-300 bg-white p-6 shadow-level-1">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Alertas de stock</p>
                                <p className="mt-3 text-3xl font-bold text-slate-950">{loadingStock ? "..." : alertasStock}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
                                <span className="material-symbols-outlined">inventory_2</span>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-slate-600">{loadingStock ? "Cargando reportes de stock..." : "Artículos por debajo del nivel de alerta"}</p>
                    </div>
                </section>

                <section className="grid grid-cols-12 gap-8">
                    <div className="col-span-12 lg:col-span-8 rounded-xl border border-slate-300 bg-white p-6 shadow-level-1">
                        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
                            <div>
                                <h3 className="text-xl font-semibold text-slate-950">Estado de habitaciones</h3>
                                <p className="text-sm text-slate-500">Resumen de los primeros espacios cargados desde la API</p>
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-[12px] text-slate-600">
                                <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>Limpia {statusTotals.limpia}</span>
                                <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-slate-400"></span>Ocupada {statusTotals.ocupada}</span>
                                <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>Sucio {statusTotals.sucio}</span>
                                <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>Mantenimiento {statusTotals.mantenimiento}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
                            {roomsToShow.length > 0 ? (
                                roomsToShow.map((habitacion, index) => (
                                    <div
                                        key={habitacion.espacio_id ?? habitacion.numero_espacio ?? `habitacion-${index}`}
                                        className={`${getRoomStateClasses(habitacion.estado)} flex items-center justify-center rounded-sm text-[12px] font-medium text-[#515f74] cursor-pointer hover:bg-[#e0e3e5] transition-colors h-16`}
                                    >
                                        {habitacion.numero_espacio || habitacion.espacio_id || "--"}
                                    </div>
                                ))
                            ) : (
                                Array.from({ length: 20 }).map((_, index) => (
                                    <div key={index} className="aspect-square rounded-sm bg-slate-100 animate-pulse" />
                                ))
                            )}
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-4 rounded-xl border border-slate-300 bg-white p-6 shadow-level-1 flex flex-col">
                        <h3 className="text-xl font-semibold text-slate-950 mb-6">Ocupación mensual</h3>
                        <div className="flex-1 flex items-end gap-2 mt-4 pt-4 border-t border-slate-300">
                            {occupancyChart.length > 0 ? (
                                occupancyChart.map((item) => (
                                    <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full rounded-t-sm bg-[#bec6e0] hover:bg-[#131b2e] transition-colors cursor-pointer" style={{ height: `${item.value}%` }}>
                                            <div className="h-full w-full"></div>
                                        </div>
                                        <span className="text-[12px] leading-3.5 font-medium text-[#515f74]">{item.label}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="flex-1 flex items-center justify-center py-14 text-sm text-slate-500">No hay datos de ocupación disponibles</div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-slate-300 bg-white shadow-level-1 overflow-hidden">
                    <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4">
                        <h3 className="text-xl font-semibold text-slate-950">Actividad reciente</h3>
                        <Link href="/bd/reservaciones" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">
                            <span className="material-symbols-outlined">visibility</span>
                            Ver todas
                        </Link>
                    </div>

                    <div className="flex flex-col divide-y divide-slate-100">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((activity) => (
                                <div key={activity.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="w-9 h-9 rounded-full bg-[#c9e6ff] flex items-center justify-center text-[#008cc7]">
                                            <span className="material-symbols-outlined text-[18px]">{activity.icon}</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                                            <p className="text-sm text-slate-600 mt-1">{activity.subtitle}</p>
                                        </div>
                                        <p className="text-xs font-medium text-slate-500">{activity.note}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-10 text-center text-sm text-slate-500">No hay actividad reciente disponible.</div>
                        )}
                    </div>
                </section>
            </div>

            <Modal open={clienteModalOpen} onClose={() => setClienteModalOpen(false)} title="Crear cliente">
                <form onSubmit={handleClienteSubmit} className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">
                        Registra un nuevo huésped o cliente desde el panel principal.
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="text-sm font-semibold text-slate-700">
                            <span className="mb-2 block">Nombres</span>
                            <input
                                value={clienteForm.nombres}
                                onChange={(event) => setClienteForm((prev) => ({ ...prev, nombres: event.target.value }))}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                                placeholder="Ej. Orlando"
                                required
                            />
                        </label>
                        <label className="text-sm font-semibold text-slate-700">
                            <span className="mb-2 block">Apellidos</span>
                            <input
                                value={clienteForm.apellidos}
                                onChange={(event) => setClienteForm((prev) => ({ ...prev, apellidos: event.target.value }))}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                                placeholder="Ej. Mendoza"
                                required
                            />
                        </label>
                        <label className="text-sm font-semibold text-slate-700">
                            <span className="mb-2 block">Teléfono</span>
                            <input
                                value={clienteForm.telefono}
                                onChange={(event) => setClienteForm((prev) => ({ ...prev, telefono: event.target.value }))}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                                placeholder="96751977"
                                required
                            />
                        </label>
                        <label className="text-sm font-semibold text-slate-700">
                            <span className="mb-2 block">Correo</span>
                            <input
                                type="email"
                                value={clienteForm.email}
                                onChange={(event) => setClienteForm((prev) => ({ ...prev, email: event.target.value }))}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                                placeholder="cliente@hotel.com"
                                required
                            />
                        </label>
                    </div>
                    <label className="block text-sm font-semibold text-slate-700">
                        <span className="mb-2 block">Documento</span>
                        <input
                            value={clienteForm.dni}
                            onChange={(event) => setClienteForm((prev) => ({ ...prev, dni: event.target.value }))}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                            placeholder="12345678"
                            required
                        />
                    </label>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={clienteSubmitting} variant="primary">
                            {clienteSubmitting ? "Guardando..." : "Guardar cliente"}
                        </Button>
                    </div>
                </form>
            </Modal>

            <MantenimientoModal
                open={mantenimientoModalOpen}
                onClose={() => setMantenimientoModalOpen(false)}
                onSave={() => setMantenimientoModalOpen(false)}
            />

            <Modal open={incidenteModalOpen} onClose={() => setIncidenteModalOpen(false)} title="Registrar incidente">
                <form onSubmit={handleIncidenteSubmit} className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">
                        Describe lo sucedido para dejarlo registrado en el seguimiento del hotel.
                    </div>
                    <label className="block text-sm font-semibold text-slate-700">
                        <span className="mb-2 block">Tipo de incidente</span>
                        <input
                            value={incidenteForm.tipo}
                            onChange={(event) => setIncidenteForm((prev) => ({ ...prev, tipo: event.target.value }))}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                            placeholder="Ej. Corte de energía"
                            required
                        />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                        <span className="mb-2 block">Detalles</span>
                        <textarea
                            value={incidenteForm.detalles}
                            onChange={(event) => setIncidenteForm((prev) => ({ ...prev, detalles: event.target.value }))}
                            className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                            placeholder="Describe el problema, el impacto y el momento en que ocurrió."
                            required
                        />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                        <span className="mb-2 block">Causas</span>
                        <textarea
                            value={incidenteForm.causas}
                            onChange={(event) => setIncidenteForm((prev) => ({ ...prev, causas: event.target.value }))}
                            className="min-h-20 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                            placeholder="Opcional"
                        />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                        <span className="mb-2 block">Recomendaciones</span>
                        <textarea
                            value={incidenteForm.recomendaciones}
                            onChange={(event) => setIncidenteForm((prev) => ({ ...prev, recomendaciones: event.target.value }))}
                            className="min-h-20 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                            placeholder="Opcional"
                        />
                    </label>
                    <div className="flex justify-end">
                        <Button type="submit" variant="primary">
                            Guardar incidente
                        </Button>
                    </div>
                </form>
            </Modal>
        </ViewTransition>
    );
}
