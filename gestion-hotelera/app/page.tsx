"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";

export default function HomePage() {
  // Estados para el formulario de contacto
  const [btnText, setBtnText] = useState("ENVIAR MENSAJE");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Referencia para el efecto parallax de la imagen de Hero
  const heroImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      if (heroImgRef.current) {
        heroImgRef.current.style.transform = `translateY(${scrolled * 0.4}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    setIsSubmitting(true);
    setBtnText("ENVIANDO...");

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setBtnText("MENSAJE RECIBIDO");
      form.reset();

      setTimeout(() => {
        setIsSuccess(false);
        setBtnText("ENVIAR MENSAJE");
      }, 3000);
    }, 1500);
  };

  return (
    <div className="bg-[#ffffff] text-[#0f172a] font-['Hanken_Grotesk'] overflow-x-hidden selection:bg-[#e0e7ff] selection:text-[#0f172a]">
      <header className="fixed top-0 w-full z-50 mix-blend-difference h-24 flex items-center">
        <div className="w-full px-[64px] flex justify-between items-center text-white">
          <div className="h-10">
            <Image fill alt="Hotel San Pedro" className="h-full invert brightness-0" src="https://lh3.googleusercontent.com/aida/AP1WRLscGNJdS5NsqKF4KqowgJj49_KZWuF1UhKLAC8hZaVLdyYizzzDoFXdh1vsY3Sv5TrmU1914085ncaT9mG90ISZ2MTEnXf2Y9Gp4KcsmU7Vm6sT-xT6BtFuTv9Vm-a7q4rG_uws9LHqr1dkhbfr0cZ4j4n-bXajZd5SD7A1Atk4txxuIi1YdEz0o-IkHb3XZmWOzZeQGMQg7AovZo8tj37ejaFb4SeMOBqFsz1k_0biHJ_-CAd83A5hS_U" />
          </div>
          <nav className="hidden md:flex items-center gap-[64px] font-['Hanken_Grotesk'] uppercase tracking-[0.2em]">
            <a className="hover:text-[#e0e7ff] transition-colors" href="#about">Historia</a>
            <a className="hover:text-[#e0e7ff] transition-colors" href="#mission">Filosofía</a>
            <a className="hover:text-[#e0e7ff] transition-colors" href="#contact">Contacto</a>
            <a className="bg-white text-[#0f172a] px-[32px] py-[16px] ml-[32px] hover:bg-[#e0e7ff] transition-all" href="#reservation">Reservar</a>
          </nav>
        </div>
      </header>
      <main>
        <section className="relative min-h-screen flex flex-col justify-center items-end-safe gap-12 pt-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image fill alt="Hotel Interior SPS" className="w-full h-full object-cover grayscale-[20%] brightness-75" src="https://images.unsplash.com/photo-1561501900-3701fa6a0864?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvdGVsJTIwZGUlMjBsdWpvfGVufDB8fDB8fHww" />
          </div>
          <div className="relative z-10 w-full px-[64px] grid grid-cols-12 gap-[32px]">
            <div className="col-span-12 lg:col-span-8 lg:col-start-2">
              <span className="text-white/60 font-['Hanken_Grotesk'] uppercase tracking-[0.4em] block mb-[24px]">Establecido en 1960</span>
              <h1 className="text-white font-['Manrope'] text-[12vw] leading-[0.85] uppercase tracking-tighter mix-blend-overlay">
                Modern<br />Heritage
              </h1>
              <p className="text-white text-lg max-w-lg mt-[64px] opacity-90 border-l-2 border-[#6366f1] pl-[32px]">
                Cincuenta años de hospitalidad tradicional reinterpretados para el viajero contemporáneo en el corazón de San Pedro Sula.
              </p>
            </div>
          </div>
          <div className="mx-[64px] w-full max-w-5xl bg-white/10 backdrop-blur-lg border border-white/20 text-white p-[32px] md:px-[64px] shadow-2xl z-50">
            <div className="flex flex-col md:flex-row items-center gap-[64px] max-w-[1440px] mx-auto">
              <div className="flex flex-1 gap-[32px] w-full">
                <div className="flex-1 border-b border-white/20 pb-[8px]">
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-white">Entrada</label>
                  <input className="bg-transparent border-none p-0 w-full focus:ring-0 text-md invert" type="date" value="2024-05-20" />
                </div>
                <div className="flex-1 border-b border-white/20 pb-[8px]">
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-white">Salida</label>
                  <input className="bg-transparent border-none p-0 w-full focus:ring-0 text-md invert" type="date" value="2024-05-25" />
                </div>
              </div>
              <button className="bg-[#6366f1] text-white px-[64px] py-[24px] uppercase font-['Hanken_Grotesk'] tracking-widest hover:bg-white hover:text-[#0f172a] transition-all w-full md:w-auto shadow-lg">
                Explorar Habitaciones
              </button>
            </div>
          </div>
        </section>
        <section className="bg-[#ffffff]" id="about">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
            <div className="relative bg-[#f8fafc] p-[64px] md:p-[120px] flex flex-col justify-center">
              <div className="absolute top-0 left-0 p-[32px] text-[#0f172a]/10 text-[200px] font-bold leading-none select-none">1960</div>
              <div className="relative z-10">
                <span className="text-[#6366f1] font-['Hanken_Grotesk'] uppercase tracking-[0.3em] block mb-[32px]">Nuestra Trayectoria</span>
                <h2 className="text-[#0f172a] font-['Manrope'] text-[clamp(40px,5vw,72px)] leading-tight mb-[64px]">Resiliencia y Tradición Sampedrana</h2>
                <div className="space-y-[32px] text-[#475569] text-lg max-w-xl">
                  <p className="">Como el tercer hotel fundado en la capital industrial, hemos sido testigos silenciosos de la evolución de una ciudad. Nuestra historia está escrita con la fuerza de quienes no se rinden.</p>
                  <p className="">Tras superar el incendio de 2012, renacimos manteniendo la esencia: ser el hogar fuera de casa para cada viajero que busca no solo una cama, sino una experiencia humana real.</p>
                </div>
                <div className="mt-[64px] flex gap-[64px] items-center border-t border-[#0f172a]/10 pt-[64px]">
                  <div className="text-center">
                    <span className="block text-4xl font-['Manrope'] text-[#0f172a]">50+</span>
                    <span className="text-[10px] uppercase tracking-widest opacity-60">Años</span>
                  </div>
                  <div className="h-12 w-px bg-[#0f172a]/10"></div>
                  <div className="text-center">
                    <span className="block text-4xl font-['Manrope'] text-[#0f172a]">03</span>
                    <span className="text-[10px] uppercase tracking-widest opacity-60">Fundación</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[600px] lg:h-auto overflow-hidden">
              <Image fill alt="Historic San Pedro" className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
              <div className="absolute inset-0 bg-[#0f172a]/10"></div>
              <div className="absolute bottom-[32px] right-[32px] bg-white p-[32px] shadow-2xl max-w-xs transform translate-y-12">
                <p className="font-['Hanken_Grotesk'] italic text-[#475569]">"Queremos que cada huésped se sienta en casa, rodeado de respeto y calidez."</p>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-[#0f172a] text-white py-[160px] relative overflow-hidden" id="mission">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
            <span className="text-[400px] font-bold leading-none -mr-40">2030</span>
          </div>
          <div className="max-w-[1440px] mx-auto px-[64px] relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[64px] items-start">
              <div className="space-y-[64px]">
                <div>
                  <span className="inline-block px-4 py-1 border border-[#6366f1] text-[#6366f1] text-[10px] uppercase tracking-[0.3em] mb-[24px]">Nuestra Misión</span>
                  <h3 className="font-['Manrope'] text-5xl font-light mb-[32px]">El hogar fuera del hogar.</h3>
                  <p className="text-white/70 text-lg leading-relaxed">
                    Proporcionar un servicio de seguridad y calidez, cimentado en la tradición que nos define como referentes de la hospitalidad en Cortés.
                  </p>
                </div>
              </div>
              <div className="space-y-[64px] md:mt-40">
                <div>
                  <span className="inline-block px-4 py-1 border border-[#6366f1] text-[#6366f1] text-[10px] uppercase tracking-[0.3em] mb-[24px]">Visión 2030</span>
                  <h3 className="font-['Manrope'] text-5xl font-light mb-[32px]">Innovar sin perder la esencia.</h3>
                  <p className="text-white/70 text-lg leading-relaxed">
                    Consolidarnos como el hotel de referencia tradicional, integrando modernidad funcional manteniendo siempre nuestra alma familiar y resiliente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-[120px] bg-[#f8fafc]">
          <div className="max-w-[1440px] mx-auto px-[64px]">
            <div className="flex flex-col md:flex-row justify-between items-end mb-[80px] gap-[32px]">
              <div className="max-w-2xl">
                <span className="text-[#6366f1] font-['Hanken_Grotesk'] uppercase tracking-[0.3em] block mb-[16px]">Pilares</span>
                <h2 className="text-[#0f172a] font-['Manrope'] text-6xl">Lo que nos define.</h2>
              </div>
              <p className="text-[#475569] max-w-xs text-right hidden md:block uppercase tracking-widest text-[10px]">Compromiso con la excelencia desde el primer día.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              <div className="group border-t border-[#0f172a]/10 pt-[32px] hover:border-[#6366f1] transition-all duration-500">
                <div className="flex justify-between items-start mb-[24px]">
                  <span className="material-symbols-outlined text-4xl text-[#0f172a] group-hover:text-[#6366f1] transition-colors">verified</span>
                  <span className="text-[10px] font-bold text-[#0f172a]/20">01</span>
                </div>
                <h4 className="text-[#0f172a] font-['Manrope'] uppercase tracking-wider mb-[16px]">Responsabilidad</h4>
                <p className="text-[#475569] text-sm">Nuestro compromiso con el entorno y cada uno de nuestros huéspedes.</p>
              </div>
              <div className="group border-t border-[#0f172a]/10 pt-[32px] hover:border-[#6366f1] transition-all duration-500">
                <div className="flex justify-between items-start mb-[24px]">
                  <span className="material-symbols-outlined text-4xl text-[#0f172a] group-hover:text-[#6366f1] transition-colors">volunteer_activism</span>
                  <span className="text-[10px] font-bold text-[#0f172a]/20">02</span>
                </div>
                <h4 className="text-[#0f172a] font-['Manrope'] uppercase tracking-wider mb-[16px]">Honestidad</h4>
                <p className="text-[#475569] text-sm">Transparencia absoluta en cada interacción y servicio ofrecido.</p>
              </div>
              <div className="group border-t border-[#0f172a]/10 pt-[32px] hover:border-[#6366f1] transition-all duration-500">
                <div className="flex justify-between items-start mb-[24px]">
                  <span className="material-symbols-outlined text-4xl text-[#0f172a] group-hover:text-[#6366f1] transition-colors">handshake</span>
                  <span className="text-[10px] font-bold text-[#0f172a]/20">03</span>
                </div>
                <h4 className="text-[#0f172a] font-['Manrope'] uppercase tracking-wider mb-[16px]">Compromiso</h4>
                <p className="text-[#475569] text-sm">Dedicación total para superar las expectativas de su estadía.</p>
              </div>
              <div className="group border-t border-[#0f172a]/10 pt-[32px] hover:border-[#6366f1] transition-all duration-500">
                <div className="flex justify-between items-start mb-[24px]">
                  <span className="material-symbols-outlined text-4xl text-[#0f172a] group-hover:text-[#6366f1] transition-colors">diversity_3</span>
                  <span className="text-[10px] font-bold text-[#0f172a]/20">04</span>
                </div>
                <h4 className="text-[#0f172a] font-['Manrope'] uppercase tracking-wider mb-[16px]">Respeto</h4>
                <p className="text-[#475569] text-sm">Valoramos la diversidad y la individualidad de cada visitante.</p>
              </div>
              <div className="group border-t border-[#0f172a]/10 pt-[32px] hover:border-[#6366f1] transition-all duration-500">
                <div className="flex justify-between items-start mb-[24px]">
                  <span className="material-symbols-outlined text-4xl text-[#0f172a] group-hover:text-[#6366f1] transition-colors">apartment</span>
                  <span className="text-[10px] font-bold text-[#0f172a]/20">05</span>
                </div>
                <h4 className="text-[#0f172a] font-['Manrope'] uppercase tracking-wider mb-[16px]">Hospitalidad</h4>
                <p className="text-[#475569] text-sm">La esencia sampedrana de dar la bienvenida con el corazón.</p>
              </div>
              <div className="group border-t border-[#0f172a]/10 pt-[32px] hover:border-[#6366f1] transition-all duration-500">
                <div className="flex justify-between items-start mb-[24px]">
                  <span className="material-symbols-outlined text-4xl text-[#0f172a] group-hover:text-[#6366f1] transition-colors">lock</span>
                  <span className="text-[10px] font-bold text-[#0f172a]/20">06</span>
                </div>
                <h4 className="text-[#0f172a] font-['Manrope'] uppercase tracking-wider mb-[16px]">Confianza</h4>
                <p className="text-[#475569] text-sm">Construyendo relaciones seguras y duraderas por generaciones.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="relative h-[80vh] flex items-center overflow-hidden">
          <Image fill alt="Dining Area" className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AP1WRLsPMOdetOVLoz6bMIE0AE1d3NTpcdVzyURdoNkRehVFwaRoz6cuaunhxLpslAsCC4fcdX2nP1IrSmrbcRg5sA8UmmBHEKH0dnnMPJGQeXeG0YiiL3Twcqn8sGM_a_UmTn4AxAv6e5npSVelxzJ_iNYQRdiS8xzYB88b6TPnDgnJgm2_bFanu4PiRKAj5uvzT6S__Bth1xUmgKg4iydzpQz2gHbu1QtlZCrKDHR_Z3-PWSz0kumf44Qc5pY" />
          <div className="absolute inset-0 bg-[#0f172a]/40"></div>
          <div className="relative z-10 w-full px-[64px] flex justify-end">
            <div className="bg-white p-[64px] max-w-xl shadow-2xl">
              <span className="text-[#6366f1] font-['Hanken_Grotesk'] uppercase tracking-[0.3em] block mb-[24px]">Experiencias</span>
              <h3 className="text-[#0f172a] font-['Manrope'] text-4xl mb-[32px] leading-tight">Atención que Reconforta</h3>
              <p className="text-[#475569] text-lg mb-[64px]">
                No solo ofrecemos una habitación; brindamos la calidez de un hogar. Contamos con residentes que han hecho del Hotel San Pedro su residencia permanente, testimonio fiel de nuestro trato cercano.
              </p>
              <button className="bg-[#0f172a] text-white px-[32px] py-[24px] uppercase font-['Hanken_Grotesk'] tracking-widest hover:bg-[#6366f1] transition-all">
                Descubra Más
              </button>
            </div>
          </div>
        </section>
        <section className="py-[120px]" id="contact">
          <div className="max-w-[1440px] mx-auto px-[64px] grid grid-cols-1 lg:grid-cols-12 gap-[64px] items-start">
            <div className="lg:col-span-4">
              <h2 className="text-[#0f172a] font-['Manrope'] text-5xl mb-[64px]">Conecte con nosotros.</h2>
              <div className="space-y-[32px]">
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-[#6366f1] font-bold mb-[8px]">Ubicación</h4>
                  <p className="text-lg text-[#475569]">3 calle entre la 1 y 2 avenida, San Pedro Sula, Cortés, Honduras.</p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-[#6366f1] font-bold mb-[8px]">Reservaciones</h4>
                  <p className="text-xl text-[#0f172a]">+504 2550-0000</p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-[#6366f1] font-bold mb-[8px]">Email</h4>
                  <p className="text-lg text-[#475569] underline">info@hotelsanpedro.com</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8 bg-[#f8fafc] p-[64px] border border-[#0f172a]/5">
              <form className="space-y-[64px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px]">
                  <div className="space-y-[8px]">
                    <label className="text-[10px] uppercase tracking-widest font-bold">Nombre</label>
                    <input className="w-full bg-transparent border-b border-[#0f172a]/20 focus:border-[#6366f1] focus:ring-0 p-[8px] transition-all" type="text" />
                  </div>
                  <div className="space-y-[8px]">
                    <label className="text-[10px] uppercase tracking-widest font-bold">Email</label>
                    <input className="w-full bg-transparent border-b border-[#0f172a]/20 focus:border-[#6366f1] focus:ring-0 p-[8px] transition-all" type="email" />
                  </div>
                </div>
                <div className="space-y-[8px]">
                  <label className="text-[10px] uppercase tracking-widest font-bold">Mensaje</label>
                  <textarea className="w-full bg-transparent border-b border-[#0f172a]/20 focus:border-[#6366f1] focus:ring-0 p-[8px] transition-all" rows="4"></textarea>
                </div>
                <button className="w-full bg-[#0f172a] text-white py-[24px] uppercase font-['Hanken_Grotesk'] tracking-widest hover:bg-[#6366f1] transition-all">Enviar Mensaje</button>
              </form>
            </div>
          </div>
          <div className="mt-[64px] h-[400px] w-full px-[64px] overflow-hidden grayscale contrast-125">
            <Image fill alt="Map" className="w-full h-full object-cover opacity-60" src="" />
          </div>
        </section>
      </main>
      <footer className="bg-[#0f172a] text-white py-[64px] border-t border-white/5">
        <div className="max-w-[1440px] mx-auto px-[64px] flex flex-col md:flex-row justify-between items-start gap-[64px]">
          <div className="space-y-[24px]">
            <Image fill alt="Hotel San Pedro Test" className="h-8 invert brightness-0" src="https://lh3.googleusercontent.com/aida/AP1WRLscGNJdS5NsqKF4KqowgJj49_KZWuF1UhKLAC8hZaVLdyYizzzDoFXdh1vsY3Sv5TrmU1914085ncaT9mG90ISZ2MTEnXf2Y9Gp4KcsmU7Vm6sT-xT6BtFuTv9Vm-a7q4rG_uws9LHqr1dkhbfr0cZ4j4n-bXajZd5SD7A1Atk4txxuIi1YdEz0o-IkHb3XZmWOzZeQGMQg7AovZo8tj37ejaFb4SeMOBqFsz1k_0biHJ_-CAd83A5hS_U" />
            <p className="text-white/40 text-sm max-w-xs">Liderando la hospitalidad tradicional desde 1960. Un refugio de resiliencia y calidez.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-[64px]">
            <div className="space-y-[24px]">
              <h5 className="text-[10px] uppercase tracking-widest text-[#6366f1] font-bold">El Hotel</h5>
              <ul className="space-y-[8px] text-sm text-white/60">
                <li className=""><a className="hover:text-white transition-colors" href="#">Habitaciones</a></li>
                <li className=""><a className="hover:text-white transition-colors" href="#">Restaurante</a></li>
                <li className=""><a className="hover:text-white transition-colors" href="#">Salones</a></li>
              </ul>
            </div>
            <div className="space-y-[24px]">
              <h5 className="text-[10px] uppercase tracking-widest text-[#6366f1] font-bold">Empresa</h5>
              <ul className="space-y-[8px] text-sm text-white/60">
                <li className=""><a className="hover:text-white transition-colors" href="#">Carreras</a></li>
                <li className=""><a className="hover:text-white transition-colors" href="#">Noticias</a></li>
              </ul>
            </div>
            <div className="space-y-[24px]">
              <h5 className="text-[10px] uppercase tracking-widest text-[#6366f1] font-bold">Legal</h5>
              <ul className="space-y-[8px] text-sm text-white/60">
                <li className=""><a className="hover:text-white transition-colors" href="#">Privacidad</a></li>
                <li className=""><a className="hover:text-white transition-colors" href="#">Términos</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-[64px] mt-[64px] pt-[32px] border-t border-white/5 flex justify-between items-center text-[10px] uppercase tracking-widest text-white/30">
          <p className="">© 2024 Hotel San Pedro.</p>
          <div className="flex gap-[32px]">
            <a className="hover:text-white transition-colors" href="#">FB</a>
            <a className="hover:text-white transition-colors" href="#">IG</a>
          </div>
        </div>
      </footer>
    
    </div>
  );
}