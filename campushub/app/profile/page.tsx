"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { events } from "@/data/events";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [myServices, setMyServices] =
  useState<any[]>([]);

  useEffect(() => {
    
    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) return;

    const parsedUser =
      JSON.parse(storedUser);

    setUser(parsedUser);

    const registrations =
      JSON.parse(
        localStorage.getItem(
          "registrations"
        ) || "[]"
      );

    const enrolledEvents =
      registrations
        .filter(
          (r: any) =>
            r.userEmail === parsedUser.email
        )
        .map((r: any) =>
          events.find(
            (e) => e.id === r.eventId
          )
        )
        .filter(Boolean);

        const services = JSON.parse(
          localStorage.getItem("services") || "[]"
        );

        const myServices = services.filter(
          (s: any) =>
            s.ownerEmail === parsedUser.email
        );

    setMyEvents(enrolledEvents);
    setMyServices(myServices);

  }, []);

  return (
    <DashboardLayout>

      <div className="bg-white rounded-3xl p-8 shadow-sm">

        <div className="flex items-center gap-6">

          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
            {user?.name?.charAt(0)}
          </div>

          <div>

            <h1 className="text-3xl font-bold">
              {user?.name}
            </h1>

            <p className="text-gray-500">
              {user?.career}
            </p>

            <p className="text-gray-400">
              {user?.email}
            </p>

          </div>

        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-10">

          <div className="border rounded-2xl p-5">
            <h3>Eventos inscritos</h3>

            <p className="text-4xl font-bold mt-2">
              {myEvents.length}
            </p>
          </div>

          <div className="border rounded-2xl p-5">
            <h3>Servicios</h3>

            <p className="text-4xl font-bold mt-2">
              {myServices.length}
            </p>
          </div>

          <div className="border rounded-2xl p-5">
            <h3>Préstamos</h3>

            <p className="text-4xl font-bold mt-2">
              0
            </p>
          </div>

        </div>

        <div className="mt-10">

          <h2 className="text-2xl font-bold mb-4">
            Mis Eventos
          </h2>

          {myEvents.length === 0 && (
            <p className="text-gray-500">
              Aún no estás inscrito en eventos.
            </p>
          )}

          <div className="space-y-4">

            {myEvents.map((event: any) => (
              <div
                key={event.id}
                className="border rounded-xl p-4"
              >
                <h3 className="font-semibold">
                  {event.title}
                </h3>

                <p className="text-gray-500">
                  {event.date}
                </p>
              </div>
            ))}

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}