"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import EventCard from "@/components/events/EventCard";
import { useAuth } from "@/components/auth/AuthContext";
import { useEvents } from "@/hooks/useEvents";
import { EVENT_CATEGORIES, EVENT_CATEGORY_LABEL, EVENT_CATEGORY_VALUE } from "@/lib/categories";
import { Search, SlidersHorizontal } from "lucide-react";

type SortOption = "date" | "title" | "capacity";

// Debounce helper hook
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function EventsPage() {
  const { user } = useAuth();

  const [search, setSearch]               = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [sortBy, setSortBy]               = useState<SortOption>("date");
  const [showOnlyEnrolled, setShowOnlyEnrolled] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const categoryParam = activeCategory !== "Todos"
    ? EVENT_CATEGORY_VALUE[activeCategory]
    : undefined;

  const { data: events = [], isLoading } = useEvents({
    search: debouncedSearch || undefined,
    category: categoryParam,
    sortBy,
  });

  const filteredEvents = useMemo(
    () => showOnlyEnrolled ? events.filter((e) => e.isRegistered) : events,
    [events, showOnlyEnrolled],
  );

  const displayCategories = ["Todos", ...EVENT_CATEGORIES.map((k) => EVENT_CATEGORY_LABEL[k])];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-slate-900">Eventos</h1>
        <p className="text-slate-500 mt-1">
          {isLoading
            ? "Cargando eventos..."
            : `${filteredEvents.length} evento${filteredEvents.length !== 1 ? "s" : ""} disponibles`}
        </p>
      </div>

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
            <option value="date">Ordenar: Fecha</option>
            <option value="title">Ordenar: Nombre</option>
            <option value="capacity">Ordenar: Cupos</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {displayCategories.map((cat) => (
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

      {isLoading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-xl font-medium">No se encontraron eventos</p>
          <p className="text-sm mt-2">Intenta con otra categoría o término de búsqueda</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
