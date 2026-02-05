"use client";

import { KycUploadStep } from "./KycUploadStep";

type Props = {
  onUpload: (file: File) => Promise<void>;
  onUploaded: () => void;
  onBack?: () => void;
  onClose: () => void;
};

export function StepIdFront({ onUpload, onUploaded, onBack, onClose }: Props) {
  return (
    <KycUploadStep
      title="CI Anverso"
      subtitle="Sube una imagen clara del anverso del documento."
      accept="image/*"
      allowedMime={["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]}
      maxBytes={10 * 1024 * 1024}
      maxLabel="10MB"
      capture="environment"
      pickLabel="Elegir archivo"
      captureLabel="Tomar foto"
      onUpload={onUpload}
      onUploaded={onUploaded}
      onBack={onBack}
      onClose={onClose}
    />
  );
}
