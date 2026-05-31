"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>

      <div className="mb-10">

        <h1 className="text-5xl font-bold text-slate-900">
          Analytics ✨
        </h1>

        <p className="text-slate-500 mt-2">
          Resumen general de CampusHub
        </p>

      </div>

      <div className="grid lg:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <h3 className="text-slate-500">
            Eventos
          </h3>

          <p className="text-5xl font-bold text-blue-600 mt-3">
            3
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <h3 className="text-slate-500">
            Inscripciones
          </h3>

          <p className="text-5xl font-bold text-violet-600 mt-3">
            0
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <h3 className="text-slate-500">
            Usuarios
          </h3>

          <p className="text-5xl font-bold text-green-600 mt-3">
            1
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <h3 className="text-slate-500">
            Participación
          </h3>

          <p className="text-5xl font-bold text-pink-600 mt-3">
            0%
          </p>
        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        <div className="bg-white p-8 rounded-3xl shadow-sm">

          <h2 className="text-2xl font-bold mb-6">
            Actividad Reciente
          </h2>

          <div className="space-y-4">

            <div className="bg-slate-50 p-4 rounded-xl">
              Sistema iniciado
            </div>

            <div className="bg-slate-50 p-4 rounded-xl">
              Usuario registrado
            </div>

            <div className="bg-slate-50 p-4 rounded-xl">
              Eventos cargados
            </div>

          </div>

        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm">

          <h2 className="text-2xl font-bold mb-6">
            Estado Plataforma
          </h2>

          <div className="space-y-5">

            <div>
              <p className="mb-2">
                Eventos
              </p>

              <div className="h-3 bg-slate-200 rounded-full">
                <div className="h-3 bg-blue-600 rounded-full w-[80%]" />
              </div>
            </div>

            <div>
              <p className="mb-2">
                Servicios
              </p>

              <div className="h-3 bg-slate-200 rounded-full">
                <div className="h-3 bg-violet-600 rounded-full w-[40%]" />
              </div>
            </div>

            <div>
              <p className="mb-2">
                Marketplace
              </p>

              <div className="h-3 bg-slate-200 rounded-full">
                <div className="h-3 bg-pink-600 rounded-full w-[20%]" />
              </div>
            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}