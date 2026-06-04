import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4">
        CampusHub
      </h1>

      <p className="mb-8 text-gray-500">
        Plataforma inteligente para eventos universitarios
      </p>

      <Link
        href="/events"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Ver Eventos
      </Link>
    </main>
  );
}
