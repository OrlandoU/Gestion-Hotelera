"use client";

import { useState } from "react";
import { login, signup } from "@/functions/auth";
import { useRouter } from "next/navigation";

export default function AuthPage() {
    const router = useRouter();
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [showPassword, setShowPassword] = useState(false);

    const [primerNombre, setPrimerNombre] = useState("");
    const [segundoNombre, setSegundoNombre] = useState("");
    const [primerApellido, setPrimerApellido] = useState("");
    const [segundoApellido, setSegundoApellido] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            if (mode === "login") {
                await login(email, password);
                router.push("/bd");
            } else {
                await signup({
                    primer_nombre: primerNombre,
                    segundo_nombre: segundoNombre,
                    primer_apellido: primerApellido,
                    segundo_apellido: segundoApellido,
                    fecha_nacimiento: fechaNacimiento,
                    email,
                    password,
                });
                router.push("/bd");
            }
        } catch (err) {
            setError((err as Error).message || "Ha ocurrido un error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#eef2f6] text-slate-700 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 font-sans">

            <div className="w-full max-w-md sm:max-w-lg transition-all duration-300">

                {/* Header - Insignia Neomórfica */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-[#eef2f6] shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] flex items-center justify-center mb-4 text-cyan-600 transition-transform hover:scale-105">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 7h7v7" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V11l7-5 7 5v10" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
                        Hotel San Pedro
                    </h1>
                    <p className="text-[11px] tracking-widest uppercase font-semibold text-slate-400 mt-1">
                        Hospitalidad & Comodidad
                    </p>
                </div>

                {/* Tarjeta Contenedora Principal */}
                <div className="bg-[#eef2f6] rounded-[2.5rem] shadow-[12px_12px_24px_#d1d9e6,-12px_-12px_24px_#ffffff] p-6 sm:p-10">

                    {/* Switcher Neomórfico (Tabs) */}
                    <div className="grid grid-cols-2 bg-[#eef2f6] p-1.5 rounded-2xl shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] mb-8">
                        <button
                            type="button"
                            onClick={() => {
                                setMode("login");
                                setError("");
                            }}
                            className={`py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 ${mode === "login"
                                ? "bg-[#eef2f6] text-cyan-700 shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff]"
                                : "text-slate-400 hover:text-slate-600"
                                }`}
                        >
                            Iniciar sesión
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setMode("signup");
                                setError("");
                            }}
                            className={`py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 ${mode === "signup"
                                ? "bg-[#eef2f6] text-cyan-700 shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff]"
                                : "text-slate-400 hover:text-slate-600"
                                }`}
                        >
                            Registrarse
                        </button>
                    </div>

                    {/* Título dinámico */}
                    <div className="mb-6 px-1">
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                            {mode === "login" ? "Bienvenido de nuevo" : "Registro de Usuario"}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            {mode === "login"
                                ? "Ingresa tus credenciales para continuar."
                                : "Completa el formulario para darte de alta."}
                        </p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {mode === "signup" && (
                            <div className="space-y-4 animate-in fade-in duration-200">
                                {/* Nombres */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1.5 pl-1">
                                            Primer nombre
                                        </label>
                                        <input
                                            type="text"
                                            value={primerNombre}
                                            onChange={(e) => setPrimerNombre(e.target.value)}
                                            placeholder="Ej. Orlando"
                                            className="w-full rounded-2xl bg-[#eef2f6] shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1.5 pl-1">
                                            Segundo nombre
                                        </label>
                                        <input
                                            type="text"
                                            value={segundoNombre}
                                            onChange={(e) => setSegundoNombre(e.target.value)}
                                            placeholder="Ej. José"
                                            className="w-full rounded-2xl bg-[#eef2f6] shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Apellidos */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1.5 pl-1">
                                            Primer apellido
                                        </label>
                                        <input
                                            type="text"
                                            value={primerApellido}
                                            onChange={(e) => setPrimerApellido(e.target.value)}
                                            placeholder="Ej. Umanzor"
                                            className="w-full rounded-2xl bg-[#eef2f6] shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1.5 pl-1">
                                            Segundo apellido
                                        </label>
                                        <input
                                            type="text"
                                            value={segundoApellido}
                                            onChange={(e) => setSegundoApellido(e.target.value)}
                                            placeholder="Ej. Zelaya"
                                            className="w-full rounded-2xl bg-[#eef2f6] shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Fecha de Nacimiento */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1.5 pl-1">
                                        Fecha de nacimiento
                                    </label>
                                    <input
                                        type="date"
                                        value={fechaNacimiento}
                                        onChange={(e) => setFechaNacimiento(e.target.value)}
                                        className="w-full rounded-2xl bg-[#eef2f6] shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all [color-scheme:light]"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email Field Inset */}
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5 pl-1">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="usuario@hotel.com"
                                    className="w-full rounded-2xl bg-[#eef2f6] shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] pl-10 pr-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                                    required
                                />
                                <svg
                                    className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                        </div>

                        {/* Password Field Inset */}
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5 pl-1">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full rounded-2xl bg-[#eef2f6] shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] pl-10 pr-10 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                                    required
                                />
                                <svg
                                    className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.018 10.018 0 013.682-.763c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m-4.012-4.012a3 3 0 11-4.243-4.243" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Feedback Alerts Inset */}
                        {error && (
                            <div className="flex items-center gap-2 rounded-2xl bg-[#eef2f6] shadow-[inset_3px_3px_6px_#fca5a5,inset_-3px_-3px_6px_#ffffff] p-3 text-xs text-rose-600 font-medium animate-in fade-in">
                                <svg className="w-4 h-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="flex items-center gap-2 rounded-2xl bg-[#eef2f6] shadow-[inset_3px_3px_6px_#a7f3d0,inset_-3px_-3px_6px_#ffffff] p-3 text-xs text-emerald-700 font-medium animate-in fade-in">
                                <svg className="w-4 h-4 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{success}</span>
                            </div>
                        )}

                        {/* Botón Principal Neomórfico Extruido / Pressed State */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 w-full rounded-2xl bg-slate-900 text-white font-semibold py-3.5 px-4 text-xs transition-all duration-150 shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.6)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Procesando...</span>
                                </>
                            ) : (
                                <span>{mode === "login" ? "Ingresar al Panel" : "Completar Registro"}</span>
                            )}
                        </button>
                    </form>

                    {/* Switcher inferior */}
                    <div className="mt-8 text-center text-xs text-slate-500">
                        {mode === "login" ? (
                            <>
                                ¿No tienes cuenta registrada?{" "}
                                <button
                                    type="button"
                                    className="font-bold text-slate-800 hover:text-cyan-600 transition-colors"
                                    onClick={() => setMode("signup")}
                                >
                                    Regístrate aquí
                                </button>
                            </>
                        ) : (
                            <>
                                ¿Ya posees acceso?{" "}
                                <button
                                    type="button"
                                    className="font-bold text-slate-800 hover:text-cyan-600 transition-colors"
                                    onClick={() => setMode("login")}
                                >
                                    Inicia sesión
                                </button>
                            </>
                        )}
                    </div>

                </div>

                {/* Footer Legal */}
                <p className="text-center text-[11px] text-slate-400 mt-8">
                    © {new Date().getFullYear()} Hotel San Pedro. Todos los derechos reservados.
                </p>

            </div>
        </div>
    );
}