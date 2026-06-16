export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      
      {/* Skeleton para el PageHeader */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-4 border-b border-slate-200">
        <div className="space-y-2">
          <div className="h-7 w-32 bg-slate-300 rounded-lg"></div>
          <div className="h-4 w-56 bg-slate-200 rounded-lg"></div>
        </div>
        {/* Simulación del botón NewReservation */}
        <div className="h-10 w-40 bg-slate-300 rounded-lg self-start sm:self-center"></div>
      </div>

      {/* Sección 1: Tarjetas de Métricas (4 columnas) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4"
          >
            <div className="flex justify-between items-start gap-4 flex-col-reverse">
              {/* Texto de la métrica */}
              <div className="h-4 w-36 bg-slate-200 rounded"></div>
              {/* Contenedor del Icono */}
              <div className="p-2 w-9 h-9 bg-slate-200 rounded-lg"></div>
            </div>
            <div className="flex items-end gap-4 pt-2">
              {/* Valor grande */}
              <div className="h-8 w-16 bg-slate-300 rounded"></div>
              {/* Tendencia/Subtexto */}
              <div className="h-4 w-12 bg-slate-200 rounded mb-1"></div>
            </div>
          </div>
        ))}
      </section>

      {/* Sección 2: Estado de habitaciones y Ocupación semanal */}
      <section className="grid grid-cols-12 gap-8">
        
        {/* Columna Izquierda: Cuadrícula de Habitaciones */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-slate-200">
            {/* Título */}
            <div className="h-6 w-48 bg-slate-300 rounded"></div>
            {/* Leyendas */}
            <div className="flex gap-4">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <div className="h-3 w-14 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid de Habitaciones (Simulando 20 habitaciones de aspecto cuadrado) */}
          <div className="grid grid-cols-6 md:grid-cols-10 gap-2 flex-1">
            {[...Array(20)].map((_, idx) => (
              <div 
                key={idx} 
                className="aspect-square bg-slate-100 border-t-4 border-slate-200 rounded-sm"
              ></div>
            ))}
          </div>
        </div>

        {/* Columna Derecha: Gráfico de Ocupación semanal */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
          {/* Título */}
          <div className="h-6 w-40 bg-slate-300 rounded mb-6"></div>
          
          {/* Contenedor de las barras */}
          <div className="flex-1 flex items-end gap-2 mt-4 pt-4 border-t border-slate-200 h-50">
            {/* Alturas simuladas para simular un gráfico dinámico */}
            {[60, 75, 90, 85, 95, 100, 70].map((height, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-slate-200 rounded-t-sm" 
                  style={{ height: `${height}%` }}
                ></div>
                {/* Texto del día */}
                <div className="h-3 w-7 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección 3: Actividad Reciente */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Encabezado del contenedor */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="h-6 w-40 bg-slate-300 rounded"></div>
          <div className="h-8 w-20 bg-slate-200 rounded-lg"></div>
        </div>

        {/* Filas de Actividad */}
        <div className="flex flex-col division-y division-slate-200">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="px-6 py-4 border-b border-slate-100 flex items-start gap-6">
              {/* Icono redondo de estado */}
              <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0"></div>
              {/* Contenido del log de actividad */}
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                <div className="h-3 w-1/4 bg-slate-100 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}