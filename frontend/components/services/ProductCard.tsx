"use client";

import { useState } from "react";
import { Tag, MessageCircle, Star } from "lucide-react";
import { Product } from "@/data/services";
import ContactModal from "./ContactModal";

const CONDITION_STYLES: Record<string, string> = {
  "nuevo":       "bg-green-100 text-green-700",
  "casi nuevo":  "bg-teal-100 text-teal-700",
  "usado":       "bg-amber-100 text-amber-700",
  "intercambio": "bg-purple-100 text-purple-700",
};

interface Props {
  product: Product;
  isOwner: boolean;
}

export default function ProductCard({ product, isOwner }: Props) {
  const [showContact, setShowContact] = useState(false);
  const conditionStyle = CONDITION_STYLES[product.condition] ?? "bg-slate-100 text-slate-700";

  const initials = product.ownerName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">

        {/* Cabecera con categoría y condición */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
            {product.category}
          </span>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${conditionStyle}`}>
            {product.condition}
          </span>
        </div>

        {isOwner && (
          <span className="mt-2 w-fit text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            Tu publicación
          </span>
        )}

        {/* Título */}
        <h2 className="font-bold text-lg mt-4 text-slate-900 leading-tight line-clamp-2">
          {product.title}
        </h2>

        {/* Descripción */}
        <p className="text-slate-500 text-sm mt-2 line-clamp-3 flex-1">
          {product.description}
        </p>

        {/* Rating si tiene */}
        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1.5 mt-3">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-slate-400">({product.reviewCount})</span>
          </div>
        )}

        {/* Dueño + precio */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold">
              {initials}
            </div>
            <span className="text-sm text-slate-600 font-medium">{product.ownerName}</span>
          </div>
          <div className="text-right">
            {product.condition === "intercambio" ? (
              <p className="font-bold text-purple-600 text-lg flex items-center gap-1">
                <Tag size={16} /> Intercambio
              </p>
            ) : (
              <p className="font-bold text-blue-600 text-lg">S/. {product.price}</p>
            )}
          </div>
        </div>

        {/* Botón */}
        {!isOwner && (
          <button
            onClick={() => setShowContact(true)}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors"
          >
            <MessageCircle size={16} />
            {product.condition === "intercambio" ? "Proponer intercambio" : "Contactar vendedor"}
          </button>
        )}
      </div>

      {showContact && (
        <ContactModal
          targetName={product.ownerName}
          targetEmail={product.ownerEmail}
          itemTitle={product.title}
          onClose={() => setShowContact(false)}
        />
      )}
    </>
  );
}