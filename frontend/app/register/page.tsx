"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [career, setCareer] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (!name || !email || !career || !password) {
      alert("Completa todos los campos");
      return;
    }

    const user = {
      name,
      email,
      career,
      password,
    };

    localStorage.setItem("user", JSON.stringify(user));

    alert("Usuario registrado correctamente");

    setName("");
    setEmail("");
    setCareer("");
    setPassword("");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center">
          Crear Cuenta
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Únete a la comunidad CampusHub
        </p>

        <div className="mt-8 space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre completo"
            className="w-full border rounded-xl p-3"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo institucional"
            className="w-full border rounded-xl p-3"
          />

          <input
            value={career}
            onChange={(e) => setCareer(e.target.value)}
            placeholder="Escuela Profesional"
            className="w-full border rounded-xl p-3"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full border rounded-xl p-3"
          />

          <button
            type="button"
            onClick={handleRegister}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Crear Cuenta
          </button>
        </div>

        <p className="text-center mt-6 text-gray-500">
          ¿Ya tienes cuenta?
          <Link
            href="/login"
            className="text-blue-600 ml-2"
          >
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </main>
  );
}