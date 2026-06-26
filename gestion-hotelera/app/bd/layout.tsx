"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Image from "next/image";
import logo from "@/public/logo.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [reportesOpen, setReportesOpen] = useState(false);

  const reportSublinks = [
    { name: "Clientes Frecuentes", href: "/bd/reportes/clientes-frecuentes" },
    { name: "Reservaciones Diarias", href: "/bd/reportes/reservaciones-diarias" },
    { name: "Estado de Habitaciones", href: "/bd/reportes/estado-habitaciones" },
    { name: "Limpieza y Mantenimiento", href: "/bd/reportes/limpieza-mantenimiento" },
    { name: "Historial de Pagos", href: "/bd/reportes/historial-pago" },
    { name: "Consumo de Inventario", href: "/bd/reportes/consumo-inventario" },
    { name: "Ocupacion Mensual", href: "/bd/reportes/ocupacion-mensual" },
    { name: "Ingresos por Habitacion", href: "/bd/reportes/ingresos-habitacion" },
    { name: "Consumo de Amenidades", href: "/bd/reportes/consumo-amenidades" },
  ];

  const navLinks = [
    { name: "Panel", href: "/bd", icon: "dashboard", subtitle: "Visión general de operaciones" },
    { name: "Habitaciones", href: "/bd/habitaciones", icon: "bed", subtitle: "Estado y historial de habitaciones" },
    { name: "Reservaciones", href: "/bd/reservaciones", icon: "calendar_month", subtitle: "Gestión de reservas y disponibilidad" },
    { name: "Clientes", href: "/bd/clientes", icon: "group", subtitle: "Perfiles de huéspedes, historial y preferencias" },
    { name: "Inventario", href: "/bd/inventario", icon: "inventory_2", subtitle: "Gestión de inventario" },
    { name: "Mantenimiento", href: "/bd/mantenimiento", icon: "build", subtitle: "Gestión de mantenimiento" },
    // { name: "Facturación", href: "/bd/facturacion", icon: "payments", subtitle: "Gestión de facturación" },
    { name: "Reportes", href: "/bd/reportes", icon: "bar_chart", subtitle: "Análisis y reportes de desempeño", isDropdown: true },
  ];

  const isActive = (path: string) => {
  if (path === "/bd") return pathname === "/bd";
  return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e]">
      <aside className="fixed left-0 top-0 h-full w-70 z-50 bg-[#ffffff] border-r border-slate-300 card-shadow flex flex-col p-3 gap-2 overflow-y-auto">
        <div className="mb-8 px-2">
          <div className="flex flex-col items-center">
            <Image width={86} height={100} alt="Hotel San Pedro Logo" className="h-12 drop-shadow-lg" src={logo} />
            <div className="mt-2 text-center">
              <h1 className="text-[20px] leading-7 font-['Hanken_Grotesk'] font-bold text-[#000000]">Hotel San Pedro</h1>
              <p className="text-[12px] leading-3.5 font-medium font-['Hanken_Grotesk'] text-[#515f74] uppercase tracking-wider">Hospitalidad &amp; Comodidad</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1 text-[#515f74]">
          {navLinks.map((link) => (
            <div key={link.href}>
              {link.isDropdown ? (
                <div>
                  <button
                    onClick={() => setReportesOpen(!reportesOpen)}
                    className={`${
                      reportesOpen || isActive(link.href) ? 'border-l-4 border-[#008cc7] text-[#008cc7]' : ''
                    } hover:cursor-pointer w-full flex items-center justify-between gap-4 p-2 hover:bg-[#eceef0] transition-all ease-linear duration-100 text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined">{link.icon}</span> {link.name}
                    </div>
                    <span className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${reportesOpen ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  
                  {reportesOpen && (
                    <div className="flex flex-col gap-1 mt-1 pl-2 border-l-2 border-[#008cc7]/30 ml-1.5">
                      {reportSublinks.map((sublink) => (
                        <Link
                          key={sublink.href}
                          href={sublink.href}
                          className={`${
                            (isActive(sublink.href)) ? 'bg-[#008cc7]/10 text-[#008cc7] font-semibold' : ''
                          } flex items-center gap-3 px-3 py-2 hover:bg-[#eceef0] transition-all ease-linear duration-100 text-[13px] leading-4 font-medium font-['Hanken_Grotesk']`}
                          transitionTypes={['nav-forward']}
                        >
                          <span className="material-symbols-outlined text-[18px]">description</span>
                          {sublink.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  className={`${isActive(link.href) ? 'border-l-4 border-[#008cc7] text-[#008cc7]' : ''} flex items-center gap-4 p-2 hover:bg-[#eceef0] transition-all ease-linear duration-100 text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider`}
                  href={link.href}
                  transitionTypes={['nav-forward']}
                >
                  <span className="material-symbols-outlined">{link.icon}</span> {link.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="mt-auto border-t border-slate-300 card-shadow pt-6 flex flex-col gap-1">
          <a className="flex items-center gap-4 p-4 text-[#515f74] hover:bg-[#eceef0] transition-all rounded-xl text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider" href="#">
            <span className="material-symbols-outlined">settings</span> Ajustes
          </a>
          <Link href={'/'} className="flex items-center gap-4 p-4 text-[#515f74] hover:bg-[#eceef0] transition-all rounded-xl text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider">
            <span className="material-symbols-outlined">logout</span> Cerrar sesión
          </Link>
        </div>
      </aside>

      <main className="ml-70 min-h-screen flex flex-col">
        <Header />
        <section className="p-10 py-8 flex flex-col gap-8">
          {children}
        </section>
        <Footer />
      </main>
    </div>
  );
}