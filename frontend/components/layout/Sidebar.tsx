"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import {
  Calendar,
  BarChart3,
  User,
  Settings,
  LogIn,
  UserPlus,
  Store,
  Handshake,
  BookOpen,
  LogOut,
  ScanLine,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const mainNav: NavItem[] = [
  { href: "/events",     label: "Eventos",    icon: Calendar  },
  { href: "/analytics",  label: "Analytics",  icon: BarChart3 },
  { href: "/services",   label: "Comunidad",  icon: Store     },
  { href: "/loans",      label: "Préstamos",  icon: BookOpen  },
  { href: "/attendance", label: "Asistencia", icon: ScanLine  },
];

const accountNav: NavItem[] = [
  { href: "/profile",  label: "My Profile", icon: User     },
  { href: "/settings", label: "Settings",   icon: Settings },
];

const guestNav: NavItem[] = [
  { href: "/login",    label: "Login",    icon: LogIn   },
  { href: "/register", label: "Register", icon: UserPlus },
];

function NavLink({ href, label, icon: Icon }: NavItem) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
        isActive
          ? "bg-blue-600 text-white"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <aside className="w-72 bg-gradient-to-b from-[#02112B] to-[#041A45] text-white min-h-screen flex flex-col shadow-2xl">

      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold">CampusHub</h1>
        <p className="text-sm text-slate-400 mt-1">Smart Campus Platform</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {mainNav.map((item) => (
          <NavLink key={item.label} {...item} />
        ))}

        {isLoggedIn && (
          <>
            <div className="pt-6 pb-2 text-xs text-slate-500 uppercase tracking-widest">
              Account
            </div>
            {accountNav.map((item) => (
              <NavLink key={item.label} {...item} />
            ))}
          </>
        )}

        {!isLoggedIn && (
          <>
            <div className="pt-6 pb-2 text-xs text-slate-500 uppercase tracking-widest">
              Authentication
            </div>
            {guestNav.map((item) => (
              <NavLink key={item.label} {...item} />
            ))}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800">
        {isLoggedIn ? (
          <div className="bg-slate-900 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.career}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="mt-3 w-full flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-red-400 hover:bg-slate-800 py-2 rounded-lg transition-colors"
            >
              <LogOut size={15} />
              Cerrar sesión
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center">
            Inicia sesión para acceder a tu perfil
          </p>
        )}
      </div>
    </aside>
  );
}