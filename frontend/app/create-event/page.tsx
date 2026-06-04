"use client";

import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useCreateEvent } from "@/hooks/useEvents";
import { EVENT_CATEGORIES, EVENT_CATEGORY_LABEL } from "@/lib/categories";
import { ArrowLeft } from "lucide-react";

const schema = z.object({
  title:       z.string().min(3, "El título debe tener al menos 3 caracteres"),
  category:    z.string().min(1, "Selecciona una categoría"),
  date:        z.string().min(1, "Selecciona una fecha").refine((d) => {
                 const today = new Date(); today.setHours(0, 0, 0, 0);
                 return new Date(d) >= today;
               }, "La fecha no puede ser en el pasado"),
  location:    z.string().min(3, "Ingresa el lugar del evento"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  capacity:    z.number().int().min(1, "La capacidad debe ser mayor a 0"),
});

type FormValues = z.infer<typeof schema>;

export default function CreateEventPage() {
  const router  = useRouter();
  const { mutateAsync, isPending } = useCreateEvent();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await mutateAsync({
        title:       data.title,
        description: data.description,
        category:    data.category,
        date:        new Date(data.date).toISOString(),
        location:    data.location,
        capacity:    data.capacity,
      });
      router.push("/events");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(msg || "Error al crear el evento");
    }
  };

  const minDate = new Date().toISOString().split("T")[0];
  const inputCls = "w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition";

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

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre del evento *</label>
              <input
                {...register("title")}
                placeholder="Ej: Hackathon UNSA 2026"
                className={inputCls}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Categoría *</label>
                <select {...register("category")} className={`${inputCls} bg-white`}>
                  <option value="">Selecciona una categoría</option>
                  {EVENT_CATEGORIES.map((key) => (
                    <option key={key} value={key}>{EVENT_CATEGORY_LABEL[key]}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Fecha *</label>
                <input type="date" min={minDate} {...register("date")} className={inputCls} />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Lugar *</label>
                <input
                  {...register("location")}
                  placeholder="Ej: Auditorio Principal"
                  className={inputCls}
                />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Capacidad máxima *</label>
                <input
                  type="number"
                  min="1"
                  {...register("capacity", { valueAsNumber: true })}
                  placeholder="Ej: 100"
                  className={inputCls}
                />
                {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Descripción *</label>
              <textarea
                {...register("description")}
                rows={4}
                placeholder="Describe de qué trata el evento, qué aprenderán los asistentes..."
                className={`${inputCls} resize-none`}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-medium transition-colors"
              >
                {isPending ? "Publicando..." : "Publicar Evento"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
