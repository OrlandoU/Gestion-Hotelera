import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-background text-primary font-body-md overflow-x-hidden selection:bg-lavender-accent selection:text-navy-dark">

      <header className="fixed top-0 w-full z-50 mix-blend-difference h-24 flex items-center">
        <div className="w-full px-margin-desktop flex justify-between items-center text-white">
          <div className="h-10 relative w-10"> 
            <Image 
              width={48} 
              height={48} 
              priority 
              alt="Hotel San Pedro" 
              className="h-full w-auto invert brightness-0" 
              src="https://lh3.googleusercontent.com/aida/AP1WRLscGNJdS5NsqKF4KqowgJj49_KZWuF1UhKLAC8hZaVLdyYizzzDoFXdh1vsY3Sv5TrmU1914085ncaT9mG90ISZ2MTEnXf2Y9Gp4KcsmU7Vm6sT-xT6BtFuTv9Vm-a7q4rG_uws9LHqr1dkhbfr0cZ4j4n-bXajZd5SD7A1Atk4txxuIi1YdEz0o-IkHb3XZmWOzZeQGMQg7AovZo8tj37ejaFb4SeMOBqFsz1k_0biHJ_-CAd83A5hS_U"
            />
          </div>
          <nav className="hidden md:flex items-center gap-xl font-label-md uppercase tracking-[0.2em]">
            <a className="hover:text-lavender-accent transition-colors" href="#about">Historia</a>
            <a className="hover:text-lavender-accent transition-colors" href="#mission">Filosofía</a>
            <a className="hover:text-lavender-accent transition-colors" href="#contact">Contacto</a>
            <a className="bg-white text-navy-dark px-lg py-sm ml-lg hover:bg-lavender-accent transition-all" href="#reservation">Reservar</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image 
              fill 
              priority 
              alt="Hotel Interior" 
              className="w-full h-full object-cover grayscale-[20%] brightness-75" 
              src="https://lh3.googleusercontent.com/aida/AP1WRLtPwlfbwi1Ky9nSAv2KxNfk090vr8eiJIR8obBu-fUeAr0SEBjuZY5LY_GcvBhcB_37fX42bRY0Lw83mqwkL8KYHum4cwyYILonESypL7S-dgcQ1E1vTa1ViPjErHWEMfHlVzKiKW2DfDKVMByAKEe4qChHdQxNjBwRuoe9R7KAlCArukdV1E6h_dsUMS8KilHO1K80UyECq2a94N2dBwayI59-McFaAD8q2K86jIrQNsXK82b_fTq-92da"
            />
          </div>
          <div className="relative z-10 w-full px-margin-desktop grid grid-cols-12 gap-gutter">
            <div className="col-span-12 lg:col-span-8 lg:col-start-2">
              <span className="text-white/60 font-label-md uppercase tracking-[0.4em] block mb-md">Establecido en 1960</span>
              <h1 className="text-white font-headline-lg text-[12vw] leading-[0.85] uppercase tracking-tighter mix-blend-overlay">
                Modern<br/>Heritage
              </h1>
              <p className="text-white text-body-lg max-w-lg mt-xl opacity-90 border-l-2 border-lavender-deep pl-space-lg">
                Cincuenta años de hospitalidad tradicional reinterpretados para el viajero contemporáneo en el corazón de San Pedro Sula.
              </p>
            </div>
          </div>
          <div className="absolute bottom-xl left-1/2 -translate-x-1/2 w-full max-w-5xl bg-white/10 backdrop-blur-lg border border-white/20 text-white p-lg md:px-margin-desktop shadow-2xl z-50">
            <div className="flex flex-col md:flex-row items-center gap-xl max-w-[1440px] mx-auto">
              <div className="flex flex-1 gap-lg w-full">
                <div className="flex-1 border-b border-white/20 pb-xs">
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-white">Entrada</label>
                  <input className="bg-transparent border-none p-0 w-full focus:ring-0 text-body-md invert" type="date" defaultValue="2024-05-20"/>
                </div>
                <div className="flex-1 border-b border-white/20 pb-xs">
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-white">Salida</label>
                  <input className="bg-transparent border-none p-0 w-full focus:ring-0 text-body-md invert" type="date" defaultValue="2024-05-25"/>
                </div>
              </div>
              <button className="bg-lavender-deep text-white px-xl py-md uppercase font-label-md tracking-widest hover:bg-white hover:text-navy-dark transition-all w-full md:w-auto shadow-lg">
                Explorar Habitaciones
              </button>
            </div>
          </div>
        </section>

        <section className="bg-surface" id="about">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
            <div className="relative bg-surface-dim p-xl md:p-[120px] flex flex-col justify-center">
              <div className="absolute top-0 left-0 p-lg text-navy-dark/10 text-[200px] font-bold leading-none select-none">1960</div>
              <div className="relative z-10">
                <span className="text-lavender-deep font-label-md uppercase tracking-[0.3em] block mb-lg">Nuestra Trayectoria</span>
                <h2 className="text-navy-dark font-headline-lg text-[clamp(40px,5vw,72px)] leading-tight mb-xl">Resiliencia y Tradición Sampedrana</h2>
                <div className="space-y-lg text-secondary text-body-lg max-w-xl">
                  <p>Como el tercer hotel fundado en la capital industrial, hemos sido testigos silenciosos de la evolución de una ciudad. Nuestra historia está escrita con la fuerza de quienes no se rinden.</p>
                  <p>Tras superar el incendio de 2012, renacimos manteniendo la esencia: ser el hogar fuera de casa para cada viajero que busca no solo una cama, sino una experiencia humana real.</p>
                </div>
                <div className="mt-xl flex gap-xl items-center border-t border-navy-dark/10 pt-xl">
                  <div className="text-center">
                    <span className="block text-4xl font-headline-md text-navy-dark">50+</span>
                    <span className="text-[10px] uppercase tracking-widest opacity-60">Años</span>
                  </div>
                  <div className="h-12 w-px bg-navy-dark/10"></div>
                  <div className="text-center">
                    <span className="block text-4xl font-headline-md text-navy-dark">03</span>
                    <span className="text-[10px] uppercase tracking-widest opacity-60">Fundación</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[600px] lg:h-auto overflow-hidden">
              <Image 
                fill 
                priority 
                alt="Historic San Pedro" 
                className="absolute inset-0 w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida/AP1WRLu0ipzN75yQSEA3aP2nGzHFQs5B6hOIxUrxtEKVC2Ftul2tTcYj9qSuI8V0kHMyojcB4CaGK5VwUgH3XUrWU2HSwB_Uqz0ywxXv7F8jB0zfJHpe1uF_WLl3M8Qhy1kNEpk81-a8gQ7CLMTncub2ea1G0IqXNcOzqlrrNAxylRqkrfsON-Vss6fMnlrVzn4fdI_wd0Ro1RttE8zychWwlvEAVfqKdpguET4IqaIi-Yn3spDSh-Blmev7gzg"
              />
              <div className="absolute inset-0 bg-navy-dark/10"></div>
              <div className="absolute bottom-xl right-xl bg-white p-lg shadow-2xl max-w-xs transform translate-y-12">
                <p className="font-body-sm italic text-secondary">"Queremos que cada huésped se sientan en casa, rodeado de respeto y calidez."</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-navy-dark text-white py-[160px] relative overflow-hidden" id="mission">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
            <span className="text-[400px] font-bold leading-none -mr-40">2030</span>
          </div>
          <div className="max-w-[1440px] mx-auto px-margin-desktop relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-xl items-start">
              <div className="space-y-xl">
                <div>
                  <span className="inline-block px-4 py-1 border border-lavender-deep text-lavender-deep text-[10px] uppercase tracking-[0.3em] mb-md">Nuestra Misión</span>
                  <h3 className="text-headline-md text-5xl font-light mb-lg">El hogar fuera del hogar.</h3>
                  <p className="text-white/70 text-body-lg leading-relaxed">
                    Proporcionar un servicio de seguridad y calidez, cimentado en la tradición que nos define como referentes de la hospitalidad en Cortés.
                  </p>
                </div>
              </div>
              <div className="space-y-xl md:mt-40">
                <div>
                  <span className="inline-block px-4 py-1 border border-lavender-deep text-lavender-deep text-[10px] uppercase tracking-[0.3em] mb-md">Visión 2030</span>
                  <h3 className="text-headline-md text-5xl font-light mb-lg">Innovar sin perder la esencia.</h3>
                  <p className="text-white/70 text-body-lg leading-relaxed">
                    Consolidarnos como el hotel de referencia tradicional, integrando modernidad funcional manteniendo siempre nuestra alma familiar y resiliente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-[120px] bg-surface-dim">
          <div className="max-w-[1440px] mx-auto px-margin-desktop">
            <div className="flex flex-col md:flex-row justify-between items-end mb-[80px] gap-lg">
              <div className="max-w-2xl">
                <span className="text-lavender-deep font-label-md uppercase tracking-[0.3em] block mb-sm">Pilares</span>
                <h2 className="text-navy-dark font-headline-lg text-6xl">Lo que nos define.</h2>
              </div>
              <p className="text-secondary max-w-xs text-right hidden md:block uppercase tracking-widest text-[10px]">Compromiso con la excelencia desde el primer día.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              <div className="group border-t border-navy-dark/10 pt-lg hover:border-lavender-deep transition-all duration-500">
                <div className="flex justify-between items-start mb-md">
                  <span className="theme-material-symbols-outlined text-4xl text-navy-dark group-hover:text-lavender-deep transition-colors">verified</span>
                  <span className="text-[10px] font-bold text-navy-dark/20">01</span>
                </div>
                <h4 className="text-navy-dark font-headline-sm uppercase tracking-wider mb-sm">Responsabilidad</h4>
                <p className="text-secondary text-sm">Nuestro compromiso con el entorno y cada uno de nuestros huéspedes.</p>
              </div>
              <div className="group border-t border-navy-dark/10 pt-lg hover:border-lavender-deep transition-all duration-500">
                <div className="flex justify-between items-start mb-md">
                  <span className="theme-material-symbols-outlined text-4xl text-navy-dark group-hover:text-lavender-deep transition-colors">volunteer_activism</span>
                  <span className="text-[10px] font-bold text-navy-dark/20">02</span>
                </div>
                <h4 className="text-navy-dark font-headline-sm uppercase tracking-wider mb-sm">Honestidad</h4>
                <p className="text-secondary text-sm">Transparencia absoluta en cada interacción y servicio ofrecido.</p>
              </div>
              <div className="group border-t border-navy-dark/10 pt-lg hover:border-lavender-deep transition-all duration-500">
                <div className="flex justify-between items-start mb-md">
                  <span className="theme-material-symbols-outlined text-4xl text-navy-dark group-hover:text-lavender-deep transition-colors">handshake</span>
                  <span className="text-[10px] font-bold text-navy-dark/20">03</span>
                </div>
                <h4 className="text-navy-dark font-headline-sm uppercase tracking-wider mb-sm">Compromiso</h4>
                <p className="text-secondary text-sm">Dedicación total para superar las expectativas de su estadía.</p>
              </div>
              <div className="group border-t border-navy-dark/10 pt-lg hover:border-lavender-deep transition-all duration-500">
                <div className="flex justify-between items-start mb-md">
                  <span className="theme-material-symbols-outlined text-4xl text-navy-dark group-hover:text-lavender-deep transition-colors">diversity_3</span>
                  <span className="text-[10px] font-bold text-navy-dark/20">04</span>
                </div>
                <h4 className="text-navy-dark font-headline-sm uppercase tracking-wider mb-sm">Respeto</h4>
                <p className="text-secondary text-sm">Valoramos la diversidad y la individualidad de cada visitante.</p>
              </div>
              <div className="group border-t border-navy-dark/10 pt-lg hover:border-lavender-deep transition-all duration-500">
                <div className="flex justify-between items-start mb-md">
                  <span className="theme-material-symbols-outlined text-4xl text-navy-dark group-hover:text-lavender-deep transition-colors">apartment</span>
                  <span className="text-[10px] font-bold text-navy-dark/20">05</span>
                </div>
                <h4 className="text-navy-dark font-headline-sm uppercase tracking-wider mb-sm">Hospitalidad</h4>
                <p className="text-secondary text-sm">La esencia sampedrana de dar la bienvenida con el corazón.</p>
              </div>
              <div className="group border-t border-navy-dark/10 pt-lg hover:border-lavender-deep transition-all duration-500">
                <div className="flex justify-between items-start mb-md">
                  <span className="theme-material-symbols-outlined text-4xl text-navy-dark group-hover:text-lavender-deep transition-colors">lock</span>
                  <span className="text-[10px] font-bold text-navy-dark/20">06</span>
                </div>
                <h4 className="text-navy-dark font-headline-sm uppercase tracking-wider mb-sm">Confianza</h4>
                <p className="text-secondary text-sm">Construyendo relaciones seguras y duraderas por generaciones.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative h-[80vh] flex items-center overflow-hidden">
          {/* Siguiente imagen corregida con la URL del mapa/comedor según el diseño */}
          <Image 
            alt="Dining Area" 
            fill 
            priority 
            className="absolute inset-0 w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida/AP1WRLu0ipzN75yQSEA3aP2nGzHFQs5B6hOIxUrxtEKVC2Ftul2tTcYj9qSuI8V0kHMyojcB4CaGK5VwUgH3XUrWU2HSwB_Uqz0ywxXv7F8jB0zfJHpe1uF_WLl3M8Qhy1kNEpk81-a8gQ7CLMTncub2ea1G0IqXNcOzqlrrNAxylRqkrfsON-Vss6fMnlrVzn4fdI_wd0Ro1RttE8zychWwlvEAVfqKdpguET4IqaIi-Yn3spDSh-Blmev7gzg"
          />
          <div className="absolute inset-0 bg-navy-dark/40"></div>
          <div className="relative z-10 w-full px-margin-desktop flex justify-end">
            <div className="bg-white p-xl max-w-xl shadow-2xl">
              <span className="text-lavender-deep font-label-md uppercase tracking-[0.3em] block mb-md">Experiencias</span>
              <h3 className="text-navy-dark font-headline-lg text-4xl mb-lg leading-tight">Atención que Reconforta</h3>
              <p className="text-secondary text-body-lg mb-xl">
                No solo ofrecemos una habitación; brindamos la calidez de un hogar. Contamos con residentes que han hecho del Hotel San Pedro su residencia permanente, testimonio fiel de nuestro trato cercano.
              </p>
              <button className="bg-navy-dark text-white px-lg py-md uppercase font-label-md tracking-widest hover:bg-lavender-deep transition-all">
                Descubra Más
              </button>
            </div>
          </div>
        </section>

        <section className="py-[120px]" id="contact">
          <div className="max-w-[1440px] mx-auto px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-xl items-start">
            <div className="lg:col-span-4">
              <h2 className="text-navy-dark font-headline-lg text-5xl mb-xl">Conecte con nosotros.</h2>
              <div className="space-y-lg">
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-lavender-deep font-bold mb-xs">Ubicación</h4>
                  <p className="text-body-lg text-secondary">3 calle entre la 1 y 2 avenida, San Pedro Sula, Cortés, Honduras.</p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-lavender-deep font-bold mb-xs">Reservaciones</h4>
                  <p className="text-headline-sm text-navy-dark">+504 2550-0000</p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-lavender-deep font-bold mb-xs">Email</h4>
                  <p className="text-body-lg text-secondary underline">info@hotelsanpedro.com</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8 bg-surface-dim p-xl border border-navy-dark/5">
              <form className="space-y-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="space-y-xs">
                    <label className="text-[10px] uppercase tracking-widest font-bold">Nombre</label>
                    <input className="w-full bg-transparent border-b border-navy-dark/20 focus:border-lavender-deep focus:ring-0 p-xs transition-all" type="text"/>
                  </div>
                  <div className="space-y-xs">
                    <label className="text-[10px] uppercase tracking-widest font-bold">Email</label>
                    <input className="w-full bg-transparent border-b border-navy-dark/20 focus:border-lavender-deep focus:ring-0 p-xs transition-all" type="email"/>
                  </div>
                </div>
                <div className="space-y-xs">
                  <label className="text-[10px] uppercase tracking-widest font-bold">Mensaje</label>
                  <textarea className="w-full bg-transparent border-b border-navy-dark/20 focus:border-lavender-deep focus:ring-0 p-xs transition-all" rows="4"></textarea>
                </div>
                <button className="w-full bg-navy-dark text-white py-md uppercase font-label-md tracking-widest hover:bg-lavender-deep transition-all">Enviar Mensaje</button>
              </form>
            </div>
          </div>
          <div className="mt-xl h-[400px] w-full px-margin-desktop overflow-hidden grayscale contrast-125 relative">
            <Image 
              fill 
              priority 
              alt="Map" 
              className="w-full h-full object-cover opacity-60" 
              src="https://lh3.googleusercontent.com/aida/AP1WRLu0ipzN75yQSEA3aP2nGzHFQs5B6hOIxUrxtEKVC2Ftul2tTcYj9qSuI8V0kHMyojcB4CaGK5VwUgH3XUrWU2HSwB_Uqz0ywxXv7F8jB0zfJHpe1uF_WLl3M8Qhy1kNEpk81-a8gQ7CLMTncub2ea1G0IqXNcOzqlrrNAxylRqkrfsON-Vss6fMnlrVzn4fdI_wd0Ro1RttE8zychWwlvEAVfqKdpguET4IqaIi-Yn3spDSh-Blmev7gzg"
            />
          </div>
        </section>
      </main>

      <footer className="bg-navy-dark text-white py-xl border-t border-white/5">
        <div className="max-w-[1440px] mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-start gap-xl">
          <div className="space-y-md">
            <div className="h-8 relative w-32">
              <Image 
                fill 
                priority 
                alt="Hotel San Pedro" 
                className="h-full w-auto invert brightness-0 object-contain" 
                src="https://lh3.googleusercontent.com/aida/AP1WRLscGNJdS5NsqKF4KqowgJj49_KZWuF1UhKLAC8hZaVLdyYizzzDoFXdh1vsY3Sv5TrmU1914085ncaT9mG90ISZ2MTEnXf2Y9Gp4KcsmU7Vm6sT-xT6BtFuTv9Vm-a7q4rG_uws9LHqr1dkhbfr0cZ4j4n-bXajZd5SD7A1Atk4txxuIi1YdEz0o-IkHb3XZmWOzZeQGMQg7AovZo8tj37ejaFb4SeMOBqFsz1k_0biHJ_-CAd83A5hS_U"
              />
            </div>
            <p className="text-white/40 text-sm max-w-xs">Liderando la hospitalidad tradicional desde 1960. Un refugio de resiliencia y calidez.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-xl">
            <div className="space-y-md">
              <h5 className="text-[10px] uppercase tracking-widest text-lavender-deep font-bold">El Hotel</h5>
              <ul className="space-y-xs text-sm text-white/60">
                <li><a className="hover:text-white transition-colors" href="#">Habitaciones</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Restaurante</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Salones</a></li>
              </ul>
            </div>
            <div className="space-y-md">
              <h5 className="text-[10px] uppercase tracking-widest text-lavender-deep font-bold">Empresa</h5>
              <ul className="space-y-xs text-sm text-white/60">
                <li><a className="hover:text-white transition-colors" href="#">Carreras</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Noticias</a></li>
              </ul>
            </div>
            <div className="space-y-md">
              <h5 className="text-[10px] uppercase tracking-widest text-lavender-deep font-bold">Legal</h5>
              <ul className="space-y-xs text-sm text-white/60">
                <li><a className="hover:text-white transition-colors" href="#">Privacidad</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Términos</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-margin-desktop mt-xl pt-lg border-t border-white/5 flex justify-between items-center text-[10px] uppercase tracking-widest text-white/30">
          <p>© 2024 Hotel San Pedro.</p>
          <div className="flex gap-lg">
            <a className="hover:text-white transition-colors" href="#">FB</a>
            <a className="hover:text-white transition-colors" href="#">IG</a>
          </div>
        </div>
      </footer>
    </div>
  );
}