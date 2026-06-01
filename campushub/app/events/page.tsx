"use client";

import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import EventCard from "@/components/events/EventCard";
import { events as defaultEvents, CATEGORIES, Event } from "@/data/events";
import { useAuth } from "@/components/auth/AuthContext";
import { Search, SlidersHorizontal } from "lucide-react";

type SortOption = "fecha" | "nombre" | "cupos";

export default function EventsPage() {
  const { user } = useAuth();

  const [allEvents, setAllEvents] = useState<Event[]>(defaultEvents);
  const [enrolledIds, setEnrolledIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [sortBy, setSortBy] = useState<SortOption>("fecha");
  const [showOnlyEnrolled, setShowOnlyEnrolled] = useState(false);

  // Cargamos eventos custom + inscripciones del usuario
  useEffect(() => {
    const customEvents: Event[] = JSON.parse(
      localStorage.getItem("customEvents") || "[]"
    );
    setAllEvents([...defaultEvents, ...customEvents]);

    if (user) {
      const registrations: { eventId: number; userEmail: string }[] = JSON.parse(
        localStorage.getItem("registrations") || "[]"
      );
      const ids = registrations
        .filter((r) => r.userEmail === user.email)
        .map((r) => r.eventId);
      setEnrolledIds(ids);
    }
  }, [user]);

  // Filtrado + ordenamiento con useMemo para eficiencia
  const filteredEvents = useMemo(() => {
    let result = [...allEvents];

    if (showOnlyEnrolled) {
      result = result.filter((e) => enrolledIds.includes(e.id));
    }

    if (activeCategory !== "Todos") {
      result = result.filter((e) => e.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortBy === "fecha")  return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "nombre") return a.title.localeCompare(b.title);
      if (sortBy === "cupos")  return (b.capacity - b.attendees) - (a.capacity - a.attendees);
      return 0;
    });

    return result;
  }, [allEvents, activeCategory, search, sortBy, showOnlyEnrolled, enrolledIds]);

  const categories = ["Todos", ...CATEGORIES];

  return (
    <DashboardLayout>

      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-slate-900">Eventos</h1>
        <p className="text-slate-500 mt-1">
          {filteredEvents.length} evento{filteredEvents.length !== 1 ? "s" : ""} disponibles
        </p>
      </div>

      {/* Barra de búsqueda + ordenamiento */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, lugar..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="fecha">Ordenar: Fecha</option>
            <option value="nombre">Ordenar: Nombre</option>
            <option value="cupos">Ordenar: Cupos</option>
          </select>
        </div>
      </div>

      {/* Filtros por categoría */}
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              activeCategory === cat
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-blue-400"
            }`}
          >
            {cat}
          </button>
        ))}

        {/* Toggle mis eventos */}
        {user && (
          <button
            onClick={() => setShowOnlyEnrolled((v) => !v)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ml-auto ${
              showOnlyEnrolled
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-green-400"
            }`}
          >
            {showOnlyEnrolled ? "✓ Mis eventos" : "Mis eventos"}
          </button>
        )}
      </div>

      {/* Grid de eventos */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-xl font-medium">No se encontraron eventos</p>
          <p className="text-sm mt-2">Intenta con otra categoría o término de búsqueda</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isEnrolled={enrolledIds.includes(event.id)}
            />
          ))}
        </div>
      )}

    </DashboardLayout>
  );
}