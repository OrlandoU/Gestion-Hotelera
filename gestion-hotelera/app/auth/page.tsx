"use client";

import { useState } from "react";
import { login, signup } from "@/functions/auth";
import { useRouter } from "next/navigation";
import { ValidatedInput } from "@/components/ui/validated-field";
import Image from "next/image";
import logo from "@/public/logo.png";

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
    const [telefono, setTelefono] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const nextErrors: Record<string, string> = {};
        const normalizedEmail = email.trim();
        const normalizedPassword = password.trim();

        if (!normalizedEmail) {
            nextErrors.email = "Ingresa tu correo electrónico.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            nextErrors.email = "Ingresa un correo válido.";
        } else if (normalizedEmail.length > 120) {
            nextErrors.email = "El correo no puede superar 120 caracteres.";
        }

        if (!normalizedPassword) {
            nextErrors.password = "Ingresa tu contraseña.";
        } else if (normalizedPassword.length < 8 || normalizedPassword.length > 64) {
            nextErrors.password = "La contraseña debe tener entre 8 y 64 caracteres.";
        } else if (!/^(?=.*[A-Z])(?=.*\d).+/.test(normalizedPassword)) {
            nextErrors.password = "La contraseña debe incluir al menos una mayúscula y un número.";
        }

        if (mode === "signup") {
            if (!primerNombre.trim() || primerNombre.trim().length < 2 || primerNombre.trim().length > 60) {
                nextErrors.primerNombre = "Ingresa un primer nombre válido de 2 a 60 caracteres.";
            }
            if (!segundoNombre.trim() || segundoNombre.trim().length < 2 || segundoNombre.trim().length > 60) {
                nextErrors.segundoNombre = "Ingresa un segundo nombre válido de 2 a 60 caracteres.";
            }
            if (!primerApellido.trim() || primerApellido.trim().length < 2 || primerApellido.trim().length > 60) {
                nextErrors.primerApellido = "Ingresa un primer apellido válido de 2 a 60 caracteres.";
            }
            if (!segundoApellido.trim() || segundoApellido.trim().length < 2 || segundoApellido.trim().length > 60) {
                nextErrors.segundoApellido = "Ingresa un segundo apellido válido de 2 a 60 caracteres.";
            }
            if (!fechaNacimiento) {
                nextErrors.fechaNacimiento = "Selecciona tu fecha de nacimiento.";
            } else {
                const birthDate = new Date(fechaNacimiento);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                const hasBirthdayPassed = today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
                if (Number.isNaN(birthDate.getTime()) || age < 18 || (age === 18 && hasBirthdayPassed)) {
                    nextErrors.fechaNacimiento = "Debes ser mayor de 18 años.";
                }
            }

            const telefonoDigits = telefono.replace(/\D/g, "");
            if (!telefonoDigits) {
                nextErrors.telefono = "Ingresa un teléfono.";
            } else if (telefonoDigits.length < 8 || telefonoDigits.length > 12) {
                nextErrors.telefono = "El teléfono debe tener entre 8 y 12 dígitos.";
            }
        }

        setFormErrors(nextErrors);
        setTouched({
            primerNombre: true,
            segundoNombre: true,
            primerApellido: true,
            segundoApellido: true,
            fechaNacimiento: true,
            email: true,
            password: true,
            telefono: true
        });
        return Object.keys(nextErrors).length === 0;
    };

    const validateField = (field: string) => {
        const nextErrors: Record<string, string> = { ...formErrors };

        switch (field) {
            case "primerNombre":
                if (!primerNombre.trim() || primerNombre.trim().length < 2 || primerNombre.trim().length > 60) {
                    nextErrors.primerNombre = "Ingresa un primer nombre válido de 2 a 60 caracteres.";
                } else {
                    delete nextErrors.primerNombre;
                }
                break;
            case "segundoNombre":
                if (!segundoNombre.trim() || segundoNombre.trim().length < 2 || segundoNombre.trim().length > 60) {
                    nextErrors.segundoNombre = "Ingresa un segundo nombre válido de 2 a 60 caracteres.";
                } else {
                    delete nextErrors.segundoNombre;
                }
                break;
            case "primerApellido":
                if (!primerApellido.trim() || primerApellido.trim().length < 2 || primerApellido.trim().length > 60) {
                    nextErrors.primerApellido = "Ingresa un primer apellido válido de 2 a 60 caracteres.";
                } else {
                    delete nextErrors.primerApellido;
                }
                break;
            case "segundoApellido":
                if (!segundoApellido.trim() || segundoApellido.trim().length < 2 || segundoApellido.trim().length > 60) {
                    nextErrors.segundoApellido = "Ingresa un segundo apellido válido de 2 a 60 caracteres.";
                } else {
                    delete nextErrors.segundoApellido;
                }
                break;
            case "fechaNacimiento":
                if (!fechaNacimiento) {
                    nextErrors.fechaNacimiento = "Selecciona tu fecha de nacimiento.";
                } else {
                    const birthDate = new Date(fechaNacimiento);
                    const today = new Date();
                    const age = today.getFullYear() - birthDate.getFullYear();
                    const hasBirthdayPassed = today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
                    if (Number.isNaN(birthDate.getTime()) || age < 18 || (age === 18 && hasBirthdayPassed)) {
                        nextErrors.fechaNacimiento = "Debes ser mayor de 18 años.";
                    } else {
                        delete nextErrors.fechaNacimiento;
                    }
                }
                break;
            case "email":
                if (!email.trim()) {
                    nextErrors.email = "Ingresa tu correo electrónico.";
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    nextErrors.email = "Ingresa un correo válido.";
                } else if (email.trim().length > 120) {
                    nextErrors.email = "El correo no puede superar 120 caracteres.";
                } else {
                    delete nextErrors.email;
                }
                break;
            case "telefono": {
                const telefonoDigits = telefono.replace(/\D/g, "");
                if (!telefonoDigits) {
                    nextErrors.telefono = "Ingresa un teléfono.";
                } else if (telefonoDigits.length < 8 || telefonoDigits.length > 12) {
                    nextErrors.telefono = "El teléfono debe tener entre 8 y 12 dígitos.";
                } else {
                    delete nextErrors.telefono;
                }
                break;
            }
            case "password":
                if (!password.trim()) {
                    nextErrors.password = "Ingresa tu contraseña.";
                } else if (password.trim().length < 8 || password.trim().length > 64) {
                    nextErrors.password = "La contraseña debe tener entre 8 y 64 caracteres.";
                } else if (!/^(?=.*[A-Z])(?=.*\d).+/.test(password.trim())) {
                    nextErrors.password = "La contraseña debe incluir al menos una mayúscula y un número.";
                } else {
                    delete nextErrors.password;
                }
                break;
        }

        setFormErrors(nextErrors);
        setTouched((prev) => ({ ...prev, [field]: true }));
        return !nextErrors[field];
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        if (!validateForm()) {
            return;
        }
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
                    telefono
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
        <div className="min-h-screen bg-slate-100 py-10">
            <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-7xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_70px_rgba(15,23,42,0.14)]">
                {/* Panel lateral con degradado representativo de la marca */}
                <aside className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-[#282B59] via-[#42468C] to-[#777CD9] px-12 py-14 text-white lg:flex">
                    <div className="flex items-center flex-col">
                        <div className="inline-flex items-center justify-center rounded-3xl mx-auto mb-6">
                            <Image
                                src={logo}
                                alt="Hotel San Pedro logo"
                                width={150}
                                height={150}
                                className="object-contain"
                            />
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight">Hotel San Pedro</h1>
                        <p className="mt-5 max-w-lg text-base leading-7 text-slate-100/85 text-center">
                            Sistema desarrollado a medida para Hotel San Pedro — gestión de reservas, facturación e inventario adaptada a sus procesos internos.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B7AEF2]">
                                Operaciones más simples
                            </p>
                            <p className="mt-3 text-sm text-slate-100/85">
                                Controla check-ins, check-outs, facturación y disponibilidad con mayor rapidez.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B7AEF2]">
                                Dashboard inteligente
                            </p>
                            <p className="mt-3 text-sm text-slate-100/85">
                                Accede a reportes y métricas clave sin perder tiempo en navegación.
                            </p>
                        </div>
                    </div>
                </aside>

                {/* Formulario Principal */}
                <main className="w-full lg:w-1/2 px-6 py-10 sm:px-10 sm:py-12">
                    <div className="flex flex-col gap-3">
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#42468C]">Hotel San Pedro</p>
                        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                            {mode === "login" ? "Bienvenido de nuevo" : "Comienza tu registro"}
                        </h2>
                        <p className="max-w-xl text-sm text-slate-500">
                            {mode === "login"
                                ? "Accede al panel de gestión con seguridad y rapidez."
                                : "Regístrate para administrar huéspedes, habitaciones y servicios desde un lugar central."}
                        </p>
                    </div>

                    <div className="mt-10 rounded-[2rem] border border-slate-200 bg-slate-50/60 p-6 shadow-sm">
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-900">{mode === "login" ? "Acceso seguro" : "Registro rápido"}</p>
                                <p className="text-xs text-slate-500">{mode === "login" ? "Introduce tus credenciales para iniciar sesión." : "Completa los datos para crear tu cuenta."}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setMode(mode === "login" ? "signup" : "login");
                                    setError("");
                                }}
                                className="inline-flex rounded-full border border-[#B7AEF2] bg-[#B7AEF2]/15 px-4 py-2 text-sm font-semibold text-[#282B59] shadow-sm transition hover:bg-[#B7AEF2]/35 hover:border-[#777CD9]"
                            >
                                {mode === "login" ? "Crear cuenta" : "Ingresar"}
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {mode === "signup" && (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-2">Primer nombre</label>
                                        <ValidatedInput
                                            id="primerNombre"
                                            type="text"
                                            value={primerNombre}
                                            onBlur={() => {
                                                setTouched((prev) => ({ ...prev, primerNombre: true }));
                                                validateField("primerNombre");
                                            }}
                                            onFocus={() => setTouched((prev) => ({ ...prev, primerNombre: true }))}
                                            onChange={(value) => {
                                                setPrimerNombre(value);
                                                setFormErrors((prev) => ({ ...prev, primerNombre: "" }));
                                            }}
                                            error={formErrors.primerNombre}
                                            touched={touched.primerNombre || Boolean(formErrors.primerNombre)}
                                            placeholder="Ej. Orlando"
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                            containerClassName=""
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-2">Segundo nombre</label>
                                        <ValidatedInput
                                            id="segundoNombre"
                                            type="text"
                                            value={segundoNombre}
                                            onBlur={() => {
                                                setTouched((prev) => ({ ...prev, segundoNombre: true }));
                                                validateField("segundoNombre");
                                            }}
                                            onFocus={() => setTouched((prev) => ({ ...prev, segundoNombre: true }))}
                                            onChange={(value) => {
                                                setSegundoNombre(value);
                                                setFormErrors((prev) => ({ ...prev, segundoNombre: "" }));
                                            }}
                                            error={formErrors.segundoNombre}
                                            touched={touched.segundoNombre || Boolean(formErrors.segundoNombre)}
                                            placeholder="Ej. José"
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                            containerClassName=""
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-2">Primer apellido</label>
                                        <ValidatedInput
                                            id="primerApellido"
                                            type="text"
                                            value={primerApellido}
                                            onBlur={() => {
                                                setTouched((prev) => ({ ...prev, primerApellido: true }));
                                                validateField("primerApellido");
                                            }}
                                            onFocus={() => setTouched((prev) => ({ ...prev, primerApellido: true }))}
                                            onChange={(value) => {
                                                setPrimerApellido(value);
                                                setFormErrors((prev) => ({ ...prev, primerApellido: "" }));
                                            }}
                                            error={formErrors.primerApellido}
                                            touched={touched.primerApellido || Boolean(formErrors.primerApellido)}
                                            placeholder="Ej. Umanzor"
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                            containerClassName=""
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-2">Segundo apellido</label>
                                        <ValidatedInput
                                            id="segundoApellido"
                                            type="text"
                                            value={segundoApellido}
                                            onBlur={() => {
                                                setTouched((prev) => ({ ...prev, segundoApellido: true }));
                                                validateField("segundoApellido");
                                            }}
                                            onFocus={() => setTouched((prev) => ({ ...prev, segundoApellido: true }))}
                                            onChange={(value) => {
                                                setSegundoApellido(value);
                                                setFormErrors((prev) => ({ ...prev, segundoApellido: "" }));
                                            }}
                                            error={formErrors.segundoApellido}
                                            touched={touched.segundoApellido || Boolean(formErrors.segundoApellido)}
                                            placeholder="Ej. Zelaya"
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                            containerClassName=""
                                            required
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-medium text-slate-600 mb-2">Fecha de nacimiento</label>
                                        <ValidatedInput
                                            id="fechaNacimiento"
                                            type="date"
                                            value={fechaNacimiento}
                                            onBlur={() => {
                                                setTouched((prev) => ({ ...prev, fechaNacimiento: true }));
                                                validateField("fechaNacimiento");
                                            }}
                                            onFocus={() => setTouched((prev) => ({ ...prev, fechaNacimiento: true }))}
                                            onChange={(value) => {
                                                setFechaNacimiento(value);
                                                setFormErrors((prev) => ({ ...prev, fechaNacimiento: "" }));
                                            }}
                                            error={formErrors.fechaNacimiento}
                                            touched={touched.fechaNacimiento || Boolean(formErrors.fechaNacimiento)}
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                            containerClassName=""
                                            required
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-medium text-slate-600 mb-2">Teléfono</label>
                                        <ValidatedInput
                                            id="telefono"
                                            type="text"
                                            value={telefono}
                                            onChange={(value) => {
                                                setTelefono(value);
                                                setFormErrors((prev) => ({ ...prev, telefono: "" }));
                                            }}
                                            onBlur={() => {
                                                setTouched((prev) => ({ ...prev, telefono: true }));
                                                validateField("telefono");
                                            }}
                                            onFocus={() => setTouched((prev) => ({ ...prev, telefono: true }))}
                                            error={formErrors.telefono}
                                            touched={touched.telefono || Boolean(formErrors.telefono)}
                                            placeholder="96751977"
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-2">Correo electrónico</label>
                                <ValidatedInput
                                    id="email"
                                    type="email"
                                    value={email}
                                    onBlur={() => {
                                        setTouched((prev) => ({ ...prev, email: true }));
                                        validateField("email");
                                    }}
                                    onFocus={() => setTouched((prev) => ({ ...prev, email: true }))}
                                    onChange={(value) => {
                                        setEmail(value);
                                        setFormErrors((prev) => ({ ...prev, email: "" }));
                                    }}
                                    error={formErrors.email}
                                    touched={touched.email || Boolean(formErrors.email)}
                                    placeholder="usuario@hotel.com"
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                    containerClassName=""
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#282B59] mb-2">Contraseña</label>
                                <div className="relative">
                                    <ValidatedInput
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onBlur={() => {
                                            setTouched((prev) => ({ ...prev, password: true }));
                                            validateField("password");
                                        }}
                                        onFocus={() => setTouched((prev) => ({ ...prev, password: true }))}
                                        onChange={(value) => {
                                            setPassword(value);
                                            setFormErrors((prev) => ({ ...prev, password: "" }));
                                        }}
                                        error={formErrors.password}
                                        touched={touched.password || Boolean(formErrors.password)}
                                        placeholder="••••••••••••"
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 shadow-sm outline-none focus:border-[#777CD9] focus:ring-2 focus:ring-[#777CD9]/20"
                                        containerClassName=""
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#42468C] transition"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.018 10.018 0 013.682-.763c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m-4.012-4.012a3 3 0 11-4.243-4.243" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm font-medium text-rose-700 shadow-sm">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm font-medium text-emerald-800 shadow-sm">
                                    {success}
                                </div>
                            )}

                            {/* Botón principal alineado a la paleta sky/cyan */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-2xl bg-gradient-to-r from-[#42468C] to-[#777CD9] py-3.5 text-sm font-semibold text-white shadow-md shadow-[#42468C]/25 transition hover:from-[#282B59] hover:to-[#42468C] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Procesando…" : mode === "login" ? "Ingresar al Panel" : "Completar Registro"}
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}