import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return(
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed left-0 top-0 h-full w-[280px] z-50 bg-slate-50 border-r border-slate-200 flex flex-col p-4 gap-2">
        <div className="mb-6 px-2">
          <div className="flex flex-col gap-2">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnL5hYJYgjTHnIve3F4ZivqaryjoLZoZ3SeeRU_BbPDJAbV2ZNTLzghr56yhMOz4mvai9V7F5GmneKOKkpsT_dPil4lN0XM0j780TJJTxX701jXjW9JhG2Asa0UxNC8R2k8stHmDVWMxNdaSUZG3zBPHiF9YHXq3REqd8lGUcR_-mNMOgm9VvHtO3mUe426J9iS7AkdxZy8NRQjeYDqIpgKjz7GDk3WS4hsBjCQMkDdBFxo7lplApb73xETcRg0RhneeCOte9D2XNc" // Replace with your actual logo source or domain
              alt="Hotel San Pedro Logo"
              width={48}
              height={48}
              className="h-12 w-auto object-contain self-start"
            />
            <div className="mt-2">
              <h1 className="text-xl font-bold text-indigo-600">Hotel San Pedro</h1>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Hospitalidad & Comodidad
              </p>
            </div>
          </div>
        </div>
        <button className="mb-6 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-transform active:scale-95 shadow-lg">
          <span
            className="theme-material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            add_circle
          </span>
          New Reservation
        </button>
        <nav className="flex-1 flex flex-col gap-4">
          <a
            className="flex items-center gap-2 p-2 text-slate-500 hover:bg-slate-100 transition-all rounded-lg text-sm font-medium"
            href="#"
          >
            <span className="theme-material-symbols-outlined">dashboard</span> Dashboard
          </a>
          <a
            className="flex items-center gap-2 p-2 text-slate-500 hover:bg-slate-100 transition-all rounded-lg text-sm font-medium"
            href="#"
          >
            <span className="theme-material-symbols-outlined">calendar_month</span>{" "}
            Reservations
          </a>
          <a
            className="flex items-center gap-2 p-2 text-slate-500 hover:bg-slate-100 transition-all rounded-lg text-sm font-medium"
            href="#"
          >
            <span className="theme-material-symbols-outlined">inventory_2</span>{" "}
            Inventory
          </a>
          <a
            className="flex items-center gap-2 p-2 text-slate-500 hover:bg-slate-100 transition-all rounded-lg text-sm font-medium"
            href="#"
          >
            <span className="theme-material-symbols-outlined">build</span> Maintenance
          </a>
          {/* Active State: Billing maps to Facturación */}
          <a
            className="flex items-center gap-2 p-2 text-indigo-800 bg-indigo-100 rounded-lg text-sm font-medium"
            href="#"
          >
            <span className="theme-material-symbols-outlined">payments</span> Billing
          </a>
        </nav>
        <div className="mt-auto border-t border-slate-200 pt-4 flex flex-col gap-4">
          <a
            className="flex items-center gap-2 p-2 text-slate-500 hover:bg-slate-100 transition-all rounded-lg text-sm font-medium"
            href="#"
          >
            <span className="theme-material-symbols-outlined">settings</span> Settings
          </a>
          <a
            className="flex items-center gap-2 p-2 text-slate-500 hover:bg-slate-100 transition-all rounded-lg text-sm font-medium"
            href="#"
          >
            <span className="theme-material-symbols-outlined">logout</span> Logout
          </a>
        </div>
      </aside>
      <main className="ml-[280px] min-h-screen flex flex-col">
        {/* TopNavBar Anchor */}
        <header className="sticky top-0 z-40 w-full bg-slate-50 border-b border-slate-200 shadow-sm flex justify-between items-center px-8 py-2">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <span className="theme-material-symbols-outlined">search</span>
              </span>
              <input
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                placeholder="Buscar facturas..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
                <span className="theme-material-symbols-outlined">
                  notifications
                </span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                <span className="theme-material-symbols-outlined">help_outline</span>
              </button>
            </div>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-2 rounded-lg transition-colors">
              <Image
                alt="Administrator Profile"
                className="w-8 h-8 rounded-full object-cover"
                width={32}
                height={32}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3a-Lgnuw0PEUn8ng-XVmANQUqbowp8Jmz9A-0TSVoGU3HWcaWNezK-Gw959Z24ir5CNK0yycCz2EU7cGverB3amz67xCEYepj884Bbzda-HCFLYqVTcPlFb83QE-Yn3IzcLImzjmUIpzHazRpXuLC90ru7sy9WYG18oY7Sg3Pgzu6Oz8kXgbk3KOcwhydgSDvqvW2DUb8NKlM_I6u5wHdp940OovW6Yg90gEVdxMImV4BQIuMA9OykkBhRqAXNOLjvUZxn0Gu7NV3" // Replace with actual profile picture source
              />
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-slate-900 leading-none">
                  Admin Jefe
                </p>
                <p className="text-xs font-medium text-slate-500">
                  Hotel San Pedro
                </p>
              </div>
            </div>
          </div>
        </header>
        {children}
        {/* <section className="p-8 flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Facturación y Pagos
              </h2>
              <p className="text-base text-slate-500">
                Gestión financiera y seguimiento de ingresos del Grand Horizon.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="bg-slate-50 border border-slate-200 text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors flex items-center gap-1">
                <span className="theme-material-symbols-outlined text-[18px]">
                  download
                </span>{" "}
                Exportar
              </button>
              <button className="bg-indigo-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1 shadow-md">
                <span className="theme-material-symbols-outlined text-[18px]">
                  add
                </span>{" "}
                Nueva Factura
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/60 backdrop-blur-md border border-slate-100 p-4 rounded-xl flex flex-col justify-between group hover:-translate-y-1 transition-transform shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-800">
                  <span className="theme-material-symbols-outlined">payments</span>
                </div>
                <span className="text-indigo-800 text-xs font-medium bg-indigo-100 px-2 py-0.5 rounded-full">
                  +12.5%
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Ingresos Totales (Mes)
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">
                  €142,580.00
                </h3>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-md border border-slate-100 p-4 rounded-xl flex flex-col justify-between group hover:-translate-y-1 transition-transform shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-red-50 rounded-lg text-red-700">
                  <span className="theme-material-symbols-outlined">
                    pending_actions
                  </span>
                </div>
                <span className="text-red-600 text-xs font-medium bg-red-50 px-2 py-0.5 rounded-full">
                  8 facturas
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Pendientes de Cobro
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">
                  €12,440.50
                </h3>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-md border border-slate-100 p-4 rounded-xl flex flex-col justify-between group hover:-translate-y-1 transition-transform shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-slate-200 rounded-lg text-slate-600">
                  <span className="theme-material-symbols-outlined">receipt_long</span>
                </div>
                <span className="text-slate-500 text-xs font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                  Este Mes
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Facturas Emitidas
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">342</h3>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white/60 backdrop-blur-md border border-slate-100 p-4 rounded-xl flex flex-col shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-semibold text-slate-900">
                  Ingresos Mensuales
                </h4>
                <select className="bg-slate-100 border-none rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 px-2 py-1 outline-none">
                  <option>Año 2023</option>
                  <option>Año 2024</option>
                </select>
              </div>
              <div className="flex-1 flex items-end justify-between gap-4 h-64 pt-4">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className="w-full max-w-[40px] bg-slate-200 rounded-t-sm"
                    style={{ height: "45%" }}
                  ></div>
                  <span className="text-xs text-slate-500 mt-2">Ene</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className="w-full max-w-[40px] bg-slate-200 rounded-t-sm"
                    style={{ height: "60%" }}
                  ></div>
                  <span className="text-xs text-slate-500 mt-2">Feb</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className="w-full max-w-[40px] bg-slate-200 rounded-t-sm"
                    style={{ height: "55%" }}
                  ></div>
                  <span className="text-xs text-slate-500 mt-2">Mar</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className="w-full max-w-[40px] bg-indigo-800 rounded-t-sm"
                    style={{ height: "85%" }}
                  ></div>
                  <span className="text-xs text-slate-500 mt-2 font-bold">
                    Abr
                  </span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className="w-full max-w-[40px] bg-slate-200 rounded-t-sm"
                    style={{ height: "70%" }}
                  ></div>
                  <span className="text-xs text-slate-500 mt-2">May</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className="w-full max-w-[40px] bg-slate-200 rounded-t-sm"
                    style={{ height: "75%" }}
                  ></div>
                  <span className="text-xs text-slate-500 mt-2">Jun</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className="w-full max-w-[40px] bg-slate-200 rounded-t-sm"
                    style={{ height: "90%" }}
                  ></div>
                  <span className="text-xs text-slate-500 mt-2">Jul</span>
                </div>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-md border border-slate-100 p-4 rounded-xl flex flex-col shadow-sm">
              <h4 className="text-xl font-semibold text-slate-900 mb-6">
                Métodos de Pago
              </h4>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-500">Tarjeta de Crédito</span>
                    <span className="text-slate-900 font-bold">65%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-800 h-full"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-500">
                      Transferencia Bancaria
                    </span>
                    <span className="text-slate-900 font-bold">25%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full"
                      style={{ width: "25%" }}
                    ></div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-500">Efectivo / Otros</span>
                    <span className="text-slate-900 font-bold">10%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-400 h-full"
                      style={{ width: "10%" }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="mt-auto pt-6">
                <div className="p-2 bg-slate-100 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-500 italic">
                    "Los pagos con tarjeta han aumentado un 5% respecto al
                    trimestre anterior."
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white/60 backdrop-blur-md border border-slate-100 rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-2 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h4 className="text-xl font-semibold text-slate-900">
                Transacciones Recientes
              </h4>
              <button className="text-indigo-800 text-sm font-medium hover:underline">
                Ver todas
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-100 text-sm font-medium text-slate-500">
                    <th className="px-4 py-2 font-medium">ID Factura</th>
                    <th className="px-4 py-2 font-medium">Cliente</th>
                    <th className="px-4 py-2 font-medium">Fecha</th>
                    <th className="px-4 py-2 font-medium">Estado</th>
                    <th className="px-4 py-2 font-medium text-right">Monto</th>
                    <th className="px-4 py-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-4 text-base text-slate-900">
                      #INV-8821
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-[12px]">
                          JD
                        </div>
                        <span className="text-base text-slate-900">
                          Julianna Duarte
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500">
                      12 Abr, 2024
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1 text-xs font-medium text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full w-fit">
                        <span className="w-1.5 h-1.5 bg-indigo-800 rounded-full"></span>
                        Completado
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xl font-semibold text-right text-slate-900">
                      €1,240.00
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button className="theme-material-symbols-outlined text-slate-400 hover:text-slate-900 transition-colors">
                        more_vert
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-4 text-base text-slate-900">
                      #INV-8820
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[12px]">
                          MP
                        </div>
                        <span className="text-base text-slate-900">
                          Marco Polo
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500">
                      11 Abr, 2024
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full w-fit">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        Pendiente
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xl font-semibold text-right text-slate-900">
                      €850.50
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button className="theme-material-symbols-outlined text-slate-400 hover:text-slate-900 transition-colors">
                        more_vert
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-4 text-base text-slate-900">
                      #INV-8819
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-[12px]">
                          SL
                        </div>
                        <span className="text-base text-slate-900">
                          Sophia Loren
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500">
                      10 Abr, 2024
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1 text-xs font-medium text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full w-fit">
                        <span className="w-1.5 h-1.5 bg-indigo-800 rounded-full"></span>
                        Completado
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xl font-semibold text-right text-slate-900">
                      €2,100.00
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button className="theme-material-symbols-outlined text-slate-400 hover:text-slate-900 transition-colors">
                        more_vert
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-4 text-base text-slate-900">
                      #INV-8818
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[12px]">
                          AG
                        </div>
                        <span className="text-base text-slate-900">
                          Alejandro G.
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500">
                      09 Abr, 2024
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full w-fit">
                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span>
                        Cancelado
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xl font-semibold text-right text-slate-900">
                      €450.00
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button className="theme-material-symbols-outlined text-slate-400 hover:text-slate-900 transition-colors">
                        more_vert
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section> */}
        <footer className="mt-auto px-8 py-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <p className="">
            © 2024 Hotel San Pedro Management System. Todos los derechos
            reservados.
          </p>
          <div className="flex gap-4">
            <a className="hover:text-slate-900 transition-colors" href="#">
              Soporte Técnico
            </a>
            <a className="hover:text-slate-900 transition-colors" href="#">
              Privacidad
            </a>
          </div>
        </footer>
      </main>
      <button className="fixed bottom-6 right-6 bg-indigo-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50">
        <span className="theme-material-symbols-outlined">support_agent</span>
      </button>
    </div>
  );
}
