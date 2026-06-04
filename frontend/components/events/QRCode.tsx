"use client";

import { useEffect, useRef } from "react";
import { Download } from "lucide-react";
import QRCodeLib from "qrcode";

interface Props {
  readonly qrToken: string;
  readonly eventTitle: string;
  readonly userName: string;
  readonly eventDate: string;
}

export default function QRCode({ qrToken, eventTitle, userName, eventDate }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCodeLib.toCanvas(canvasRef.current, qrToken, {
      width: 200,
      color: { dark: "#1e293b", light: "#ffffff" },
    });
  }, [qrToken]);

  const handleDownload = () => {
    const qrCanvas = canvasRef.current;
    if (!qrCanvas) return;

    const finalCanvas = document.createElement("canvas");
    finalCanvas.width  = 280;
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

    ctx.drawImage(qrCanvas, 40, 60, 200, 200);

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(eventTitle.length > 35 ? `${eventTitle.slice(0, 35)}...` : eventTitle, 140, 282);
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
        <div className="text-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest">CampusHub</p>
          <p className="font-bold text-slate-900 mt-1">{eventTitle}</p>
          <p className="text-sm text-slate-500">{userName}</p>
          <p className="text-xs text-slate-400 mt-1">{formattedDate}</p>
        </div>

        <div className="w-full border-t-2 border-dashed border-slate-200" />

        <canvas ref={canvasRef} className="rounded-lg" />

        <div className="w-full border-t-2 border-dashed border-slate-200" />

        <p className="text-xs text-slate-400 font-mono text-center break-all max-w-[200px]">
          {qrToken.slice(0, 24)}...
        </p>
      </div>

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
