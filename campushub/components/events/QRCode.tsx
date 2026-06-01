"use client";

import { useEffect, useRef } from "react";
import { Download } from "lucide-react";

interface Props {
  eventId: number;
  eventTitle: string;
  userEmail: string;
  userName: string;
  eventDate: string;
}

export default function QRCode({
  eventId,
  eventTitle,
  userEmail,
  userName,
  eventDate,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Datos que codifica el QR
  const qrData = JSON.stringify({
    eventId,
    userEmail,
    checkinToken: btoa(`${eventId}:${userEmail}:${eventDate}`),
  });

  useEffect(() => {
    // Usamos la librería qrcode desde CDN
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    script.onload = () => {
      const container = document.getElementById(`qr-${eventId}-${userEmail.replace("@","_")}`);
      if (!container) return;
      container.innerHTML = "";
      // @ts-ignore
      new window.QRCode(container, {
        text: qrData,
        width: 200,
        height: 200,
        colorDark: "#1e293b",
        colorLight: "#ffffff",
        correctLevel: 2, // QRCode.CorrectLevel.Q
      });
    };
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [qrData, eventId, userEmail]);

  const handleDownload = () => {
    const container = document.getElementById(`qr-${eventId}-${userEmail.replace("@","_")}`);
    const canvas = container?.querySelector("canvas");
    if (!canvas) return;

    // Creamos un canvas con fondo blanco + datos del evento
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = 280;
    finalCanvas.height = 340;
    const ctx = finalCanvas.getContext("2d")!;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 280, 340);

    ctx.fillStyle = "#1e40af";
    ctx.fillRect(0, 0, 280, 50);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("CampusHub", 140, 22);
    ctx.font = "11px sans-serif";
    ctx.fillText("Código de Asistencia", 140, 40);

    ctx.drawImage(canvas, 40, 60, 200, 200);

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(eventTitle.length > 35 ? eventTitle.slice(0, 35) + "..." : eventTitle, 140, 282);
    ctx.fillStyle = "#64748b";
    ctx.font = "11px sans-serif";
    ctx.fillText(userName, 140, 300);
    ctx.fillText(new Date(eventDate).toLocaleDateString("es-PE"), 140, 318);

    const link = document.createElement("a");
    link.download = `QR_${eventTitle.replace(/\s+/g, "_")}.png`;
    link.href = finalCanvas.toDataURL("image/png");
    link.click();
  };

  const formattedDate = new Date(eventDate).toLocaleDateString("es-PE", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="flex flex-col items-center gap-4">

      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 inline-flex flex-col items-center gap-4">
        {/* Encabezado del ticket */}
        <div className="text-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest">CampusHub</p>
          <p className="font-bold text-slate-900 mt-1">{eventTitle}</p>
          <p className="text-sm text-slate-500">{userName}</p>
          <p className="text-xs text-slate-400 mt-1">{formattedDate}</p>
        </div>

        {/* Línea punteada tipo ticket */}
        <div className="w-full border-t-2 border-dashed border-slate-200" />

        {/* QR generado */}
        <div
          id={`qr-${eventId}-${userEmail.replace("@","_")}`}
          className="rounded-lg overflow-hidden"
        />

        <div className="w-full border-t-2 border-dashed border-slate-200" />

        {/* Token legible */}
        <p className="text-xs text-slate-400 font-mono text-center break-all max-w-[200px]">
          {btoa(`${eventId}:${userEmail}`).slice(0, 24)}...
        </p>
      </div>

      {/* Botón de descarga */}
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
      >
        <Download size={16} />
        Descargar QR
      </button>
    </div>
  );
}