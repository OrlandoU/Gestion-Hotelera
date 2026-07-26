import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background text-primary">
            <h1 className="text-[48px] leading-14 font-bold text-[#000000]">404</h1>
            <p className="text-[16px] leading-6 font-normal text-[#515f74]">Lo sentimos, la página que buscas no existe.</p>
            <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-[2.5rem] bg-slate-950 px-5 py-3 text-[14px] font-semibold leading-4 tracking-wider text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-800 active:scale-95">
                <span className="material-symbols-outlined">arrow_back</span> Volver al Inicio
            </Link>
        </div>
    );
}