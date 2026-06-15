import Image from "next/image";

export default function Header() {
    return (
        <header className="sticky top-0 z-40 w-full bg-[#ffffff] border-b border-[#c6c6cd] shadow-sm flex justify-between items-center px-[40px] py-[8px]">
            <div className="flex items-center gap-[24px]">
                <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#76777d]">
                        <span className="material-symbols-outlined">search</span>
                    </span>
                    <input readOnly className="pl-10 pr-[24px] py-[8px] bg-[#f2f4f6] border-none rounded-full text-[14px] leading-[20px] font-normal font-['Hanken_Grotesk'] w-64 focus:ring-2 focus:ring-[#008cc7] transition-all" placeholder="Buscar facturas..." type="text" />
                </div>
            </div>
            <div className="flex items-center gap-[24px]">
                <div className="flex items-center gap-[16px]">
                    <button className="p-[8px] text-[#515f74] hover:bg-[#f2f4f6] rounded-full transition-colors relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
                    </button>
                    <button className="p-[8px] text-[#515f74] hover:bg-[#f2f4f6] rounded-full transition-colors">
                        <span className="material-symbols-outlined">help_outline</span>
                    </button>
                </div>
                <div className="h-8 w-px bg-[#c6c6cd] mx-[8px]"></div>
                <div className="flex items-center gap-[16px] cursor-pointer hover:bg-[#f2f4f6] p-[4px] rounded-[0.5rem] transition-colors">
                    <Image height={24} width={24} alt="Administrator Profile" className="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3a-Lgnuw0PEUn8ng-XVmANQUqbowp8Jmz9A-0TSVoGU3HWcaWNezK-Gw959Z24ir5CNK0yycCz2EU7cGverB3amz67xCEYepj884Bbzda-HCFLYqVTcPlFb83QE-Yn3IzcLImzjmUIpzHazRpXuLC90ru7sy9WYG18oY7Sg3Pgzu6Oz8kXgbk3KOcwhydgSDvqvW2DUb8NKlM_I6u5wHdp940OovW6Yg90gEVdxMImV4BQIuMA9OykkBhRqAXNOLjvUZxn0Gu7NV3" />
                    <div className="hidden lg:block">
                        <p className="text-[14px] leading-[16px] font-semibold font-['Hanken_Grotesk'] tracking-[0.05em] text-[#000000] leading-none">Admin Jefe</p>
                        <p className="text-[12px] leading-[14px] font-medium font-['Hanken_Grotesk'] text-[#515f74]">Hotel San Pedro</p>
                    </div>
                </div>
            </div>
        </header>
    )
}