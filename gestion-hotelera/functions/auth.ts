import { API_BASE_URL } from "./reservas";

interface AuthResponse {
    access_token: string;
    token_type: string;
    usuario_id: number;
    nombre: string;
    email: string;
}

export interface LoggedUser {
    usuario_id: number;
    nombre: string;
    email: string;
}

async function fetchAuth<T>(endpoint: string, body: unknown) {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        const message = payload.detail || response.statusText || "Error en la autenticación.";
        throw new Error(message);
    }

    return response.json() as Promise<T>;
}

export async function login(email: string, password: string) {
    const result = await fetchAuth<AuthResponse>("/auth/login", { email, password });
    console.log(result)
    if (typeof window !== "undefined") {
        localStorage.setItem("hotel_token", result.access_token);
        localStorage.setItem("hotel_user", JSON.stringify({
            usuario_id: result.usuario_id,
            nombre: result.nombre,
            email: result.email,
        }));
    }
    return result;
}

interface SignupPayload {
    primer_nombre: string;
    segundo_nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
    fecha_nacimiento: string;
    email: string;
    password: string;
    telefono: string
}

export async function signup(payload: SignupPayload) {
    const result = await fetchAuth<AuthResponse>("/auth/signup", payload);

    if (typeof window !== "undefined") {
        localStorage.setItem("hotel_token", result.access_token);
        localStorage.setItem("hotel_user", JSON.stringify({
            usuario_id: result.usuario_id,
            nombre: result.nombre,
            email: result.email,
        }));
    }
    return result;
}

export function logout() {
    if (typeof window !== "undefined") {
        localStorage.removeItem("hotel_token");
        localStorage.removeItem("hotel_user");
    }
}

export function getCurrentUser(): LoggedUser | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("hotel_user");
    if (!raw) return null;
    try {
        return JSON.parse(raw) as LoggedUser;
    } catch {
        return null;
    }
}

export function getAccessToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("hotel_token");
}
