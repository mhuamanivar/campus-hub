"use client";

import { Star, Clock } from "lucide-react";
import type { ApiService } from "@/types/service";
import { SERVICE_CATEGORY_LABEL, PRICE_TYPE_LABEL } from "@/lib/categories";

const CATEGORY_BADGE: Record<string, string> = {
  TUTORIA: "bg-blue-100 text-blue-700", PROGRAMACION: "bg-violet-100 text-violet-700",
  DISENO: "bg-pink-100 text-pink-700", MATEMATICAS: "bg-amber-100 text-amber-700",
  FISICA: "bg-teal-100 text-teal-700", QUIMICA: "bg-green-100 text-green-700",
  IDIOMAS: "bg-sky-100 text-sky-700", ESTADISTICA: "bg-orange-100 text-orange-700",
  REDACCION: "bg-rose-100 text-rose-700", CONTABILIDAD: "bg-emerald-100 text-emerald-700",
};

interface Props {
  readonly service: ApiService;
  readonly currentUserId?: string;
}

export default function ServiceCard({ service, currentUserId }: Props) {
  const badge   = CATEGORY_BADGE[service.category] ?? "bg-slate-100 text-slate-700";
  const label   = SERVICE_CATEGORY_LABEL[service.category] ?? service.category;
  const ptLabel = PRICE_TYPE_LABEL[service.priceType] ?? service.priceType;
  const isOwner = currentUserId === service.ownerId;

  const initials = service.ownerName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      <div className="flex items-center justify-between">
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${badge}`}>{label}</span>
        {isOwner && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Tu servicio</span>}
      </div>

      <h2 className="font-bold text-lg mt-4 text-slate-900 leading-tight line-clamp-2">{service.title}</h2>
      <p className="text-slate-500 text-sm mt-2 line-clamp-3 flex-1">{service.description}</p>

      {service.reviewCount > 0 && (
        <div className="flex items-center gap-1.5 mt-3">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium text-slate-800">{service.rating.toFixed(1)}</span>
          <span className="text-xs text-slate-400">({service.reviewCount} reseñas)</span>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">{initials}</div>
          <span className="text-sm text-slate-600 font-medium">{service.ownerName}</span>
        </div>
        <div className="text-right">
          <p className="font-bold text-blue-600 text-lg">S/. {service.price}</p>
          <p className="text-xs text-slate-400 flex items-center gap-1 justify-end">
            <Clock size={10} /> por {ptLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
