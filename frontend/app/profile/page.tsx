"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/components/auth/AuthContext";
import { useMyRegisteredEvents, useMyServices, useMyProducts, useMyLoanCount } from "@/hooks/useProfile";
import { EVENT_CATEGORY_LABEL } from "@/lib/categories";
import { SERVICE_CATEGORY_LABEL } from "@/lib/categories";
import { Calendar, MapPin, Briefcase, Package, BookOpen, Edit3 } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: myEvents   = [], isLoading: loadingEvents   } = useMyRegisteredEvents();
  const { data: myServices = [], isLoading: loadingServices } = useMyServices();
  const { data: myProducts = [], isLoading: loadingProducts } = useMyProducts();
  const { data: myLoans    = [], isLoading: loadingLoans    } = useMyLoanCount();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const activeLoans = myLoans.filter((l) => l.status === "ACTIVE" || l.status === "PENDING");

  return (
    <DashboardLayout>
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="flex items-start gap-6 flex-wrap">
          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{user?.name || "Usuario"}</h1>
            <p className="text-slate-500 mt-0.5">{user?.career}</p>
            <p className="text-slate-400 text-sm">{user?.email}</p>
            {user?.bio && <p className="text-slate-600 text-sm mt-2 max-w-md">{user.bio}</p>}
            {user?.interests && user.interests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {user.interests.map((i) => (
                  <span key={i} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{i}</span>
                ))}
              </div>
            )}
          </div>
          <Link href="/settings" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 border border-slate-200 px-4 py-2 rounded-xl transition">
            <Edit3 size={14} /> Editar perfil
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mt-8">
          {[
            { label: "Eventos inscritos", value: loadingEvents   ? "–" : myEvents.length,       icon: Calendar  },
            { label: "Servicios",         value: loadingServices ? "–" : myServices.length,      icon: Briefcase },
            { label: "Productos",         value: loadingProducts ? "–" : myProducts.length,      icon: Package   },
            { label: "Préstamos activos", value: loadingLoans    ? "–" : activeLoans.length,     icon: BookOpen  },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="border rounded-2xl p-5 text-center">
              <Icon size={20} className="text-blue-600 mx-auto mb-2" />
              <p className="text-4xl font-bold">{value}</p>
              <p className="text-gray-500 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Mis Eventos Inscritos</h2>
          {loadingEvents ? (
            <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
          ) : myEvents.length === 0 ? (
            <p className="text-slate-500">Aún no estás inscrito en eventos.</p>
          ) : (
            <div className="space-y-3">
              {myEvents.map((event) => (
                <Link key={event.id} href={`/event/${event.id}`} className="block border rounded-xl p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800">{event.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><Calendar size={12}/>{new Date(event.date).toLocaleDateString("es-PE")}</span>
                        <span className="flex items-center gap-1"><MapPin size={12}/>{event.location}</span>
                      </div>
                    </div>
                    <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                      {EVENT_CATEGORY_LABEL[event.category] ?? event.category}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Mis Servicios</h2>
          {loadingServices ? (
            <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
          ) : myServices.length === 0 ? (
            <p className="text-slate-500">Aún no has publicado servicios. <Link href="/create-service" className="text-blue-600 hover:underline">Publicar servicio →</Link></p>
          ) : (
            <div className="space-y-3">
              {myServices.map((s) => (
                <div key={s.id} className="border rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">{s.title}</h3>
                    <p className="text-sm text-slate-500">{SERVICE_CATEGORY_LABEL[s.category]} · S/. {s.price}</p>
                  </div>
                  <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">Activo</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
