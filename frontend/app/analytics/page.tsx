"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  useAnalyticsOverview,
  usePopularEvents,
  useEventsByCategory,
  useEventDistribution,
} from "@/hooks/useAnalytics";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from "recharts";
import { TrendingUp, Users, Calendar, Star, ShoppingBag, Wrench } from "lucide-react";

const PIE_COLORS = ["#3b82f6", "#a855f7", "#22c55e", "#f59e0b", "#ec4899", "#14b8a6", "#64748b"];
const CATEGORY_COLORS: Record<string, string> = {
  "Tecnología": "#3b82f6", "Ciencia": "#14b8a6", "Emprendimiento": "#f59e0b",
  "Arte y Cultura": "#ec4899", "Deportes": "#22c55e", "Música": "#a855f7",
  "Diseño": "#d946ef", "Voluntariado": "#ef4444", "Idiomas": "#0ea5e9",
  "Investigación": "#64748b",
};

function StatCard({ label, value, icon: Icon, color, sub }: {
  label: string; value: string | number; icon: React.ElementType; color: string; sub?: string;
}) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-slate-500 text-sm font-medium">{label}</span>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="text-5xl font-bold text-slate-900">{value}</p>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`bg-slate-100 rounded-2xl animate-pulse ${className}`} />;
}

export default function AnalyticsPage() {
  const { data: overview, isLoading: loadingOverview } = useAnalyticsOverview();
  const { data: popular = [], isLoading: loadingPopular } = usePopularEvents(5);
  const { data: byCategory = [], isLoading: loadingCategory } = useEventsByCategory();
  const { data: distribution = [], isLoading: loadingDist } = useEventDistribution();

  const moduleStats = [
    { label: "Eventos",       value: overview?.totalEvents ?? 0,       max: 20, color: "bg-blue-500" },
    { label: "Inscripciones", value: overview?.totalRegistrations ?? 0, max: 50, color: "bg-violet-500" },
    { label: "Servicios",     value: overview?.totalServices ?? 0,      max: 20, color: "bg-green-500" },
    { label: "Productos",     value: overview?.totalProducts ?? 0,      max: 20, color: "bg-pink-500" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-slate-900">Analytics ✨</h1>
        <p className="text-slate-500 mt-2">Resumen general de CampusHub en tiempo real</p>
      </div>

      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {loadingOverview ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40" />)
        ) : (
          <>
            <StatCard label="Eventos"        value={overview?.totalEvents ?? 0}        icon={Calendar}   color="bg-blue-500" />
            <StatCard label="Inscripciones"  value={overview?.totalRegistrations ?? 0} icon={TrendingUp}  color="bg-violet-500" />
            <StatCard label="Usuarios"       value={overview?.totalUsers ?? 0}         icon={Users}       color="bg-green-500" />
            <StatCard label="Participación"  value={`${overview?.attendanceRate ?? 0}%`} icon={Star}      color="bg-amber-500" sub="asistencias / inscripciones" />
            <StatCard label="Servicios"      value={overview?.totalServices ?? 0}      icon={Wrench}      color="bg-teal-500" />
            <StatCard label="Productos"      value={overview?.totalProducts ?? 0}      icon={ShoppingBag} color="bg-pink-500" />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Inscripciones por categoría</h2>
          <p className="text-slate-400 text-sm mb-6">Cuántas inscripciones tiene cada categoría</p>
          {loadingCategory ? <Skeleton className="h-56" /> : byCategory.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Sin inscripciones aún</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={byCategory} barSize={32}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px #0001" }} cursor={{ fill: "#f1f5f9" }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {byCategory.map((entry, i) => (
                    <Cell key={i} fill={CATEGORY_COLORS[entry.name] ?? PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Eventos por categoría</h2>
          <p className="text-slate-400 text-sm mb-4">Distribución del catálogo de eventos</p>
          {loadingDist ? <Skeleton className="h-56" /> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={distribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={3}>
                  {distribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px #0001" }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Eventos más populares</h2>
          {loadingPopular ? (
            <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : (
            <div className="space-y-4">
              {popular.map((event, i) => (
                <div key={event.id} className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                    i === 0 ? "bg-amber-100 text-amber-600" : i === 1 ? "bg-slate-100 text-slate-600" : i === 2 ? "bg-orange-100 text-orange-600" : "bg-slate-50 text-slate-400"
                  }`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">{event.title}</p>
                    <p className="text-xs text-slate-400">{event.categoryLabel} · {new Date(event.date).toLocaleDateString("es-PE")}</p>
                  </div>
                  <span className="text-sm font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                    {event.registrationCount} inscritos
                  </span>
                </div>
              ))}
              {popular.length === 0 && <p className="text-slate-400 text-sm text-center py-6">Aún no hay inscripciones</p>}
            </div>
          )}
        </div>

        {/* Estado de módulos */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Estado de la plataforma</h2>
          <div className="space-y-5">
            {moduleStats.map((m) => {
              const pct = Math.min(Math.round((m.value / m.max) * 100), 100);
              return (
                <div key={m.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-700">{m.label}</span>
                    <span className="text-sm text-slate-400">{m.value} / {m.max}</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-2.5 rounded-full transition-all duration-700 ${m.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{overview?.totalRegistrations ?? 0}</p>
              <p className="text-xs text-slate-400 mt-1">Inscripciones totales</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{overview?.totalAttendances ?? 0}</p>
              <p className="text-xs text-slate-400 mt-1">Asistencias registradas</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
