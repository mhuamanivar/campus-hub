"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import QRCode from "@/components/events/QRCode";
import { useEvent, useRegisterEvent, useUnregisterEvent } from "@/hooks/useEvents";
import { EVENT_CATEGORY_LABEL } from "@/lib/categories";
import ReactionBar from "@/components/events/ReactionBar";
import CommentSection from "@/components/events/CommentSection";
import { Calendar, MapPin, Users, User, ArrowLeft, Share2 } from "lucide-react";

export default function EventDetail() {
  const params   = useParams();
  const router   = useRouter();
  const { user } = useAuth();
  const id       = params.id as string;

  const [showQR, setShowQR]   = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const { data: event, isLoading } = useEvent(id);
  const registerMutation   = useRegisterEvent(id);
  const unregisterMutation = useUnregisterEvent(id);

  const handleRegister = async () => {
    if (!user) { router.push("/login"); return; }
    try {
      await registerMutation.mutateAsync();
      setShowQR(true);
      setMessage({ text: "¡Inscripción exitosa! Guarda tu QR para el check-in.", type: "success" });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setMessage({ text: msg || "Error al inscribirse", type: "error" });
    }
  };

  const handleCancelEnrollment = async () => {
    try {
      await unregisterMutation.mutateAsync();
      setShowQR(false);
      setMessage({ text: "Inscripción cancelada.", type: "error" });
    } catch {
      setMessage({ text: "Error al cancelar inscripción", type: "error" });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-4 animate-pulse">
          <div className="h-64 rounded-3xl bg-slate-100" />
          <div className="h-96 rounded-3xl bg-slate-100" />
        </div>
      </DashboardLayout>
    );
  }

  if (!event) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-slate-700">Evento no encontrado</h1>
          <button onClick={() => router.push("/events")} className="mt-4 text-blue-600 hover:underline">
            Volver al feed
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const spotsLeft     = event.capacity - event.registrationCount;
  const categoryLabel = EVENT_CATEGORY_LABEL[event.category] ?? event.category;
  const formattedDate = new Date(event.date).toLocaleDateString("es-PE", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const isBusy = registerMutation.isPending || unregisterMutation.isPending;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">

        {/* Volver */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft size={18} /> Volver
        </button>

        {/* Banner */}
        <div className="h-64 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0 flex items-end p-8">
            <span className="bg-white/20 backdrop-blur text-white text-sm px-4 py-1.5 rounded-full">
              {categoryLabel}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 mt-6 border border-slate-200">

          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message.text}
            </div>
          )}

          <div className="flex items-start justify-between flex-wrap gap-4">
            <h1 className="text-3xl font-bold text-slate-900 flex-1">{event.title}</h1>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setMessage({ text: "Enlace copiado al portapapeles", type: "success" });
              }}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 border border-slate-200 px-3 py-2 rounded-xl text-sm transition"
            >
              <Share2 size={15} /> Compartir
            </button>
          </div>

          <p className="mt-4 text-gray-600 leading-relaxed">{event.description}</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-slate-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1"><Calendar size={14} /> Fecha</div>
              <p className="font-semibold text-slate-800 text-sm capitalize">{formattedDate}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1"><MapPin size={14} /> Lugar</div>
              <p className="font-semibold text-slate-800 text-sm">{event.location}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1"><Users size={14} /> Cupos</div>
              <p className={`font-semibold text-sm ${spotsLeft <= 10 ? "text-amber-600" : "text-slate-800"}`}>
                {spotsLeft} disponibles de {event.capacity}
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1"><User size={14} /> Organizador</div>
              <p className="font-semibold text-slate-800 text-sm">{event.organizerName}</p>
            </div>
          </div>

          {showQR && event.isRegistered && event.qrToken && user && (
            <div className="mt-8 border-t border-slate-100 pt-8">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Tu código QR de asistencia</h2>
              <p className="text-slate-500 text-sm mb-6">
                Muestra este código el día del evento para registrar tu asistencia.
              </p>
              <QRCode
                qrToken={event.qrToken}
                eventTitle={event.title}
                userName={user.name}
                eventDate={event.date}
              />
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            {event.isRegistered ? (
              <>
                <button
                  onClick={() => setShowQR((v) => !v)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-medium transition-colors"
                >
                  {showQR ? "Ocultar QR" : "Ver mi QR de asistencia"}
                </button>
                <button
                  onClick={handleCancelEnrollment}
                  disabled={isBusy}
                  className="px-6 py-4 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-50 font-medium transition-colors"
                >
                  {unregisterMutation.isPending ? "Cancelando..." : "Cancelar inscripción"}
                </button>
              </>
            ) : (
              <button
                onClick={handleRegister}
                disabled={isBusy || spotsLeft <= 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-medium transition-colors"
              >
                {registerMutation.isPending
                  ? "Procesando..."
                  : spotsLeft <= 0
                  ? "Sin cupos disponibles"
                  : "Inscribirme al evento"}
              </button>
            )}
          </div>

          {/* Reacciones */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-sm font-medium text-slate-500 mb-3">Reacciones</p>
            <ReactionBar eventId={id} />
          </div>

          {/* Comentarios */}
          <CommentSection eventId={id} />

        </div>
      </div>
    </DashboardLayout>
  );
}
