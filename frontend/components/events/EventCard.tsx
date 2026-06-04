import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";
import { Event } from "@/data/events";

// Colores por categoría para darle vida al feed
const CATEGORY_COLORS: Record<string, string> = {
  "Tecnología":      "from-blue-500 to-indigo-600",
  "Ciencia":         "from-teal-500 to-cyan-600",
  "Emprendimiento":  "from-amber-500 to-orange-600",
  "Arte y Cultura":  "from-pink-500 to-rose-600",
  "Deportes":        "from-green-500 to-emerald-600",
  "Música":          "from-purple-500 to-violet-600",
  "Diseño":          "from-fuchsia-500 to-pink-600",
  "Voluntariado":    "from-red-500 to-rose-600",
  "Idiomas":         "from-sky-500 to-blue-600",
  "Investigación":   "from-slate-500 to-gray-600",
};

const CATEGORY_BADGE: Record<string, string> = {
  "Tecnología":      "bg-blue-100 text-blue-700",
  "Ciencia":         "bg-teal-100 text-teal-700",
  "Emprendimiento":  "bg-amber-100 text-amber-700",
  "Arte y Cultura":  "bg-pink-100 text-pink-700",
  "Deportes":        "bg-green-100 text-green-700",
  "Música":          "bg-purple-100 text-purple-700",
  "Diseño":          "bg-fuchsia-100 text-fuchsia-700",
  "Voluntariado":    "bg-red-100 text-red-700",
  "Idiomas":         "bg-sky-100 text-sky-700",
  "Investigación":   "bg-slate-100 text-slate-700",
};

interface Props {
  event: Event;
  isEnrolled?: boolean;
}

export default function EventCard({ event, isEnrolled = false }: Props) {
  const gradient = CATEGORY_COLORS[event.category] ?? "from-blue-500 to-indigo-600";
  const badge    = CATEGORY_BADGE[event.category]  ?? "bg-blue-100 text-blue-700";

  const spotsLeft  = event.capacity - event.attendees;
  const isFull     = spotsLeft <= 0;
  const almostFull = spotsLeft <= 10 && !isFull;

  const formattedDate = new Date(event.date).toLocaleDateString("es-PE", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col">

      {/* Banner */}
      <div className={`h-40 bg-gradient-to-r ${gradient} relative`}>
        {isEnrolled && (
          <span className="absolute top-3 right-3 bg-white text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
            ✓ Inscrito
          </span>
        )}
        {isFull && !isEnrolled && (
          <span className="absolute top-3 right-3 bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Cupos llenos
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-1">
        <span className={`text-xs px-3 py-1 rounded-full font-medium w-fit ${badge}`}>
          {event.category}
        </span>

        <h2 className="font-bold text-lg mt-3 text-slate-900 leading-tight line-clamp-2">
          {event.title}
        </h2>

        <p className="text-slate-500 text-sm mt-2 line-clamp-2 flex-1">
          {event.description}
        </p>

        <div className="mt-4 space-y-1.5">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Calendar size={14} className="flex-shrink-0" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <MapPin size={14} className="flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users size={14} className="flex-shrink-0 text-slate-500" />
            <span className={almostFull ? "text-amber-600 font-medium" : "text-slate-500"}>
              {event.attendees}/{event.capacity} asistentes
              {almostFull && " · ¡Últimos cupos!"}
            </span>
          </div>
        </div>

        <Link
          href={`/event/${event.id}`}
          className={`block text-center mt-5 py-3 rounded-xl font-medium transition-colors ${
            isFull && !isEnrolled
              ? "bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isEnrolled ? "Ver detalles" : isFull ? "Sin cupos" : "Ver Evento"}
        </Link>
      </div>
    </div>
  );
}