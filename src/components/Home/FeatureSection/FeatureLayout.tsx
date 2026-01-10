import { ReactNode } from "react";

interface FeatureLayoutProps {
  children: [ReactNode, ReactNode];
  reverse?: boolean;
}

export function FeatureLayout({ children, reverse = false }: FeatureLayoutProps) {
  const [first, second] = children;

  return (
    <div className={`flex ${reverse ? "flex-row-reverse" : "flex-row"}`}>
      {first}
      {second}
    </div>
  );
}
