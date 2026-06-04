"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/components/auth/AuthContext";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import { Settings, CheckCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  name:   z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  career: z.string().min(2, "Ingresa tu carrera"),
  bio:    z.string().max(200, "La biografía no puede exceder 200 caracteres").optional(),
});

type FormValues = z.infer<typeof schema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors, isDirty } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: { name: user?.name ?? "", career: user?.career ?? "", bio: user?.bio ?? "" },
    });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setError("");
    try {
      await api.patch("/users/me", data);
      qc.invalidateQueries({ queryKey: ["profile"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("No se pudo guardar los cambios");
    }
  };

  const inputCls = "w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center gap-3">
          <Settings size={32} className="text-blue-600" />
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Configuración</h1>
            <p className="text-slate-500 mt-0.5">Actualiza tu perfil y preferencias</p>
          </div>
        </div>

        {saved && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl flex items-center gap-2 text-sm font-medium">
            <CheckCircle size={16} /> Cambios guardados correctamente
          </div>
        )}

        <div className="bg-white rounded-3xl p-8 border border-slate-200 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo electrónico</label>
            <input
              value={user?.email ?? ""}
              readOnly
              className={`${inputCls} bg-slate-50 text-slate-400 cursor-not-allowed`}
            />
            <p className="text-xs text-slate-400 mt-1">El correo no se puede cambiar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre completo *</label>
              <input {...register("name")} placeholder="Tu nombre" className={inputCls} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Carrera *</label>
              <input {...register("career")} placeholder="Ej: Ingeniería de Sistemas" className={inputCls} />
              {errors.career && <p className="text-red-500 text-xs mt-1">{errors.career.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Biografía</label>
              <textarea
                {...register("bio")}
                rows={3}
                placeholder="Cuéntanos un poco sobre ti (opcional)"
                className={`${inputCls} resize-none`}
              />
              {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={!isDirty}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors"
            >
              Guardar cambios
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
