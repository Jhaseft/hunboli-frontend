"use client";

import React from "react";
import { isImageMime, isPdfMime } from "./depositUtils";

interface Props {
  proofUrl: string | null;
  proofMimeType: string | null;
}

export function ProofMediaViewer({ proofUrl, proofMimeType }: Props) {
  return (
    <div className="lg:col-span-2 rounded-2xl border border-gray-800 bg-[#071225] p-3">
      {!proofUrl ? (
        <p className="text-sm text-gray-300">Sin comprobante.</p>
      ) : isImageMime(proofMimeType) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={proofUrl}
          alt="Comprobante"
          className="w-full max-h-[560px] object-contain rounded-xl border border-gray-800 bg-[#0a1628]"
        />
      ) : isPdfMime(proofMimeType) ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-200">PDF cargado.</p>
          <a
            href={proofUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#0a1628] text-teal-300 hover:bg-[#152b47]"
          >
            Abrir PDF en nueva pestaña
          </a>
          <div className="rounded-xl border border-gray-800 overflow-hidden">
            <iframe src={proofUrl} className="w-full h-[520px]" title="PDF preview" />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-gray-200">Archivo cargado.</p>
          <a
            href={proofUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#0a1628] text-teal-300 hover:bg-[#152b47]"
          >
            Abrir archivo
          </a>
        </div>
      )}
    </div>
  );
}
