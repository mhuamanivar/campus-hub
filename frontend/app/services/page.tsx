"use client";

import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ServiceCard from "@/components/services/ServiceCard";
import ProductCard from "@/components/services/ProductCard";
import {
  defaultServices,
  defaultProducts,
  SERVICE_CATEGORIES,
  PRODUCT_CATEGORIES,
  Service,
  Product,
} from "@/data/services";
import { useAuth } from "@/components/auth/AuthContext";
import { Search, Plus } from "lucide-react";
import Link from "next/link";

type Tab = "services" | "products";

export default function ServicesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("services");
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");

  useEffect(() => {
    const storedServices: Service[] = JSON.parse(
      localStorage.getItem("services") || "[]"
    );
    const storedProducts: Product[] = JSON.parse(
      localStorage.getItem("products") || "[]"
    );
    setServices([...defaultServices, ...storedServices]);
    setProducts([...defaultProducts, ...storedProducts]);
  }, []);

  const categories =
    activeTab === "services"
      ? ["Todos", ...SERVICE_CATEGORIES]
      : ["Todos", ...PRODUCT_CATEGORIES];

  // Reset categoría al cambiar pestaña
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setActiveCategory("Todos");
    setSearch("");
  };

  const filteredServices = useMemo(() => {
    let result = [...services];
    if (activeCategory !== "Todos")
      result = result.filter((s) => s.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [services, activeCategory, search]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (activeCategory !== "Todos")
      result = result.filter((p) => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, activeCategory, search]);

  const currentCount =
    activeTab === "services" ? filteredServices.length : filteredProducts.length;

  return (
    <DashboardLayout>

      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Comunidad</h1>
          <p className="text-slate-500 mt-1">
            {currentCount} {activeTab === "services" ? "servicio" : "producto"}
            {currentCount !== 1 ? "s" : ""} disponibles
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

      {/* Pestañas */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
        <button
          onClick={() => handleTabChange("services")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "services"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Servicios
        </button>
        <button
          onClick={() => handleTabChange("products")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "products"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Marketplace
        </button>
      </div>

      {/* Búsqueda */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={
            activeTab === "services"
              ? "Buscar tutorías, diseño, programación..."
              : "Buscar libros, calculadoras, apuntes..."
          }
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Filtros por categoría */}
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeCategory === cat
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-blue-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {activeTab === "services" ? (
        filteredServices.length === 0 ? (
          <EmptyState label="servicios" />
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredServices.map((s) => (
              <ServiceCard
                key={s.id}
                service={s}
                isOwner={user?.email === s.ownerEmail}
              />
            ))}
          </div>
        )
      ) : filteredProducts.length === 0 ? (
        <EmptyState label="productos" />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isOwner={user?.email === p.ownerEmail}
            />
          ))}
        </div>
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