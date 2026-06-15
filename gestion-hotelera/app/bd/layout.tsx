"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const navLinks = [
    { name: "Dashboard", href: "/bd", icon: "dashboard", buttons: [], subtitle: "Visión general de operaciones" },
    { name: "Reservaciones", href: "/bd/reservaciones", icon: "calendar_month", buttons: [], subtitle: "Gestión de reservas y disponibilidad" },
    { name: "Inventario", href: "/bd/inventario", icon: "inventory_2", buttons: [], subtitle: "Gestión de inventario" },
    { name: "Mantenimiento", href: "/bd/mantenimiento", icon: "build", buttons: [], subtitle: "Gestión de mantenimiento" },
    { name: "Facturación", href: "/bd/facturacion", icon: "payments", buttons: [], subtitle: "Gestión de facturación" },
  ];

  const isActive = (path: string) => pathname === path;

  return(
    <div className="bg-[#f7f9fb] text-[#191c1e]">
      <aside className="fixed left-0 top-0 h-full w-[280px] z-50 bg-[#ffffff] border-r border-[#c6c6cd] flex flex-col p-[24px] gap-[8px]">
        <div className="mb-[32px] px-[8px]">
          <div className="flex flex-col gap-[8px]">
            <Image width={12} src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnL5hYJYgjTHnIve3F4ZivqaryjoLZoZ3SeeRU_BbPDJAbV2ZNTLzghr56yhMOz4mvai9V7F5GmneKOKkpsT_dPil4lN0XM0j780TJJTxX701jXjW9JhG2Asa0UxNC8R2k8stHmDVWMxNdaSUZG3zBPHiF9YHXq3REqd8lGUcR_-mNMOgm9VvHtO3mUe426J9iS7AkdxZy8NRQjeYDqIpgKjz7GDk3WS4hsBjCQMkDdBFxo7lplApb73xETcRg0RhneeCOte9D2XNc" alt="Hotel San Pedro Logo" height={12} className="h-12 w-auto object-contain self-start" />
            <div className="mt-[8px]">
              <h1 className="text-[20px] leading-[28px] font-semibold font-['Manrope'] font-bold text-[#000000]">Hotel San Pedro</h1>
              <p className="text-[12px] leading-[14px] font-medium font-['Hanken_Grotesk'] text-[#515f74] uppercase tracking-wider">Hospitalidad &amp; Comodidad</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col gap-[4px] text-[#515f74]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              className={`${isActive(link.href) ? 'text-[#008cc7] bg-[#001e2f]' : ''} flex items-center gap-[16px] p-[16px]  hover:bg-[#eceef0] transition-all rounded-[0.5rem] text-[14px] leading-[16px] font-semibold font-['Hanken_Grotesk'] tracking-[0.05em] `}
              href={link.href}
            >
              <span className="material-symbols-outlined">{link.icon}</span> {link.name}
            </Link>
          ))}
        </nav>
        <button className=" fixed right-4 bottom-4 flex items-center justify-center gap-[8px] bg-[#000000] text-[#ffffff] py-[16px] px-[24px] rounded-[2.5rem] text-[14px] leading-[16px] font-semibold font-['Hanken_Grotesk'] tracking-[0.05em] transition-transform active:scale-95 shadow-lg">
          <span className="material-symbols-outlined">add_circle</span>
          New Reservation
        </button>
        <div className="mt-auto border-t border-[#c6c6cd] pt-[24px] flex flex-col gap-[4px]">
          <a className="flex items-center gap-[16px] p-[16px] text-[#515f74] hover:bg-[#eceef0] transition-all rounded-[0.5rem] text-[14px] leading-[16px] font-semibold font-['Hanken_Grotesk'] tracking-[0.05em]" href="#">
            <span className="material-symbols-outlined">settings</span> Settings
          </a>
          <Link href={'/'} className="flex items-center gap-[16px] p-[16px] text-[#515f74] hover:bg-[#eceef0] transition-all rounded-[0.5rem] text-[14px] leading-[16px] font-semibold font-['Hanken_Grotesk'] tracking-[0.05em]">
            <span className="material-symbols-outlined">logout</span> Logout
          </Link>
        </div>
      </aside>
      <main className="ml-[280px] min-h-screen flex flex-col">
        <Header />
        <section className="p-[40px] py-[32px] flex flex-col gap-[32px]">
          {children}
        </section>
        <Footer />
      </main>
    </div>
  );
}
