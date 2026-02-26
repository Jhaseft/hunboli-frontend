"use client";

import React from "react";
import type { AdminDepositItem } from "./types";
import { isImageMime } from "./depositUtils";

interface Props {
  deposit: AdminDepositItem;
  onPreview: (deposit: AdminDepositItem) => void;
}

export function AdminDepositProofSection({ deposit: d, onPreview }: Props) {
  return (
    <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
      <p className="text-xs text-gray-400">Comprobante</p>

      {!d.proofUrl ? (
        <p className="text-xs text-gray-500 mt-1">Sin comprobante</p>
      ) : (
        <>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <a
              href={d.proofUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-lg text-xs font-medium border border-gray-700 bg-[#0a1628] text-teal-300 hover:bg-[#152b47]"
            >
              Abrir
            </a>

            <button
              type="button"
              onClick={() => onPreview(d)}
              className="px-3 py-2 rounded-lg text-xs font-medium border border-gray-700 bg-[#0a1628] text-gray-200 hover:bg-[#152b47]"
            >
              Vista previa
            </button>

            {d.proofFileName && (
              <span className="text-xs text-gray-500">
                {d.proofFileName}
                {d.proofMimeType ? ` • ${d.proofMimeType}` : ""}
              </span>
            )}
          </div>

          {d.proofUploadedAt && (
            <p className="text-xs text-gray-500 mt-2">
              Subido: {new Date(d.proofUploadedAt).toLocaleString()}
            </p>
          )}

          {isImageMime(d.proofMimeType) && (
            <button
              type="button"
              onClick={() => onPreview(d)}
              className="mt-3 w-full text-left"
              title="Abrir vista previa"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={d.proofUrl}
                alt="Comprobante"
                className="w-full max-h-44 object-cover rounded-xl border border-gray-800 bg-[#0a1628]"
              />
            </button>
          )}
        </>
      )}
    </div>
  );
}
