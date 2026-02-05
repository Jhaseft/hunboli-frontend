"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { DragEvent } from "react";
import { CameraCaptureModal } from "@/components/kyc/CameraCaptureModal";

type Props = {
  title: string;
  subtitle: string;
  accept: string;
  allowedMime: string[];
  maxBytes: number;
  maxLabel: string;
  isVideo?: boolean;
  capture?: "user" | "environment";
  pickLabel?: string;
  captureLabel?: string;
  onSkip?: () => void;
  skipLabel?: string;
  onUpload: (file: File) => Promise<void>;
  onUploaded: () => void;
  onBack?: () => void;
  onClose: () => void;
};

function formatMb(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function KycUploadStep({
  title,
  subtitle,
  accept,
  allowedMime,
  maxBytes,
  maxLabel,
  isVideo,
  capture,
  pickLabel = "Elegir archivo",
  captureLabel,
  onSkip,
  skipLabel = "Siguiente",
  onUpload,
  onUploaded,
  onBack,
  onClose,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputCaptureRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const validateFile = (selected: File | null) => {
    setError(null);
    if (!selected) return;
    const fileType = selected.type || "";
    const fileName = selected.name?.toLowerCase() ?? "";
    const ext = fileName.includes(".") ? fileName.split(".").pop() ?? "" : "";

    if (isVideo) {
      const allowedVideoExt = new Set(["webm", "mp4", "mov", "3gp"]);
      const isVideoMime = !!fileType && fileType.startsWith("video/");
      const isVideoByExt = !fileType && allowedVideoExt.has(ext);
      if (!isVideoMime && !isVideoByExt) {
        setError("Formato no permitido.");
        return;
      }
    } else {
      const isAllowed = allowedMime.some((mime) => {
        if (mime.endsWith("/*")) {
          const prefix = mime.replace("/*", "/");
          return fileType.startsWith(prefix);
        }
        return fileType === mime || fileType.startsWith(`${mime};`);
      });
      if (!isAllowed) {
        setError("Formato no permitido.");
        return;
      }
    }
    if (selected.size > maxBytes) {
      setError(`Archivo muy grande. Maximo ${maxLabel}.`);
      return;
    }
    setFile(selected);
  };

  const resetInputs = () => {
    if (inputRef.current) inputRef.current.value = "";
    if (inputCaptureRef.current) inputCaptureRef.current.value = "";
  };

  const handlePick = () => {
    if (!inputRef.current) return;
    inputRef.current.value = "";
    inputRef.current.click();
  };

  const handleCapture = () => {
    if (!inputCaptureRef.current) return;
    inputCaptureRef.current.value = "";
    inputCaptureRef.current.click();
  };

  const handleOpenCamera = () => {
    if (uploading) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      if (capture) handleCapture();
      return;
    }
    setCameraOpen(true);
  };

  const handleCaptured = async (capturedFile: File) => {
    setError(null);
    setUploading(true);
    try {
      await onUpload(capturedFile);
      setCameraOpen(false);
      onUploaded();
    } catch (e: any) {
      setCameraOpen(false);
      setError(e?.message ?? "Error al subir archivo.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0] ?? null;
    validateFile(dropped);
  };

  const handleUpload = async () => {
    setError(null);
    if (!file) {
      setError("Selecciona un archivo.");
      return;
    }
    setUploading(true);
    try {
      await onUpload(file);
      setFile(null);
      resetInputs();
      onUploaded();
    } catch (e: any) {
      setError(e?.message ?? "Error al subir archivo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-200 text-sm">
          {error}
        </div>
      )}

      <div
        onClick={handlePick}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-5 text-center cursor-pointer transition-colors ${
          dragOver ? "border-teal-400 bg-teal-500/10" : "border-gray-700 bg-[#0a1628] hover:border-gray-600"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onClick={(e) => {
            e.currentTarget.value = "";
          }}
          onChange={(e) => {
            const selected = e.target.files?.[0] ?? null;
            e.currentTarget.value = "";
            validateFile(selected);
          }}
          disabled={uploading}
        />
        {capture && (
          <input
            ref={inputCaptureRef}
            type="file"
            accept={accept}
            capture={capture}
            className="hidden"
            onClick={(e) => {
              e.currentTarget.value = "";
            }}
            onChange={(e) => {
              const selected = e.target.files?.[0] ?? null;
              e.currentTarget.value = "";
              validateFile(selected);
            }}
            disabled={uploading}
          />
        )}

        {!file && (
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-[#071225] border border-gray-700 flex items-center justify-center text-teal-300">
              {isVideo ? "VID" : "DOC"}
            </div>
            <div>
              <p className="text-sm text-gray-200">Arrastra y suelta aqui</p>
              <p className="text-xs text-gray-500 mt-1">o haz clic para seleccionar</p>
            </div>
            <p className="text-xs text-gray-500">
              {maxLabel} - {accept.replace(/,/g, ", ")}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePick();
                }}
                disabled={uploading}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  uploading
                    ? "border-gray-700 bg-gray-700/30 text-gray-400 cursor-not-allowed"
                    : "border-gray-700 bg-[#0a1628] text-gray-200 hover:bg-[#152b47]"
                }`}
              >
                {pickLabel}
              </button>
              {capture && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenCamera();
                  }}
                  disabled={uploading}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    uploading
                      ? "border-gray-700 bg-gray-700/30 text-gray-400 cursor-not-allowed"
                      : "border-gray-700 bg-[#0a1628] text-gray-200 hover:bg-[#152b47]"
                  }`}
                >
                  {captureLabel ?? (isVideo ? "Grabar video" : "Tomar foto")}
                </button>
              )}
            </div>
          </div>
        )}

        {file && (
          <div className="text-left">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-gray-400">Seleccionado</p>
                <p className="text-sm text-gray-200 break-all">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatMb(file.size)} · {file.type || "archivo"}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  resetInputs();
                }}
                className="px-3 py-2 rounded-lg text-xs font-medium border border-gray-700 bg-[#071225] text-gray-200 hover:bg-[#152b47]"
              >
                Quitar
              </button>
            </div>

            {previewUrl && (
              <div className="mt-4 rounded-xl border border-gray-800 bg-[#071225] p-2">
                {isVideo ? (
                  <video className="w-full max-h-64 rounded-lg" src={previewUrl} controls />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="w-full max-h-64 object-contain rounded-lg" src={previewUrl} alt="Vista previa" />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={!onBack || uploading}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            !onBack || uploading
              ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
              : "bg-[#0a1628] border border-gray-700 text-gray-200 hover:bg-[#152b47]"
          }`}
        >
          Volver
        </button>
        <div className="flex items-center gap-2">
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              disabled={uploading}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                uploading
                  ? "border-gray-700 bg-gray-700/30 text-gray-400 cursor-not-allowed"
                  : "border-gray-700 bg-[#0a1628] text-gray-200 hover:bg-[#152b47]"
              }`}
            >
              {skipLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700/40 text-gray-200 hover:bg-gray-700"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading || !file}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              uploading || !file
                ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                : "bg-teal-600 text-white hover:bg-teal-700"
            }`}
          >
            {uploading ? "Subiendo..." : "Subir y continuar"}
          </button>
        </div>
      </div>

      {capture && (
        <CameraCaptureModal
          open={cameraOpen}
          mode={isVideo ? "video" : "photo"}
          facingMode={capture}
          busy={uploading}
          onClose={() => setCameraOpen(false)}
          onCaptured={handleCaptured}
        />
      )}
    </div>
  );
}
