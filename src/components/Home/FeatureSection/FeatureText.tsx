import { ReactNode } from "react";

interface FeatureTextProps {
  title: string;
  description: string | ReactNode; // <- permite JSX
  buttonText?: string;
}

export function FeatureText({ title, description, buttonText }: FeatureTextProps) {
  return (
    <div className="space-y-6 px-2 sm:px-0">
      <h2 className="text-3xl sm:text-4xl md:text-5xl text-white leading-tight">
        {title}
      </h2>

      <p className="text-base sm:text-lg text-gray-400 leading-relaxed break-words">
        {description}
      </p>

      {buttonText && (
        <button className="px-4 sm:px-6 py-2 sm:py-3 border border-teal-500 text-teal-400 hover:bg-teal-500/10 rounded-lg transition-all text-sm sm:text-base">
          {buttonText}
        </button>
      )}
    </div>
  );
}
