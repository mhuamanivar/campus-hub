"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      alert("No existe ningún usuario registrado");
      return;
    }

    const user = JSON.parse(storedUser);

    if (
      user.email === email &&
      user.password === password
    ) {
      alert("Login exitoso");

      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      router.push("/dashboard");
    } else {
      alert("Correo o contraseña incorrectos");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center">
          CampusHub
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Inicia sesión en tu cuenta
        </p>

        <div className="mt-8 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo institucional"
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
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Ingresar
          </button>
        </div>

        <p className="text-center mt-6 text-gray-500">
          ¿No tienes cuenta?
          <Link
            href="/register"
            className="text-blue-600 ml-2"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  );
}