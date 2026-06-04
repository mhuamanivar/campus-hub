"use client";

import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useCreateService } from "@/hooks/useServices";
import { SERVICE_CATEGORIES_ENUM, SERVICE_CATEGORY_LABEL, PRICE_TYPE_LABEL } from "@/lib/categories";
import { ArrowLeft } from "lucide-react";

const schema = z.object({
  title:       z.string().min(3, "El título debe tener al menos 3 caracteres"),
  category:    z.string().min(1, "Selecciona una categoría"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  price:       z.number().min(1, "El precio debe ser mayor a 0"),
  priceType:   z.enum(["HORA", "SESION", "PROYECTO", "FIJO"]),
});

type FormValues = z.infer<typeof schema>;

export default function CreateServicePage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateService();

  const { register, handleSubmit, formState: { errors } } =
    useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { priceType: "HORA" } });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await mutateAsync(data);
      router.push("/services");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(msg || "Error al publicar el servicio");
    }
  };

  const inputCls = "w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors">
          <ArrowLeft size={18} /> Volver
        </button>

        <div className="bg-white rounded-3xl p-8 border border-slate-200">
          <h1 className="text-3xl font-bold text-slate-900">Publicar Servicio</h1>
          <p className="text-slate-500 mt-1">Ofrece tus habilidades a la comunidad</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Título *</label>
              <input {...register("title")} placeholder="Ej: Tutoría de Cálculo Diferencial" className={inputCls} />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Categoría *</label>
                <select {...register("category")} className={`${inputCls} bg-white`}>
                  <option value="">Selecciona una categoría</option>
                  {SERVICE_CATEGORIES_ENUM.map((k) => (
                    <option key={k} value={k}>{SERVICE_CATEGORY_LABEL[k]}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Precio (S/.) *</label>
                <div className="flex gap-2">
                  <input
                    type="number" min="1"
                    {...register("price", { valueAsNumber: true })}
                    placeholder="0"
                    className={`flex-1 ${inputCls}`}
                  />
                  <select {...register("priceType")} className="border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {Object.entries(PRICE_TYPE_LABEL).map(([k, v]) => (
                      <option key={k} value={k}>/ {v}</option>
                    ))}
                  </select>
                </div>
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Descripción *</label>
              <textarea
                {...register("description")}
                rows={4}
                placeholder="Describe tu servicio: experiencia, qué incluye, a quién va dirigido..."
                className={`${inputCls} resize-none`}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={isPending} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-medium transition-colors">
                {isPending ? "Publicando..." : "Publicar Servicio"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
