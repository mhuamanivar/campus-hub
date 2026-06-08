"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";

const CAREERS = [
  "Ingeniería de Sistemas",
  "Ingeniería Industrial",
  "Administración de Empresas",
  "Contabilidad",
  "Derecho",
  "Medicina",
  "Arquitectura",
  "Psicología",
  "Comunicación Social",
  "Educación",
];

const INTERESTS = [
  "Tecnología",
  "Emprendimiento",
  "Arte y Cultura",
  "Deportes",
  "Ciencia",
  "Voluntariado",
  "Música",
  "Diseño",
  "Idiomas",
  "Investigación",
];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    career: "",
    password: "",
    confirmPassword: "",
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleRegister = async () => {
    setError("");
    if (!form.name || !form.email || !form.career || !form.password) {
      setError("Completa todos los campos obligatorios");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (selectedInterests.length === 0) {
      setError("Selecciona al menos un interés");
      return;
    }
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        career: form.career,
        interests: selectedInterests,
      });
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center">Crear Cuenta</h1>
        <p className="text-center text-gray-500 mt-2">Únete a la comunidad CampusHub</p>

        <div className="mt-8 space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre completo"
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Correo institucional"
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="career"
            value={form.career}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
          >
            <option value="">Selecciona tu escuela profesional</option>
            {CAREERS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Contraseña (mín. 6 caracteres)"
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirmar contraseña"
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">
              Intereses <span className="text-slate-400 font-normal">(selecciona al menos uno)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => {
                const active = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      active
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="button"
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60 font-medium"
          >
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
          </button>
        </div>

        <p className="text-center mt-6 text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
