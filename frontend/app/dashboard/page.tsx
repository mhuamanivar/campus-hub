"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAnalyticsOverview } from "@/hooks/useAnalytics";
import { useEvents } from "@/hooks/useEvents";
import { CalendarDays, Users, Activity, TrendingUp } from "lucide-react";
import Link from "next/link";
import { EVENT_CATEGORY_LABEL } from "@/lib/categories";

export default function DashboardPage() {
  const { data: overview, isLoading } = useAnalyticsOverview();
  const { data: upcomingEvents = [] }  = useEvents({ sortBy: "date", limit: 5 });

  const stats = [
    { title: "Eventos",        value: isLoading ? "–" : overview?.totalEvents ?? 0,        icon: CalendarDays, color: "text-blue-600" },
    { title: "Inscripciones",  value: isLoading ? "–" : overview?.totalRegistrations ?? 0, icon: TrendingUp,   color: "text-violet-600" },
    { title: "Usuarios",       value: isLoading ? "–" : overview?.totalUsers ?? 0,         icon: Users,        color: "text-green-600" },
    { title: "Asistencia",     value: isLoading ? "–" : `${overview?.attendanceRate ?? 0}%`, icon: Activity,   color: "text-amber-600" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-2">Bienvenido a CampusHub</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ title, value, icon: Icon, color }) => (
          <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">{title}</span>
              <Icon className={color} />
            </div>
            <h2 className="text-4xl font-bold mt-4 text-slate-900">{value}</h2>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900">Próximos Eventos</h2>
          <Link href="/events" className="text-sm text-blue-600 hover:underline">Ver todos →</Link>
        </div>

        <div className="space-y-3">
          {upcomingEvents.slice(0, 5).map((event) => (
            <Link key={event.id} href={`/event/${event.id}`} className="flex items-center gap-4 border rounded-xl p-4 hover:border-blue-300 transition-colors">
              <div className="flex-1">
                <p className="font-medium text-slate-800">{event.title}</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  {new Date(event.date).toLocaleDateString("es-PE")} · {event.location}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                  {EVENT_CATEGORY_LABEL[event.category] ?? event.category}
                </span>
                <p className="text-xs text-slate-400 mt-1">{event.registrationCount}/{event.capacity}</p>
              </div>
            </Link>
          ))}
          {upcomingEvents.length === 0 && (
            <p className="text-slate-400 text-center py-6">No hay eventos próximos</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
