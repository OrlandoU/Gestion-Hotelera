import { url } from "inspector";

//const API_BASE_URL = "https://gestion-hotelera.fastapicloud.dev";
const API_BASE_URL = "http://127.0.0.1:8000"

export interface FetchOptions extends RequestInit {
    params?: Record<string, string | number | boolean | null | undefined>;
}

export async function fetchAPI<T = unknown>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const { params, ...fetchOptions } = options;

    // Construir URL con parámetros de query
    const targetUrl = new URL(`${API_BASE_URL}${endpoint}`);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                targetUrl.searchParams.append(key, String(value));
            }
        });
    }

    try {
        const token = typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;
        const response = await fetch(targetUrl.toString(), {
            ...fetchOptions,
            headers: {
                'Content-Type': 'application/json',
                ...fetchOptions.headers,
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });

        if (!response.ok) {
            let errorMessage = `API Error: ${response.status} ${response.statusText}`;

            try {
                // Extraemos el cuerpo del error en formato JSON
                const errorData = await response.json();

                // Si FastAPI devolvió {"detail": "..."}, tomamos ese mensaje exacto
                if (errorData && errorData.detail) {
                    errorMessage = typeof errorData.detail === 'string'
                        ? errorData.detail
                        : JSON.stringify(errorData.detail);
                } else if (errorData && errorData.message) {
                    errorMessage = errorData.message;
                }
            } catch {
                // Si la respuesta no era JSON, se conserva el mensaje genérico con el status
            }

            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data as T;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
}


/*
export interface FetchOptions extends RequestInit {
    params?: Record<string, string | number | boolean | null | undefined>;
}

export async function fetchAPI<T = unknown>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const { params, ...fetchOptions } = options;

    // Construir URL con parámetros de query
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    try {
        const token = typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;
        const response = await fetch(url.toString(), {
            ...fetchOptions,
            headers: {
                'Content-Type': 'application/json',
                ...fetchOptions.headers,
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data as T;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
}*/
