"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";
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
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-72 bg-gradient-to-b from-[#02112B] to-[#041A45] text-white min-h-screen flex flex-col shadow-2xl">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold">
          CampusHub
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Smart Campus Platform
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link
          href="/events"
          className="flex items-center gap-3 bg-blue-600 p-3 rounded-xl"
        >
          <Calendar size={18} />
          Events
        </Link>

        <Link
          href="/analytics"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition"
        >
          <BarChart3 size={18} />
          Analytics
        </Link>

        <Link
          href="/services"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition"
        >
          <Store size={18} />
          Marketplace
        </Link>

        <Link
          href="#"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition"
        >
          <Handshake size={18} />
          Services
        </Link>

        <Link
          href="#"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition"
        >
          <BookOpen size={18} />
          Loans
        </Link>

        <div className="pt-8 pb-2 text-xs text-slate-500 uppercase">
          Account
        </div>

        <Link
          href="/profile"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition"
        >
          <User size={18} />
          My Profile
        </Link>

        <Link
          href="#"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition"
        >
          <Settings size={18} />
          Settings
        </Link>

        <div className="pt-8 pb-2 text-xs text-slate-500 uppercase">
          Authentication
        </div>

        <Link
          href="/login"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition"
        >
          <LogIn size={18} />
          Login
        </Link>

        <Link
          href="/register"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition"
        >
          <UserPlus size={18} />
          Register
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-900 rounded-xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold">
            M
          </div>

          <div>
            <p className="font-semibold">
              Maria
            </p>

            <p className="text-xs text-slate-400">
              Ingeniería de Sistemas
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}