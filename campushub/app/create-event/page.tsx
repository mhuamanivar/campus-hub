"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function CreateEventPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] =
    useState("");

  const handleCreate = () => {
    if (
      !title ||
      !category ||
      !date ||
      !location ||
      !description
    ) {
      alert("Completa todos los campos");
      return;
    }

    const customEvents = JSON.parse(
      localStorage.getItem("customEvents") ||
        "[]"
    );

    const newEvent = {
      id: Date.now(),
      title,
      category,
      date,
      location,
      description,
      attendees: 0,
    };

    customEvents.push(newEvent);

    localStorage.setItem(
      "customEvents",
      JSON.stringify(customEvents)
    );

    alert("Evento creado");

    router.push("/events");
  };

  return (
    <DashboardLayout>

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl">

        <h1 className="text-3xl font-bold mb-8">
          Crear Evento
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

            <option>
              Technology
            </option>

            <option>
              Academic
            </option>

            <option>
              Workshop
            </option>
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            className="w-full border p-3 rounded-xl"
          />

          <input
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            placeholder="Ubicación"
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
            Crear Evento
          </button>

        </div>

      </div>

    </DashboardLayout>
  );
}