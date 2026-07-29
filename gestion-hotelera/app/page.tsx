"use client";

import img1 from '@/public/img1.jpg';
import img3 from '@/public/img3.jpg';
import img4 from '@/public/img4.jpg';
import logo from '@/public/logo.png';
import Image from "next/image";
import { toast } from "sonner";
import { useEffect, useState, useMemo } from "react";
import { useHabitacionesDisponibles, crearReserva, Reserva } from "@/functions/reservas"
import { ValidatedInput, ValidatedSelect } from "@/components/ui/validated-field";

type TipoHabitacion = "Básica" | "Doble-Básica" | "Estandar" | "Doble-Estandar";

const TARIFAS: Record<TipoHabitacion, { nombre: string; precio: number; desc: string }> = {
  'Básica': { nombre: 'Habitación Básica', precio: 350, desc: 'Esencial, cómoda y funcional.' },
  'Estandar': { nombre: 'Habitación Estándar', precio: 500, desc: 'Espaciosa, ideal para ejecutivos.' },
  'Doble-Básica': { nombre: 'Doble Básica', precio: 500, desc: 'Perfecta para estadías familiares cortas.' },
  'Doble-Estandar': { nombre: 'Doble Estándar', precio: 650, desc: 'Confort prémium con espacio optimizado.' },
};

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState<{ [key: string]: boolean }>({});

  const [isActive, setIsActive] = useState(false); // Controla la apertura del Modal
  const [cargando, setCargando] = useState(false);

  // Estados del Formulario del Huésped dentro del Modal
  // 1. Datos de contacto
  const [nombreHuesped, setNombreHuesped] = useState('');
  const [apellidoHuesped, setApellidoHuesped] = useState('');
  const [emailHuesped, setEmailHuesped] = useState('');
  const [telefonoHuesped, setTelefonoHuesped] = useState('');
  const [dniHuesped, setDniHuesped] = useState('');

  // 2. Detalles de la estancia
  const obtenerFechaHoy = () => new Date().toISOString().split('T')[0];
  const obtenerFechaManana = () => {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    return manana.toISOString().split('T')[0];
  };
  const [fechaIn, setFechaIn] = useState(obtenerFechaHoy());
  const [fechaOut, setFechaOut] = useState(obtenerFechaManana());
  const [numeroHuespedes, setNumeroHuespedes] = useState(1);
  const [horaLlegada, setHoraLlegada] = useState('15:00');

  // 3. Datos adicionales
  const [peticionesCama, setPeticionesCama] = useState('Indiferente');

  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoHabitacion>("Estandar");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { data: habitacionesApi, refetch } = useHabitacionesDisponibles(fechaIn, fechaOut);

  // LÓGICA DE PRODUCTO: Buscar qué habitaciones físicas están "Disponibles" para el tipo seleccionado
  const habitacionFisicaAsignable = useMemo(() => {
    return habitacionesApi || [];
    /*return habitacionesData.find(
      h => h.tipo === tipoSeleccionado && h.estado?.toLowerCase() === "disponible"
    );*/
  }, [habitacionesApi]);

  // Cálculos dinámicos del desglose de precios
  const calculosReserva = useMemo(() => {
    const checkIn = new Date(fechaIn);
    const checkOut = new Date(fechaOut);
    const diferenciaTiempo = checkOut.getTime() - checkIn.getTime();
    const noches = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24)) || 1;

    const precioPorNoche = TARIFAS[tipoSeleccionado].precio;
    const subtotal = precioPorNoche * noches * 0.85;
    const impuestos = precioPorNoche * noches * 0.15; // 15% ISV de Honduras
    const total = impuestos + subtotal;

    return { noches, precioPorNoche, subtotal, impuestos, total };
  }, [fechaIn, fechaOut, tipoSeleccionado]);

  const handleHabitacionesDisponibles = () => {
    setIsActive(true);
    setFormErrors({});
    refetch();
  };

  const validateReservationForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!nombreHuesped.trim() || nombreHuesped.trim().length < 2 || nombreHuesped.trim().length > 60) {
      nextErrors.nombreHuesped = "Ingresa un nombre válido de 2 a 60 caracteres.";
    }
    if (!apellidoHuesped.trim() || apellidoHuesped.trim().length < 2 || apellidoHuesped.trim().length > 80) {
      nextErrors.apellidoHuesped = "Ingresa un apellido válido de 2 a 80 caracteres.";
    }
    if (!emailHuesped.trim()) {
      nextErrors.emailHuesped = "Ingresa un correo electrónico.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailHuesped)) {
      nextErrors.emailHuesped = "El correo electrónico no es válido.";
    } else if (emailHuesped.trim().length > 120) {
      nextErrors.emailHuesped = "El correo electrónico no puede superar 120 caracteres.";
    }
    const telefonoDigits = telefonoHuesped.replace(/\D/g, "");
    if (!telefonoDigits) {
      nextErrors.telefonoHuesped = "Ingresa un teléfono.";
    } else if (telefonoDigits.length < 8 || telefonoDigits.length > 12) {
      nextErrors.telefonoHuesped = "El teléfono debe tener entre 8 y 12 dígitos.";
    }
    if (!dniHuesped.trim() || !/^([0-9]{13}|[0-9]{4}-[0-9]{4}-[0-9]{5})$/.test(dniHuesped.trim())) {
      nextErrors.dniHuesped = "El documento debe tener formato válido (13 dígitos o 4-4-5).";
    }
    if (!fechaIn) {
      nextErrors.fechaIn = "Selecciona la fecha de entrada.";
    }
    if (!fechaOut) {
      nextErrors.fechaOut = "Selecciona la fecha de salida.";
    } else if (new Date(fechaOut) <= new Date(fechaIn)) {
      nextErrors.fechaOut = "La salida debe ser posterior a la entrada.";
    }
    if (!habitacionFisicaAsignable?.length) {
      nextErrors.room = "No hay habitaciones disponibles para estas fechas.";
    }

    setFormErrors(nextErrors);
    setTouched({
      nombreHuesped: true,
      apellidoHuesped: true,
      emailHuesped: true,
      telefonoHuesped: true,
      dniHuesped: true,
      fechaIn: true,
      fechaOut: true,
      numeroHuespedes: true,
      horaLlegada: true,
      peticionesCama: true,
    });
    return Object.keys(nextErrors).length === 0;
  };

  const validateReservationField = (field: string) => {
    const nextErrors: Record<string, string> = { ...formErrors };

    switch (field) {
      case "nombreHuesped":
        if (!nombreHuesped.trim() || nombreHuesped.trim().length < 2 || nombreHuesped.trim().length > 60) {
          nextErrors.nombreHuesped = "Ingresa un nombre válido de 2 a 60 caracteres.";
        } else {
          delete nextErrors.nombreHuesped;
        }
        break;
      case "apellidoHuesped":
        if (!apellidoHuesped.trim() || apellidoHuesped.trim().length < 2 || apellidoHuesped.trim().length > 80) {
          nextErrors.apellidoHuesped = "Ingresa un apellido válido de 2 a 80 caracteres.";
        } else {
          delete nextErrors.apellidoHuesped;
        }
        break;
      case "emailHuesped":
        if (!emailHuesped.trim()) {
          nextErrors.emailHuesped = "Ingresa un correo electrónico.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailHuesped)) {
          nextErrors.emailHuesped = "El correo electrónico no es válido.";
        } else if (emailHuesped.trim().length > 120) {
          nextErrors.emailHuesped = "El correo electrónico no puede superar 120 caracteres.";
        } else {
          delete nextErrors.emailHuesped;
        }
        break;
      case "telefonoHuesped":
        {
          const telefonoDigits = telefonoHuesped.replace(/\D/g, "");
          if (!telefonoDigits) {
            nextErrors.telefonoHuesped = "Ingresa un teléfono.";
          } else if (telefonoDigits.length < 8 || telefonoDigits.length > 12) {
            nextErrors.telefonoHuesped = "El teléfono debe tener entre 8 y 12 dígitos.";
          } else {
            delete nextErrors.telefonoHuesped;
          }
        }
        break;
      case "dniHuesped":
        if (!dniHuesped.trim() || !/^([0-9]{13}|[0-9]{4}-[0-9]{4}-[0-9]{5})$/.test(dniHuesped.trim())) {
          nextErrors.dniHuesped = "El documento debe tener formato válido (13 dígitos o 4-4-5).";
        } else {
          delete nextErrors.dniHuesped;
        }
        break;
      case "fechaIn":
        if (!fechaIn) {
          nextErrors.fechaIn = "Selecciona la fecha de entrada.";
        } else {
          delete nextErrors.fechaIn;
        }
        break;
      case "fechaOut":
        if (!fechaOut) {
          nextErrors.fechaOut = "Selecciona la fecha de salida.";
        } else if (new Date(fechaOut) <= new Date(fechaIn)) {
          nextErrors.fechaOut = "La salida debe ser posterior a la entrada.";
        } else {
          delete nextErrors.fechaOut;
        }
        break;
    }

    setFormErrors(nextErrors);
    setTouched((prev) => ({ ...prev, [field]: true }));
    return !nextErrors[field];
  };

  const handleFinalizarReserva = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateReservationForm()) {
      return;
    }

    if (!habitacionFisicaAsignable?.length) {
      setFormErrors((prev) => ({ ...prev, room: "No hay habitaciones disponibles para estas fechas." }));
      return;
    }

    // Estructura adaptada incluyendo los nuevos datos capturados
    const nuevaReserva: Reserva & Record<string, string | number | undefined> = {
      nombres: nombreHuesped,
      apellidos: apellidoHuesped,
      telefono: telefonoHuesped,
      email: emailHuesped,
      dni: dniHuesped,
      espacio_id: habitacionFisicaAsignable[0].espacio_id,
      fecha_entrada: fechaIn,
      fecha_salida: fechaOut,
    };

    setCargando(true);
    try {
      const respuesta = await crearReserva(nuevaReserva);
      toast.success(respuesta.message || "¡Reserva creada exitosamente!");
      setIsActive(false);
      // Limpiar formulario
      setNombreHuesped('');
      setEmailHuesped('');
      setTelefonoHuesped('');
      setNumeroHuespedes(1);
      setHoraLlegada('15:00');
      setPeticionesCama('Indiferente');
    } catch {
      toast.error("No se pudo procesar la reserva. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
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

    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.12 };
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

      <style jsx global>{`
        .cubic-fluid { transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes customFadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes heroReveal { from { transform: scale(1.15); filter: brightness(0.4); } to { transform: scale(1.05); filter: brightness(0.75); } }
        .animate-fade-up { animation: customFadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-hero-img { animation: heroReveal 2s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>

      {/* HEADER */}
      <header className="fixed p-1 sm:p-2 md:p-4 top-0 w-full z-50 flex items-center transition-all duration-500 cubic-fluid">
        <div className={`w-full transition-all duration-300 ease-linear rounded-lg py-1 sm:py-2 md:py-4 px-4 sm:px-8 md:px-16 flex justify-between items-center text-white ${isScrolled ? 'bg-[#0f172a]/40 backdrop-blur-md h-20 shadow-xl' : 'bg-transparent'}`}>
          <div className="h-10 transition-transform duration-500 cubic-fluid hover:scale-105">
            <Image width={66} height={80} alt="Hotel San Pedro" className="invert brightness-0" src={logo} />
          </div>
          <nav className="hidden md:flex items-center gap-16 text-xs font-['Hanken_Grotesk'] uppercase tracking-[0.2em]">
            <a className="hover:text-blue-200 transition-colors duration-300 relative group py-2" href="#about">Historia</a>
            <a className="hover:text-blue-200 transition-colors duration-300 relative group py-2" href="#mission">Filosofía</a>
            <a className="hover:text-blue-200 transition-colors duration-300 relative group py-2" href="#contact">Contacto</a>
            <a href="/auth" className="bg-white text-[#0f172a] px-6 py-4 rounded-xl border border-white transition-all duration-300 hover:bg-[#0f172a] hover:text-white text-xs sm:text-sm font-semibold">
              Ingresar
            </a>
            <button onClick={() => { setIsActive(true); refetch(); }} className="bg-white text-[#0f172a] px-8 py-4 ml-2 hover:bg-[#0f172a] hover:text-white border border-white transition-all duration-300 rounded-xl shadow-md">
              Reservar
            </button>
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
            <div className="absolute inset-0 bg-linear-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent z-10" />
          </div>

          <div className="relative z-20 w-full px-4 sm:px-8 md:px-16 grid grid-cols-12 gap-4 animate-fade-up">
            <div className="col-span-12 lg:col-span-8 lg:col-start-2">
              <span className="text-white/60 font-['Hanken_Grotesk'] uppercase tracking-[0.4em] block mb-4 sm:mb-6 text-xs sm:text-sm">Establecido en 1960</span>
              <h1 className="text-white font-['Hanken_Grotesk'] text-[clamp(1.875rem,9vw,11rem)] leading-[0.85] uppercase tracking-tighter mix-blend-overlay pr-4">
                Herencia<br />Moderna
              </h1>
              <p className="text-white text-sm sm:text-lg max-w-lg mt-4 sm:mt-8 opacity-90 border-l-2 border-white/40 pl-4 sm:pl-8">
                Sesenta años de hospitalidad tradicional reinterpretados para el viajero contemporáneo en el corazón de San Pedro Sula.
              </p>
            </div>
          </div>

          {/* BUSCADOR INTERACTIVO */}
          <div className="sm:mx-8 md:mx-16 w-full sm:rounded-4xl max-w-5xl bg-[#0f172a]/40 backdrop-blur-xl border border-white/10 text-white p-4 sm:p-6 md:px-12 shadow-2xl z-30 animate-fade-up delay-300 self-center lg:self-auto">
            <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-8 md:gap-12 max-w-360 mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full flex-1">
                <div className="flex-1 border-b border-white/20 pb-2 focus-within:border-white transition-colors duration-300">
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-white/60">Entrada</label>
                  <input className="bg-transparent border-none text-white p-0 w-full focus:ring-0 text-md outline-hidden accent-blue-500" type="date" value={fechaIn} min={obtenerFechaHoy()} onChange={(e) => setFechaIn(e.target.value)} />
                </div>
                <div className="flex-1 border-b border-white/20 pb-2 focus-within:border-white transition-colors duration-300">
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-white/60">Salida</label>
                  <input className="bg-transparent border-none text-white p-0 w-full focus:ring-0 text-md outline-hidden accent-blue-500" type="date" value={fechaOut} min={fechaIn} onChange={(e) => setFechaOut(e.target.value)} />
                </div>
              </div>
              <button onClick={handleHabitacionesDisponibles} className="rounded-2xl bg-white text-[#0f172a] px-6 sm:px-16 py-4 sm:py-6 uppercase font-['Hanken_Grotesk'] tracking-widest hover:bg-[#0f172a] text-xs sm:text-sm hover:text-white border border-white transition-all duration-500 w-full md:w-auto shadow-xl hover:-translate-y-1 cursor-pointer">
                Explorar Habitaciones
              </button>
            </div>
          </div>
        </section>

        {/* ================= MODAL DE RESERVAS ESTILIZADO ================= */}
        {isActive && (
          <div className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-500">
            <section className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col transform animate-fade-up">

              {/* Encabezado elegante a juego con la marca oscura */}
              <div className="px-8 py-5 bg-[#0f172a] text-white flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-wider text-white">Solicitud de Reserva</h2>
                  <p className="text-xs text-white/60">Personaliza tus datos y confirma tu estadía tradicional</p>
                </div>
                <button onClick={() => setIsActive(false)} className="text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                  ✕
                </button>
              </div>

              {/* Formulario en dos columnas */}
              <form onSubmit={handleFinalizarReserva} className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12">

                {/* Columna Izquierda: Formulario */}
                <div className="p-8 md:col-span-7 space-y-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-4">1. Datos de Contacto</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Nombre Completo *</label>
                        <ValidatedInput label="Nombre Completo *" value={nombreHuesped} onChange={(value) => { setNombreHuesped(value); setFormErrors((prev) => ({ ...prev, nombreHuesped: "" })); }} onBlur={() => { setTouched((prev) => ({ ...prev, nombreHuesped: true })); validateReservationField("nombreHuesped"); }} onFocus={() => setTouched((prev) => ({ ...prev, nombreHuesped: true }))} error={formErrors.nombreHuesped} touched={touched.nombreHuesped || Boolean(formErrors.nombreHuesped)} placeholder="Ej. Jeferson Alexander" className="border-b border-slate-200 bg-transparent px-0 py-2 text-sm focus:border-[#0f172a]" containerClassName="" required />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Apellido Completo *</label>
                        <ValidatedInput label="Apellido Completo *" value={apellidoHuesped} onChange={(value) => { setApellidoHuesped(value); setFormErrors((prev) => ({ ...prev, apellidoHuesped: "" })); }} onBlur={() => { setTouched((prev) => ({ ...prev, apellidoHuesped: true })); validateReservationField("apellidoHuesped"); }} onFocus={() => setTouched((prev) => ({ ...prev, apellidoHuesped: true }))} error={formErrors.apellidoHuesped} touched={touched.apellidoHuesped || Boolean(formErrors.apellidoHuesped)} placeholder="Ej. Umanzor Lagos" className="border-b border-slate-200 bg-transparent px-0 py-2 text-sm focus:border-[#0f172a]" containerClassName="" required />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Email *</label>
                          <ValidatedInput label="Email *" type="email" value={emailHuesped} onChange={(value) => { setEmailHuesped(value); setFormErrors((prev) => ({ ...prev, emailHuesped: "" })); }} onBlur={() => { setTouched((prev) => ({ ...prev, emailHuesped: true })); validateReservationField("emailHuesped"); }} onFocus={() => setTouched((prev) => ({ ...prev, emailHuesped: true }))} error={formErrors.emailHuesped} touched={touched.emailHuesped || Boolean(formErrors.emailHuesped)} placeholder="huesped@gmail.com" className="border-b border-slate-200 bg-transparent px-0 py-2 text-sm focus:border-[#0f172a]" containerClassName="" required />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Teléfono *</label>
                          <ValidatedInput label="Teléfono *" type="tel" value={telefonoHuesped} onChange={(value) => { setTelefonoHuesped(value); setFormErrors((prev) => ({ ...prev, telefonoHuesped: "" })); }} onBlur={() => { setTouched((prev) => ({ ...prev, telefonoHuesped: true })); validateReservationField("telefonoHuesped"); }} onFocus={() => setTouched((prev) => ({ ...prev, telefonoHuesped: true }))} error={formErrors.telefonoHuesped} touched={touched.telefonoHuesped || Boolean(formErrors.telefonoHuesped)} placeholder="50425500000" className="border-b border-slate-200 bg-transparent px-0 py-2 text-sm focus:border-[#0f172a]" containerClassName="" required />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">DNI *</label>
                          <ValidatedInput label="DNI *" value={dniHuesped} onChange={(value) => { setDniHuesped(value); setFormErrors((prev) => ({ ...prev, dniHuesped: "" })); }} onBlur={() => { setTouched((prev) => ({ ...prev, dniHuesped: true })); validateReservationField("dniHuesped"); }} onFocus={() => setTouched((prev) => ({ ...prev, dniHuesped: true }))} error={formErrors.dniHuesped} touched={touched.dniHuesped || Boolean(formErrors.dniHuesped)} placeholder="0501-2000-01234" className="border-b border-slate-200 bg-transparent px-0 py-2 text-sm focus:border-[#0f172a]" containerClassName="" required />
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-4">2. Detalles de la Estancia</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Fecha de Entrada *</label>
                        <ValidatedInput label="Fecha de Entrada *" type="date" value={fechaIn} onChange={(value) => { setFechaIn(value); setFormErrors((prev) => ({ ...prev, fechaIn: "" })); }} onBlur={() => { setTouched((prev) => ({ ...prev, fechaIn: true })); validateReservationField("fechaIn"); }} onFocus={() => setTouched((prev) => ({ ...prev, fechaIn: true }))} error={formErrors.fechaIn} touched={touched.fechaIn || Boolean(formErrors.fechaIn)} className="border-b border-slate-200 bg-transparent px-0 py-2 text-sm focus:border-[#0f172a]" containerClassName="" required />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Fecha de Salida *</label>
                        <ValidatedInput label="Fecha de Salida *" type="date" value={fechaOut} onChange={(value) => { setFechaOut(value); setFormErrors((prev) => ({ ...prev, fechaOut: "" })); }} onBlur={() => { setTouched((prev) => ({ ...prev, fechaOut: true })); validateReservationField("fechaOut"); }} onFocus={() => setTouched((prev) => ({ ...prev, fechaOut: true }))} error={formErrors.fechaOut} touched={touched.fechaOut || Boolean(formErrors.fechaOut)} className="border-b border-slate-200 bg-transparent px-0 py-2 text-sm focus:border-[#0f172a]" containerClassName="" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Número de Huéspedes *</label>
                        <ValidatedInput label="Número de Huéspedes *" type="number" value={String(numeroHuespedes)} onChange={(value) => setNumeroHuespedes(Number(value))} onBlur={() => setTouched((prev) => ({ ...prev, numeroHuespedes: true }))} onFocus={() => setTouched((prev) => ({ ...prev, numeroHuespedes: true }))} touched={touched.numeroHuespedes} className="border-b border-slate-200 bg-transparent px-0 py-2 text-sm focus:border-[#0f172a]" containerClassName="" required />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Hora Estimada de Llegada *</label>
                        <ValidatedInput label="Hora Estimada de Llegada *" type="time" value={horaLlegada} onChange={(value) => setHoraLlegada(value)} onBlur={() => setTouched((prev) => ({ ...prev, horaLlegada: true }))} onFocus={() => setTouched((prev) => ({ ...prev, horaLlegada: true }))} touched={touched.horaLlegada} className="border-b border-slate-200 bg-transparent px-0 py-2 text-sm focus:border-[#0f172a]" containerClassName="" required />
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-4">3. Datos Adicionales</h3>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-2">Preferencia de Cama</label>
                      <ValidatedSelect label="Preferencia de Cama" value={peticionesCama} onChange={(value) => setPeticionesCama(value)} onBlur={() => setTouched((prev) => ({ ...prev, peticionesCama: true }))} onFocus={() => setTouched((prev) => ({ ...prev, peticionesCama: true }))} touched={touched.peticionesCama} className="rounded-xl border-slate-200 bg-white p-3 text-sm" containerClassName="" options={[{ label: "Sin preferencia", value: "Indiferente" }, { label: "Una Cama Grande (Matrimonial/King)", value: "Una Cama Matrimonial / King" }, { label: "Dos Camas Separadas", value: "Dos Camas Individuales" }]} />
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-4">4. Categoría de Alojamiento</h3>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-2">Selecciona tu habitación ideal</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(Object.keys(TARIFAS) as TipoHabitacion[]).map((key) => (
                          <div
                            key={key}
                            onClick={() => setTipoSeleccionado(key)}
                            className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${tipoSeleccionado === key ? 'border-[#0f172a] bg-slate-50 shadow-sm' : 'border-slate-200 hover:border-slate-400'}`}
                          >
                            <p className="text-sm font-bold text-[#0f172a]">{TARIFAS[key].nombre}</p>
                            <p className="text-[11px] text-slate-400 mb-2 leading-tight">{TARIFAS[key].desc}</p>
                            <p className="text-xs font-semibold text-blue-700">L. {TARIFAS[key].precio}.00 <span className="text-[10px] font-normal text-slate-400">/ noche</span></p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Columna Derecha: Checkout Sidebar */}
                <div className="p-8 bg-slate-50 md:col-span-5 border-t md:border-t-0 md:border-l border-slate-100 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Resumen del Viaje</h3>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-2 text-center divide-x divide-slate-100 mb-6 shadow-xs">
                      <div>
                        <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Check-In</p>
                        <p className="text-xs font-bold text-slate-700">{fechaIn}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Check-Out</p>
                        <p className="text-xs font-bold text-slate-700">{fechaOut}</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs text-slate-600 px-1">
                      <div className="flex justify-between">
                        <span>{TARIFAS[tipoSeleccionado].nombre}</span>
                        <span className="font-bold text-[#0f172a]">L. {calculosReserva.precioPorNoche.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Huéspedes</span>
                        <span className="font-semibold text-slate-700">{numeroHuespedes} {numeroHuespedes === 1 ? 'persona' : 'personas'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estadía completa</span>
                        <span className="font-semibold text-slate-700">{calculosReserva.noches} {calculosReserva.noches === 1 ? 'noche' : 'noches'}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Subtotal</span>
                        <span>L. {calculosReserva.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Impuestos locales (15%)</span>
                        <span>L. {calculosReserva.impuestos.toFixed(2)}</span>
                      </div>

                      <hr className="border-dashed border-slate-200 my-4" />

                      <div className="flex justify-between text-sm font-bold text-[#0f172a]">
                        <span className="uppercase tracking-wider">Total Final</span>
                        <span className="text-lg text-emerald-700">L. {calculosReserva.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={cargando}
                      className="flex w-full items-center justify-center gap-2 rounded-[2.5rem] bg-slate-950 px-5 py-3 text-[14px] font-semibold leading-4 tracking-wider text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {cargando ? "Procesando..." : "Confirmar Mi Estadía"}
                    </button>
                    <p className="text-[9px] text-center text-slate-400 mt-3 leading-tight">
                      Al presionar confirmar se enviará una solicitud directa a recepción para asegurar tu espacio.
                    </p>
                  </div>
                </div>

              </form>
            </section>
          </div>
        )}

        {/* SECTION: ABOUT */}
        <section className="bg-[#ffffff] overflow-hidden" id="about">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
            <div className="relative bg-slate-50 p-4 sm:p-8 md:p-16 lg:p-30 flex flex-col justify-center">
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
                <div className="mt-8 sm:mt-16 flex gap-8 sm:gap-16 items-center border-t border-[#0f172a]/10 pt-8 sm:pt-16">
                  <div className="text-center group cursor-default">
                    <span className="text-2xl sm:text-4xl font-['Hanken_Grotesk'] text-[#0f172a] group-hover:text-blue-700 transition-colors duration-300 inline-block">50+</span>
                    <span className="block text-[10px] uppercase tracking-widest opacity-60 mt-1">Años</span>
                  </div>
                  <div className="h-12 w-px bg-[#0f172a]/10"></div>
                  <div className="text-center group cursor-default">
                    <span className="text-2xl sm:text-4xl font-['Hanken_Grotesk'] text-[#0f172a] group-hover:text-blue-700 transition-colors duration-300 inline-block">03</span>
                    <span className="block text-[10px] uppercase tracking-widest opacity-60 mt-1">Fundación</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-64 sm:h-96 lg:h-auto overflow-hidden group">
              <Image fill alt="Historic San Pedro" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" src={img3} />
              <div className="absolute inset-0 bg-[#0f172a]/10 transition-opacity duration-500" />
              <div className={`absolute bottom-4 sm:bottom-12 right-4 sm:right-12 bg-white p-6 sm:p-8 shadow-2xl max-w-xs transition-all duration-1000 delay-300 ${visibleSections['about'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} hover:-translate-y-2`}>
                <p className="font-['Hanken_Grotesk'] italic text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed">
                  “Queremos que cada huésped se sientan en casa, rodeado de respeto y calidez.”
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: MISSION */}
        <section className="bg-[#0f172a] text-white py-16 sm:py-24 md:py-40 relative overflow-hidden" id="mission">
          <div className="absolute right-0 top-0 opacity-5 pointer-events-none overflow-hidden select-none">
            <span className="text-[clamp(100px,20vw,400px)] font-bold leading-none -mr-40 block">2030</span>
          </div>
          <div className="max-w-360 mx-auto px-4 sm:px-8 md:px-16 relative z-10">
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16 items-start transition-all duration-1000 ${visibleSections['mission'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
              <div className="space-y-8 sm:space-y-16 group">
                <div className="p-2 group-hover:translate-x-2 transition-transform duration-500">
                  <span className="inline-block px-4 py-1 border border-white/30 text-white/80 text-[10px] uppercase tracking-[0.3em] mb-4 sm:mb-6 rounded-full">Nuestra Misión</span>
                  <h3 className="font-['Hanken_Grotesk'] text-[clamp(1.25rem,4vw,2.25rem)] font-light mb-4 sm:mb-8 text-white">El hogar fuera del hogar.</h3>
                  <p className="text-white/70 text-sm sm:text-lg leading-relaxed max-w-md">
                    Proporcionar un servicio de seguridad y calidez, cimentado en la tradición que nos define como referentes de la hospitalidad en Cortés.
                  </p>
                </div>
              </div>
              <div className="space-y-8 sm:space-y-16 md:mt-40 group">
                <div className="p-2 group-hover:translate-x-2 transition-transform duration-500 delay-150">
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

        {/* SECTION: PILARES */}
        <section className="py-16 sm:py-24 md:py-40 bg-slate-50">
          <div className="max-w-360 mx-auto px-4 sm:px-8 md:px-16 data-reveal">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 sm:mb-20 gap-4 sm:gap-8">
              <div className="max-w-2xl">
                <span className="text-blue-700 font-['Hanken_Grotesk'] uppercase tracking-[0.3em] block mb-2 sm:mb-4 text-xs">Pilares</span>
                <h2 className="text-[#0f172a] font-['Hanken_Grotesk'] text-[clamp(1.5rem,5vw,3.75rem)]">Lo que nos define.</h2>
              </div>
              <p className="text-slate-500 max-w-xs text-right hidden md:block uppercase tracking-widest text-[10px]">Compromiso con la excelencia desde el primer día.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-12 reveal-on-scroll">
              {[
                { icon: "verified", id: "01", title: "Responsabilidad", desc: "Nuestro compromiso con el entorno y cada uno de nuestros huéspedes." },
                { icon: "volunteer_activism", id: "02", title: "Honestidad", desc: "Transparencia absoluta en cada interacción y servicio ofrecido." },
                { icon: "handshake", id: "03", title: "Compromiso", desc: "Dedicación total para superar las expectativas de su estadía." },
                { icon: "diversity_3", id: "04", title: "Respeto", desc: "Valoramos la diversidad y la individualidad de cada visitante." },
                { icon: "apartment", id: "05", title: "Hospitalidad", desc: "La esencia sampedrana de dar la bienvenida con el corazón." },
                { icon: "lock", id: "06", title: "Confianza", desc: "Construyendo relaciones seguras y duraderas por generaciones." }
              ].map((pilar, index) => (
                <div key={index} className="group border-t border-[#0f172a]/10 pt-6 sm:pt-8 hover:border-[#0f172a] transition-all duration-500 transform hover:-translate-y-2 cursor-default">
                  <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <span className="text-xl font-bold text-[#0f172a]/20 group-hover:text-[#0f172a]/60 transition-colors duration-500">{pilar.id}</span>
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
          <Image fill alt="Dining Area" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" src={img4} />
          <div className="absolute inset-0 bg-[#0f172a]/40" />

          <div className="relative z-10 w-full px-4 sm:px-8 md:px-16 flex justify-start sm:justify-end">
            <div className="bg-white p-6 sm:p-8 md:p-16 max-w-xl shadow-2xl transition-transform duration-700 hover:-translate-y-1">
              <span className="text-blue-700 font-['Hanken_Grotesk'] uppercase tracking-[0.3em] block mb-3 sm:mb-6 text-xs sm:text-sm">Experiencias</span>
              <h3 className="text-[#0f172a] font-['Hanken_Grotesk'] text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-8 leading-tight">Atención que Reconforta</h3>
              <p className="text-slate-600 text-sm sm:text-lg mb-8 sm:mb-12 leading-relaxed">
                No solo ofrecemos una habitación; brindamos la calidez de un hogar. Contamos con residentes que han hecho del Hotel San Pedro su residencia permanente, testimonio fiel de nuestro trato cercano.
              </p>
              <button onClick={() => { setIsActive(true); refetch(); }} className="bg-[#0f172a] text-white px-8 py-4 sm:py-5 uppercase font-['Hanken_Grotesk'] tracking-widest hover:bg-blue-700 transition-all duration-300 shadow-lg cursor-pointer text-xs sm:text-sm">
                Descubra Más
              </button>
            </div>
          </div>
        </section>

        {/* SECTION: CONTACTO */}
        <section className="pt-16 sm:pt-24 md:pt-40 bg-linear-to-b from-slate-50 to-blue-50" id="contact">
          <div className="max-w-360 mx-auto px-4 sm:px-8 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-16 items-start">
            <div className="lg:col-span-4 space-y-8">
              <h2 className="text-[#0f172a] font-['Hanken_Grotesk'] text-[clamp(1.75rem,6vw,4.5rem)] leading-none">Conecte con nosotros.</h2>
              <div className="space-y-6 sm:space-y-8">
                <div className="group cursor-default">
                  <h4 className="text-[10px] uppercase tracking-widest text-blue-700 font-bold mb-1 sm:mb-2">Ubicación</h4>
                  <p className="text-sm sm:text-lg text-slate-600">3 calle entre la 1 y 2 avenida, San Pedro Sula, Cortés, Honduras.</p>
                </div>
                <div className="group cursor-default">
                  <h4 className="text-[10px] uppercase tracking-widest text-blue-700 font-bold mb-1 sm:mb-2">Reservaciones</h4>
                  <p className="text-lg sm:text-xl text-[#0f172a] font-semibold">+504 2550-0000</p>
                </div>
                <div className="group cursor-default">
                  <h4 className="text-[10px] uppercase tracking-widest text-blue-700 font-bold mb-1 sm:mb-2">Email</h4>
                  <p className="text-sm sm:text-lg text-slate-600 underline decoration-blue-200">info@hotelsanpedro.com</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 bg-white p-6 sm:p-8 md:p-16 border border-[#0f172a]/5 shadow-xl rounded-2xl">
              <form className="space-y-8 sm:space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-2 relative group">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Nombre</label>
                    <input className="w-full bg-transparent border-b border-[#0f172a]/20 focus:border-blue-700 focus:ring-0 p-2 outline-hidden text-[#0f172a]" type="text" />
                  </div>
                  <div className="space-y-2 relative group">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Email</label>
                    <input className="w-full bg-transparent border-b border-[#0f172a]/20 focus:border-blue-700 focus:ring-0 p-2 outline-hidden text-[#0f172a]" type="email" />
                  </div>
                </div>
                <div className="space-y-2 relative group">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Mensaje</label>
                  <textarea className="w-full bg-transparent border-b border-[#0f172a]/20 focus:border-blue-700 focus:ring-0 p-2 outline-hidden text-[#0f172a]" rows={4}></textarea>
                </div>
                <button className="w-full bg-[#0f172a] text-white py-4 sm:py-5 uppercase font-['Hanken_Grotesk'] tracking-widest hover:bg-blue-700 transition-all duration-500 shadow-lg text-xs sm:text-sm rounded-xl">
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>

          <div className="mt-8 sm:mt-16 h-64 sm:h-96 md:h-125 w-full overflow-hidden opacity-90">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3844.637075276313!2d-88.02565002494666!3d15.503941685096555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f665b4536eb25d9%3A0xff3dffbffeb793e6!2sHotel%20San%20Pedro!5e0!3m2!1ses-419!2shn!4v1781505597298!5m2!1ses-419!2shn" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0f172a] text-white py-12 sm:py-16 md:py-20 border-t border-white/5">
        <div className="max-w-360 mx-auto px-4 sm:px-8 md:px-16 flex flex-col md:flex-row justify-between items-start gap-12 sm:gap-16">
          <div className="space-y-4 sm:space-y-6">
            <Image width={66} height={80} alt="Hotel San Pedro Test" className="invert brightness-0" src={logo} />
            <p className="text-white/40 text-xs sm:text-sm max-w-xs">Liderando la hospitalidad tradicional desde 1960. Un refugio de resiliencia y calidez en la capital industrial.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-16">
            <div className="space-y-4 sm:space-y-6">
              <h5 className="text-[10px] uppercase tracking-widest text-white/50 font-bold">El Hotel</h5>
              <ul className="space-y-2 text-xs sm:text-sm text-white/60">
                <li><a className="hover:text-white" href="#">Habitaciones</a></li>
                <li><a className="hover:text-white" href="#">Restaurante</a></li>
                <li><a className="hover:text-white" href="#">Salones</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
