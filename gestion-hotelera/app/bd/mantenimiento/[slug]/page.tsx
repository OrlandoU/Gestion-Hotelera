"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PageHeader from "@/components/pageheader";
import { ValidatedInput } from "@/components/ui/validated-field";
import { createComentario, getComentarios, getTickets, Ticket, Comentario } from "@/functions/tickets";

export default function TicketDetailPage() {
    const params = useParams<{ slug: string }>();
    const slug = params?.slug as string | undefined;

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
                const commentsResponse = await getComentarios(slug);
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
                numero_ticket: slug,
                usuario_id: 1,
                contenido: commentText.trim(),
                fecha_creacion: new Date().toISOString(),
            });
            setComentarios((prev) => [created, ...prev]);
            setCommentText("");
            setFormErrors({});
            setTouched({});
        } catch (error) {
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

    return (
        <div className="max-w-360 mx-auto w-full flex flex-col gap-6">
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
                <div className="rounded-xl border border-slate-300 bg-white p-8 text-center text-slate-500">Cargando ticket...</div>
            ) : !ticket ? (
                <div className="rounded-xl border border-slate-300 bg-white p-8 text-center text-slate-500">
                    No se encontró el ticket solicitado.
                </div>
            ) : (
                <>
                    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
                        <section className="rounded-xl border border-slate-300 bg-white p-6 shadow-sm">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{ticket.numero_ticket}</p>
                                    <h2 className="mt-1 text-xl font-bold text-slate-950">{ticket.titulo}</h2>
                                </div>
                                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${estadoClasses}`}>
                                    {ticket.estado}
                                </span>
                            </div>

                            <div className="mt-6 grid gap-4 md:grid-cols-2">
                                <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px] text-slate-500">description</span>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Descripción</p>
                                    </div>
                                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">{ticket.descripcion}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Área / espacio</p>
                                    <p className="mt-2 text-sm font-semibold text-slate-900">{ticket.espacio_id}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Responsable</p>
                                    <p className="mt-2 text-sm font-semibold text-slate-900">{ticket.nombre_responsable ?? "Sin asignar"}</p>
                                    <p className="text-sm text-slate-600">{ticket.telefono_responsable ?? "—"}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Fechas</p>
                                    <p className="mt-2 text-sm text-slate-700">Creado: {ticket.fecha_creacion ? new Date(ticket.fecha_creacion).toLocaleString() : "—"}</p>
                                    <p className="text-sm text-slate-700">Límite: {ticket.fecha_limite ? new Date(ticket.fecha_limite).toLocaleString() : "Sin límite"}</p>
                                </div>
                            </div>
                        </section>

                        <aside className="rounded-xl border border-slate-300 bg-white p-6 shadow-sm">
                            <h3 className="text-base font-bold text-slate-950">Resumen rápido</h3>
                            <div className="mt-4 space-y-3 text-sm text-slate-600">
                                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                                    <span>Reserva asociada</span>
                                    <span className="font-semibold text-slate-900">{ticket.reserva_id ?? "—"}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                                    <span>Usuario</span>
                                    <span className="font-semibold text-slate-900">{ticket.usuario_id}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                                    <span>Responsable ID</span>
                                    <span className="font-semibold text-slate-900">{ticket.responsable_id ?? "—"}</span>
                                </div>
                            </div>
                        </aside>
                    </div>

                    <section className="rounded-xl border border-slate-300 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h3 className="text-base font-bold text-slate-950">Comentarios</h3>
                                <p className="text-sm text-slate-500">Añade actualizaciones o notas de seguimiento.</p>
                            </div>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{comentarios.length}</span>
                        </div>
                        <div className="mt-6 space-y-3">
                            {comentarios.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                                    Aún no hay comentarios para este ticket.
                                </div>
                            ) : (
                                comentarios.map((comment) => (
                                    <div key={comment.comentario_id} className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                                                    U{comment.usuario_id}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">Usuario {comment.usuario_id}</p>
                                                    <p className="text-xs text-slate-500">{comment.fecha_creacion ? new Date(comment.fecha_creacion).toLocaleString() : "—"}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">{comment.contenido}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        <form onSubmit={handleSubmitComment} className="mt-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white">
                                    <span className="material-symbols-outlined text-[20px]">chat</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900">Nuevo comentario</h4>
                                            <p className="text-sm text-slate-500">Registra una actualización o nota de seguimiento para este ticket.</p>
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
                                            className="min-h-[120px]"
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
                </>
            )}
        </div>
    );
}
