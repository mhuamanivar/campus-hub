import Link from "next/link";

interface Props {
  id: number;
  title: string;
  category: string;
  date: string;
  attendees: number;
}

export default function EventCard({
  id,
  title,
  category,
  date,
  attendees,
}: Props) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition">

      <div className="h-40 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600" />

      <div className="p-5">

        <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
          {category}
        </span>

        <h2 className="font-bold text-xl mt-4 text-slate-900">
          {title}
        </h2>

        <p className="text-slate-600 mt-3">
          📅 {date}
        </p>

        <p className="text-slate-600">
          👥 {attendees} asistentes
        </p>

        <Link
          href={`/event/${id}`}
          className="block text-center mt-5 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
        >
          Ver Evento
        </Link>
      </div>
    </div>
  );
}