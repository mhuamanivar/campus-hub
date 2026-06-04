"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { SERVICE_CATEGORIES, Service } from "@/data/services";
import { ArrowLeft } from "lucide-react";

type PriceType = "hora" | "sesión" | "proyecto" | "fijo";

export default function CreateServicePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    priceType: "hora" as PriceType,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    setError("");

    if (!form.title || !form.category || !form.description || !form.price) {
      setError("Completa todos los campos");
      return;
    }

    if (Number(form.price) <= 0) {
      setError("El precio debe ser mayor a 0");
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(true);

    const stored: Service[] = JSON.parse(
      localStorage.getItem("services") || "[]"
    );

    const newService: Service = {
      id: Date.now(),
      title: form.title,
      category: form.category,
      description: form.description,
      price: Number(form.price),
      priceType: form.priceType,
      ownerName: user.name,
      ownerEmail: user.email,
      createdAt: new Date().toISOString(),
      rating: 0,
      reviewCount: 0,
      type: "service",
    };

    localStorage.setItem("services", JSON.stringify([...stored, newService]));
    router.push("/services");
  };

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
          <h1 className="text-3xl font-bold text-slate-900">Publicar Servicio</h1>
          <p className="text-slate-500 mt-1">Ofrece tus habilidades a la comunidad</p>

          <div className="mt-8 space-y-5">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Título *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ej: Tutoría de Cálculo Diferencial"
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
                  {SERVICE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Precio (S/.) *</label>
                <div className="flex gap-2">
                  <input
                    name="price"
                    type="number"
                    min="1"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0"
                    className="flex-1 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <select
                    name="priceType"
                    value={form.priceType}
                    onChange={handleChange}
                    className="border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="hora">/ hora</option>
                    <option value="sesión">/ sesión</option>
                    <option value="proyecto">/ proyecto</option>
                    <option value="fijo">fijo</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Descripción *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe tu servicio: experiencia, qué incluye, a quién va dirigido..."
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
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-medium transition-colors"
              >
                {loading ? "Publicando..." : "Publicar Servicio"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}