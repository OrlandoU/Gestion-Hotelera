"use client";

import { useMemo, useState } from "react";
import { ViewTransition } from "react";
import Link from "next/link";
import PageHeader from "@/components/pageheader";
import { CLIENTS_LIST } from "@/data/clients";

const STATUS_CONFIG: Record<string, { label: string; badge: string; dot: string }> = {
  Active: { label: "Activo", badge: "bg-blue-100 text-blue-800 border-blue-300", dot: "bg-blue-500" },
  InHouse: { label: "En estancia", badge: "bg-emerald-100 text-emerald-800 border-emerald-300", dot: "bg-emerald-500" },
  Inactive: { label: "Inactivo", badge: "bg-slate-100 text-slate-800 border-slate-300", dot: "bg-slate-400" },
};

export default function ClientesPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CLIENTS_LIST;
    return CLIENTS_LIST.filter((client) =>
      client.name.toLowerCase().includes(q) ||
      client.email.toLowerCase().includes(q) ||
      client.loyaltyTier.toLowerCase().includes(q)
    );
  }, [query]);

  const totalClients = CLIENTS_LIST.length;
  const inHouseCount = CLIENTS_LIST.filter((c) => c.status === "InHouse").length;
  const totalSpent = CLIENTS_LIST.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgStays = totalClients
    ? (CLIENTS_LIST.reduce((sum, c) => sum + c.totalStays, 0) / totalClients).toFixed(1)
    : "0";

  return (
    <ViewTransition enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}>
      <PageHeader
        name="Clientes"
        subtitle="Perfiles de huéspedes, historial y preferencias"
        buttons={
          <button className="hover:cursor-pointer hover:-translate-y-0.5 right-4 bottom-4 flex items-center justify-center gap-2 bg-[#000000] text-[#ffffff] py-4 px-6 rounded-[2.5rem] text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider transition-transform active:scale-95 shadow-lg">
            <span className="material-symbols-outlined text-[18px]">person_add</span> Nuevo Cliente
          </button>
        }
      />

      <div className="flex-1 flex flex-col gap-6 max-w-360 mx-auto w-full">
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
              <span className="text-2xl font-bold text-slate-950">${totalSpent.toLocaleString()}</span>
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
                  <th className="text-xs font-bold text-slate-500 py-3 px-6">Estado</th>
                  <th className="text-xs font-bold text-slate-500 py-3 px-6 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="text-slate-800 divide-y divide-slate-100">
                {filtered.map((client) => {
                  const cfg = STATUS_CONFIG[client.status] || STATUS_CONFIG.Inactive;
                  console.log(client)
                  return (
                    <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="font-medium text-slate-900">{client.name}</div>
                        <div className="text-xs text-slate-400">
                          Última visita: {client.lastVisit}
                        </div>
                      </td>
                      <td className="py-3.5 px-6 text-slate-500">
                        <div>{client.email}</div>
                        <div className="text-xs">{client.phone}</div>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          <span className="material-symbols-outlined text-[14px]">star</span>
                          {client.loyaltyTier}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right font-semibold">{client.totalStays}</td>
                      <td className="py-3.5 px-6 text-right font-bold text-slate-900">${client.totalSpent.toLocaleString()}</td>
                      <td className="py-3.5 px-6">
                        <span className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-medium border ${cfg.badge}`}>
                          <span className={`w-2 h-2 rounded-full ${cfg.dot}`}></span>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <Link href={`/bd/clientes/${client.id}`} className="text-sm text-[#008cc7] hover:underline font-semibold">
                          Ver perfil
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 px-6 text-center text-sm text-slate-400">
                      No se encontraron clientes que coincidan con &quot;{query}&quot;.
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
    </ViewTransition>
  );
}
