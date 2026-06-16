"use client";

import img1 from '@/public/img1.jpg';
import img3 from '@/public/img3.jpg';
import img4 from '@/public/img4.jpg';
import logo from '@/public/logo.png';
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // 1. Control de scroll clásico optimizado
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const heroImg = document.querySelector('.hero-parallax') as HTMLImageElement | null;
      if (heroImg) {
        heroImg.style.transform = `translateY(${scrolled * 0.35}px) scale(1.05)`;
      }
      setIsScrolled(scrolled > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 2. Intersection Observer para revelar secciones al hacer scroll de forma limpia
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.12,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
        }
      });
    }, observerOptions);

    const targets = document.querySelectorAll("section[id], div.reveal-on-scroll");
    targets.forEach((target) => observer.observe(target));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      targets.forEach((target) => observer.unobserve(target));
    };
  }, []);

  return (
    <div className="bg-[#ffffff] text-[#0f172a] font-['Hanken_Grotesk'] overflow-x-hidden selection:bg-blue-100 selection:text-[#0f172a] scroll-smooth">
      
      {/* Estilos embebidos rápidos para la curva fluida personalizada y animaciones de entrada sin flashes */}
      <style jsx global>{`
        .cubic-fluid {
          transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes customFadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroReveal {
          from { transform: scale(1.15); filter: brightness(0.4); }
          to { transform: scale(1.05); filter: brightness(0.75); }
        }
        .animate-fade-up {
          animation: customFadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .animate-hero-img {
          animation: heroReveal 2s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>

      {/* HEADER */}
      <header className={`fixed p-1 sm:p-2 md:p-4 top-0 w-full z-50 flex items-center transition-all duration-500 cubic-fluid `}>
        <div className={`w-full transition-all duration-300 ease-linear rounded-lg  py-1 sm:py-2 md:py-4 px-4 sm:px-8 md:px-16 flex justify-between items-center text-white ${
        isScrolled ? 'bg-[#0f172a]/40 backdrop-blur-md h-20 shadow-xl ' : 'bg-transparent'
      }`}>
          <div className="h-10 transition-transform duration-500 cubic-fluid hover:scale-105">
            <Image width={86} height={100} alt="Hotel San Pedro" className="h-full invert brightness-0" src={logo} />
          </div>
          <nav className="hidden md:flex items-center gap-16 text-xs font-['Hanken_Grotesk'] uppercase tracking-[0.2em]">
            <a className="hover:text-blue-200 transition-colors duration-300 relative group py-2" href="#about">
              Historia
              <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
            </a>
            <a className="hover:text-blue-200 transition-colors duration-300 relative group py-2" href="#mission">
              Filosofía
              <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
            </a>
            <a className="hover:text-blue-200 transition-colors duration-300 relative group py-2" href="#contact">
              Contacto
              <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
            </a>
            <a className="bg-white text-[#0f172a] px-8 py-4 ml-8 hover:bg-[#0f172a] hover:text-white border border-white transition-all duration-300 rounded-xl transform hover:-translate-y-0.5 active:translate-y-0 shadow-md" href="#reservation">
              Reservar
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex flex-col justify-center items-end-safe gap-16 pt-24 overflow-hidden">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="w-full h-full hero-parallax animate-hero-img will-change-transform">
              <Image fill priority alt="Hotel Interior SPS" className="w-full h-full object-cover grayscale-20" src={img1} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent z-10" />
          </div>
          
          <div className="relative z-20 w-full px-4 sm:px-8 md:px-16 grid grid-cols-12 gap-4 animate-fade-up">
            <div className="col-span-12 lg:col-span-8 lg:col-start-2">
              <span className="text-white/60 font-['Hanken_Grotesk'] uppercase tracking-[0.4em] block mb-4 sm:mb-6 text-xs sm:text-sm delay-100">Establecido en 1960</span>
              <h1 className="text-white font-['Hanken_Grotesk'] text-[clamp(1.875rem,9vw,11rem)] leading-[0.85] uppercase tracking-tighter mix-blend-overlay pr-4">
                Herencia<br />Moderna
              </h1>
              <p className="text-white text-sm sm:text-lg max-w-lg mt-4 sm:mt-8 opacity-90 border-l-2 border-white/40 pl-4 sm:pl-8">
                Sesenta años de hospitalidad tradicional reinterpretados para el viajero contemporáneo en el corazón de San Pedro Sula.
              </p>
            </div>
          </div>

          {/* Buscador/Widget horizontal */}
          <div className="sm:mx-8 md:mx-16 w-full sm:rounded-4xl max-w-5xl bg-[#0f172a]/40 backdrop-blur-xl border border-white/10 text-white p-4 sm:p-6 md:px-12 shadow-2xl z-30 animate-fade-up delay-300 self-center lg:self-auto">
            <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-8 md:gap-12 max-w-360 mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full flex-1">
                <div className="flex-1 border-b border-white/20 pb-2 focus-within:border-white transition-colors duration-300">
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-white/60">Entrada</label>
                  <input className="bg-transparent border-none text-white p-0 w-full focus:ring-0 text-md outline-hidden accent-blue-500" type="date" defaultValue="2026-05-20" />
                </div>
                <div className="flex-1 border-b border-white/20 pb-2 focus-within:border-white transition-colors duration-300">
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-white/60">Salida</label>
                  <input className="bg-transparent border-none text-white p-0 w-full focus:ring-0 text-md outline-hidden accent-blue-500" type="date" defaultValue="2026-05-25" />
                </div>
              </div>
              <button className="rounded-2xl bg-white text-[#0f172a] px-6 sm:px-16 py-4 sm:py-6 uppercase font-['Hanken_Grotesk'] tracking-widest hover:bg-[#0f172a] text-xs sm:text-sm hover:text-white border border-white transition-all duration-500 cubic-fluid w-full md:w-auto shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 cursor-pointer">
                Explorar Habitaciones
              </button>
            </div>
          </div>
        </section>

        {/* SECTION: ABOUT */}
        <section className="bg-[#ffffff] overflow-hidden" id="about">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
            <div className="relative bg-slate-50 p-4 sm:p-8 md:p-16 lg:p-30 flex flex-col justify-center">
              
              {/* Número gigante desvanecido con sutil desplazamiento interactivo */}
              <div className="absolute top-0 left-0 p-4 sm:p-8 text-[#0f172a]/5 text-[80px] sm:text-[120px] md:text-[200px] font-bold leading-none select-none transition-transform duration-1000 cubic-fluid transform hover:scale-105">
                1960
              </div>
              
              <div className={`relative z-10 transition-all duration-1000 cubic-fluid ${visibleSections['about'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
                <span className="text-blue-700 font-['Hanken_Grotesk'] uppercase tracking-[0.3em] block mb-4 sm:mb-8 text-xs sm:text-sm">Nuestra Trayectoria</span>
                <h2 className="text-[#0f172a] font-['Hanken_Grotesk'] text-[clamp(1.75rem,6vw,4.5rem)] leading-tight mb-8 sm:mb-16">Resiliencia y Tradición Sampedrana</h2>
                <div className="space-y-4 sm:space-y-8 text-slate-600 text-sm sm:text-lg max-w-xl">
                  <p>Como el tercer hotel fundado en la capital industrial, hemos sido testigos silenciosos de la evolución de una ciudad. Nuestra historia está escrita con la fuerza de quienes no se rinden.</p>
                  <p>Tras superar el incendio de 2012, renacimos manteniendo la esencia: ser el hogar fuera de casa para cada viajero que busca no solo una cama, sino una experiencia humana real.</p>
                </div>
                
                {/* Contadores Estadísticos */}
                <div className="mt-8 sm:mt-16 flex gap-8 sm:gap-16 items-center border-t border-[#0f172a]/10 pt-8 sm:pt-16">
                  <div className="text-center group cursor-default">
                    <span className="block text-2xl sm:text-4xl font-['Hanken_Grotesk'] text-[#0f172a] group-hover:text-blue-700 transition-colors duration-300 transform group-hover:scale-110 inline-block cubic-fluid">50+</span>
                    <span className="block text-[10px] uppercase tracking-widest opacity-60 mt-1">Años</span>
                  </div>
                  <div className="h-12 w-px bg-[#0f172a]/10"></div>
                  <div className="text-center group cursor-default">
                    <span className="block text-2xl sm:text-4xl font-['Hanken_Grotesk'] text-[#0f172a] group-hover:text-blue-700 transition-colors duration-300 transform group-hover:scale-110 inline-block cubic-fluid">03</span>
                    <span className="block text-[10px] uppercase tracking-widest opacity-60 mt-1">Fundación</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Imagen de historia y tarjeta flotante */}
            <div className="relative h-64 sm:h-96 lg:h-auto overflow-hidden group">
              <Image fill alt="Historic San Pedro" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 cubic-fluid group-hover:scale-105" src={img3} />
              <div className="absolute inset-0 bg-[#0f172a]/10 transition-opacity duration-500 group-hover:bg-[#0f172a]/20" />
              
              {/* Tarjeta flotante con animación interactiva */}
              <div className={`absolute bottom-4 sm:bottom-12 right-4 sm:right-12 bg-white p-6 sm:p-8 shadow-2xl max-w-xs transition-all duration-1000 cubic-fluid delay-300 ${
                visibleSections['about'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              } hover:-translate-y-2`}>
                <p className="font-['Hanken_Grotesk'] italic text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed">
                  “Queremos que cada huésped se sienta en casa, rodeado de respeto y calidez.”
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: MISSION */}
        <section className="bg-[#0f172a] text-white py-16 sm:py-24 md:py-40 relative overflow-hidden" id="mission">
          <div className="absolute right-0 top-0 opacity-5 pointer-events-none overflow-hidden select-none">
            <span className="text-[clamp(100px,20vw,400px)] font-bold leading-none -mr-40 block transition-transform duration-1000 transform hover:translate-x-5">2030</span>
          </div>
          <div className="max-w-360 mx-auto px-4 sm:px-8 md:px-16 relative z-10">
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16 items-start transition-all duration-1000 cubic-fluid ${
              visibleSections['mission'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
            }`}>
              <div className="space-y-8 sm:space-y-16 group">
                <div className="p-2 group-hover:translate-x-2 transition-transform duration-500 cubic-fluid">
                  <span className="inline-block px-4 py-1 border border-white/30 text-white/80 text-[10px] uppercase tracking-[0.3em] mb-4 sm:mb-6 rounded-full">Nuestra Misión</span>
                  <h3 className="font-['Hanken_Grotesk'] text-[clamp(1.25rem,4vw,2.25rem)] font-light mb-4 sm:mb-8 text-white">El hogar fuera del hogar.</h3>
                  <p className="text-white/70 text-sm sm:text-lg leading-relaxed max-w-md">
                    Proporcionar un servicio de seguridad y calidez, cimentado en la tradición que nos define como referentes de la hospitalidad en Cortés.
                  </p>
                </div>
              </div>
              <div className="space-y-8 sm:space-y-16 md:mt-40 group">
                <div className="p-2 group-hover:translate-x-2 transition-transform duration-500 cubic-fluid delay-150">
                  <span className="inline-block px-4 py-1 border border-white/30 text-white/80 text-[10px] uppercase tracking-[0.3em] mb-4 sm:mb-6 rounded-full">Visión 2030</span>
                  <h3 className="font-['Hanken_Grotesk'] text-[clamp(1.25rem,4vw,2.25rem)] font-light mb-4 sm:mb-8 text-white">Innovar sin perder la esencia.</h3>
                  <p className="text-white/70 text-sm sm:text-lg leading-relaxed max-w-md">
                    Consolidarnos como el hotel de referencia tradicional, integrando modernidad funcional manteniendo siempre nuestra alma familiar y resiliente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: PILARES (GRID INTERACTIVO) */}
        <section className="py-16 sm:py-24 md:py-40 bg-slate-50">
          <div className="max-w-360 mx-auto px-4 sm:px-8 md:px-16 data-reveal">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 sm:mb-20 gap-4 sm:gap-8">
              <div className="max-w-2xl">
                <span className="text-blue-700 font-['Hanken_Grotesk'] uppercase tracking-[0.3em] block mb-2 sm:mb-4 text-xs">Pilares</span>
                <h2 className="text-[#0f172a] font-['Hanken_Grotesk'] text-[clamp(1.5rem,5vw,3.75rem)]">Lo que nos define.</h2>
              </div>
              <p className="text-slate-500 max-w-xs text-right hidden md:block uppercase tracking-widest text-[10px]">Compromiso con la excelencia desde el primer día.</p>
            </div>

            {/* Grid de Pilares con efectos hover 3D fluidos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-12 reveal-on-scroll">
              {[
                { icon: "verified", id: "01", title: "Responsabilidad", desc: "Nuestro compromiso con el entorno y cada uno de nuestros huéspedes." },
                { icon: "volunteer_activism", id: "02", title: "Honestidad", desc: "Transparencia absoluta en cada interacción y servicio ofrecido." },
                { icon: "handshake", id: "03", title: "Compromiso", desc: "Dedicación total para superar las expectativas de su estadía." },
                { icon: "diversity_3", id: "04", title: "Respeto", desc: "Valoramos la diversidad y la individualidad de cada visitante." },
                { icon: "apartment", id: "05", title: "Hospitalidad", desc: "La esencia sampedrana de dar la bienvenida con el corazón." },
                { icon: "lock", id: "06", title: "Confianza", desc: "Construyendo relaciones seguras y duraderas por generaciones." }
              ].map((pilar, index) => (
                <div 
                  key={index} 
                  className="group border-t border-[#0f172a]/10 pt-6 sm:pt-8 hover:border-[#0f172a] transition-all duration-500 cubic-fluid transform hover:-translate-y-2 cursor-default"
                >
                  <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <span className="material-symbols-outlined text-3xl sm:text-4xl text-[#0f172a] group-hover:text-blue-700 transition-colors duration-500 transform group-hover:scale-110 cubic-fluid">
                      {pilar.icon}
                    </span>
                    <span className="text-[10px] font-bold text-[#0f172a]/20 group-hover:text-[#0f172a]/60 transition-colors duration-500">{pilar.id}</span>
                  </div>
                  <h4 className="text-[#0f172a] font-['Hanken_Grotesk'] uppercase tracking-wider mb-2 sm:mb-4 text-sm group-hover:text-blue-700 transition-colors duration-300">
                    {pilar.title}
                  </h4>
                  <p className="text-slate-600 text-xs sm:text-sm group-hover:text-slate-900 transition-colors duration-300 leading-relaxed">
                    {pilar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: EXPERIENCIAS */}
        <section className="relative min-h-screen sm:h-[60vh] md:h-[80vh] flex items-center overflow-hidden group">
          <Image fill alt="Dining Area" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 cubic-fluid group-hover:scale-105" src={img4} />
          <div className="absolute inset-0 bg-[#0f172a]/40 transition-opacity duration-700 group-hover:bg-[#0f172a]/50" />
          
          <div className="relative z-10 w-full px-4 sm:px-8 md:px-16 flex justify-start sm:justify-end">
            <div className="bg-white p-6 sm:p-8 md:p-16 max-w-xl shadow-2xl transition-transform duration-700 cubic-fluid hover:-translate-y-1">
              <span className="text-blue-700 font-['Hanken_Grotesk'] uppercase tracking-[0.3em] block mb-3 sm:mb-6 text-xs sm:text-sm">Experiencias</span>
              <h3 className="text-[#0f172a] font-['Hanken_Grotesk'] text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-8 leading-tight">Atención que Reconforta</h3>
              <p className="text-slate-600 text-sm sm:text-lg mb-8 sm:mb-12 leading-relaxed">
                No solo ofrecemos una habitación; brindamos la calidez de un hogar. Contamos con residentes que han hecho del Hotel San Pedro su residencia permanente, testimonio fiel de nuestro trato cercano.
              </p>
              <button className="bg-[#0f172a] text-white px-8 py-4 sm:py-5 uppercase font-['Hanken_Grotesk'] tracking-widest hover:bg-blue-700 transition-all duration-300 cubic-fluid transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl cursor-pointer text-xs sm:text-sm">
                Descubra Más
              </button>
            </div>
          </div>
        </section>

        {/* SECTION: CONTACTO & FORMULARIO */}
        <section className="pt-16 sm:pt-24 md:pt-40 bg-gradient-to-b from-slate-50 to-blue-50" id="contact">
          <div className="max-w-360 mx-auto px-4 sm:px-8 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-16 items-start">
            <div className="lg:col-span-4 space-y-8">
              <h2 className="text-[#0f172a] font-['Hanken_Grotesk'] text-[clamp(1.75rem,6vw,4.5rem)] leading-none">Conecte con nosotros.</h2>
              <div className="space-y-6 sm:space-y-8">
                <div className="group cursor-default">
                  <h4 className="text-[10px] uppercase tracking-widest text-blue-700 font-bold mb-1 sm:mb-2">Ubicación</h4>
                  <p className="text-sm sm:text-lg text-slate-600 transition-colors group-hover:text-black">3 calle entre la 1 y 2 avenida, San Pedro Sula, Cortés, Honduras.</p>
                </div>
                <div className="group cursor-default">
                  <h4 className="text-[10px] uppercase tracking-widest text-blue-700 font-bold mb-1 sm:mb-2">Reservaciones</h4>
                  <p className="text-lg sm:text-xl text-[#0f172a] font-semibold transition-transform duration-300 inline-block group-hover:translate-x-1">+504 2550-0000</p>
                </div>
                <div className="group cursor-default">
                  <h4 className="text-[10px] uppercase tracking-widest text-blue-700 font-bold mb-1 sm:mb-2">Email</h4>
                  <p className="text-sm sm:text-lg text-slate-600 underline transition-colors group-hover:text-blue-700 decoration-blue-200">info@hotelsanpedro.com</p>
                </div>
              </div>
            </div>

            {/* Formulario Interactivo */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 md:p-16 border border-[#0f172a]/5 shadow-xl rounded-2xl transition-all duration-500 hover:shadow-2xl">
              <form className="space-y-8 sm:space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-2 relative group">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 group-focus-within:text-blue-700 transition-colors">Nombre</label>
                    <input className="w-full bg-transparent border-b border-[#0f172a]/20 focus:border-blue-700 focus:ring-0 p-2 transition-all outline-hidden text-[#0f172a]" type="text" />
                  </div>
                  <div className="space-y-2 relative group">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 group-focus-within:text-blue-700 transition-colors">Email</label>
                    <input className="w-full bg-transparent border-b border-[#0f172a]/20 focus:border-blue-700 focus:ring-0 p-2 transition-all outline-hidden text-[#0f172a]" type="email" />
                  </div>
                </div>
                <div className="space-y-2 relative group">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 group-focus-within:text-blue-700 transition-colors">Mensaje</label>
                  <textarea className="w-full bg-transparent border-b border-[#0f172a]/20 focus:border-blue-700 focus:ring-0 p-2 transition-all outline-hidden text-[#0f172a]" rows={4}></textarea>
                </div>
                <button className="w-full bg-[#0f172a] text-white py-4 sm:py-5 uppercase font-['Hanken_Grotesk'] tracking-widest hover:bg-blue-700 transition-all duration-500 cubic-fluid transform hover:-translate-y-0.5 shadow-lg cursor-pointer text-xs sm:text-sm rounded-xl">
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
          
          {/* Iframe con contenedor controlado */}
          <div className="mt-8 sm:mt-16 h-64 sm:h-96 md:h-[500px] w-full overflow-hidden shadow-inner opacity-90 hover:opacity-100 transition-opacity duration-500">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3844.637075276313!2d-88.02565002494666!3d15.503941685096555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f665b4536eb25d9%3A0xff3dffbffeb793e6!2sHotel%20San%20Pedro!5e0!3m2!1ses-419!2shn!4v1781505597298!5m2!1ses-419!2shn" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0f172a] text-white py-12 sm:py-16 md:py-20 border-t border-white/5">
        <div className="max-w-360 mx-auto px-4 sm:px-8 md:px-16 flex flex-col md:flex-row justify-between items-start gap-12 sm:gap-16">
          <div className="space-y-4 sm:space-y-6">
            <Image width={86} height={100} alt="Hotel San Pedro Test" className=" invert brightness-0 transition-transform duration-500 hover:scale-105" src={logo} />
            <p className="text-white/40 text-xs sm:text-sm max-w-xs leading-relaxed">Liderando la hospitalidad tradicional desde 1960. Un refugio de resiliencia y calidez en la capital industrial.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-16">
            <div className="space-y-4 sm:space-y-6">
              <h5 className="text-[10px] uppercase tracking-widest text-white/50 font-bold">El Hotel</h5>
              <ul className="space-y-2 text-xs sm:text-sm text-white/60">
                <li><a className="hover:text-white transition-colors duration-300" href="#">Habitaciones</a></li>
                <li><a className="hover:text-white transition-colors duration-300" href="#">Restaurante</a></li>
                <li><a className="hover:text-white transition-colors duration-300" href="#">Salones</a></li>
              </ul>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <h5 className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Empresa</h5>
              <ul className="space-y-2 text-xs sm:text-sm text-white/60">
                <li><a className="hover:text-white transition-colors duration-300" href="#">Carreras</a></li>
                <li><a className="hover:text-white transition-colors duration-300" href="#">Noticias</a></li>
              </ul>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <h5 className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Legal</h5>
              <ul className="space-y-2 text-xs sm:text-sm text-white/60">
                <li><a className="hover:text-white transition-colors duration-300" href="#">Privacidad</a></li>
                <li><a className="hover:text-white transition-colors duration-300" href="#">Términos</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-360 mx-auto px-4 sm:px-8 md:px-16 mt-12 sm:mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[10px] uppercase tracking-widest text-white/30">
          <p>© 2026 Hotel San Pedro.</p>
          <div className="flex gap-6 sm:gap-8">
            <a className="hover:text-white transition-all duration-300 hover:scale-110" href="#">FB</a>
            <a className="hover:text-white transition-all duration-300 hover:scale-110" href="#">IG</a>
          </div>
        </div>
      </footer>
    </div>
  );
}