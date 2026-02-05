"use client";

import { KycUploadStep } from "./KycUploadStep";

type Props = {
  onUpload: (file: File) => Promise<void>;
  onUploaded: () => void;
  onBack?: () => void;
  onClose: () => void;
};

export function StepVideo({ onUpload, onUploaded, onBack, onClose }: Props) {
  return (
    <KycUploadStep
      title="Video de verificacion"
      subtitle="Sube un video corto mostrando tu rostro. Mira arriba, abajo y a los lados."
      accept="video/*"
      allowedMime={["video/mp4", "video/webm", "video/quicktime", "video/3gpp"]}
      maxBytes={50 * 1024 * 1024}
      maxLabel="50MB"
      isVideo
      capture="user"
      pickLabel="Elegir archivo"
      captureLabel="Grabar video"
      onUpload={onUpload}
      onUploaded={onUploaded}
      onBack={onBack}
      onClose={onClose}
    />
  );
}
