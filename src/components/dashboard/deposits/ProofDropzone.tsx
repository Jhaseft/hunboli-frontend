"use client";

import React from "react";

interface Props {
  file: File | null;
  dragOver: boolean;
  uploading: boolean;
  disabled?: boolean;
  previewUrl: string | null;
  onPickFile: () => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onClearFile: () => void;
}

export function ProofDropzone({
  file,
  dragOver,
  uploading,
  disabled,
  previewUrl,
  onPickFile,
  onDragOver,
  onDragLeave,
  onDrop,
  onClearFile,
}: Props) {
  return (
    <div
      onClick={onPickFile}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`mt-4 cursor-pointer rounded-2xl border-2 border-dashed p-4 sm:p-5 transition-colors ${
        dragOver
          ? "border-teal-400 bg-teal-500/10"
          : "border-gray-600 bg-[#071225] hover:border-gray-500"
      }`}
    >
      {!file && (
        <div className="flex flex-col items-center text-center gap-3">
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
            <p className="text-sm text-gray-200">Arrastra y suelta tu comprobante aquí</p>
            <p className="text-xs text-gray-500 mt-1">o elige una opción</p>
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
      )}

      {file && (
        <div className="mt-4 rounded-xl border border-gray-700 bg-[#0a1628] p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-gray-400">Seleccionado</p>
              <p className="text-sm text-gray-200 break-all">{file.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type || "archivo"}
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClearFile();
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
  );
}
