"use client";

import { useEffect, useMemo, useState } from "react";
import type { KycDocumentType } from "@/services/kyc.service";
import { DOC_LABELS } from "./useKycFlow";
import { StepIdFront } from "./steps/StepIdFront";
import { StepIdBack } from "./steps/StepIdBack";
import { StepVideo } from "./steps/StepVideo";
import { StepSubmit } from "./steps/StepSubmit";

type WizardStep = KycDocumentType | "SUBMIT";

const DOC_ORDER: KycDocumentType[] = ["ID_FRONT", "ID_BACK", "LIVENESS_VIDEO"];

const STEP_LABELS: Record<WizardStep, string> = {
  ID_FRONT: DOC_LABELS.ID_FRONT,
  ID_BACK: DOC_LABELS.ID_BACK,
  LIVENESS_VIDEO: DOC_LABELS.LIVENESS_VIDEO,
  SUBMIT: "Enviar",
};

function buildSteps(missingDocs: KycDocumentType[]): WizardStep[] {
  const missing = new Set(missingDocs);
  const docs = DOC_ORDER.filter((doc) => missing.has(doc));
  return [...docs, "SUBMIT"];
}

type Props = {
  open: boolean;
  missingDocs: KycDocumentType[];
  reviewNote?: string | null;
  onClose: () => void;
  onUpload: (docType: KycDocumentType, file: File) => Promise<void>;
  onRefresh: () => Promise<{ missingDocs: KycDocumentType[] } | null>;
  onSubmit: () => Promise<void>;
  onSubmitted: () => void;
  allowClose?: boolean;
};

export function KycWizardModal({
  open,
  missingDocs,
  reviewNote,
  onClose,
  onUpload,
  onRefresh,
  onSubmit,
  onSubmitted,
  allowClose = true,
}: Props) {
  const steps = useMemo(() => buildSteps(missingDocs), [missingDocs]);
  const [currentStep, setCurrentStep] = useState<WizardStep>("ID_FRONT");

  useEffect(() => {
    if (!open) return;
    setCurrentStep(steps[0] ?? "SUBMIT");
  }, [open, steps]);

  const stepIndex = steps.indexOf(currentStep);
  const totalSteps = steps.length;
  const canGoBack = stepIndex > 0;

  const goBack = () => {
    if (!canGoBack) return;
    setCurrentStep(steps[stepIndex - 1]);
  };

  const handleUpload = async (docType: KycDocumentType, file: File) => {
    await onUpload(docType, file);
    const data = await onRefresh();
    const nextSteps = buildSteps(data?.missingDocs ?? missingDocs);
    setCurrentStep(nextSteps[0] ?? "SUBMIT");
  };

  const handleSubmit = async () => {
    await onSubmit();
    await onRefresh();
    onSubmitted();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onMouseDown={() => {
        if (allowClose) onClose();
      }}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-800 bg-[#0f1e33] shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-gray-800 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Wizard KYC</h3>
            <p className="text-xs text-gray-400 mt-1">
              Paso {Math.max(stepIndex + 1, 1)} de {totalSteps}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={!allowClose}
            className={`rounded-lg border border-gray-700 px-3 py-1.5 text-sm ${
              allowClose ? "bg-[#0a1628] text-gray-200 hover:bg-[#152b47]" : "bg-gray-700/40 text-gray-500 cursor-not-allowed"
            }`}
          >
            Cerrar
          </button>
        </div>

        {reviewNote && (
          <div className="mx-6 mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-amber-200 text-sm">
            <span className="font-semibold">Nota de correccion:</span> {reviewNote}
          </div>
        )}

        <div className="px-6 pt-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {steps.map((step) => (
              <span
                key={step}
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  step === currentStep
                    ? "bg-teal-600/20 text-teal-200 border-teal-500/40"
                    : "bg-[#0a1628] text-gray-400 border-gray-700"
                }`}
              >
                {STEP_LABELS[step]}
              </span>
            ))}
          </div>
        </div>

        <div className="px-6 py-5">
          {currentStep === "ID_FRONT" && (
            <StepIdFront
              onUpload={(file) => handleUpload("ID_FRONT", file)}
              onUploaded={() => {}}
              onBack={canGoBack ? goBack : undefined}
              onClose={onClose}
            />
          )}
          {currentStep === "ID_BACK" && (
            <StepIdBack
              onUpload={(file) => handleUpload("ID_BACK", file)}
              onUploaded={() => {}}
              onBack={canGoBack ? goBack : undefined}
              onClose={onClose}
            />
          )}
          {currentStep === "LIVENESS_VIDEO" && (
            <StepVideo
              onUpload={(file) => handleUpload("LIVENESS_VIDEO", file)}
              onUploaded={() => {}}
              onBack={canGoBack ? goBack : undefined}
              onClose={onClose}
            />
          )}
          {currentStep === "SUBMIT" && (
            <StepSubmit
              missingDocs={missingDocs}
              onSubmit={handleSubmit}
              onSubmitted={onSubmitted}
              onBack={canGoBack ? goBack : undefined}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
