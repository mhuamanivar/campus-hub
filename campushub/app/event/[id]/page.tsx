"use client";

import { useParams } from "next/navigation";
import { events } from "@/data/events";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function EventDetail() {
  const params = useParams();

  const event = events.find(
    (e) => e.id === Number(params.id)
  );

  const handleRegister = () => {
    const user = localStorage.getItem("user");

    if (!user) {
      alert("Debes iniciar sesión");
      return;
    }

    const parsedUser = JSON.parse(user);

    const registrations = JSON.parse(
      localStorage.getItem("registrations") || "[]"
    );

    const exists = registrations.find(
      (r: any) =>
        r.eventId === event?.id &&
        r.userEmail === parsedUser.email
    );

    if (exists) {
      alert("Ya estás inscrito");
      return;
    }

    registrations.push({
      eventId: event?.id,
      userEmail: parsedUser.email,
    });

    localStorage.setItem(
      "registrations",
      JSON.stringify(registrations)
    );

    alert("Inscripción realizada correctamente");
  };

  if (!event) {
    return (
      <DashboardLayout>
        <h1 className="text-3xl font-bold">
          Evento no encontrado
        </h1>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">

        <div className="h-64 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700" />

        <div className="bg-white rounded-3xl p-8 mt-6 border">

          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            {event.category}
          </span>

          <h1 className="text-4xl font-bold mt-4">
            {event.title}
          </h1>

          <p className="mt-6 text-gray-600">
            {event.description}
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-8">

            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-gray-500">Fecha</p>
              <p className="font-semibold">{event.date}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-gray-500">Lugar</p>
              <p className="font-semibold">{event.location}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-gray-500">Asistentes</p>
              <p className="font-semibold">{event.attendees}</p>
            </div>

          </div>

          <button
            onClick={handleRegister}
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl"
          >
            Inscribirme
          </button>

        </div>

      </div>
    </DashboardLayout>
  );
}