"use client";

import { useMemo, useState, useEffect } from "react";
// removed ViewTransition import (not available in this React version)
import Link from "next/link";
import PageHeader from "@/components/pageheader";
import Modal from "@/components/Modal";
import { createHuesped, getHuespedes, Huesped } from "@/functions/huesped"
import { ValidatedInput } from "@/components/ui/validated-field";
import Button from "@/components/ui/button";


export default function ClientesPage() {
  const [huespedes, setHuespedes] = useState<Huesped[]>()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    email: "",
    dni: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const fetchHuespedes = async () => {
    const data = await getHuespedes();
    setHuespedes(data);
  };

  useEffect(() => {
    let isActive = true;

    const loadHuespedes = async () => {
      const data = await getHuespedes();
      if (isActive) {
        setHuespedes(data);
      }
    };

    void loadHuespedes();

    return () => {
      isActive = false;
    };
  }, []);

  const [query, setQuery] = useState("");

  const getFullName = (client: Huesped) => {
    return client.nombre?.trim() || `${client.nombres ?? ""} ${client.apellidos ?? ""}`.trim();
  };

  const getLoyaltyTier = (client: Huesped) => {
    const amount = Number(client.total_gastado ?? 0);
    if (amount > 10000) return "Platinum";
    if (amount > 5000) return "Gold";
    if (amount > 1000) return "Silver";
    return "Bronze";
  };

  const filtered = useMemo(() => {
    if (!huespedes?.length) return huespedes || [];
    const q = query.trim().toLowerCase();
    if (!q) return huespedes;

    return huespedes.filter((client) => {
      const fullName = getFullName(client).toLowerCase();
      const email = client.email?.toLowerCase() ?? "";
      const tier = getLoyaltyTier(client).toLowerCase();

      return (
        fullName.includes(q) ||
        email.includes(q) ||
        tier.includes(q)
      );
    });
  }, [query, huespedes]);

  const totalClients = huespedes?.length ?? 0;
  const inHouseCount = huespedes?.filter((c) => (c.estancias ?? 0) > 0).length ?? 0;
  const totalSpent = huespedes?.reduce((sum, c) => sum + (c.total_gastado ?? 0), 0) ?? 0;
  const totalEstancias = huespedes?.reduce((sum, c) => sum + (c.estancias ?? 0), 0) ?? 0;
  const avgStays = totalClients ? (totalEstancias / totalClients).toFixed(1) : "0";

  const validateGuestForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.nombres.trim() || formData.nombres.trim().length < 2 || formData.nombres.trim().length > 60) {
      nextErrors.nombres = "Ingresa un nombre válido de 2 a 60 caracteres.";
    }
    if (!formData.apellidos.trim() || formData.apellidos.trim().length < 2 || formData.apellidos.trim().length > 80) {
      nextErrors.apellidos = "Ingresa un apellido válido de 2 a 80 caracteres.";
    }
    const telefonoDigits = (formData.telefono || "").replace(/\D/g, "");

    if (!telefonoDigits) {
      nextErrors.telefono = "Ingresa un teléfono.";
    } else if (telefonoDigits.length !== 8) {
      nextErrors.telefono = "El teléfono debe tener 8 dígitos.";
    } else {
      delete nextErrors.telefono; // Limpia el error cuando la validación pasa correctamente
    }
    if (!formData.email.trim()) {
      nextErrors.email = "Ingresa un correo electrónico.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "El correo electrónico no es válido.";
    } else if (formData.email.trim().length > 120) {
      nextErrors.email = "El correo electrónico no puede superar 120 caracteres.";
    }
    if (!formData.dni.trim() || !/^([0-9]{13}|[0-9]{4}-[0-9]{4}-[0-9]{5})$/.test(formData.dni.trim())) {
      nextErrors.dni = "El documento debe tener formato válido (13 dígitos o 4-4-5).";
    }

    setFormErrors(nextErrors);
    setTouched({ nombres: true, apellidos: true, telefono: true, email: true, dni: true });
    return Object.keys(nextErrors).length === 0;
  };

  const validateGuestField = (field: string) => {
    const nextErrors: Record<string, string> = { ...formErrors };

    switch (field) {
      case "nombres":
        if (!formData.nombres.trim() || formData.nombres.trim().length < 2 || formData.nombres.trim().length > 60) {
          nextErrors.nombres = "Ingresa un nombre válido de 2 a 60 caracteres.";
        } else {
          delete nextErrors.nombres;
        }
        break;
      case "apellidos":
        if (!formData.apellidos.trim() || formData.apellidos.trim().length < 2 || formData.apellidos.trim().length > 80) {
          nextErrors.apellidos = "Ingresa un apellido válido de 2 a 80 caracteres.";
        } else {
          delete nextErrors.apellidos;
        }
        break;
      case "telefono": {
        const tel = formData.telefono?.trim() || "";
        // Limpia cualquier carácter que no sea número
        const digits = tel.replace(/\D/g, "");

        if (!tel || !/^[0-9]{8}$/.test(digits)) {
          nextErrors.telefono = "El teléfono debe tener exactamente 8 dígitos.";
        } else {
          delete nextErrors.telefono;
        }
        break;
      }
      case "email":
        if (!formData.email.trim()) {
          nextErrors.email = "Ingresa un correo electrónico.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          nextErrors.email = "El correo electrónico no es válido.";
        } else if (formData.email.trim().length > 120) {
          nextErrors.email = "El correo electrónico no puede superar 120 caracteres.";
        } else {
          delete nextErrors.email;
        }
        break;
      case "dni":
        if (!formData.dni.trim() || !/^([0-9]{13}|[0-9]{4}-[0-9]{4}-[0-9]{5})$/.test(formData.dni.trim())) {
          nextErrors.dni = "El documento debe tener formato válido (13 dígitos o 4-4-5).";
        } else {
          delete nextErrors.dni;
        }
        break;
    }

    setFormErrors(nextErrors);
    setTouched((prev) => ({ ...prev, [field]: true }));
    return !nextErrors[field];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateGuestForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      await createHuesped(formData);
      setSubmitMessage("Huésped creado correctamente.");
      setFormData({ nombres: "", apellidos: "", telefono: "", email: "", dni: "" });
      await fetchHuespedes();
      setIsFormOpen(false);
    } catch (error) {
      console.error(error);
      setSubmitMessage("No se pudo crear el huésped. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        name="Clientes"
        subtitle="Perfiles de huéspedes, historial y preferencias"
        buttons={
          <div className="flex gap-3">
            <Link
              href="/bd/clientes/nuevo"
              className="hover:cursor-pointer hover:-translate-y-0.5 flex items-center justify-center gap-2 bg-[#000000] text-[#ffffff] py-4 px-6 rounded-[2.5rem] text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider transition-transform active:scale-95 shadow-lg"
            >
              <span className="material-symbols-outlined text-[18px]">add</span> Nuevo Cliente
            </Link>
          </div>
        }
      />

      <div className="flex-1 flex flex-col gap-6 w-full">
        <Modal open={isFormOpen} onClose={() => setIsFormOpen(false)} title="Crear huésped">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-sm font-medium text-slate-700">Completa los datos para registrar un nuevo cliente en el sistema.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <ValidatedInput
                  label="Nombres"
                  value={formData.nombres}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, nombres: value }));
                    setFormErrors((prev) => ({ ...prev, nombres: "" }));
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, nombres: true }));
                    validateGuestField("nombres");
                  }}
                  onFocus={() => setTouched((prev) => ({ ...prev, nombres: true }))}
                  error={formErrors.nombres}
                  touched={touched.nombres || Boolean(formErrors.nombres)}
                  placeholder="Ej. Orlando"
                  required
                />
              </div>
              <div>
                <ValidatedInput
                  label="Apellidos"
                  value={formData.apellidos}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, apellidos: value }));
                    setFormErrors((prev) => ({ ...prev, apellidos: "" }));
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, apellidos: true }));
                    validateGuestField("apellidos");
                  }}
                  onFocus={() => setTouched((prev) => ({ ...prev, apellidos: true }))}
                  error={formErrors.apellidos}
                  touched={touched.apellidos || Boolean(formErrors.apellidos)}
                  placeholder="Ej. Mendoza"
                  required
                />
              </div>
              <div>
                <ValidatedInput
                  id="telefono"
                  type="tel"
                  label="Teléfono"
                  value={formData.telefono}
                  onChange={(value) => {
                    // 1. Sanitización en tiempo real: Solo permite números y un máximo de 8 dígitos
                    const cleanValue = value.replace(/\D/g, "").slice(0, 8);
                    setFormData((prev) => ({ ...prev, telefono: cleanValue }));
                    setFormErrors((prev) => ({ ...prev, telefono: "" }));
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, telefono: true }));
                    validateGuestField("telefono");
                  }}
                  onFocus={() => setTouched((prev) => ({ ...prev, telefono: true }))}
                  error={formErrors.telefono}
                  touched={touched.telefono || Boolean(formErrors.telefono)}
                  placeholder="96751977"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-[#777CD9] focus:ring-2 focus:ring-[#777CD9]/20"
                  required
                />
              </div>
              <div>
                <ValidatedInput
                  label="Correo"
                  type="email"
                  value={formData.email}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, email: value }));
                    setFormErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, email: true }));
                    validateGuestField("email");
                  }}
                  onFocus={() => setTouched((prev) => ({ ...prev, email: true }))}
                  error={formErrors.email}
                  touched={touched.email || Boolean(formErrors.email)}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
            </div>

            <div>
              <ValidatedInput
                label="DNI"
                value={formData.dni}
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, dni: value }));
                  setFormErrors((prev) => ({ ...prev, dni: "" }));
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, dni: true }));
                  validateGuestField("dni");
                }}
                onFocus={() => setTouched((prev) => ({ ...prev, dni: true }))}
                error={formErrors.dni}
                touched={touched.dni || Boolean(formErrors.dni)}
                placeholder="Número de identidad"
                required
              />
            </div>

            {submitMessage && (
              <div className={`rounded-lg border px-3 py-2 text-sm ${submitMessage.includes("correctamente") ? "border-sky-200 bg-sky-50 text-sky-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                {submitMessage}
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
              <Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} variant="primary">
                {isSubmitting ? "Guardando..." : "Guardar huésped"}
              </Button>
            </div>
          </form>
        </Modal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-slate-300 card-shadow p-6 flex flex-col justify-between h-35">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Clientes totales</span>
              <div className="p-2 bg-slate-50 rounded-lg text-slate-600 border border-slate-100">
                <span className="material-symbols-outlined">group</span>
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-950">{totalClients}</span>
              <span className="text-xs text-slate-400 ml-2">Registrados</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-300 card-shadow p-6 flex flex-col justify-between h-35">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">En estancia</span>
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700 border border-emerald-100">
                <span className="material-symbols-outlined">bed</span>
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-950">{inHouseCount}</span>
              <span className="text-xs text-emerald-600 font-medium ml-2">Ahora mismo</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-300 card-shadow p-6 flex flex-col justify-between h-35">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estancias promedio</span>
              <div className="p-2 bg-slate-50 rounded-lg text-slate-600 border border-slate-100">
                <span className="material-symbols-outlined">calendar_month</span>
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-950">{avgStays}</span>
              <span className="text-xs text-slate-400 ml-2">Por cliente</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-300 card-shadow p-6 flex flex-col justify-between h-35">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ingresos totales</span>
              <div className="p-2 bg-blue-50 rounded-lg text-[#008cc7] border border-blue-100">
                <span className="material-symbols-outlined">payments</span>
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-950">{totalSpent?.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}</span>
              <span className="text-xs text-slate-400 ml-2">Histórico</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-300 card-shadow overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-300 card-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="text-base font-bold text-slate-950">Directorio de clientes</h3>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 card-shadow focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent rounded-lg text-sm transition-colors"
                  placeholder="Buscar cliente, correo o nivel..."
                  type="text"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-300 card-shadow">
                  <th className="text-xs font-bold text-slate-500 py-3 px-6">Cliente</th>
                  <th className="text-xs font-bold text-slate-500 py-3 px-6">Contacto</th>
                  <th className="text-xs font-bold text-slate-500 py-3 px-6">Nivel</th>
                  <th className="text-xs font-bold text-slate-500 py-3 px-6 text-right">Estancias</th>
                  <th className="text-xs font-bold text-slate-500 py-3 px-6 text-right">Total gastado</th>
                  <th className="text-xs font-bold text-slate-500 py-3 px-6 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="text-slate-800 divide-y divide-slate-100">
                {filtered.map((client) => {
                  const fullName = getFullName(client) || "Cliente sin nombre";
                  return (
                    <tr key={client.huesped_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="font-medium text-slate-900">{fullName}</div>
                        <div className="text-xs text-slate-400">
                          Última visita: —
                        </div>
                      </td>
                      <td className="py-3.5 px-6 text-slate-500">
                        <div>{client.email}</div>
                        <div className="text-xs">{client.telefono}</div>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          <span className="material-symbols-outlined text-[14px]">star</span>
                          {getLoyaltyTier(client)}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right font-semibold">{client.estancias ?? 0}</td>
                      <td className="py-3.5 px-6 text-right font-bold text-slate-900">{(client.total_gastado ?? 0).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}</td>

                      <td className="py-3.5 px-6 text-right">
                        <Link href={`/bd/clientes/${client.huesped_id}`} className="text-sm text-[#008cc7] hover:underline font-semibold">
                          Ver perfil
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 px-6 text-center text-sm text-slate-400">
                      {huespedes?.length === 0 ? "No hay clientes registrados." : `No se encontraron clientes que coincidan con "${query}".`}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-300 card-shadow bg-white flex justify-between items-center text-xs text-slate-500">
            <span>Mostrando {filtered.length} de {totalClients} clientes</span>
          </div>
        </div>
      </div>
    </>
  );
}
