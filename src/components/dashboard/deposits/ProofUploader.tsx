"use client";

import React, { useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Props = {
  depositId: string;
  disabled?: boolean;
  onUploaded?: () => void;
};

const MAX_MB = 7;
const MAX_BYTES = MAX_MB * 1024 * 1024;

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export function ProofUploader({ depositId, disabled, onUploaded }: Props) {
  const { token, isLoading } = useAuth();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const inputCameraRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const canUpload = useMemo(() => {
    return !!backendUrl && !!token && !isLoading && !!file && !uploading && !disabled;
  }, [backendUrl, token, isLoading, file, uploading, disabled]);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    if (!file.type.startsWith("image/")) return null;
    return URL.createObjectURL(file);
  }, [file]);

  const clearMessages = () => {
    setError(null);
    setOkMsg(null);
  };

  const validateAndSetFile = (f: File | null) => {
    clearMessages();
    if (!f) return;

    if (!ALLOWED_MIME.includes(f.type)) {
      setError("Formato no permitido. Usa JPG, PNG, WEBP o PDF.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError(`Archivo muy grande. Máximo ${MAX_MB}MB.`);
      return;
    }

    setFile(f);
  };

  const onPickFile = () => inputFileRef.current?.click();
  const onTakePhoto = () => inputCameraRef.current?.click();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0] ?? null;
    validateAndSetFile(f);
  };

  const handleUpload = async () => {
    clearMessages();

    if (!backendUrl) return setError("NEXT_PUBLIC_BACKEND_URL no está configurado.");
    if (!token) return setError("Debes iniciar sesión.");
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(`${backendUrl}/deposits/${depositId}/proof`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          (res.status === 401 ? "Sesión expirada. Vuelve a iniciar sesión." : "No se pudo subir el comprobante.");
        setError(typeof msg === "string" ? msg : "No se pudo subir el comprobante.");
        return;
      }

      setOkMsg("✅ Comprobante subido. Queda en revisión.");
      setFile(null);
      onUploaded?.();
    } catch {
      setError("Error de red. Revisa backend y CORS.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-700 bg-[#0a1628] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-white">Subir comprobante</p>
          <p className="mt-1 text-xs text-gray-400">
            JPG/PNG/WEBP/PDF • Máx {MAX_MB}MB
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
          <p className="text-xs text-red-200">{error}</p>
        </div>
      )}

      {okMsg && (
        <div className="mt-4 rounded-xl border border-teal-500/30 bg-teal-500/10 p-3">
          <p className="text-xs text-teal-200">{okMsg}</p>
        </div>
      )}

      {/* Hidden inputs */}
      <input
        ref={inputFileRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.pdf"
        className="hidden"
        onChange={(e) => validateAndSetFile(e.target.files?.[0] ?? null)}
        disabled={uploading || disabled}
      />

      {/* Para móviles: tomar foto (solo imágenes) */}
      <input
        ref={inputCameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => validateAndSetFile(e.target.files?.[0] ?? null)}
        disabled={uploading || disabled}
      />

      {/* Dropzone */}
      <div
        onClick={onPickFile}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`mt-4 cursor-pointer rounded-2xl border-2 border-dashed p-5 transition-colors ${
          dragOver
            ? "border-teal-400 bg-teal-500/10"
            : "border-gray-600 bg-[#071225] hover:border-gray-500"
        }`}
      >
        <div className="flex flex-col items-center text-center gap-3">
          {/* Icon */}
          <div className="h-12 w-12 rounded-2xl bg-[#0a1628] border border-gray-700 flex items-center justify-center">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              className="text-teal-300"
            >
              <path
                d="M7 7h10M7 11h10M7 15h6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M8 3h8l3 3v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <p className="text-sm text-gray-200">
              Arrastra y suelta tu comprobante aquí
            </p>
            <p className="text-xs text-gray-500 mt-1">
              o elige una opción
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPickFile();
              }}
              disabled={uploading || disabled}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                uploading || disabled
                  ? "border-gray-700 bg-gray-700/30 text-gray-400 cursor-not-allowed"
                  : "border-gray-700 bg-[#0a1628] text-gray-200 hover:bg-[#152b47]"
              }`}
            >
              Subir archivo
            </button>

            
          </div>
        </div>

        {/* Selected preview */}
        {file && (
          <div className="mt-4 rounded-xl border border-gray-700 bg-[#0a1628] p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-gray-400">Seleccionado</p>
                <p className="text-sm text-gray-200 break-all">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type || "archivo"}
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  clearMessages();
                }}
                className="px-3 py-2 rounded-lg text-xs font-medium border border-gray-700 bg-[#071225] text-gray-200 hover:bg-[#152b47]"
              >
                Quitar
              </button>
            </div>

            {previewUrl && (
              <div className="mt-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="w-full max-h-56 object-contain rounded-xl border border-gray-800 bg-[#071225]"
                  onLoad={() => URL.revokeObjectURL(previewUrl)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mantener el botón principal */}
      <button
        type="button"
        onClick={handleUpload}
        disabled={!canUpload}
        className={`mt-4 w-full py-3 rounded-lg font-medium transition-colors shadow-md ${
          canUpload
            ? "bg-teal-600 text-white hover:bg-cyan-700"
            : "bg-gray-700/40 text-gray-400 cursor-not-allowed"
        }`}
      >
        {uploading ? "Subiendo..." : "Subir comprobante"}
      </button>
    </div>
  );
}
