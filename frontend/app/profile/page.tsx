"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/components/auth/AuthContext";
import { events, Event } from "@/data/events";

// ── Tipos ─────────────────────────────────────────────
interface Registration {
  userEmail: string;
  eventId: number;
}

interface Service {
  ownerEmail: string;
  title: string;
}

// ── Componente ────────────────────────────────────────
export default function ProfilePage() {
  const { user } = useAuth();

  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [myServices, setMyServices] = useState<Service[]>([]);

  useEffect(() => {
    if (!user) return;

    // Eventos inscritos
    const registrations: Registration[] = JSON.parse(
      localStorage.getItem("registrations") || "[]"
    );

    const enrolledEvents = registrations
      .filter((r) => r.userEmail === user.email)
      .map((r) => events.find((e) => e.id === r.eventId))
      .filter(Boolean) as Event[];

    // Servicios creados por el usuario
    const allServices: Service[] = JSON.parse(
      localStorage.getItem("services") || "[]"
    );

    const ownedServices = allServices.filter(
      (s) => s.ownerEmail === user.email
    );

    setMyEvents(enrolledEvents);
    setMyServices(ownedServices);
  }, [user]);

  return (
    <DashboardLayout>
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        {/* Cabecera */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
            {user?.name?.charAt(0) ?? "?"}
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              {user?.name || "Usuario"}
            </h1>
            <p className="text-gray-500">{user?.career}</p>
            <p className="text-gray-400">{user?.email}</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="border rounded-2xl p-5">
            <h3 className="text-gray-500 text-sm">Eventos inscritos</h3>
            <p className="text-4xl font-bold mt-2">{myEvents.length}</p>
          </div>

          <div className="border rounded-2xl p-5">
            <h3 className="text-gray-500 text-sm">Servicios</h3>
            <p className="text-4xl font-bold mt-2">{myServices.length}</p>
          </div>

          <div className="border rounded-2xl p-5">
            <h3 className="text-gray-500 text-sm">Préstamos</h3>
            <p className="text-4xl font-bold mt-2">0</p>
          </div>
        </div>

        {/* Mis Eventos */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Mis Eventos</h2>

          {myEvents.length === 0 ? (
            <p className="text-gray-500">
              Aún no estás inscrito en eventos.
            </p>
          ) : (
            <div className="space-y-4">
              {myEvents.map((event) => (
                <div key={event.id} className="border rounded-xl p-4">
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-gray-500">{event.date}</p>
                  <p className="text-gray-500">{event.location}</p>
                  <p className="text-sm text-gray-400">
                    {event.category}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mis Servicios */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Mis Servicios</h2>

          {myServices.length === 0 ? (
            <p className="text-gray-500">
              Aún no has publicado servicios.
            </p>
          ) : (
            <div className="space-y-4">
              {myServices.map((service, index) => (
                <div key={index} className="border rounded-xl p-4">
                  <h3 className="font-semibold">{service.title}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}