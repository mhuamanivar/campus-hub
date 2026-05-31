"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Link from "next/link";

export default function ServicesPage() {
  const [services, setServices] =
    useState<any[]>([]);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("services") || "[]"
    );

    setServices(stored);
  }, []);

  return (
    <DashboardLayout>

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-4xl font-bold">
            Servicios
          </h1>

          <p className="text-gray-500">
            Encuentra ayuda dentro del campus
          </p>
        </div>

        <Link
          href="/create-service"
          className="bg-blue-600 text-white px-4 py-3 rounded-xl"
        >
          Publicar Servicio
        </Link>

      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-3xl p-6 border"
          >
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              {service.category}
            </span>

            <h2 className="font-bold text-xl mt-4">
              {service.title}
            </h2>

            <p className="text-gray-500 mt-3">
              {service.description}
            </p>

            <div className="mt-4">
              <p>
                👤 {service.owner}
              </p>

              <p className="font-bold text-blue-600 mt-2">
                S/. {service.price}
              </p>
            </div>

            <button
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl"
            >
              Contactar
            </button>
          </div>
        ))}

      </div>

    </DashboardLayout>
  );
}