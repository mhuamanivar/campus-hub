"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import jsQR from "jsqr";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import { Camera, CameraOff, CheckCircle, XCircle, QrCode } from "lucide-react";

interface ScanResult {
  success: boolean;
  message: string;
  attendeeName?: string;
  attendeeCareer?: string;
  eventTitle?: string;
  scannedAt: string;
}

export default function AttendanceScannerPage() {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number | undefined>(undefined);
  const streamRef = useRef<MediaStream | null>(null);

  const [scanning,    setScanning]    = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [results,     setResults]     = useState<ScanResult[]>([]);
  const [lastToken,   setLastToken]   = useState<string | null>(null);
  const [processing,  setProcessing]  = useState(false);

  const stopCamera = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setScanning(false);
    setLastToken(null);
  }, []);

  const processFrame = useCallback(async () => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(processFrame);
      return;
    }

    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (code && code.data && code.data !== lastToken && !processing) {
      setLastToken(code.data);
      setProcessing(true);
      try {
        const res = await api.post("/attendance/checkin", { qrToken: code.data });
        const data = res.data.data;
        setResults((prev) => [
          {
            success: true,
            message: data.message,
            attendeeName: data.attendee?.name,
            attendeeCareer: data.attendee?.career,
            eventTitle: data.event?.title,
            scannedAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      } catch (err: unknown) {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        setResults((prev) => [
          {
            success: false,
            message: msg || "Error al registrar asistencia",
            scannedAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      } finally {
        setProcessing(false);
        setTimeout(() => setLastToken(null), 2500);
      }
    }

    rafRef.current = requestAnimationFrame(processFrame);
  }, [lastToken, processing]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setScanning(true);
    } catch {
      setCameraError("No se pudo acceder a la cámara. Verifica los permisos.");
    }
  };

  useEffect(() => {
    if (scanning) rafRef.current = requestAnimationFrame(processFrame);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [scanning, processFrame]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
            <QrCode size={36} className="text-blue-600" /> Escáner de Asistencia
          </h1>
          <p className="text-slate-500 mt-1">
            Escanea los códigos QR de los asistentes para registrar su presencia
          </p>
        </div>

        {/* Cámara */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm mb-6">
          <div className="relative bg-slate-900 aspect-video flex items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full object-cover ${scanning ? "block" : "hidden"}`}
            />
            <canvas ref={canvasRef} className="hidden" />

            {!scanning && (
              <div className="text-center text-slate-400 p-8">
                <Camera size={48} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">Activa la cámara para comenzar a escanear</p>
              </div>
            )}

            {processing && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="bg-white rounded-2xl px-6 py-4 text-center">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-700">Verificando...</p>
                </div>
              </div>
            )}

            {/* Visor de escaneo */}
            {scanning && !processing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-4 border-blue-400 rounded-2xl opacity-70">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-400 rounded-tl-lg -mt-1 -ml-1" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-400 rounded-tr-lg -mt-1 -mr-1" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-400 rounded-bl-lg -mb-1 -ml-1" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-400 rounded-br-lg -mb-1 -mr-1" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 flex gap-3">
            {cameraError && <p className="text-red-500 text-sm flex-1">{cameraError}</p>}
            <div className="flex gap-3 ml-auto">
              {scanning ? (
                <button
                  onClick={stopCamera}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
                >
                  <CameraOff size={16} /> Detener cámara
                </button>
              ) : (
                <button
                  onClick={startCamera}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                >
                  <Camera size={16} /> Activar cámara
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Log de resultados */}
        {results.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-bold text-slate-900 mb-4">
              Registros ({results.length})
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.map((r, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-xl ${
                    r.success ? "bg-green-50 border border-green-100" : "bg-red-50 border border-red-100"
                  }`}
                >
                  {r.success ? (
                    <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    {r.success && r.attendeeName ? (
                      <>
                        <p className="font-semibold text-sm text-slate-800">{r.attendeeName}</p>
                        {r.attendeeCareer && (
                          <p className="text-xs text-slate-500">{r.attendeeCareer}</p>
                        )}
                        {r.eventTitle && (
                          <p className="text-xs text-green-600 mt-0.5">{r.eventTitle}</p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-slate-700">{r.message}</p>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">
                    {new Date(r.scannedAt).toLocaleTimeString("es-PE", {
                      hour: "2-digit", minute: "2-digit", second: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
