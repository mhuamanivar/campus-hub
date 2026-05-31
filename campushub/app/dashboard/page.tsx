"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { CalendarDays, Users, Activity, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Eventos",
      value: "24",
      icon: CalendarDays,
    },
    {
      title: "Participantes",
      value: "1,284",
      icon: Users,
    },
    {
      title: "Asistencia",
      value: "92%",
      icon: Activity,
    },
    {
      title: "Crecimiento",
      value: "+18%",
      icon: TrendingUp,
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Bienvenido a CampusHub
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
            >
              <div className="flex justify-between">
                <span className="text-slate-500">
                  {stat.title}
                </span>

                <Icon className="text-blue-600" />
              </div>

              <h2 className="text-4xl font-bold mt-4 text-slate-900">
                {stat.value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="mt-10 bg-white rounded-2xl p-6 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">
          Próximos Eventos
        </h2>

        <div className="mt-5 space-y-4">
          <div className="border rounded-xl p-4">
            Hackathon UNSA 2026
          </div>

          <div className="border rounded-xl p-4">
            Congreso de Ingeniería
          </div>

          <div className="border rounded-xl p-4">
            Workshop IA
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}