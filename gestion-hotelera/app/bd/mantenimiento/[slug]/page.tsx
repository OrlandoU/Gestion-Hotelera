"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PageHeader from "@/components/pageheader";
import { ValidatedInput } from "@/components/ui/validated-field";
import { createComentario, getComentarios, getTickets, Ticket, Comentario } from "@/functions/tickets";
import { toast } from "sonner";
import { getCurrentUser, LoggedUser } from "@/functions/auth";

export default function TicketDetailPage() {
    const params = useParams<{ slug: string }>();
    const slug = params?.slug as string | undefined;

    const [user] = useState<LoggedUser | null>(() => getCurrentUser());
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (!slug) {
                setTicket(null);
                setComentarios([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const ticketResponse = await getTickets(slug);
                setTicket(ticketResponse?.[0] ?? null);
            } catch (error) {
                console.error("Error cargando el ticket", error);
                setTicket(null);
            }

            try {
                const commentsResponse = await getComentarios(ticket?.ticket_id ?? undefined);
                setComentarios(commentsResponse ?? []);
            } catch (error) {
                console.error("Error cargando comentarios", error);
                setComentarios([]);
            } finally {
                setLoading(false);
            }
        };

        void loadData();
    }, [slug]);

    const validateComment = () => {
        const nextErrors: Record<string, string> = {};

        if (!commentText.trim()) {
            nextErrors.comment = "Escribe un comentario antes de enviar.";
        } else if (commentText.trim().length < 3) {
            nextErrors.comment = "El comentario debe tener al menos 3 caracteres.";
        } else if (commentText.trim().length > 500) {
            nextErrors.comment = "El comentario no puede superar 500 caracteres.";
        }

        setFormErrors(nextErrors);
        setTouched({ comment: true });
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmitComment = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!validateComment() || !slug) return;

        try {
            setIsSubmitting(true);
            const created = await createComentario({
                ticket_id: ticket?.ticket_id?.toString() || "",
                usuario_id: user?.usuario_id || 0,
                contenido: commentText.trim(),
                fecha_creacion: new Date().toISOString(),
            });
            setComentarios((prev) => [...prev, {
                ...created,
                ticket_id: ticket?.ticket_id?.toString() || "",
                usuario_id: user?.usuario_id || 0,
                contenido: commentText.trim(),
                fecha_creacion: new Date().toISOString(), usuario: user?.nombre || "Usuario"
            }]);
            toast.success("Comentario agregado correctamente.");
            setCommentText("");
            setFormErrors({});
            setTouched({});
        } catch (error) {
            toast.error("Error agregando comentario");
            console.error("Error agregando comentario", error);
            setFormErrors((prev) => ({ ...prev, comment: "No se pudo guardar el comentario. Inténtalo de nuevo." }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const estadoClasses = useMemo(() => {
        const estado = ticket?.estado?.toLowerCase() ?? "pendiente";
        if (estado.includes("progreso") || estado.includes("in progress")) {
            return "bg-amber-50 text-amber-700 border-amber-200";
        }
        if (estado.includes("resuelto") || estado.includes("cerrado")) {
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        }
        return "bg-red-50 text-red-700 border-red-200";
    }, [ticket?.estado]);

    const prioridadClasses = useMemo(() => {
        const prioridad = ticket?.prioridad?.toLowerCase() ?? "media";
        if (prioridad.includes("alta") || prioridad.includes("urgente")) {
            return "bg-rose-50 text-rose-700 border-rose-200";
        }
        if (prioridad.includes("baja")) {
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        }
        return "bg-sky-50 text-sky-700 border-sky-200";
    }, [ticket?.prioridad]);

    const espacioLabel = ticket?.numero_espacio ?? (ticket?.espacio_id != null ? String(ticket.espacio_id) : "Sin asignar");
    const responsableLabel = ticket?.responsable ?? ticket?.nombre_responsable ?? "Sin asignar";
    const usuarioLabel = ticket?.usuario ?? (ticket?.usuario_id != null ? `Usuario ${ticket.usuario_id}` : "Sin asignar");
    const tipoLabel = ticket?.tipo ?? "Sin tipo";
    const prioridadLabel = ticket?.prioridad ?? "Sin prioridad";
    const rolLabel = ticket?.rol ?? "—";
    const estadoLabel = ticket?.estado ?? "Pendiente";
    const fechaCreacionLabel = ticket?.fecha_creacion ? new Date(ticket.fecha_creacion).toLocaleString("es-ES", {
        dateStyle: "medium",
        timeStyle: "short",
    }) : "—";
    const fechaLimiteLabel = ticket?.fecha_limite ? new Date(ticket.fecha_limite).toLocaleString("es-ES", {
        dateStyle: "medium",
        timeStyle: "short",
    }) : "Sin límite";

    return (
        <div className="w-full flex flex-col">
            <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
                <Link className="font-medium transition-colors hover:text-sky-600" href="/bd/mantenimiento" transitionTypes={["nav-back"]}>Mantenimiento</Link>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                <span className="font-semibold text-slate-800">Detalle del ticket</span>
            </div>

            <PageHeader
                name="Detalle del ticket"
                subtitle={ticket?.titulo ?? "Solicitud de mantenimiento"}
                buttons={
                    <Link href="/bd/mantenimiento" className="hover:cursor-pointer hover:-translate-y-0.5 flex items-center justify-center gap-2 border border-slate-300 bg-white py-3 px-5 rounded-[2.5rem] text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider text-slate-700 shadow-sm transition-transform active:scale-95">
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span> Volver
                    </Link>
                }
            />

            {loading ? (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                    Cargando ticket...
                </div>
            ) : !ticket ? (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                    No se encontró el ticket solicitado.
                </div>
            ) : (
                <div className="mt-6 space-y-6">
                    <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                        <div className="bg-linear-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-6 text-white">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-200">
                                            {ticket.numero_ticket ?? "Ticket sin número"}
                                        </span>
                                        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-200">
                                            {tipoLabel}
                                        </span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-semibold text-white">{ticket.titulo}</h2>
                                        <p className="mt-2 text-sm text-slate-300">Seguimiento del caso y registro de actualizaciones para el equipo.</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${estadoClasses}`}>
                                        {estadoLabel}
                                    </span>
                                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${prioridadClasses}`}>
                                        {prioridadLabel}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 p-6 xl:grid-cols-[1.5fr_0.9fr]">
                            <div className="space-y-6">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px] text-slate-500">description</span>
                                        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Descripción</h3>
                                    </div>
                                    <p className="mt-4 whitespace-pre-wrap wrap-break-word text-sm leading-7 text-slate-700">
                                        {ticket.descripcion || "Sin descripción registrada."}
                                    </p>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Espacio</p>
                                        <p className="mt-2 text-sm font-semibold text-slate-900">{espacioLabel}</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Responsable</p>
                                        <p className="mt-2 text-sm font-semibold text-slate-900">{responsableLabel}</p>
                                        <p className="text-sm text-slate-600">{ticket.telefono_responsable ?? "—"}</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Fecha de creación</p>
                                        <p className="mt-2 text-sm font-semibold text-slate-900">{fechaCreacionLabel}</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Fecha límite</p>
                                        <p className="mt-2 text-sm font-semibold text-slate-900">{fechaLimiteLabel}</p>
                                    </div>
                                </div>
                            </div>

                            <aside className="space-y-4">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Resumen rápido</h3>
                                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                        <dl className="grid gap-4 text-sm text-slate-700">
                                            <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_auto] sm:items-center">
                                                <dt className="text-xs uppercase tracking-[0.24em] text-slate-500">Reserva asociada</dt>
                                                <dd className="font-semibold text-slate-900">{ticket.reserva_id ?? '—'}</dd>
                                            </div>
                                            <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_auto] sm:items-center">
                                                <dt className="text-xs uppercase tracking-[0.24em] text-slate-500">Usuario</dt>
                                                <dd className="font-semibold text-slate-900">{usuarioLabel}</dd>
                                            </div>
                                            <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_auto] sm:items-center">
                                                <dt className="text-xs uppercase tracking-[0.24em] text-slate-500">Responsable</dt>
                                                <dd className="font-semibold text-slate-900">{responsableLabel}</dd>
                                            </div>
                                            <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_auto] sm:items-center">
                                                <dt className="text-xs uppercase tracking-[0.24em] text-slate-500">Rol</dt>
                                                <dd className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{rolLabel}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>

                                {/* <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px] text-amber-700">tips_and_updates</span>
                                        <h3 className="text-sm font-semibold text-amber-800">Recomendación</h3>
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-amber-800">
                                        Mantén el seguimiento activo y prioriza la atención cuando el estado está pendiente o la prioridad es alta.
                                    </p>
                                </div> */}
                            </aside>
                        </div>
                    </section>

                    <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h3 className="text-base font-bold text-slate-950">Comentarios y seguimiento</h3>
                                <p className="text-sm text-slate-500">Registra actualizaciones claras para mantener el caso bien documentado.</p>
                            </div>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{comentarios.length} mensajes</span>
                        </div>

                        <div className="mt-6 space-y-3">
                            {comentarios.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                                    Aún no hay comentarios para este ticket.
                                </div>
                            ) : (
                                comentarios.map((comment) => (
                                    <div key={comment.comentario_id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                                                {comment.usuario ? comment.usuario.split(" ")[0][0].toUpperCase() + comment.usuario.split(" ")[1][0].toUpperCase() : "U"}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{comment.usuario}</p>
                                                <p className="text-xs text-slate-500">{comment.fecha_creacion ? new Date(comment.fecha_creacion).toLocaleString() : "—"}</p>
                                            </div>
                                        </div>
                                        <p className="mt-3 whitespace-pre-wrap wrap-break-word text-sm leading-7 text-slate-700">{comment.contenido}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <form onSubmit={handleSubmitComment} className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white">
                                    <span className="material-symbols-outlined text-[20px]">chat</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900">Añadir actualización</h4>
                                            <p className="text-sm text-slate-500">Comparte un avance, una observación o el siguiente paso.</p>
                                        </div>
                                        <span className="rounded-full bg-slate-200/70 px-2.5 py-1 text-xs font-semibold text-slate-600">Equipo</span>
                                    </div>
                                    <div className="mt-4">
                                        <ValidatedInput
                                            label=""
                                            value={commentText}
                                            onChange={setCommentText}
                                            onBlur={() => {
                                                setTouched((prev) => ({ ...prev, comment: true }));
                                                validateComment();
                                            }}
                                            onFocus={() => setTouched((prev) => ({ ...prev, comment: true }))}
                                            error={formErrors.comment}
                                            touched={touched.comment || Boolean(formErrors.comment)}
                                            placeholder="Escribe una actualización..."
                                            multiline
                                            rows={4}
                                            className="min-h-30"
                                        />
                                    </div>
                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                        <p className="text-xs text-slate-500">Tu comentario ayuda a mantener el seguimiento claro y ordenado.</p>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {isSubmitting ? "Enviando..." : "Guardar comentario"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
}
