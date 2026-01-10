import { ReactNode } from "react";

interface FeatureLayoutProps {
  children: [ReactNode, ReactNode];
  reverse?: boolean;
}

export function FeatureLayout({ children, reverse = false }: FeatureLayoutProps) {
  const [first, second] = children;

  return (
    <div
      className={`flex flex-col md:flex-row gap-12 sm:gap-16 md:gap-20 items-center mb-20 sm:mb-24 md:mb-32 ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className="flex-1">{first}</div>
      <div className="flex-1">{second}</div>
    </div>
  );
}
