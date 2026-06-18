"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Image from "next/image";
import logo from "@/public/logo.png";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const navLinks = [
    { name: "Panel", href: "/bd", icon: "dashboard", buttons: [], subtitle: "Visión general de operaciones" },
        { name: "Habitaciones", href: "/bd/habitaciones", icon: "bed", buttons: [], subtitle: "Estado y historial de habitaciones" },

    { name: "Reservaciones", href: "/bd/reservaciones", icon: "calendar_month", buttons: [], subtitle: "Gestión de reservas y disponibilidad" },
    { name: "Clientes", href: "/bd/clientes", icon: "group", buttons: [], subtitle: "Perfiles de huéspedes, historial y preferencias" },
    { name: "Inventario", href: "/bd/inventario", icon: "inventory_2", buttons: [], subtitle: "Gestión de inventario" },
    { name: "Mantenimiento", href: "/bd/mantenimiento", icon: "build", buttons: [], subtitle: "Gestión de mantenimiento" },
    { name: "Facturación", href: "/bd/facturacion", icon: "payments", buttons: [], subtitle: "Gestión de facturación" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e]">
      <aside className="fixed left-0 top-0 h-full w-70 z-50 bg-[#ffffff] border-r border-slate-300 card-shadow  flex flex-col p-6 gap-2">
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
            <Link
              key={link.href}
              className={`${isActive(link.href) ? 'border-l-4 border-[#008cc7] text-[#008cc7]' : ''} flex items-center gap-4 p-4  hover:bg-[#eceef0] transition-all ease-linear duration-100 rounded-r-xl text-[14px] leading-4 font-semibold font-['Hanken_Grotesk'] tracking-wider `}
              href={link.href}
              transitionTypes={['nav-forward']}
            >
              <span className="material-symbols-outlined">{link.icon}</span> {link.name}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-slate-300 card-shadow  pt-6 flex flex-col gap-1">
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
