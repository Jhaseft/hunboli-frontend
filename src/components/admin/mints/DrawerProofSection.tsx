"use client";

import React from "react";
import type { AdminMintDepositItem } from "./types";
import { isImageMime, isPdfMime } from "./mintUtils";

interface DrawerProofSectionProps {
  item: AdminMintDepositItem;
  onPreview: (item: AdminMintDepositItem) => void;
}

export function DrawerProofSection({ item, onPreview }: DrawerProofSectionProps) {
  return (
    <div className="mt-3 rounded-xl border border-gray-800 bg-[#071225] p-3">
      <p className="text-xs text-gray-400">Comprobante</p>

      {!item.proofUrl ? (
        <p className="text-xs text-gray-500 mt-1">Sin comprobante.</p>
      ) : (
        <>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onPreview(item)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-700 bg-[#0a1628] text-teal-300 hover:bg-[#152b47]"
            >
              Ver grande
            </button>
            <a
              href={item.proofUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-700 bg-[#0a1628] text-gray-200 hover:bg-[#152b47]"
            >
              Abrir
            </a>
            {item.proofFileName && (
              <span className="text-xs text-gray-500">
                {item.proofFileName}
                {item.proofMimeType ? ` - ${item.proofMimeType}` : ""}
              </span>
            )}
          </div>

          {item.proofUploadedAt && (
            <p className="text-xs text-gray-500 mt-2">
              Subido: {new Date(item.proofUploadedAt).toLocaleString()}
            </p>
          )}

          {isImageMime(item.proofMimeType) && (
            <button
              type="button"
              onClick={() => onPreview(item)}
              className="mt-3 w-full text-left"
              title="Abrir vista previa"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.proofUrl}
                alt="Comprobante"
                loading="lazy"
                className="w-full max-h-40 object-cover rounded-lg border border-gray-800 bg-[#0a1628]"
              />
            </button>
          )}

          {isPdfMime(item.proofMimeType) && (
            <div className="mt-3 rounded-lg border border-gray-800 bg-[#0a1628] p-3">
              <p className="text-xs text-gray-400">PDF adjunto</p>
              <p className="text-xs text-gray-500 mt-1">
                Usa &quot;Ver grande&quot; para previsualizar.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
