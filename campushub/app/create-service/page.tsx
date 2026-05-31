"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function CreateServicePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] =
    useState("");

  const handleCreate = () => {
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    if (
      !title ||
      !category ||
      !price ||
      !description
    ) {
      alert("Completa todos los campos");
      return;
    }

    const services = JSON.parse(
      localStorage.getItem("services") || "[]"
    );

    services.push({
      id: Date.now(),
      title,
      category,
      price,
      description,
      owner: user.name,
      ownerEmail: user.email,
    });

    localStorage.setItem(
      "services",
      JSON.stringify(services)
    );

    alert("Servicio publicado");

    router.push("/services");
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl">

        <h1 className="text-3xl font-bold mb-8">
          Publicar Servicio
        </h1>

        <div className="space-y-4">

          <input
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Título"
            className="w-full border p-3 rounded-xl"
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="w-full border p-3 rounded-xl"
          >
            <option value="">
              Categoría
            </option>

            <option>Tutoría</option>
            <option>Programación</option>
            <option>Diseño</option>
            <option>Matemáticas</option>
            <option>Física</option>
          </select>

          <input
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            placeholder="Precio"
            className="w-full border p-3 rounded-xl"
          />

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Descripción"
            className="w-full border p-3 rounded-xl h-40"
          />

          <button
            onClick={handleCreate}
            className="w-full bg-blue-600 text-white py-3 rounded-xl"
          >
            Publicar Servicio
          </button>

        </div>

      </div>
    </DashboardLayout>
  );
}