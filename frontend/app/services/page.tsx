"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ServiceCard from "@/components/services/ServiceCard";
import ProductCard from "@/components/services/ProductCard";
import { useServices } from "@/hooks/useServices";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/components/auth/AuthContext";
import {
  SERVICE_CATEGORIES_ENUM, SERVICE_CATEGORY_LABEL,
  PRODUCT_CATEGORIES_ENUM, PRODUCT_CATEGORY_LABEL,
} from "@/lib/categories";
import { Search, Plus } from "lucide-react";
import Link from "next/link";

type Tab = "services" | "products";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function ServicesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab]       = useState<Tab>("services");
  const [search, setSearch]             = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");

  const debouncedSearch = useDebounce(search, 300);
  const categoryParam   = activeCategory !== "Todos" ? activeCategory : undefined;

  const { data: services = [], isLoading: loadingS } = useServices({
    search: debouncedSearch || undefined,
    category: categoryParam,
  });

  const { data: products = [], isLoading: loadingP } = useProducts({
    search: debouncedSearch || undefined,
    category: categoryParam,
  });

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setActiveCategory("Todos");
    setSearch("");
  };

  const serviceCategories = ["Todos", ...SERVICE_CATEGORIES_ENUM.map((k) => SERVICE_CATEGORY_LABEL[k])];
  const productCategories = ["Todos", ...PRODUCT_CATEGORIES_ENUM.map((k) => PRODUCT_CATEGORY_LABEL[k])];
  const categories        = activeTab === "services" ? serviceCategories : productCategories;

  const isLoading    = activeTab === "services" ? loadingS : loadingP;
  const currentCount = activeTab === "services" ? services.length : products.length;

  return (
    <DashboardLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Comunidad</h1>
          <p className="text-slate-500 mt-1">
            {isLoading ? "Cargando..." : `${currentCount} ${activeTab === "services" ? "servicio" : "producto"}${currentCount !== 1 ? "s" : ""} disponibles`}
          </p>
        </div>
        <Link
          href={activeTab === "services" ? "/create-service" : "/create-product"}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition-colors"
        >
          <Plus size={18} />
          {activeTab === "services" ? "Publicar servicio" : "Publicar producto"}
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
        {(["services", "products"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab === "services" ? "Servicios" : "Marketplace"}
          </button>
        ))}
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={activeTab === "services" ? "Buscar tutorías, diseño, programación..." : "Buscar libros, calculadoras, apuntes..."}
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeCategory === cat ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : activeTab === "services" ? (
        services.length === 0 ? <EmptyState label="servicios" /> : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {services.map((s) => <ServiceCard key={s.id} service={s} currentUserId={user?.id} />)}
          </div>
        )
      ) : (
        products.length === 0 ? <EmptyState label="productos" /> : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((p) => <ProductCard key={p.id} product={p} currentUserId={user?.id} />)}
          </div>
        )
      )}
    </DashboardLayout>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="text-center py-20 text-slate-400">
      <p className="text-xl font-medium">No hay {label} disponibles</p>
      <p className="text-sm mt-2">Sé el primero en publicar uno</p>
    </div>
  );
}
