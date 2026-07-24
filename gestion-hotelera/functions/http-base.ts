//const API_BASE_URL = "https://gestion-hotelera.fastapicloud.dev";
const API_BASE_URL = "http://127.0.0.1:8000"


export interface FetchOptions extends RequestInit {
    params?: Record<string, any>;
}

export async function fetchAPI<T = any>(
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
        const response = await fetch(url.toString(), {
            ...fetchOptions,
            headers: {
                'Content-Type': 'application/json',
                ...fetchOptions.headers,
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
}