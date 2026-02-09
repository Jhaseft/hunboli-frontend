"use client";

import { useEffect, useRef, useState } from "react";

type CaptureMode = "photo" | "video";
type FacingMode = "user" | "environment";

type Props = {
  open: boolean;
  mode: CaptureMode;
  facingMode: FacingMode;
  busy?: boolean;
  onClose: () => void;
  onCaptured: (file: File) => Promise<void> | void;
};

const VIDEO_MIME_CANDIDATES = [
  "video/webm;codecs=vp9,opus",
  "video/webm;codecs=vp8,opus",
  "video/webm",
  "video/mp4",
];

function getSupportedMimeType() {
  if (typeof MediaRecorder === "undefined") return null;
  return VIDEO_MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type)) ?? null;
}

export function CameraCaptureModal({
  open,
  mode,
  facingMode,
  busy,
  onClose,
  onCaptured,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const ignoreStopRef = useRef(false);

  const [initializing, setInitializing] = useState(false);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stopStream = () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.srcObject = null;
    }
    streamRef.current = null;
    recorderRef.current = null;
    chunksRef.current = [];
    setRecording(false);
  };

  useEffect(() => {
    if (!open) return;

    ignoreStopRef.current = false;
    setError(null);
    setInitializing(true);

    const start = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setError("Tu navegador no soporta camara.");
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: mode === "video",
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (e) {
        setError("No se pudo acceder a la camara.");
      } finally {
        setInitializing(false);
      }
    };

    start();

    return () => {
      stopStream();
    };
  }, [open, mode, facingMode]);

  const handleClose = () => {
    ignoreStopRef.current = true;
    stopStream();
    onClose();
  };

  const capturePhoto = async () => {
    setError(null);
    const video = videoRef.current;
    if (!video) return;
    video.pause(); //pausar el video para congelar la imagen mientras se captura la foto
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setError("No se pudo capturar la imagen.");
      video.play().catch(() => {});   //reanudar el video si no se pudo capturar la imagen
      return;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.92),
    );
    if (!blob) {
      setError("No se pudo capturar la imagen.");
      video.play().catch(() => {});   //reanudar el video si no se pudo capturar la imagen
      return;
    }

    const file = new File([blob], "document.jpg", { type: "image/jpeg" });
    await onCaptured(file);
  };

  const startRecording = () => {
    setError(null);
    const stream = streamRef.current;
    if (!stream) return;
    if (typeof MediaRecorder === "undefined") {
      setError("Tu navegador no soporta grabacion de video.");
      return;
    }

    chunksRef.current = [];
    const mimeType = getSupportedMimeType();
    let recorder: MediaRecorder;
    try {
      recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    } catch (e) {
      setError("No se pudo iniciar la grabacion.");
      return;
    }

    recorderRef.current = recorder;
    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };
    recorder.onstop = async () => {
      if (ignoreStopRef.current) return;
      const data = chunksRef.current;
      if (!data.length) {
        setError("No se pudo guardar el video.");
        return;
      }

      const video = videoRef.current;
      if (video) {
        video.pause();    
      }
      const type = recorder.mimeType || mimeType || "video/webm";
      const blob = new Blob(data, { type });
      let extension = "webm";
      if (type.includes("mp4")) extension = "mp4";
      else if (type.includes("quicktime")) extension = "mov";
      else if (type.includes("3gpp")) extension = "3gp";
      const file = new File([blob], `liveness.${extension}`, { type });
      await onCaptured(file);
    };
    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (!recorderRef.current) return;

    const video = videoRef.current;   //congelar video
    if (video) {
      video.pause();    //pausar el video para congelar la imagen mientras se procesa la grabación
    }

    recorderRef.current.stop();
    setRecording(false);

    streamRef.current?.getTracks().forEach(track => track.stop());
  };

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4"
      onMouseDown={handleClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-3xl rounded-2xl border border-gray-800 bg-[#0f1e33] shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-gray-800 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {mode === "video" ? "Grabar video" : "Tomar foto"}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {mode === "video"
                ? "Mira al frente, arriba, abajo y a los lados."
                : "Alinea el documento dentro del marco."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={busy}
            className={`rounded-lg border border-gray-700 px-3 py-1.5 text-sm ${
              busy ? "bg-gray-700/40 text-gray-500 cursor-not-allowed" : "bg-[#0a1628] text-gray-200 hover:bg-[#152b47]"
            }`}
          >
            Cerrar
          </button>
        </div>

        <div className="px-6 py-5">
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="relative rounded-xl border border-gray-800 bg-[#071225] p-2">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full max-h-[60vh] rounded-lg object-contain"
            />
            {initializing && (
              <div className="mt-3 text-xs text-gray-400">Iniciando camara...</div>
            )}

            {/* Overlay de carga durante captura */}
            {busy && (
              <>
                <div className="bg-[#0a1628]/80 absolute left-0 top-0 w-full h-full rounded-xl"></div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                  <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              </>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={busy}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                busy ? "bg-gray-700/40 text-gray-500 cursor-not-allowed" : "bg-[#0a1628] border border-gray-700 text-gray-200 hover:bg-[#152b47]"
              }`}
            >
              Cancelar
            </button>

            {mode === "photo" ? (
              <button
                type="button"
                onClick={capturePhoto}
                disabled={busy || initializing}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  busy || initializing
                    ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
              >
                Capturar
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {!recording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    disabled={busy || initializing}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      busy || initializing
                        ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                        : "bg-teal-600 text-white hover:bg-teal-700"
                    }`}
                  >
                    Iniciar grabacion
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    disabled={busy}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      busy
                        ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    Detener
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
