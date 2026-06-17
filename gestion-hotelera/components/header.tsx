import Image from "next/image";
import adminPhoto from "@/public/admin.jpg";
import Link from "next/link";

export default function Header() {
    return (
        <header className="sticky top-0 z-40 w-full bg-[#ffffff] border-b border-slate-300 card-shadow  shadow-sm flex justify-between items-center px-10 py-2">
            <div className="flex items-center gap-6">
                <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#76777d]">
                        <span className="material-symbols-outlined">search</span>
                    </span>
                    <input readOnly className="pl-10 pr-6 py-2 bg-[#f2f4f6] border-none rounded-full text-[14px] leading-5 font-normal font-['Hanken_Grotesk'] w-64 focus:ring-2 focus:ring-[#008cc7] transition-all" placeholder="Buscar en Base de Datos..." type="text" />
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                    <button className="p-2 text-[#515f74] hover:bg-[#f2f4f6] rounded-full transition-colors relative cursor-pointer flex items-center">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
                    </button>
                    <button className="p-2 text-[#515f74] hover:bg-[#f2f4f6] rounded-full transition-colors cursor-pointer flex items-center">
                        <span className="material-symbols-outlined">help_outline</span>
                    </button>
                    <Link href="/" className="p-2 text-[#515f74] hover:bg-[#f2f4f6] rounded-full transition-colors cursor-pointer flex items-center">
                        <span className="material-symbols-outlined">web</span>
                    </Link>
                </div>
                <div className="h-8 w-px bg-[#c6c6cd] mx-2"></div>
                <div className="flex items-center gap-4 cursor-pointer hover:bg-[#f2f4f6] p-1 rounded-xl transition-colors">
                    <Image height={34} width={34} alt="Administrator Profile" className="rounded-full object-cover" src={adminPhoto} />
                    <div className="hidden lg:block">
                        <p className="text-[14px] font-semibold font-['Hanken_Grotesk'] tracking-wider text-[#000000] leading-none">Admin Jefe</p>
                        <p className="text-[12px] leading-3.5 font-medium font-['Hanken_Grotesk'] text-[#515f74]">Hotel San Pedro</p>
                    </div>
                </div>
            </div>
        </header>
    )
}