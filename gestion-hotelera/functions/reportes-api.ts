// lib/api/reportes.ts
import { useState, useEffect, useCallback } from 'react';

// URL base de la API - usa variable de entorno o localhost como fallback
const API_BASE_URL = "https://fluffy-barnacle-rv579j5wxrfx6jp-8000.app.github.dev";

// ============================================
// TIPOS E INTERFACES
// ============================================

export interface HuespedFrecuente {
  id_huesped?: number;
  nombre?: string;
  email?: string;
  telefono?: string;
  cantidad_visitas?: number;
  ultima_visita?: string;
  gasto_total?: number;
  [key: string]: any;
}

export interface ReservacionDiaria {
  id_reservacion?: number;
  numero_habitacion?: string;
  huesped?: string;
  fecha_entrada?: string;
  fecha_salida?: string;
  estado?: string;
  tarifa?: number;
  [key: string]: any;
}

export interface EspacioHabitacion {
  numero_espacio?: string;
  tipo?: string;
  estado?: string;
  capacidad_huespedes?: number;
  precio_unidad?: number;
  [key: string]: any;
}

export interface ActividadMantenimiento {
  id_actividad?: number;
  numero_habitacion?: string;
  tipo_mantenimiento?: string;
  descripcion?: string;
  fecha?: string;
  estado?: string;
  responsable?: string;
  [key: string]: any;
}

export interface PagoRealizado {
  id_pago?: number;
  reservacion?: string;
  monto?: number;
  fecha_pago?: string;
  metodo?: string;
  estado?: string;
  [key: string]: any;
}

export interface ConsumoStock {
  articulo?: string;
  cantidad_inicial?: number;
  cantidad_consumida?: number;
  cantidad_restante?: number;
  porcentaje_consumo?: number;
  fecha_semana?: string;
  [key: string]: any;
}

export interface OcupacionMensual {
  mes?: string;
  total_habitaciones?: number;
  habitaciones_ocupadas?: number;
  porcentaje_ocupacion?: number;
  ingresos?: number;
  [key: string]: any;
}

export interface IngresoTipoHabitacion {
  tipo_habitacion?: string;
  cantidad?: number;
  ingreso_total?: number;
  ingreso_promedio?: number;
  [key: string]: any;
}

export interface ConsumoAmenidades {
  amenidad?: string;
  consumo_enero?: number;
  consumo_febrero?: number;
  consumo_marzo?: number;
  consumo_total?: number;
  [key: string]: any;
}

// ============================================
// CLIENTE HTTP BASE
// ============================================

interface FetchOptions extends RequestInit {
  params?: Record<string, any>;
}

async function fetchAPI<T = any>(
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

// ============================================
// FUNCIONES DE API - REPORTES
// ============================================

/**
 * Obtiene la lista de clientes/huéspedes frecuentes
 */
export async function getClientesFrecuentes(): Promise<HuespedFrecuente[]> {
  return fetchAPI<HuespedFrecuente[]>('/reportes/clientes');
}

/**
 * Obtiene las reservaciones del día especificado
 * @param fecha - Fecha en formato YYYY-MM-DD (por defecto: hoy)
 */
export async function getReservacionesDiarias(
  fecha?: string
): Promise<ReservacionDiaria[]> {
  return fetchAPI<ReservacionDiaria[]>('/reportes/reservaciones-diarias', {
    params: { fecha },
  });
}

/**
 * Obtiene el estado de todas las habitaciones
 */
export async function getEstadoHabitaciones(): Promise<EspacioHabitacion[]> {
  return fetchAPI<EspacioHabitacion[]>('/reportes/estado-de-habitaciones');
}

/**
 * Obtiene las actividades y mantenimientos del día
 * @param fecha_inicio - Fecha en formato YYYY-MM-DD
 */
export async function getActividadesMantenimiento(
  fecha_inicio?: string
): Promise<ActividadMantenimiento[]> {
  return fetchAPI<ActividadMantenimiento[]>(
    '/reportes/actividades-mantenimientos-diarios',
    {
      params: { fecha_inicio },
    }
  );
}

/**
 * Obtiene los pagos realizados
 */
export async function getPagosRealizados(): Promise<PagoRealizado[]> {
  return fetchAPI<PagoRealizado[]>('/reportes/pagos-realizados');
}

/**
 * Obtiene el consumo de stock semanal
 */
export async function getConsumoStockSemanal(): Promise<ConsumoStock[]> {
  return fetchAPI<ConsumoStock[]>('/reportes/consumo-stock-semanal');
}

/**
 * Obtiene estadísticas de ocupación mensual
 */
export async function getOcupacionMensual(): Promise<OcupacionMensual[]> {
  return fetchAPI<OcupacionMensual[]>('/reportes/estadistica-ocupacion-mensual?fecha=2026-06-27');
}

/**
 * Obtiene ingresos por tipo de habitación
 */
export async function getIngresosTipoHabitacion(): Promise<IngresoTipoHabitacion[]> {
  return fetchAPI<IngresoTipoHabitacion[]>('/reportes/ingresos-tipo-habitacion');
}

/**
 * Obtiene consumo de amenidades mensual
 * @param fecha
 */
export async function getConsumoAmenidadesMensual(fecha?: string): Promise<ConsumoAmenidades[]> {
  return fetchAPI<ConsumoAmenidades[]>('/reportes/consumo-amenidades-mensual',
    {
      params: { fecha },
    }
  );
}

// ============================================
// CUSTOM HOOKS
// ============================================

interface UseReporteState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook para obtener clientes frecuentes
 */
export function useClientesFrecuentes() {
  const [state, setState] = useState<UseReporteState<HuespedFrecuente[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await getClientesFrecuentes();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

/**
 * Hook para obtener reservaciones diarias
 */
export function useReservacionesDiarias(fecha?: string) {
  const [state, setState] = useState<UseReporteState<ReservacionDiaria[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await getReservacionesDiarias(fecha);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, [fecha]);

  useEffect(() => {
    refetch();
  }, [refetch, fecha]);

  return { ...state, refetch };
}

/**
 * Hook para obtener estado de habitaciones
 */
export function useEstadoHabitaciones() {
  const [state, setState] = useState<UseReporteState<EspacioHabitacion[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await getEstadoHabitaciones();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

/**
 * Hook para obtener actividades de mantenimiento
 */
export function useActividadesMantenimiento(fecha_inicio?: string) {
  const [state, setState] = useState<UseReporteState<ActividadMantenimiento[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await getActividadesMantenimiento(fecha_inicio);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, [fecha_inicio]);

  useEffect(() => {
    refetch();
  }, [refetch, fecha_inicio]);

  return { ...state, refetch };
}

/**
 * Hook para obtener pagos realizados
 */
export function usePagosRealizados() {
  const [state, setState] = useState<UseReporteState<PagoRealizado[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await getPagosRealizados();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

/**
 * Hook para obtener consumo de stock semanal
 */
export function useConsumoStockSemanal() {
  const [state, setState] = useState<UseReporteState<ConsumoStock[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await getConsumoStockSemanal();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

/**
 * Hook para obtener ocupación mensual
 */
export function useOcupacionMensual() {
  const [state, setState] = useState<UseReporteState<OcupacionMensual[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await getOcupacionMensual();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

/**
 * Hook para obtener ingresos por tipo de habitación
 */
export function useIngresosTipoHabitacion() {
  const [state, setState] = useState<UseReporteState<IngresoTipoHabitacion[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await getIngresosTipoHabitacion();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

/**
 * Hook para obtener consumo de amenidades
 */
export function useConsumoAmenidadesMensual(fecha?:string) {
  const [state, setState] = useState<UseReporteState<ConsumoAmenidades[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await getConsumoAmenidadesMensual(fecha);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, [fecha]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}
