"use client";

import { useRouter } from "next/navigation";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useCreateProduct } from "@/hooks/useProducts";
import { PRODUCT_CATEGORIES_ENUM, PRODUCT_CATEGORY_LABEL } from "@/lib/categories";
import { ArrowLeft } from "lucide-react";

const CONDITIONS = [
  { value: "NUEVO", label: "Nuevo" },
  { value: "CASI_NUEVO", label: "Casi nuevo" },
  { value: "USADO", label: "Usado" },
  { value: "INTERCAMBIO", label: "Intercambio" },
];

const schema = z.object({
  title:       z.string().min(3, "Título demasiado corto"),
  category:    z.string().min(1, "Selecciona una categoría"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  condition:   z.enum(["NUEVO", "CASI_NUEVO", "USADO", "INTERCAMBIO"]),
  price:       z.number().min(0, "Precio inválido"),
}).refine(
  (d) => d.condition === "INTERCAMBIO" || d.price > 0,
  { message: "Ingresa un precio válido o selecciona intercambio", path: ["price"] },
);

type FormValues = z.infer<typeof schema>;

export default function CreateProductPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateProduct();

  const { register, handleSubmit, control, formState: { errors } } =
    useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { condition: "USADO", price: 0 } });

  const condition    = useWatch({ control, name: "condition" });
  const isExchange   = condition === "INTERCAMBIO";

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await mutateAsync({ ...data, price: isExchange ? 0 : data.price });
      router.push("/services");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(msg || "Error al publicar el producto");
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
          <h1 className="text-3xl font-bold text-slate-900">Publicar Producto</h1>
          <p className="text-slate-500 mt-1">Vende o intercambia con la comunidad</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Título *</label>
              <input {...register("title")} placeholder="Ej: Cálculo - James Stewart 8va edición" className={inputCls} />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Categoría *</label>
                <select {...register("category")} className={`${inputCls} bg-white`}>
                  <option value="">Selecciona una categoría</option>
                  {PRODUCT_CATEGORIES_ENUM.map((k) => (
                    <option key={k} value={k}>{PRODUCT_CATEGORY_LABEL[k]}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Estado *</label>
                <select {...register("condition")} className={`${inputCls} bg-white`}>
                  {CONDITIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            {!isExchange && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Precio (S/.) *</label>
                <input type="number" min="1" {...register("price", { valueAsNumber: true })} placeholder="0" className={inputCls} />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Descripción *</label>
              <textarea
                {...register("description")}
                rows={4}
                placeholder={isExchange ? "Describe el producto y qué te gustaría recibir a cambio..." : "Describe el estado, edición, qué incluye..."}
                className={`${inputCls} resize-none`}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors">Cancelar</button>
              <button type="submit" disabled={isPending} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-medium transition-colors">
                {isPending ? "Publicando..." : "Publicar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
