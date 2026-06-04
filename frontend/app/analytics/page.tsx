"use client";
 
import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { events as defaultEvents } from "@/data/events";
import { defaultServices, defaultProducts } from "@/data/services";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { TrendingUp, Users, Calendar, Star, ShoppingBag, Wrench } from "lucide-react";
 
// ── Tipos ──────────────────────────────────────────────────────────
interface Registration {
  userEmail: string;
  eventId: number;
}
 
interface StoredUser {
  email: string;
  name: string;
}
 
interface EventWithCount {
  id: number;
  title: string;
  category: string;
  date: string;
  count: number;
}
 
// ── Colores por categoría ──────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  Tecnología: "#3b82f6",
  Cultura: "#a855f7",
  Deporte: "#22c55e",
  Académico: "#f59e0b",
  Arte: "#ec4899",
  Música: "#14b8a6",
  Otros: "#64748b",
};
 
const PIE_COLORS = ["#3b82f6", "#a855f7", "#22c55e", "#f59e0b", "#ec4899", "#14b8a6", "#64748b"];
 
// ── Stat Card ─────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  sub?: string;
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
 
// ── Componente principal ───────────────────────────────────────────
export default function AnalyticsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [extraServices, setExtraServices] = useState<{ ownerEmail: string }[]>([]);
  const [extraProducts, setExtraProducts] = useState<{ ownerEmail: string }[]>([]);
 
  useEffect(() => {
    setRegistrations(JSON.parse(localStorage.getItem("registrations") || "[]"));
    setUsers(JSON.parse(localStorage.getItem("users") || "[]"));
    setExtraServices(JSON.parse(localStorage.getItem("services") || "[]"));
    setExtraProducts(JSON.parse(localStorage.getItem("products") || "[]"));
  }, []);
 
  // ── Métricas globales ────────────────────────────────────────────
  const totalEvents = defaultEvents.length;
  const totalRegistrations = registrations.length;
  const totalUsers = users.length || 1;
  const totalServices = defaultServices.length + extraServices.length;
  const totalProducts = defaultProducts.length + extraProducts.length;
  const participationRate =
    totalEvents > 0
      ? Math.round((totalRegistrations / (totalEvents * Math.max(totalUsers, 1))) * 100)
      : 0;
 
  // ── Eventos más populares ────────────────────────────────────────
  const topEvents: EventWithCount[] = useMemo(() => {
    const countMap: Record<number, number> = {};
    registrations.forEach((r) => {
      countMap[r.eventId] = (countMap[r.eventId] || 0) + 1;
    });
 
    return defaultEvents
      .map((e) => ({ ...e, count: countMap[e.id] || 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [registrations]);
 
  // ── Inscripciones por categoría (barra) ─────────────────────────
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    registrations.forEach((r) => {
      const event = defaultEvents.find((e) => e.id === r.eventId);
      if (event) {
        map[event.category] = (map[event.category] || 0) + 1;
      }
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [registrations]);
 
  // ── Distribución de eventos por categoría (pie) ──────────────────
  const eventCategoryDist = useMemo(() => {
    const map: Record<string, number> = {};
    defaultEvents.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, []);
 
  // ── Barras de módulos ────────────────────────────────────────────
  const moduleStats = [
    { label: "Eventos", value: totalEvents, max: 20, color: "bg-blue-500" },
    { label: "Inscripciones", value: totalRegistrations, max: 50, color: "bg-violet-500" },
    { label: "Servicios", value: totalServices, max: 20, color: "bg-green-500" },
    { label: "Marketplace", value: totalProducts, max: 20, color: "bg-pink-500" },
  ];
 
  return (
    <DashboardLayout>
 
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-slate-900">Analytics ✨</h1>
        <p className="text-slate-500 mt-2">Resumen general de CampusHub en tiempo real</p>
      </div>
 
      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <div className="xl:col-span-1">
          <StatCard label="Eventos" value={totalEvents} icon={Calendar} color="bg-blue-500" />
        </div>
        <div className="xl:col-span-1">
          <StatCard label="Inscripciones" value={totalRegistrations} icon={TrendingUp} color="bg-violet-500" />
        </div>
        <div className="xl:col-span-1">
          <StatCard label="Usuarios" value={totalUsers} icon={Users} color="bg-green-500" />
        </div>
        <div className="xl:col-span-1">
          <StatCard
            label="Participación"
            value={`${participationRate}%`}
            icon={Star}
            color="bg-amber-500"
            sub="inscritos / usuarios × eventos"
          />
        </div>
        <div className="xl:col-span-1">
          <StatCard label="Servicios" value={totalServices} icon={Wrench} color="bg-teal-500" />
        </div>
        <div className="xl:col-span-1">
          <StatCard label="Productos" value={totalProducts} icon={ShoppingBag} color="bg-pink-500" />
        </div>
      </div>
 
      {/* Fila 2: Gráficas */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
 
        {/* Inscripciones por categoría */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Inscripciones por categoría</h2>
          <p className="text-slate-400 text-sm mb-6">Cuántas inscripciones tiene cada categoría</p>
 
          {categoryData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
              Sin inscripciones aún
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData} barSize={32}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px #0001" }}
                  cursor={{ fill: "#f1f5f9" }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {categoryData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={CATEGORY_COLORS[entry.name] ?? PIE_COLORS[i % PIE_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
 
        {/* Distribución de eventos */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Eventos por categoría</h2>
          <p className="text-slate-400 text-sm mb-4">Distribución del catálogo de eventos</p>
 
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={eventCategoryDist}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={3}
              >
                {eventCategoryDist.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px #0001" }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
 
      {/* Fila 3: Top eventos + Estado módulos */}
      <div className="grid lg:grid-cols-2 gap-6">
 
        {/* Top 5 eventos */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Eventos más populares</h2>
 
          <div className="space-y-4">
            {topEvents.map((event, i) => (
              <div key={event.id} className="flex items-center gap-4">
                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                    i === 0
                      ? "bg-amber-100 text-amber-600"
                      : i === 1
                      ? "bg-slate-100 text-slate-600"
                      : i === 2
                      ? "bg-orange-100 text-orange-600"
                      : "bg-slate-50 text-slate-400"
                  }`}
                >
                  {i + 1}
                </span>
 
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">{event.title}</p>
                  <p className="text-xs text-slate-400">{event.category} · {event.date}</p>
                </div>
 
                <span
                  className="text-sm font-semibold px-3 py-1 rounded-full"
                  style={{
                    background: `${CATEGORY_COLORS[event.category] ?? "#64748b"}18`,
                    color: CATEGORY_COLORS[event.category] ?? "#64748b",
                  }}
                >
                  {event.count} inscritos
                </span>
              </div>
            ))}
 
            {topEvents.every((e) => e.count === 0) && (
              <p className="text-slate-400 text-sm text-center py-6">
                Aún no hay inscripciones registradas
              </p>
            )}
          </div>
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
                    <div
                      className={`h-2.5 rounded-full transition-all duration-700 ${m.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
 
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{totalRegistrations}</p>
              <p className="text-xs text-slate-400 mt-1">Inscripciones totales</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{participationRate}%</p>
              <p className="text-xs text-slate-400 mt-1">Tasa de participación</p>
            </div>
          </div>
        </div>
 
      </div>
    </DashboardLayout>
  );
}