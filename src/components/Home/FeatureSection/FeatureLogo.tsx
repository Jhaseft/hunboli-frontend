import { ReactNode } from "react";

interface FeatureLogoProps {
  children?: ReactNode; // opcional porque a veces usas imageSrc
  variant?: "default" | "shield";
  imageSrc?: string;
}

export function FeatureLogo({
  children,
  variant = "default",
  imageSrc,
}: FeatureLogoProps) {
  const variants = {
    default: "from-teal-500 to-teal-600",
    shield: "from-teal-600 via-teal-500 to-cyan-400",
  };

  return (
    <div className="flex justify-center">
      <div className="relative">
        <div
          className={`w-80 h-80 bg-gradient-to-br ${variants[variant]} rounded-full flex items-center justify-center shadow-2xl`}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Feature"
              className="w-40 h-40 object-cover rounded-full"
            />
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
