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
  const [isCollapsed, setIsCollapsed] = useState(false); // Estado para controlar el colapso

  const reportSublinks = [
    { name: "Clientes Frecuentes", href: "/bd/reportes/clientes-frecuentes", icon: "notes" },
    { name: "Reservaciones Diarias", href: "/bd/reportes/reservaciones-diarias", icon: "notes" },
    { name: "Estado de Habitaciones", href: "/bd/reportes/estado-habitaciones", icon: "notes" },
    { name: "Limpieza y Mantenimiento", href: "/bd/reportes/limpieza-mantenimiento", icon: "notes" },
    { name: "Ocupacion Mensual", href: "/bd/reportes/ocupacion-mensual", icon: "bar_chart_4_bars" },
    { name: "Ingresos por Habitacion", href: "/bd/reportes/ingresos-habitacion", icon: "bar_chart_4_bars" },
    { name: "Consumo de Amenidades", href: "/bd/reportes/consumo-amenidades", icon: "bar_chart_4_bars" },
  ];

  const navLinks = [
    { name: "Panel", href: "/bd", icon: "dashboard", subtitle: "Visión general de operaciones" },
    { name: "Habitaciones", href: "/bd/habitaciones", icon: "bed", subtitle: "Estado y historial de habitaciones" },
    { name: "Reservaciones", href: "/bd/reservaciones", icon: "calendar_month", subtitle: "Gestión de reservas y disponibilidad" },
    { name: "Clientes", href: "/bd/clientes", icon: "group", subtitle: "Perfiles de huéspedes, historial y preferencias" },
    { name: "Inventario", href: "/bd/inventario", icon: "inventory_2", subtitle: "Gestión de inventario" },
    { name: "Mantenimiento", href: "/bd/mantenimiento", icon: "build", subtitle: "Gestión de mantenimiento" },
    { name: "Reportes", href: "/bd/reportes", icon: "bar_chart", subtitle: "Análisis y reportes de desempeño", isDropdown: true },
  ];

  const isActive = (path: string) => {
    if (path === "/bd") return pathname === "/bd";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setReportesOpen(false); // Cierra reportes si se repliega para evitar bugs visuales
    }
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen">
      
      {/* SIDE NAVIGATION BAR */}
      <aside 
        className={`fixed left-0 top-0 h-full z-50 bg-[#ffffff] border-r border-slate-300 card-shadow flex flex-col p-3 gap-2 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-70"
        }`}
      >
        {/* Botón flotante para replegar/desplegar */}
        <button
          onClick={handleToggleCollapse}
          className="absolute top-5 -right-3 bg-white border border-slate-300 rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-slate-50 cursor-pointer z-50 transition-transform duration-200"
          title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
        >
          <span className="material-symbols-outlined text-[16px] text-slate-600">
            {isCollapsed ? "chevron_right" : "chevron_left"}
          </span>
        </button>

        {/* LOGO SECCIÓN */}
        <div className="mb-8 transition-all duration-300">
          <div className="flex flex-col items-center">
            <Image width={86} height={100} alt="Hotel San Pedro Logo" className="h-12 drop-shadow-lg object-contain" src={logo} />
            {!isCollapsed && (
              <div className="mt-2 text-center animate-fadeIn whitespace-nowrap">
                <h1 className="text-[20px] leading-7 font-['Hanken_Grotesk'] font-bold text-[#000000]">Hotel San Pedro</h1>
                <p className="text-[12px] leading-3.5 font-medium font-['Hanken_Grotesk'] text-[#515f74] uppercase tracking-wider">Hospitalidad &amp; Comodidad</p>
              </div>
            )}
          </div>
        </div>

        {/* ENLACES DE NAVEGACIÓN */}
        <nav className="flex-1 flex flex-col gap-1 text-[#515f74]">
          {navLinks.map((link) => (
            <div key={link.href}>
              {link.isDropdown ? (
                <div>
                  <button
                    onClick={() => !isCollapsed && setReportesOpen(!reportesOpen)}
                    className={`${
                      (reportesOpen || isActive(link.href)) ? 'border-l-4 border-[#008cc7] text-[#008cc7]' : ''
                    } hover:cursor-pointer w-full flex items-center justify-between p-2 hover:bg-[#eceef0] transition-all ease-linear duration-100 text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider ${
                      isCollapsed ? "justify-center border-none px-0" : "gap-4"
                    }`}
                    title={isCollapsed ? link.name : undefined}
                  >
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined shrink-0">{link.icon}</span> 
                      {!isCollapsed && <span className="animate-fadeIn">{link.name}</span>}
                    </div>
                    {!isCollapsed && (
                      <span className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${reportesOpen ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    )}
                  </button>
                  
                  {reportesOpen && !isCollapsed && (
                    <div className="flex flex-col gap-1 mt-1 pl-2 border-l-2 border-[#008cc7]/30 ml-1.5 animate-fadeIn">
                      {reportSublinks.map((sublink) => (
                        <Link
                          key={sublink.href}
                          href={sublink.href}
                          className={`${
                            (isActive(sublink.href)) ? 'bg-[#008cc7]/10 text-[#008cc7] font-semibold' : ''
                          } flex items-center gap-3 px-3 py-2 hover:bg-[#eceef0] transition-all ease-linear duration-100 text-[13px] leading-4 font-medium font-['Hanken_Grotesk']`}
                          transitionTypes={['nav-forward']}
                        >
                          <span className="material-symbols-outlined text-[18px] shrink-0">{sublink.icon}</span>
                          <span>{sublink.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  className={`${isActive(link.href) ? 'border-l-4 border-[#008cc7] text-[#008cc7]' : ''} flex items-center p-2 hover:bg-[#eceef0] transition-all ease-linear duration-100 text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider ${
                    isCollapsed ? "justify-center border-none px-0" : "gap-4"
                  }`}
                  href={link.href}
                  transitionTypes={['nav-forward']}
                  title={isCollapsed ? link.name : undefined}
                >
                  <span className="material-symbols-outlined shrink-0">{link.icon}</span> 
                  {!isCollapsed && <span className="animate-fadeIn">{link.name}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* AJUSTES Y LOGOUT */}
        <div className="mt-auto border-t border-slate-300 card-shadow pt-6 flex flex-col gap-1">
          <a 
            className={`flex items-center p-4 text-[#515f74] hover:bg-[#eceef0] transition-all rounded-xl text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider ${
              isCollapsed ? "justify-center px-0 rounded-lg" : "gap-4"
            }`} 
            href="#"
            title={isCollapsed ? "Ajustes" : undefined}
          >
            <span className="material-symbols-outlined shrink-0">settings</span> 
            {!isCollapsed && <span className="animate-fadeIn">Ajustes</span>}
          </a>
          <Link 
            href={'/'} 
            className={`flex items-center p-4 text-[#515f74] hover:bg-[#eceef0] transition-all rounded-xl text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider ${
              isCollapsed ? "justify-center px-0 rounded-lg" : "gap-4"
            }`}
            title={isCollapsed ? "Cerrar sesión" : undefined}
          >
            <span className="material-symbols-outlined shrink-0">logout</span> 
            {!isCollapsed && <span className="animate-fadeIn">Cerrar sesión</span>}
          </Link>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main 
        className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? "ml-20" : "ml-70"
        }`}
      >
        <Header />
        <section className="p-10 py-8 flex flex-col gap-8 flex-1">
          {children}
        </section>
        <Footer />
      </main>
    </div>
  );
}