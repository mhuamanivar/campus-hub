"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PRODUCT_CATEGORIES, Product } from "@/data/services";
import { ArrowLeft } from "lucide-react";

type Condition = "nuevo" | "casi nuevo" | "usado" | "intercambio";

export default function CreateProductPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    condition: "usado" as Condition,
  });
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    setError("");

    if (!form.title || !form.category || !form.description) {
      setError("Completa todos los campos");
      return;
    }

    if (form.condition !== "intercambio" && (!form.price || Number(form.price) <= 0)) {
      setError("Ingresa un precio válido o selecciona intercambio");
      return;
    }

    if (!user) { router.push("/login"); return; }

    const stored: Product[] = JSON.parse(
      localStorage.getItem("products") || "[]"
    );

    const newProduct: Product = {
      id: Date.now(),
      title: form.title,
      category: form.category,
      description: form.description,
      price: form.condition === "intercambio" ? 0 : Number(form.price),
      condition: form.condition,
      ownerName: user.name,
      ownerEmail: user.email,
      createdAt: new Date().toISOString(),
      rating: 0,
      reviewCount: 0,
      type: "product",
    };

    localStorage.setItem("products", JSON.stringify([...stored, newProduct]));
    router.push("/services");
  };

  const isIntercambio = form.condition === "intercambio";

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft size={18} /> Volver
        </button>

        <div className="bg-white rounded-3xl p-8 border border-slate-200">
          <h1 className="text-3xl font-bold text-slate-900">Publicar Producto</h1>
          <p className="text-slate-500 mt-1">Vende o intercambia con la comunidad</p>

          <div className="mt-8 space-y-5">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Título *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ej: Cálculo - James Stewart 8va edición"
                className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Categoría *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Selecciona una categoría</option>
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Estado *</label>
                <select
                  name="condition"
                  value={form.condition}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="nuevo">Nuevo</option>
                  <option value="casi nuevo">Casi nuevo</option>
                  <option value="usado">Usado</option>
                  <option value="intercambio">Intercambio</option>
                </select>
              </div>
            </div>

            {!isIntercambio && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Precio (S/.) *</label>
                <input
                  name="price"
                  type="number"
                  min="1"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Descripción *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder={
                  isIntercambio
                    ? "Describe el producto y qué te gustaría recibir a cambio..."
                    : "Describe el estado, edición, qué incluye..."
                }
                className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors"
              >
                Publicar
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}