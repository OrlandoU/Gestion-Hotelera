export default function Footer() {
    return (<footer className="mt-auto px-10 py-6 border-t border-slate-300 card-shadow  flex justify-between items-center text-[12px] leading-3.5 font-medium font-['Hanken_Grotesk'] text-[#515f74]">
        <p className="">© 2024 Hotel San Pedro Management System. Todos los derechos reservados.</p>
        <div className="flex gap-6">
            <a className="hover:text-[#000000] transition-colors" href="#">Soporte Técnico</a>
            <a className="hover:text-[#000000] transition-colors" href="#">Privacidad</a>
        </div>
    </footer>);
}