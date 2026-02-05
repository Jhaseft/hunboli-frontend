"use client";

import { useCallback, useEffect, useState } from "react";
import { kycService, KycDocumentType } from "@/services/kyc.service";
import type { KycStatus } from "@/types/auth.types";
import { useAuth } from "@/context/AuthContext";

export const DOC_LABELS: Record<KycDocumentType, string> = {
  ID_FRONT: "CI Anverso",
  ID_BACK: "CI Reverso",
  LIVENESS_VIDEO: "Video de verificacion",
};

const TYPE_TO_ENDPOINT: Record<KycDocumentType, "id-front" | "id-back" | "video"> = {
  ID_FRONT: "id-front",
  ID_BACK: "id-back",
  LIVENESS_VIDEO: "video",
};

export function useKycFlow() {
  const { token, isLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [requestId, setRequestId] = useState<string | null>(null);
  const [status, setStatus] = useState<KycStatus | null>(null);
  const [reviewNote, setReviewNote] = useState<string | null>(null);
  const [missingDocs, setMissingDocs] = useState<KycDocumentType[]>([]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await kycService.getMe();
      setStatus(data.kycStatus);
      setRequestId(data.requestActual?.id ?? null);
      setReviewNote(data.reviewNote ?? null);
      setMissingDocs(data.missingDocs ?? []);
      return data;
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "No se pudo cargar tu estado KYC.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!token) return;
    refresh();
  }, [isLoading, token, refresh]);

  const startRequest = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await kycService.createRequest();
      setRequestId(data.requestId);
      setStatus(data.status);
      setMissingDocs(data.missingDocs ?? []);
      return data;
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "No se pudo iniciar KYC.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadDocument = useCallback(
    async (docType: KycDocumentType, file: File) => {
      if (!requestId) {
        throw new Error("Primero inicia tu solicitud KYC.");
      }
      try {
        await kycService.uploadDocument(requestId, TYPE_TO_ENDPOINT[docType], file);
      } catch (e: any) {
        throw new Error(e?.response?.data?.message ?? "Error al subir archivo.");
      }
    },
    [requestId],
  );

  const submitRequest = useCallback(async () => {
    if (!requestId) {
      throw new Error("No hay solicitud activa.");
    }
    try {
      const data = await kycService.submitRequest(requestId);
      setStatus(data.status);
      return data;
    } catch (e: any) {
      throw new Error(e?.response?.data?.message ?? "No se pudo enviar la solicitud.");
    }
  }, [requestId]);

  return {
    token,
    isLoading,
    loading,
    error,
    setError,
    requestId,
    status,
    reviewNote,
    missingDocs,
    refresh,
    startRequest,
    uploadDocument,
    submitRequest,
  };
}
