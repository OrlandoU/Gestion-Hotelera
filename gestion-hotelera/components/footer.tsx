export default function Footer() {
    return (<footer className="mt-auto px-[40px] py-[24px] border-t border-[#c6c6cd] flex justify-between items-center text-[12px] leading-[14px] font-medium font-['Hanken_Grotesk'] text-[#515f74]">
        <p className="">© 2024 Hotel San Pedro Management System. Todos los derechos reservados.</p>
        <div className="flex gap-[24px]">
            <a className="hover:text-[#000000] transition-colors" href="#">Soporte Técnico</a>
            <a className="hover:text-[#000000] transition-colors" href="#">Privacidad</a>
        </div>
    </footer>);
}