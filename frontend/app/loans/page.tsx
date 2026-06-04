"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useResources, useMyLoans, useRequestLoan, useReturnLoan } from "@/hooks/useLoans";
import { useAuth } from "@/components/auth/AuthContext";
import { BookOpen, CheckCircle, Clock, XCircle, Package } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  PENDING:   { label: "Pendiente",  color: "bg-amber-100 text-amber-700",  icon: Clock        },
  ACTIVE:    { label: "Activo",     color: "bg-green-100 text-green-700",  icon: CheckCircle  },
  RETURNED:  { label: "Devuelto",   color: "bg-slate-100 text-slate-600",  icon: CheckCircle  },
  OVERDUE:   { label: "Vencido",    color: "bg-red-100 text-red-700",      icon: XCircle      },
  CANCELLED: { label: "Cancelado",  color: "bg-slate-100 text-slate-400",  icon: XCircle      },
};

export default function LoansPage() {
  const { user } = useAuth();
  const { data: resources = [], isLoading: loadingRes } = useResources();
  const { data: myLoans   = [], isLoading: loadingLoans } = useMyLoans();
  const requestLoan = useRequestLoan();
  const returnLoan  = useReturnLoan();

  const [requesting, setRequesting] = useState<string | null>(null);
  const [dueDate, setDueDate]       = useState("");
  const [message, setMessage]       = useState<string | null>(null);

  const handleRequest = async (resourceId: string) => {
    if (!dueDate) { setMessage("Selecciona una fecha de devolución"); return; }
    try {
      await requestLoan.mutateAsync({ resourceId, dueDate });
      setRequesting(null);
      setDueDate("");
      setMessage("¡Solicitud enviada! El préstamo está pendiente de aprobación.");
      setTimeout(() => setMessage(null), 4000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setMessage(msg || "Error al solicitar el préstamo");
    }
  };

  const minDate = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const activeLoans = myLoans.filter((l) => l.status === "ACTIVE" || l.status === "PENDING");

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
          <BookOpen size={36} className="text-blue-600" /> Préstamos
        </h1>
        <p className="text-slate-500 mt-1">Solicita recursos académicos de la biblioteca universitaria</p>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-sm font-medium">
          {message}
        </div>
      )}

      {/* Available resources */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Recursos Disponibles</h2>
        {loadingRes ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-100 rounded-2xl animate-pulse"/>)}
          </div>
        ) : resources.length === 0 ? (
          <p className="text-slate-500 text-center py-10">No hay recursos disponibles en este momento</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((r) => (
              <div key={r.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Package size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">{r.name}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{r.code}</p>
                    {r.description && <p className="text-sm text-slate-500 mt-1">{r.description}</p>}
                  </div>
                </div>

                {requesting === r.id ? (
                  <div className="mt-4 space-y-2">
                    <label className="text-xs font-medium text-slate-600">Fecha de devolución</label>
                    <input
                      type="date"
                      min={minDate}
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setRequesting(null); setDueDate(""); }}
                        className="flex-1 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleRequest(r.id)}
                        disabled={requestLoan.isPending}
                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium"
                      >
                        {requestLoan.isPending ? "..." : "Solicitar"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { if (!user) return; setRequesting(r.id); }}
                    disabled={!user}
                    className="mt-4 w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    {user ? "Solicitar préstamo" : "Inicia sesión para solicitar"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My loans */}
      {user && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Mis Préstamos</h2>
          {loadingLoans ? (
            <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
          ) : myLoans.length === 0 ? (
            <p className="text-slate-500">No tienes préstamos registrados.</p>
          ) : (
            <div className="space-y-3">
              {myLoans.map((loan) => {
                const cfg = STATUS_CONFIG[loan.status] ?? STATUS_CONFIG.PENDING;
                const StatusIcon = cfg.icon;
                return (
                  <div key={loan.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                    <StatusIcon size={20} className={loan.status === "ACTIVE" ? "text-green-600" : loan.status === "OVERDUE" ? "text-red-500" : "text-slate-400"} />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{loan.resource.name}</p>
                      <p className="text-sm text-slate-500">Vence: {new Date(loan.dueDate).toLocaleDateString("es-PE")}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${cfg.color}`}>{cfg.label}</span>
                    {loan.status === "ACTIVE" && (
                      <button
                        onClick={() => returnLoan.mutate(loan.id)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Devolver
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
