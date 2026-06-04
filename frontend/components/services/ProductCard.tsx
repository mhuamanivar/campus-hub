"use client";

import { Tag, Star } from "lucide-react";
import type { ApiProduct } from "@/types/service";
import { PRODUCT_CATEGORY_LABEL, PRODUCT_CONDITION_LABEL } from "@/lib/categories";

const CONDITION_STYLES: Record<string, string> = {
  NUEVO: "bg-green-100 text-green-700", CASI_NUEVO: "bg-teal-100 text-teal-700",
  USADO: "bg-amber-100 text-amber-700", INTERCAMBIO: "bg-purple-100 text-purple-700",
};

interface Props {
  readonly product: ApiProduct;
  readonly currentUserId?: string;
}

export default function ProductCard({ product, currentUserId }: Props) {
  const condStyle  = CONDITION_STYLES[product.condition] ?? "bg-slate-100 text-slate-700";
  const catLabel   = PRODUCT_CATEGORY_LABEL[product.category] ?? product.category;
  const condLabel  = PRODUCT_CONDITION_LABEL[product.condition] ?? product.condition;
  const isOwner    = currentUserId === product.ownerId;
  const isExchange = product.condition === "INTERCAMBIO";

  const initials = product.ownerName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">{catLabel}</span>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${condStyle}`}>{condLabel}</span>
      </div>
      {isOwner && <span className="mt-2 w-fit text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Tu publicación</span>}

      <h2 className="font-bold text-lg mt-4 text-slate-900 leading-tight line-clamp-2">{product.title}</h2>
      <p className="text-slate-500 text-sm mt-2 line-clamp-3 flex-1">{product.description}</p>

      {product.reviewCount > 0 && (
        <div className="flex items-center gap-1.5 mt-3">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-slate-400">({product.reviewCount})</span>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold">{initials}</div>
          <span className="text-sm text-slate-600 font-medium">{product.ownerName}</span>
        </div>
        <div className="text-right">
          {isExchange ? (
            <p className="font-bold text-purple-600 text-lg flex items-center gap-1"><Tag size={16} /> Intercambio</p>
          ) : (
            <p className="font-bold text-blue-600 text-lg">S/. {product.price}</p>
          )}
        </div>
      </div>
    </div>
  );
}
