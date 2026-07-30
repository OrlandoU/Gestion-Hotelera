"use client";

import { useMemo, useState, useEffect } from "react";
import PageHeader from "@/components/pageheader";
import Modal from "@/components/Modal";
import { ValidatedInput } from "@/components/ui/validated-field";
import Button from "@/components/ui/button";
import { useUsuarios, crearUsuario, updateUsuario, Usuario } from "@/functions/usuarios";
import { toast } from "sonner";

// ─── TIPOS DE DATOS ─────────────────────────────────────────
export type UserStatus = "Disponible" | "Ocupado";
export type UserRole = "Administrador" | "Recepcionista" | "Mantenimiento" | "Limpieza";

export default function UsuariosPage() {
    const { data: usuarios, loading, error, refetch } = useUsuarios();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [query, setQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("todos");

    // Estados de Modales
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Usuario | null>(null);
    const [deletingUser, setDeletingUser] = useState<Usuario | null>(null);

    // Formulario de Creación
    const [createForm, setCreateForm] = useState({
        primer_nombre: "",
        segundo_nombre: "",
        primer_apellido: "",
        segundo_apellido: "",
        fecha_nacimiento: "",
        telefono: "",
        email: "",
        rol: "Recepcionista" as UserRole,
        password_hash: "",
    });

    // Formulario de Edición Rápida (Rol, Email, Estado)
    const [editForm, setEditForm] = useState<{
        rol: UserRole;
        email: string;
        estado: UserStatus;
    }>({
        rol: "Recepcionista",
        email: "",
        estado: "Disponible",
    });

    // ─── HELPER FUNCTIONS ──────────────────────────────────────

    const getFullName = (u: Usuario) => {
        return `${u.primer_nombre} ${u.segundo_nombre || ""} ${u.primer_apellido} ${u.segundo_apellido || ""}`.replace(/\s+/g, " ").trim();
    };

    // Badges estilizados con la paleta oficial
    const getRoleBadge = (rol: UserRole) => {
        const styles: Record<UserRole, string> = {
            Administrador: "bg-[#282B59] text-white border-[#282B59]",
            Recepcionista: "bg-[#B7AEF2]/30 text-[#282B59] border-[#777CD9]",
            Mantenimiento: "bg-slate-100 text-slate-700 border-slate-200",
            Limpieza: "bg-slate-100 text-slate-700 border-slate-200"
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[rol] || styles.Mantenimiento}`}>
                {rol}
            </span>
        );
    };

    const getStatusBadge = (estado: UserStatus) => {
        const styles: Record<UserStatus, { label: string; dot: string; bg: string }> = {
            Disponible: { label: "Disponible", dot: "bg-emerald-500", bg: "bg-emerald-50 text-emerald-800 border-emerald-200" },
            Ocupado: { label: "Ocupado", dot: "bg-slate-400", bg: "bg-slate-50 text-slate-600 border-slate-200" }
        };
        const conf = styles[estado] || styles.Disponible;
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${conf.bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
                {conf.label}
            </span>
        );
    };

    useEffect(() => {
        if (editingUser) {
            setEditForm({
                rol: editingUser.rol as UserRole,
                email: editingUser.email || (editingUser as any).correo || "",
                estado: editingUser.estado as UserStatus,
            });
        }
    }, [editingUser]);

    // ─── FILTROS Y MÉTRICAS ────────────────────────────────────

    const filteredUsers = useMemo(() => {
        if (!usuarios) return [];
        return usuarios.filter((u) => {
            const q = query.toLowerCase().trim();
            const fullName = getFullName(u).toLowerCase();
            const email = (u.email || "").toLowerCase();
            const id = u.usuario_id?.toString() || "";

            const matchesQuery = !q || fullName.includes(q) || email.includes(q) || id.includes(q);
            const matchesRole = roleFilter === "todos" || u.rol === roleFilter;
            return matchesQuery && matchesRole;
        });
    }, [usuarios, query, roleFilter]);

    const activeUsersCount = useMemo(() => {
        return usuarios?.filter((u) => u.estado === "Disponible").length || 0;
    }, [usuarios]);

    // ─── ACCIONES ──────────────────────────────────────────────

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newUser: Usuario = {
            usuario_id: Date.now(),
            ...createForm,
            estado: "Disponible",
        };

        setIsSubmitting(true);

        try {
            await crearUsuario(newUser);
            await refetch();
            toast.success("Usuario creado exitosamente");
            setIsCreateOpen(false);
            setCreateForm({
                primer_nombre: "",
                segundo_nombre: "",
                primer_apellido: "",
                segundo_apellido: "",
                fecha_nacimiento: "",
                telefono: "",
                email: "",
                rol: "Recepcionista",
                password_hash: "",
            });
        } catch (error) {
            toast.error("Error al crear usuario");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenEdit = (usuario: Usuario) => {
        setEditingUser(usuario);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        setIsSubmitting(true);

        const payload: Usuario = {
            ...editingUser,
            ...editForm,
        };

        try {
            await updateUsuario(editingUser.usuario_id!, payload);
            await refetch();
            toast.success("Usuario actualizado correctamente");
            setEditingUser(null);
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            toast.error("Ocurrió un error al actualizar la información del usuario.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deletingUser) return;
        setIsSubmitting(true);
        try {
            // Ejemplo de llamado de eliminación si existe en tus funciones:
            // await eliminarUsuario(deletingUser.usuario_id!);
            await refetch();
            toast.success("Usuario eliminado correctamente");
            setDeletingUser(null);
        } catch (error) {
            toast.error("Error al eliminar el usuario.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 1. Estado de Carga Global
    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] gap-3">
                <div className="w-10 h-10 border-4 border-[#777CD9]/20 border-t-[#282B59] rounded-full animate-spin" />
                <p className="text-sm font-medium text-[#282B59]">Cargando directorio de usuarios...</p>
            </div>
        );
    }

    // 2. Manejo de Error
    if (error) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] gap-3 text-center p-6">
                <span className="material-symbols-outlined text-4xl text-rose-500">error</span>
                <h3 className="text-base font-bold text-[#282B59]">Error al cargar usuarios</h3>
                <p className="text-sm text-slate-500">{error.message || "No se pudo conectar con el servidor."}</p>
                <button
                    onClick={() => refetch()}
                    className="mt-2 px-4 py-2 bg-[#282B59] hover:bg-[#42468C] text-white text-xs font-semibold rounded-xl transition-colors"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <>
            <PageHeader
                name="Gestión de Usuarios"
                subtitle="Administra credenciales, roles, datos personales y accesos del personal"
                buttons={
                    <button
                        type="button"
                        onClick={() => setIsCreateOpen(true)}
                        className="hover:cursor-pointer hover:-translate-y-0.5 flex items-center justify-center gap-2 bg-[#282B59] hover:bg-[#42468C] text-white py-3.5 px-6 rounded-[2.5rem] text-[14px] leading-4 font-semibold tracking-wider transition-all active:scale-95 shadow-md hover:shadow-lg"
                    >
                        <span className="material-symbols-outlined text-[18px]">person_add</span> Nuevo Usuario
                    </button>
                }
            />

            <div className="flex-1 flex flex-col gap-6 w-full">
                {/* TARJETAS DE MÉTRICAS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between h-32">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Usuarios</span>
                            <div className="p-2 bg-[#282B59]/10 text-[#282B59] rounded-lg border border-[#282B59]/20">
                                <span className="material-symbols-outlined">badge</span>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-[#282B59]">{usuarios?.length || 0}</span>
                            <span className="text-xs text-slate-400">Registrados</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between h-32">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Usuarios Disponibles</span>
                            <div className="p-2 bg-[#777CD9]/15 text-[#42468C] rounded-lg border border-[#777CD9]/30">
                                <span className="material-symbols-outlined">verified_user</span>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-[#282B59]">{activeUsersCount}</span>
                            <span className="text-xs text-[#42468C] font-semibold">Acceso habilitado</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between h-32">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Próximos Cumpleaños</span>
                            <div className="p-2 bg-[#B7AEF2]/30 text-[#282B59] rounded-lg border border-[#777CD9]/40">
                                <span className="material-symbols-outlined">cake</span>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-[#282B59]">
                                {usuarios?.filter((u) => u.fecha_nacimiento?.startsWith("08") || u.fecha_nacimiento?.startsWith("11")).length || 0}
                            </span>
                            <span className="text-xs text-slate-400">Notificaciones este mes</span>
                        </div>
                    </div>
                </div>

                {/* CONTENEDOR DE TABLA / DIRECTORIO */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    {/* BARRA SUPERIOR DE BÚSQUEDA Y FILTROS */}
                    <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h3 className="text-base font-bold text-[#282B59]">Directorio de Personal</h3>

                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                            {/* Filtro por Rol */}
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full sm:w-auto py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#777CD9] focus:border-[#42468C]"
                            >
                                <option value="todos">Todos los roles</option>
                                <option value="Administrador">Administrador</option>
                                <option value="Recepcionista">Recepcionista</option>
                                <option value="Mantenimiento">Mantenimiento</option>
                                <option value="Limpieza">Limpieza</option>
                            </select>

                            {/* Búsqueda general */}
                            <div className="relative w-full sm:w-64">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#777CD9] focus:border-[#42468C] rounded-lg text-sm transition-colors"
                                    placeholder="Buscar por ID, nombre o correo..."
                                    type="text"
                                />
                            </div>
                        </div>
                    </div>

                    {/* TABLA DE USUARIOS */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#282B59]/5 border-b border-slate-200">
                                    <th className="text-xs font-bold text-[#282B59] py-3 px-6">ID</th>
                                    <th className="text-xs font-bold text-[#282B59] py-3 px-6">Usuario / Nombre</th>
                                    <th className="text-xs font-bold uppercase tracking-wider text-[#282B59] py-3 px-6 text-left">Rol</th>
                                    <th className="text-xs font-bold text-[#282B59] py-3 px-6">Contacto</th>
                                    <th className="text-xs font-bold text-[#282B59] py-3 px-6">Estado</th>
                                    <th className="text-xs font-bold text-[#282B59] py-3 px-6 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-800 divide-y divide-slate-100">
                                {filteredUsers.map((u) => {
                                    const fullName = getFullName(u);
                                    return (
                                        <tr key={u.usuario_id} className="hover:bg-[#B7AEF2]/10 transition-colors">
                                            <td className="py-3.5 px-6 font-mono text-xs text-slate-500">#{u.usuario_id}</td>

                                            <td className="py-3.5 px-6">
                                                <div className="font-medium text-[#282B59]">{fullName}</div>
                                                <div className="text-xs text-slate-400">Identificador único</div>
                                            </td>

                                            <td className="py-3.5 px-6 whitespace-nowrap">
                                                {u?.rol ? (
                                                    getRoleBadge(u.rol as UserRole)
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-400 border border-slate-200">
                                                        Sin rol
                                                    </span>
                                                )}
                                            </td>

                                            <td className="py-3.5 px-6 text-slate-600">
                                                <div className="text-sm font-medium">{u.email}</div>
                                                <div className="text-xs text-slate-400">{u.telefono ? `+504 ${u.telefono}` : "Sin teléfono"}</div>
                                            </td>

                                            <td className="py-3.5 px-6">{getStatusBadge(u?.estado)}</td>

                                            <td className="py-3.5 px-6 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenEdit(u)}
                                                        className="p-2 text-[#42468C] hover:text-[#282B59] hover:bg-[#B7AEF2]/30 rounded-lg transition-colors"
                                                        title="Modificar Rol / Email / Estado"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setDeletingUser(u)}
                                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                        title="Eliminar usuario"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-12 px-6 text-center text-sm text-slate-400">
                                            No se encontraron usuarios registrados que coincidan con la búsqueda.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-slate-200 bg-white flex justify-between items-center text-xs text-slate-500">
                        <span>Mostrando {filteredUsers.length} de {usuarios?.length || 0} usuarios</span>
                    </div>
                </div>
            </div>

            {/* ─── MODAL 1: CREAR USUARIO ──────────────────────────────── */}
            <Modal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Crear Nuevo Usuario">
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                    <div className="rounded-xl border border-[#777CD9]/30 bg-[#B7AEF2]/15 p-3 text-xs text-[#282B59]">
                        Completa la información personal y credenciales para dar de alta al nuevo usuario en la plataforma.
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <ValidatedInput
                            label="Primer Nombre *"
                            value={createForm.primer_nombre}
                            onChange={(v) => setCreateForm((p) => ({ ...p, primer_nombre: v }))}
                            placeholder="Ej. Carlos"
                            required
                        />
                        <ValidatedInput
                            label="Segundo Nombre"
                            value={createForm.segundo_nombre}
                            onChange={(v) => setCreateForm((p) => ({ ...p, segundo_nombre: v }))}
                            placeholder="Ej. Alberto"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <ValidatedInput
                            label="Primer Apellido *"
                            value={createForm.primer_apellido}
                            onChange={(v) => setCreateForm((p) => ({ ...p, primer_apellido: v }))}
                            placeholder="Ej. Martínez"
                            required
                        />
                        <ValidatedInput
                            label="Segundo Apellido"
                            value={createForm.segundo_apellido}
                            onChange={(v) => setCreateForm((p) => ({ ...p, segundo_apellido: v }))}
                            placeholder="Ej. Gómez"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-[#282B59] mb-1">Fecha Nacimiento *</label>
                            <input
                                type="date"
                                required
                                value={createForm.fecha_nacimiento}
                                onChange={(e) => setCreateForm((p) => ({ ...p, fecha_nacimiento: e.target.value }))}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#42468C] focus:ring-2 focus:ring-[#777CD9]/20"
                            />
                        </div>
                        <ValidatedInput
                            label="Teléfono"
                            value={createForm.telefono}
                            onChange={(v) => setCreateForm((p) => ({ ...p, telefono: v.replace(/\D/g, "").slice(0, 8) }))}
                            placeholder="Ej. 98765432"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <ValidatedInput
                            label="Correo Electrónico *"
                            type="email"
                            value={createForm.email}
                            onChange={(v) => setCreateForm((p) => ({ ...p, email: v }))}
                            placeholder="usuario@gmail.com"
                            required
                        />
                        <div>
                            <label className="block text-xs font-semibold text-[#282B59] mb-1">Rol Asignado *</label>
                            <select
                                value={createForm.rol}
                                onChange={(e) => setCreateForm((p) => ({ ...p, rol: e.target.value as UserRole }))}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#42468C] focus:ring-2 focus:ring-[#777CD9]/20 bg-white"
                            >
                                <option value="Recepcionista">Recepcionista</option>
                                <option value="Administrador">Administrador</option>
                                <option value="Mantenimiento">Mantenimiento</option>
                                <option value="Limpieza">Limpieza</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <ValidatedInput
                            label="Contraseña temporal *"
                            type="password"
                            value={createForm.password_hash}
                            onChange={(v) => setCreateForm((p) => ({ ...p, password_hash: v }))}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsCreateOpen(false)}>
                            Cancelar
                        </Button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 bg-[#282B59] hover:bg-[#42468C] disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                        >
                            {isSubmitting ? "Guardando..." : "Guardar Usuario"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ─── MODAL 2: EDITAR USUARIO ─────────────────── */}
            <Modal open={Boolean(editingUser)} onClose={() => setEditingUser(null)} title="Modificar Usuario">
                {editingUser && (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="rounded-xl border border-[#777CD9]/30 bg-[#B7AEF2]/15 p-3 text-xs text-[#282B59]">
                            Modificando permisos y credenciales de:{" "}
                            <strong className="text-[#282B59] font-bold">{getFullName(editingUser)}</strong>
                        </div>

                        <div>
                            <ValidatedInput
                                label="Correo Electrónico"
                                type="email"
                                value={editForm.email}
                                onChange={(v) => setEditForm((p) => ({ ...p, email: v }))}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-[#282B59] mb-1">Rol</label>
                                <select
                                    value={editForm.rol}
                                    onChange={(e) => setEditForm((p) => ({ ...p, rol: e.target.value as UserRole }))}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#42468C] focus:ring-2 focus:ring-[#777CD9]/20 bg-white"
                                >
                                    <option value="Administrador">Administrador</option>
                                    <option value="Recepcionista">Recepcionista</option>
                                    <option value="Limpieza">Limpieza</option>
                                    <option value="Mantenimiento">Mantenimiento</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#282B59] mb-1">Estado de la cuenta</label>
                                <select
                                    value={editForm.estado}
                                    onChange={(e) => setEditForm((p) => ({ ...p, estado: e.target.value as UserStatus }))}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#42468C] focus:ring-2 focus:ring-[#777CD9]/20 bg-white"
                                >
                                    <option value="Disponible">Disponible</option>
                                    <option value="Ocupado">Ocupado</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
                            <Button type="button" variant="secondary" onClick={() => setEditingUser(null)}>
                                Cancelar
                            </Button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-5 py-2.5 bg-[#282B59] hover:bg-[#42468C] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors shadow-sm flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                                        <span>Actualizando...</span>
                                    </>
                                ) : (
                                    "Actualizar Datos"
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* ─── MODAL 3: CONFIRMAR ELIMINACIÓN ──────────────────────── */}
            <Modal open={Boolean(deletingUser)} onClose={() => setDeletingUser(null)} title="Eliminar Usuario">
                {deletingUser && (
                    <div className="space-y-4">
                        <p className="text-sm text-slate-600">
                            ¿Estás seguro de que deseas eliminar al usuario <strong className="text-[#282B59]">{getFullName(deletingUser)}</strong>? Esta acción no se puede deshacer y revocará sus accesos de inmediato.
                        </p>
                        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
                            <Button type="button" variant="secondary" onClick={() => setDeletingUser(null)}>
                                Cancelar
                            </Button>
                            <button
                                type="button"
                                onClick={handleDeleteConfirm}
                                disabled={isSubmitting}
                                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                                        <span>Eliminando...</span>
                                    </>
                                ) : (
                                    "Eliminar Usuario"
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}