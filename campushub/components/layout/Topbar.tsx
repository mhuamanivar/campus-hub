import Link from "next/link";
import { Bell } from "lucide-react";

export default function Topbar() {
  const user =
    typeof window !== "undefined"
      ? JSON.parse(
          localStorage.getItem("user") || "{}"
        )
      : {};

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between">

      <input
        placeholder="Buscar..."
        className="w-80 bg-slate-100 rounded-xl px-4 py-3 outline-none"
      />

      <div className="flex items-center gap-5">

        <Link
          href="/create-event"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium"
        >
          + Nuevo Evento
        </Link>

        <Bell
          size={20}
          className="text-slate-500"
        />

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {user?.name?.charAt(0) || "U"}
          </div>

          <div>
            <p className="font-semibold text-sm text-slate-900">
              {user?.name || "Usuario"}
            </p>

            <p className="text-xs text-slate-500">
              Estudiante
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}