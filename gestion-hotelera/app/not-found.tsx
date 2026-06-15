import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background text-primary">
            <h1 className="text-[48px] leading-[56px] font-bold text-[#000000]">404</h1>
            <p className="text-[16px] leading-[24px] font-normal text-[#515f74]">Lo sentimos, la página que buscas no existe.</p>
            <Link href="/" className="flex items-center gap-2 bg-[#008cc7] text-white px-4 py-2 rounded transition-transform active:scale-95">
                <span className="material-symbols-outlined">arrow_back</span> Volver al Inicio
            </Link>
        </div>
    );
}