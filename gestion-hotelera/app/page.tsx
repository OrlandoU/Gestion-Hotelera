"use client";

import img1 from '@/public/img1.jpg'
import img3 from '@/public/img3.jpg'
import img4 from '@/public/img4.jpg'
import logo from '@/public/logo.png'
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const heroImg = document.querySelector('section img') as HTMLImageElement | null;
      if (heroImg) {
        heroImg.style.transform = `translateY(${scrolled * 0.4}px)`;
      }
      setIsScrolled(scrolled > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // run once to initialize
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#ffffff] text-[#0f172a] font-['Hanken_Grotesk'] overflow-x-hidden selection:bg-lavender selection:text-[#0f172a]">
      <header className={`fixed top-0 w-full z-50 h-24 flex items-center transition-colors duration-300 ${isScrolled ? 'bg-[#0f172a]/60 backdrop-blur-sm' : 'bg-transparent'}`}>
        <div className="w-full px-4 sm:px-8 md:px-16 flex justify-between items-center text-white">
          <div className="h-10">
            <Image width={86} height={100} alt="Hotel San Pedro" className="h-full invert brightness-0" src={logo} />
          </div>
          <nav className="hidden md:flex items-center gap-16 text-xs font-['Hanken_Grotesk'] uppercase tracking-[0.2em]">
            <a className="hover:text-lavender transition-colors" href="#about">Historia</a>
            <a className="hover:text-lavender transition-colors" href="#mission">Filosofía</a>
            <a className="hover:text-lavender transition-colors" href="#contact">Contacto</a>
            <a className="bg-white text-[#0f172a] px-8 py-4 ml-8 hover:bg-lavender transition-all rounded-xl" href="#reservation">Reservar</a>
          </nav>
        </div>
      </header>
      <main>
        <section className="relative min-h-screen flex flex-col justify-center items-end-safe gap-16 pt-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image fill alt="Hotel Interior SPS" className="w-full h-full object-cover grayscale-20 brightness-75" src={img1} />
          </div>
          <div className="relative z-10 w-full px-4 sm:px-8 md:px-16 grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-8 lg:col-start-2">
              <span className="text-white/60 font-['Hanken_Grotesk'] uppercase tracking-[0.4em] block mb-4 sm:mb-6 text-xs sm:text-sm">Establecido en 1960</span>
              <h1 className="text-white font-['Hanken_Grotesk'] text-[clamp(1.875rem,9vw,11rem)] leading-[0.85] uppercase tracking-tighter mix-blend-overlay">
                Herencia<br />Moderna
              </h1>
              <p className="text-white text-sm sm:text-lg max-w-lg mt-4 sm:mt-8 opacity-90 border-l-2 border-lavender pl-4 sm:pl-8">
                Sesenta años de hospitalidad tradicional reinterpretados para el viajero contemporáneo en el corazón de San Pedro Sula.
              </p>
            </div>
          </div>
          <div className="sm:mx-8 md:mx-16 w-full sm:rounded-4xl max-w-5xl bg-white/10 backdrop-blur-lg border border-white/20 text-white p-4 sm:p-6 md:px-12 shadow-2xl z-50">
            <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-8 md:gap-12 max-w-360 mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full flex-1">
                <div className="flex-1 border-b border-white/20 pb-2">
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-white">Entrada</label>
                  <input className="bg-transparent border-none text-yellow-900 p-0 w-full focus:ring-0 text-md invert" type="date" value="2024-05-20" />
                </div>
                <div className="flex-1 border-b border-white/20 pb-2">
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-white">Salida</label>
                  <input className="bg-transparent border-none text-yellow-900 p-0 w-full focus:ring-0 text-md invert" type="date" value="2024-05-25" />
                </div>
              </div>
              <button className="bg-lavender rounded-2xl bg-blue-700 text-white px-6 sm:px-16 py-4 sm:py-6 uppercase font-['Hanken_Grotesk'] tracking-widest hover:bg-white text-xs sm:text-sm hover:text-[#0f172a] transition-all w-full md:w-auto shadow-lg cursor-pointer">
                Explorar Habitaciones
              </button>
            </div>
          </div>
        </section>
        <section className="bg-[#ffffff]" id="about">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
            <div className="relative bg-surface-dim p-4 sm:p-8 md:p-16 lg:p-30 flex flex-col justify-center">
              <div className="absolute top-0 left-0 p-4 sm:p-8 text-[#0f172a]/10 text-[80px] sm:text-[120px] md:text-[200px] font-bold leading-none select-none">1960</div>
              <div className="relative z-10">
                <span className="text-lavender font-['Hanken_Grotesk'] uppercase tracking-[0.3em] block mb-4 sm:mb-8 text-xs sm:text-sm">Nuestra Trayectoria</span>
                <h2 className="text-[#0f172a] font-['Hanken_Grotesk'] text-[clamp(1.75rem,6vw,4.5rem)] leading-tight mb-8 sm:mb-16">Resiliencia y Tradición Sampedrana</h2>
                <div className="space-y-4 sm:space-y-8 text-secondary text-sm sm:text-lg max-w-xl">
                  <p className="">Como el tercer hotel fundado en la capital industrial, hemos sido testigos silenciosos de la evolución de una ciudad. Nuestra historia está escrita con la fuerza de quienes no se rinden.</p>
                  <p className="">Tras superar el incendio de 2012, renacimos manteniendo la esencia: ser el hogar fuera de casa para cada viajero que busca no solo una cama, sino una experiencia humana real.</p>
                </div>
                <div className="mt-8 sm:mt-16 flex gap-8 sm:gap-16 items-center border-t border-[#0f172a]/10 pt-8 sm:pt-16">
                  <div className="text-center">
                    <span className="block text-2xl sm:text-4xl font-['Hanken_Grotesk'] text-[#0f172a]">50+</span>
                    <span className="text-[10px] uppercase tracking-widest opacity-60">Años</span>
                  </div>
                  <div className="h-12 w-px bg-[#0f172a]/10"></div>
                  <div className="text-center">
                    <span className="block text-2xl sm:text-4xl font-['Hanken_Grotesk'] text-[#0f172a]">03</span>
                    <span className="text-[10px] uppercase tracking-widest opacity-60">Fundación</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-64 sm:h-96 lg:h-auto overflow-hidden">
              <Image fill alt="Historic San Pedro" className="absolute inset-0 w-full h-full object-cover" src={img3} />
              <div className="absolute inset-0 bg-[#0f172a]/10"></div>
              <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 bg-white p-4 sm:p-8 shadow-2xl max-w-xs transform translate-y-12 text-xs sm:text-base">
                <p className="font-['Hanken_Grotesk'] italic text-secondary">&ldquo;Queremos que cada huésped se sienta en casa, rodeado de respeto y calidez.&rdquo;</p>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-[#0f172a] text-white py-16 sm:py-24 md:py-40 relative overflow-hidden" id="mission">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none overflow-hidden">
            <span className="text-[clamp(100px,20vw,400px)] font-bold leading-none -mr-40">2030</span>
          </div>
          <div className="max-w-360 mx-auto px-4 sm:px-8 md:px-16 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16 items-start">
              <div className="space-y-8 sm:space-y-16">
                <div>
                  <span className="inline-block px-4 py-1 border border-lavender text-lavender text-[10px] uppercase tracking-[0.3em] mb-4 sm:mb-6">Nuestra Misión</span>
                  <h3 className="font-['Hanken_Grotesk'] text-[clamp(1.25rem,4vw,2.25rem)] font-light mb-4 sm:mb-8">El hogar fuera del hogar.</h3>
                  <p className="text-white/70 text-sm sm:text-lg leading-relaxed">
                    Proporcionar un servicio de seguridad y calidez, cimentado en la tradición que nos define como referentes de la hospitalidad en Cortés.
                  </p>
                </div>
              </div>
              <div className="space-y-8 sm:space-y-16 md:mt-40">
                <div>
                  <span className="inline-block px-4 py-1 border border-lavender text-lavender text-[10px] uppercase tracking-[0.3em] mb-4 sm:mb-6">Visión 2030</span>
                  <h3 className="font-['Hanken_Grotesk'] text-[clamp(1.25rem,4vw,2.25rem)] font-light mb-4 sm:mb-8">Innovar sin perder la esencia.</h3>
                  <p className="text-white/70 text-sm sm:text-lg leading-relaxed">
                    Consolidarnos como el hotel de referencia tradicional, integrando modernidad funcional manteniendo siempre nuestra alma familiar y resiliente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-16 sm:py-24 md:py-40 bg-surface-dim">
          <div className="max-w-360 mx-auto px-4 sm:px-8 md:px-16">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 sm:mb-20 gap-4 sm:gap-8">
              <div className="max-w-2xl">
                <span className="text-lavender font-['Hanken_Grotesk'] uppercase tracking-[0.3em] block mb-2 sm:mb-4 text-xs">Pilares</span>
                <h2 className="text-[#0f172a] font-['Hanken_Grotesk'] text-[clamp(1.5rem,5vw,3.75rem)]">Lo que nos define.</h2>
              </div>
              <p className="text-secondary max-w-xs text-right hidden md:block uppercase tracking-widest text-[10px]">Compromiso con la excelencia desde el primer día.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-12">
              <div className="group border-t border-[#0f172a]/10 pt-6 sm:pt-8 hover:border-lavender transition-all duration-500">
                <div className="flex justify-between items-start mb-4 sm:mb-6">
                  <span className="material-symbols-outlined text-3xl sm:text-4xl text-[#0f172a] group-hover:text-lavender transition-colors">verified</span>
                  <span className="text-[10px] font-bold text-[#0f172a]/20">01</span>
                </div>
                <h4 className="text-[#0f172a] font-['Hanken_Grotesk'] uppercase tracking-wider mb-2 sm:mb-4 text-sm">Responsabilidad</h4>
                <p className="text-secondary text-xs sm:text-sm">Nuestro compromiso con el entorno y cada uno de nuestros huéspedes.</p>
              </div>
              <div className="group border-t border-[#0f172a]/10 pt-6 sm:pt-8 hover:border-lavender transition-all duration-500">
                <div className="flex justify-between items-start mb-4 sm:mb-6">
                  <span className="material-symbols-outlined text-3xl sm:text-4xl text-[#0f172a] group-hover:text-lavender transition-colors">volunteer_activism</span>
                  <span className="text-[10px] font-bold text-[#0f172a]/20">02</span>
                </div>
                <h4 className="text-[#0f172a] font-['Hanken_Grotesk'] uppercase tracking-wider mb-2 sm:mb-4 text-sm">Honestidad</h4>
                <p className="text-secondary text-xs sm:text-sm">Transparencia absoluta en cada interacción y servicio ofrecido.</p>
              </div>
              <div className="group border-t border-[#0f172a]/10 pt-6 sm:pt-8 hover:border-lavender transition-all duration-500">
                <div className="flex justify-between items-start mb-4 sm:mb-6">
                  <span className="material-symbols-outlined text-3xl sm:text-4xl text-[#0f172a] group-hover:text-lavender transition-colors">handshake</span>
                  <span className="text-[10px] font-bold text-[#0f172a]/20">03</span>
                </div>
                <h4 className="text-[#0f172a] font-['Hanken_Grotesk'] uppercase tracking-wider mb-2 sm:mb-4 text-sm">Compromiso</h4>
                <p className="text-secondary text-xs sm:text-sm">Dedicación total para superar las expectativas de su estadía.</p>
              </div>
              <div className="group border-t border-[#0f172a]/10 pt-6 sm:pt-8 hover:border-lavender transition-all duration-500">
                <div className="flex justify-between items-start mb-4 sm:mb-6">
                  <span className="material-symbols-outlined text-3xl sm:text-4xl text-[#0f172a] group-hover:text-lavender transition-colors">diversity_3</span>
                  <span className="text-[10px] font-bold text-[#0f172a]/20">04</span>
                </div>
                <h4 className="text-[#0f172a] font-['Hanken_Grotesk'] uppercase tracking-wider mb-2 sm:mb-4 text-sm">Respeto</h4>
                <p className="text-secondary text-xs sm:text-sm">Valoramos la diversidad y la individualidad de cada visitante.</p>
              </div>
              <div className="group border-t border-[#0f172a]/10 pt-6 sm:pt-8 hover:border-lavender transition-all duration-500">
                <div className="flex justify-between items-start mb-4 sm:mb-6">
                  <span className="material-symbols-outlined text-3xl sm:text-4xl text-[#0f172a] group-hover:text-lavender transition-colors">apartment</span>
                  <span className="text-[10px] font-bold text-[#0f172a]/20">05</span>
                </div>
                <h4 className="text-[#0f172a] font-['Hanken_Grotesk'] uppercase tracking-wider mb-2 sm:mb-4 text-sm">Hospitalidad</h4>
                <p className="text-secondary text-xs sm:text-sm">La esencia sampedrana de dar la bienvenida con el corazón.</p>
              </div>
              <div className="group border-t border-[#0f172a]/10 pt-6 sm:pt-8 hover:border-lavender transition-all duration-500">
                <div className="flex justify-between items-start mb-4 sm:mb-6">
                  <span className="material-symbols-outlined text-3xl sm:text-4xl text-[#0f172a] group-hover:text-lavender transition-colors">lock</span>
                  <span className="text-[10px] font-bold text-[#0f172a]/20">06</span>
                </div>
                <h4 className="text-[#0f172a] font-['Hanken_Grotesk'] uppercase tracking-wider mb-2 sm:mb-4 text-sm">Confianza</h4>
                <p className="text-secondary text-xs sm:text-sm">Construyendo relaciones seguras y duraderas por generaciones.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="relative min-h-screen sm:h-[60vh] md:h-[80vh] flex items-center overflow-hidden">
          <Image fill alt="Dining Area" className="absolute inset-0 w-full h-full object-cover" src={img4} />
          <div className="absolute inset-0 bg-[#0f172a]/40"></div>
          <div className="relative z-10 w-full px-4 sm:px-8 md:px-16 flex justify-start sm:justify-end">
            <div className="bg-white p-4 sm:p-8 md:p-16 max-w-xl shadow-2xl">
              <span className="text-lavender font-['Hanken_Grotesk'] uppercase tracking-[0.3em] block mb-3 sm:mb-6 text-xs sm:text-sm">Experiencias</span>
              <h3 className="text-[#0f172a] font-['Hanken_Grotesk'] text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-8 leading-tight">Atención que Reconforta</h3>
              <p className="text-secondary text-sm sm:text-lg mb-8 sm:mb-16">
                No solo ofrecemos una habitación; brindamos la calidez de un hogar. Contamos con residentes que han hecho del Hotel San Pedro su residencia permanente, testimonio fiel de nuestro trato cercano.
              </p>
              <button className="bg-[#0f172a] text-white px-6 sm:px-8 py-4 sm:py-6 uppercase font-['Hanken_Grotesk'] tracking-widest hover:bg-lavender transition-all cursor-pointer text-xs sm:text-sm">
                Descubra Más
              </button>
            </div>
          </div>
        </section>
        <section className="pt-16 sm:pt-24 md:pt-40 bg-linear-to-b from-lavender to-blue-200" id="contact">
          <div className="max-w-360  mx-auto px-4 sm:px-8 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-16 items-start">
            <div className="lg:col-span-4">
              <h2 className="text-[#0f172a] font-['Hanken_Grotesk'] text-[clamp(1.75rem,6vw,4.5rem)] mb-8 sm:mb-16">Conecte con nosotros.</h2>
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-lavender font-bold mb-1 sm:mb-2">Ubicación</h4>
                  <p className="text-sm sm:text-lg text-secondary">3 calle entre la 1 y 2 avenida, San Pedro Sula, Cortés, Honduras.</p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-lavender font-bold mb-1 sm:mb-2">Reservaciones</h4>
                  <p className="text-lg sm:text-xl text-[#0f172a]">+504 2550-0000</p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-lavender font-bold mb-1 sm:mb-2">Email</h4>
                  <p className="text-sm sm:text-lg text-secondary underline">info@hotelsanpedro.com</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8 bg-surface-dim p-4 sm:p-8 md:p-16 border border-[#0f172a]/5">
              <form className="space-y-8 sm:space-y-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold">Nombre</label>
                    <input className="w-full bg-transparent border-b border-[#0f172a]/20 focus:border-lavender focus:ring-0 p-2 transition-all" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold">Email</label>
                    <input className="w-full bg-transparent border-b border-[#0f172a]/20 focus:border-lavender focus:ring-0 p-2 transition-all" type="email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold">Mensaje</label>
                  <textarea className="w-full bg-transparent border-b border-[#0f172a]/20 focus:border-lavender focus:ring-0 p-2 transition-all" rows={4}></textarea>
                </div>
                <button className="w-full bg-[#0f172a] text-white py-4 sm:py-6 uppercase font-['Hanken_Grotesk'] tracking-widest hover:bg-lavender transition-all cursor-pointer text-xs sm:text-sm">Enviar Mensaje</button>
              </form>
            </div>
          </div>
          <div className="mt-8 sm:mt-16 h-64 sm:h-96 md:h-[600px] w-full overflow-hidden">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3844.637075276313!2d-88.02565002494666!3d15.503941685096555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f665b4536eb25d9%3A0xff3dffbffeb793e6!2sHotel%20San%20Pedro!5e0!3m2!1ses-419!2shn!4v1781505597298!5m2!1ses-419!2shn" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </section>
      </main>
      <footer className="bg-[#0f172a] text-white py-8 sm:py-12 md:py-16 border-t border-white/5">
        <div className="max-w-360 mx-auto px-4 sm:px-8 md:px-16 flex flex-col md:flex-row justify-between items-start gap-8 sm:gap-12 md:gap-16">
          <div className="space-y-4 sm:space-y-6">
            <Image width={86} height={100} alt="Hotel San Pedro Test" className="h-6 sm:h-8 invert brightness-0" src={logo} />
            <p className="text-white/40 text-xs sm:text-sm max-w-xs">Liderando la hospitalidad tradicional desde 1960. Un refugio de resiliencia y calidez.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-16">
            <div className="space-y-3 sm:space-y-6">
              <h5 className="text-[10px] uppercase tracking-widest text-lavender font-bold">El Hotel</h5>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-white/60">
                <li className=""><a className="hover:text-white transition-colors" href="#">Habitaciones</a></li>
                <li className=""><a className="hover:text-white transition-colors" href="#">Restaurante</a></li>
                <li className=""><a className="hover:text-white transition-colors" href="#">Salones</a></li>
              </ul>
            </div>
            <div className="space-y-3 sm:space-y-6">
              <h5 className="text-[10px] uppercase tracking-widest text-lavender font-bold">Empresa</h5>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-white/60">
                <li className=""><a className="hover:text-white transition-colors" href="#">Carreras</a></li>
                <li className=""><a className="hover:text-white transition-colors" href="#">Noticias</a></li>
              </ul>
            </div>
            <div className="space-y-3 sm:space-y-6">
              <h5 className="text-[10px] uppercase tracking-widest text-lavender font-bold">Legal</h5>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-white/60">
                <li className=""><a className="hover:text-white transition-colors" href="#">Privacidad</a></li>
                <li className=""><a className="hover:text-white transition-colors" href="#">Términos</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-360 mx-auto px-4 sm:px-8 md:px-16 mt-8 sm:mt-12 md:mt-16 pt-4 sm:pt-6 md:pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[10px] uppercase tracking-widest text-white/30">
          <p className="">© 2024 Hotel San Pedro.</p>
          <div className="flex gap-6 sm:gap-8">
            <a className="hover:text-white transition-colors" href="#">FB</a>
            <a className="hover:text-white transition-colors" href="#">IG</a>
          </div>
        </div>
      </footer>

    </div>
  );
}