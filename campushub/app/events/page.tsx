"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import EventCard from "@/components/events/EventCard";
import { events as defaultEvents } from "@/data/events";

export default function EventsPage() {
  const [allEvents, setAllEvents] =
    useState(defaultEvents);

  useEffect(() => {
    const customEvents = JSON.parse(
      localStorage.getItem("customEvents") ||
        "[]"
    );

    setAllEvents([
      ...defaultEvents,
      ...customEvents,
    ]);
  }, []);

  return (
    <DashboardLayout>

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Eventos
        </h1>

        <p className="text-slate-500">
          Descubre oportunidades del campus
        </p>

      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {allEvents.map((event: any) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            category={event.category}
            date={event.date}
            attendees={event.attendees}
          />
        ))}

      </div>

    </DashboardLayout>
  );
}