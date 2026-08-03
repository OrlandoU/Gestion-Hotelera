'use client'
import { useMemo, useState, type ChangeEvent } from 'react'
import PageHeader from '@/components/pageheader'
import Link from 'next/link'
import { useTickets, Ticket } from '@/functions/tickets'
import { getCurrentUser } from '@/functions/auth'

function formatDate(iso?: string | null) {
    if (!iso) return '—'
    try {
        const d = new Date(iso)
        return d.toLocaleString('es-HN', { year: 'numeric', month: 'short', day: '2-digit' })
    } catch {
        return iso
    }
}

export default function MantenimientoPage() {
    const user = getCurrentUser()
    const { data: tickets = [], loading } = useTickets()
    const [q, setQ] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | 'Pendiente' | 'Completado'>('all')
    const [filterPriority, setFilterPriority] = useState<'all' | 'Urgente' | 'Alta' | 'Media' | 'Baja'>('all')

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase()
        return (tickets || []).filter((t: Ticket) => {
            if (filterStatus !== 'all' && t.estado !== filterStatus) return false
            if (filterPriority !== 'all' && t.prioridad !== filterPriority) return false
            if (!term) return true
            return (
                String(t.numero_ticket).toLowerCase().includes(term) ||
                String(t.titulo || '').toLowerCase().includes(term) ||
                String(t.descripcion || '').toLowerCase().includes(term) ||
                String(t.numero_espacio || '').toLowerCase().includes(term) ||
                String(t.responsable || '').toLowerCase().includes(term)
            )
        })
    }, [tickets, q, filterStatus, filterPriority])

    const total = tickets?.length ?? 0
    const pendientes = tickets?.filter((t: Ticket) => t.estado === 'Pendiente').length ?? 0
    const altas = tickets?.filter((t: Ticket) => t.prioridad === 'Alta').length ?? 0

    return (
        <div className="w-full flex flex-col gap-6">
            <PageHeader
                name="Mantenimiento"
                subtitle="Solicitudes y tareas pendientes"
                buttons={
                    <div className="flex items-center gap-3">
                        <Link href="/bd/mantenimiento/nuevo" className="hover:cursor-pointer hover:-translate-y-0.5 right-4 bottom-4 flex items-center justify-center gap-2 rounded-[2.5rem] bg-[#000000] px-6 py-4 text-[14px] font-semibold leading-4 tracking-wider text-[#ffffff] shadow-lg transition-transform active:scale-95">
                            <span className="material-symbols-outlined">add</span> Nuevo ticket
                        </Link>
                    </div>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-slate-300 p-5 shadow-sm b-1" >
                    <div className="text-xs text-slate-500 uppercase font-semibold">Tickets</div>
                    <div className="text-2xl font-bold mt-2">{total}</div>
                    <div className="text-sm text-slate-500 mt-1">Total en el sistema</div>
                </div>
                <div className="bg-white rounded-xl border border-slate-300 p-5 shadow-sm b-1" >
                    <div className="text-xs text-slate-500 uppercase font-semibold">Pendientes</div>
                    <div className="text-2xl font-bold mt-2">{pendientes}</div>
                    <div className="text-sm text-amber-600 mt-1">Requiere acción</div>
                </div>
                <div className="bg-white rounded-xl border border-slate-300 p-5 shadow-sm b-1" >
                    <div className="text-xs text-slate-500 uppercase font-semibold">Alta prioridad</div>
                    <div className="text-2xl font-bold mt-2 text-indigo-600">{altas}</div>
                    <div className="text-sm text-indigo-500 mt-1">Atender urgente</div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-300 p-5 shadow-sm b-1" >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3 w-full md:w-1/2">
                        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por ticket, título, descripción, habitación o responsable" className="w-full px-3 py-2 border rounded-md text-sm" />
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setFilterStatus('all')} className="px-3 py-2 border rounded-md text-sm">
                            Todos
                        </button>
                        <button onClick={() => setFilterStatus('Pendiente')} className="px-3 py-2 border rounded-md text-sm">
                            Mis tareas
                        </button>
                        <select value={filterStatus} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value as 'all' | 'Pendiente' | 'Completado')} className="px-3 py-2 border rounded-md text-sm">
                            <option value="all">Todos los estados</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Completado">Completado</option>
                        </select>

                        <select value={filterPriority} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterPriority(e.target.value as 'all' | 'Urgente' | 'Alta' | 'Media' | 'Baja')} className="px-3 py-2 border rounded-md text-sm">
                            <option value="all">Todas las prioridades</option>
                            <option value="Urgente">Urgente</option>
                            <option value="Alta">Alta</option>
                            <option value="Media">Media</option>
                            <option value="Baja">Baja</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs text-slate-500 uppercase">
                                <th className="px-3 py-2">Ticket</th>
                                <th className="px-3 py-2">Título / Descripción</th>
                                <th className="px-3 py-2">Espacio</th>
                                <th className="px-3 py-2">Prioridad</th>
                                <th className="px-3 py-2">Responsable</th>
                                <th className="px-3 py-2">Creado</th>
                                <th className="px-3 py-2">Límite</th>
                                <th className="px-3 py-2">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-3 py-6 text-center text-sm text-slate-500">Cargando tickets...</td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-3 py-6 text-center text-sm text-slate-500">No se encontraron tickets.</td>
                                </tr>
                            ) : (
                                filtered.map((t: Ticket) => (
                                    <tr key={t.ticket_id} className="border-t">
                                        <td className="px-3 py-3 align-top"><Link href={`/bd/mantenimiento/${t.numero_ticket}`} className="font-medium text-slate-900">{t.numero_ticket}</Link></td>
                                        <td className="px-3 py-3 align-top">
                                            <div className="font-semibold">{t.titulo}</div>
                                            <div className="text-xs text-slate-500 mt-1">{t.descripcion}</div>
                                        </td>
                                        <td className="px-3 py-3 align-top">{t.numero_espacio}</td>
                                        <td className="px-3 py-3 align-top">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.prioridad === 'Alta' ? 'bg-indigo-200 text-indigo-800' : t.prioridad === 'Media' ? 'bg-amber-50 text-amber-800' : 'bg-purple-200 text-purple-800'}`}>{t.prioridad}</span>
                                        </td>
                                        <td className="px-3 py-3 align-top">{(t.responsable ?? t.usuario ?? '—') + (t.responsable_id === user?.usuario_id ? ' (Tú)' : '')}</td>
                                        <td className="px-3 py-3 align-top text-sm text-slate-600">{formatDate(t.fecha_creacion)}</td>
                                        <td className="px-3 py-3 align-top text-sm text-slate-600">{formatDate(t.fecha_limite)}</td>
                                        <td className="px-3 py-3 align-top">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${t.estado === 'Pendiente' ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-700'}`}>{t.estado}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}