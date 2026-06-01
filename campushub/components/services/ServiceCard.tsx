"use client";

import { useState } from "react";
import { Star, MessageCircle, Clock } from "lucide-react";
import { Service } from "@/data/services";
import ContactModal from "./ContactModal";

const CATEGORY_COLORS: Record<string, string> = {
  "Tutoría":      "bg-blue-100 text-blue-700",
  "Programación": "bg-violet-100 text-violet-700",
  "Diseño":       "bg-pink-100 text-pink-700",
  "Matemáticas":  "bg-amber-100 text-amber-700",
  "Física":       "bg-teal-100 text-teal-700",
  "Química":      "bg-green-100 text-green-700",
  "Idiomas":      "bg-sky-100 text-sky-700",
  "Estadística":  "bg-orange-100 text-orange-700",
  "Redacción":    "bg-rose-100 text-rose-700",
  "Contabilidad": "bg-emerald-100 text-emerald-700",
};

interface Props {
  service: Service;
  isOwner: boolean;
}

export default function ServiceCard({ service, isOwner }: Props) {
  const [showContact, setShowContact] = useState(false);
  const badge = CATEGORY_COLORS[service.category] ?? "bg-slate-100 text-slate-700";

  const initials = service.ownerName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">

        {/* Categoría + owner tag */}
        <div className="flex items-center justify-between">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${badge}`}>
            {service.category}
          </span>
          {isOwner && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Tu servicio
            </span>
          )}
        </div>

        {/* Título */}
        <h2 className="font-bold text-lg mt-4 text-slate-900 leading-tight line-clamp-2">
          {service.title}
        </h2>

        {/* Descripción */}
        <p className="text-slate-500 text-sm mt-2 line-clamp-3 flex-1">
          {service.description}
        </p>

        {/* Rating */}
        {service.reviewCount > 0 && (
          <div className="flex items-center gap-1.5 mt-3">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-slate-800">
              {service.rating.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">
              ({service.reviewCount} reseñas)
            </span>
          </div>
        )}

        {/* Dueño + precio */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
              {initials}
            </div>
            <span className="text-sm text-slate-600 font-medium">{service.ownerName}</span>
          </div>
          <div className="text-right">
            <p className="font-bold text-blue-600 text-lg">S/. {service.price}</p>
            <p className="text-xs text-slate-400 flex items-center gap-1 justify-end">
              <Clock size={10} /> por {service.priceType}
            </p>
          </div>
        </div>

        {/* Botón contactar */}
        {!isOwner && (
          <button
            onClick={() => setShowContact(true)}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors"
          >
            <MessageCircle size={16} />
            Contactar
          </button>
        )}
      </div>

      {showContact && (
        <ContactModal
          targetName={service.ownerName}
          targetEmail={service.ownerEmail}
          itemTitle={service.title}
          onClose={() => setShowContact(false)}
        />
      )}
    </>
  );
}