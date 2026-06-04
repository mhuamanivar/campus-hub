"use client";

import { useState } from "react";
import { X, Send, Check } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";

interface Props {
  targetName: string;
  targetEmail: string;
  itemTitle: string;
  onClose: () => void;
}

interface Message {
  from: string;
  fromEmail: string;
  to: string;
  toEmail: string;
  item: string;
  text: string;
  sentAt: string;
  read: boolean;
}

export default function ContactModal({ targetName, targetEmail, itemTitle, onClose }: Props) {
  const { user } = useAuth();
  const [text, setText] = useState(
    `Hola ${targetName}, me interesa "${itemTitle}". ¿Podemos coordinar?`
  );
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!user || !text.trim()) return;

    const messages: Message[] = JSON.parse(
      localStorage.getItem("campushub_messages") || "[]"
    );

    messages.push({
      from: user.name,
      fromEmail: user.email,
      to: targetName,
      toEmail: targetEmail,
      item: itemTitle,
      text: text.trim(),
      sentAt: new Date().toISOString(),
      read: false,
    });

    localStorage.setItem("campushub_messages", JSON.stringify(messages));
    setSent(true);

    setTimeout(onClose, 1800);
  };

  return (
    // Overlay con fondo oscuro usando div normal (no fixed)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-lg text-slate-900">Contactar</h2>
            <p className="text-sm text-slate-500">a {targetName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        {sent ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check size={28} className="text-green-600" />
            </div>
            <p className="font-semibold text-slate-900">¡Mensaje enviado!</p>
            <p className="text-sm text-slate-500 mt-1">
              {targetName} recibirá tu mensaje pronto.
            </p>
          </div>
        ) : (
          <>
            {/* Item referenciado */}
            <div className="bg-slate-50 rounded-xl p-3 mb-4">
              <p className="text-xs text-slate-400">Sobre</p>
              <p className="text-sm font-medium text-slate-800 mt-0.5 line-clamp-1">{itemTitle}</p>
            </div>

            {/* Mensaje */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              placeholder="Escribe tu mensaje..."
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSend}
                disabled={!text.trim() || !user}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                <Send size={15} />
                Enviar mensaje
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}