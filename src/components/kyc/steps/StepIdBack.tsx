"use client";

import { KycUploadStep } from "./KycUploadStep";

type Props = {
  onUpload: (file: File) => Promise<void>;
  onUploaded: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  onClose: () => void;
};

export function StepIdBack({ onUpload, onUploaded, onBack, onSkip, onClose }: Props) {
  return (
    <KycUploadStep
      title="CI Reverso"
      subtitle="Sube una imagen clara del reverso del documento."
      accept="image/*"
      allowedMime={["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]}
      maxBytes={10 * 1024 * 1024}
      maxLabel="10MB"
      capture="environment"
      pickLabel="Elegir archivo"
      captureLabel="Tomar foto"
      onSkip={onSkip}
      onUpload={onUpload}
      onUploaded={onUploaded}
      onBack={onBack}
      onClose={onClose}
    />
  );
}
