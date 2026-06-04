"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, Search } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { useUnreadCount } from "@/hooks/useNotifications";

export default function Topbar() {
  const { user, isLoggedIn } = useAuth();
  const { data: unreadCount = 0 } = useUnreadCount();
  const [search, setSearch] = useState("");

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between gap-4">

      <div className="relative w-80">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar eventos, servicios..."
          className="w-full bg-slate-100 rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      <div className="flex items-center gap-4">

        {isLoggedIn && (
          <Link
            href="/create-event"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
          >
            + Nuevo Evento
          </Link>
        )}

        <Link
          href="/notifications"
          className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors"
          aria-label="Notificaciones"
        >
          <Bell size={20} className="text-slate-500" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        {isLoggedIn ? (
          <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-900 leading-tight">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.role === "ORGANIZER" ? "Organizador" : "Estudiante"}</p>
            </div>
          </Link>
        ) : (
          <Link href="/login" className="text-sm text-blue-600 font-medium hover:underline">
            Iniciar sesión
          </Link>
        )}

      </div>
    </header>
  );
}
