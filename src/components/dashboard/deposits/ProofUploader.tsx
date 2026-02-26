"use client";

import React, { useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { handleKycGateResponse } from "@/lib/kyc-errors";
import { ProofDropzone } from "./ProofDropzone";

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

  const canUpload = useMemo(
    () => !!backendUrl && !!token && !isLoading && !!file && !uploading && !disabled,
    [backendUrl, token, isLoading, file, uploading, disabled]
  );

  const previewUrl = useMemo(() => {
    if (!file || !file.type.startsWith("image/")) return null;
    return URL.createObjectURL(file);
  }, [file]);

  const clearMessages = () => {
    setError(null);
    setOkMsg(null);
  };

  const resetInputs = () => {
    if (inputFileRef.current) inputFileRef.current.value = "";
    if (inputCameraRef.current) inputCameraRef.current.value = "";
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    validateAndSetFile(e.dataTransfer.files?.[0] ?? null);
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
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (handleKycGateResponse(res.status, data)) return;
        const msg =
          (data && (data.message || data.error)) ||
          (res.status === 401
            ? "Sesión expirada. Vuelve a iniciar sesión."
            : "No se pudo subir el comprobante.");
        setError(typeof msg === "string" ? msg : "No se pudo subir el comprobante.");
        return;
      }

      setOkMsg("Comprobante subido. Queda en revisión.");
      setFile(null);
      resetInputs();
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
          <p className="mt-1 text-xs text-gray-400">JPG/PNG/WEBP/PDF • Máx {MAX_MB}MB</p>
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
      <input
        ref={inputCameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => validateAndSetFile(e.target.files?.[0] ?? null)}
        disabled={uploading || disabled}
      />

      {!okMsg && (
        <>
          <ProofDropzone
            file={file}
            dragOver={dragOver}
            uploading={uploading}
            disabled={disabled}
            previewUrl={previewUrl}
            onPickFile={onPickFile}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClearFile={() => {
              setFile(null);
              resetInputs();
              clearMessages();
            }}
          />

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
        </>
      )}
    </div>
  );
}
