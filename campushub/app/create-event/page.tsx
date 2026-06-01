"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { CATEGORIES, Event } from "@/data/events";
import { ArrowLeft } from "lucide-react";

export default function CreateEventPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    category: "",
    date: "",
    location: "",
    description: "",
    capacity: "",
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

    if (!form.title || !form.category || !form.date || !form.location || !form.description || !form.capacity) {
      setError("Completa todos los campos");
      return;
    }

    if (Number(form.capacity) < 1) {
      setError("La capacidad debe ser mayor a 0");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(form.date) < today) {
      setError("La fecha del evento no puede ser en el pasado");
      return;
    }

    setLoading(true);

    const existing: Event[] = JSON.parse(
      localStorage.getItem("customEvents") || "[]"
    );

    const newEvent: Event = {
      id: Date.now(), // ID único basado en timestamp
      title: form.title,
      category: form.category,
      date: form.date,
      location: form.location,
      description: form.description,
      capacity: Number(form.capacity),
      attendees: 0,
      organizerEmail: user?.email ?? "",
      organizerName: user?.name ?? "Organizador",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "customEvents",
      JSON.stringify([...existing, newEvent])
    );

    router.push("/events");
  };

  const minDate = new Date().toISOString().split("T")[0];

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

          <h1 className="text-3xl font-bold text-slate-900">Crear Evento</h1>
          <p className="text-slate-500 mt-1">Publica un nuevo evento para la comunidad</p>

          <div className="mt-8 space-y-5">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nombre del evento *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ej: Hackathon UNSA 2026"
                className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Categoría *
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Selecciona una categoría</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Fecha *
                </label>
                <input
                  name="date"
                  type="date"
                  min={minDate}
                  value={form.date}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Lugar *
                </label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Ej: Auditorio Principal"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Capacidad máxima *
                </label>
                <input
                  name="capacity"
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={handleChange}
                  placeholder="Ej: 100"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Descripción *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe de qué trata el evento, qué aprenderán los asistentes..."
                className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-medium transition-colors"
              >
                {loading ? "Publicando..." : "Publicar Evento"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}