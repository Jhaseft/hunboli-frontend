interface ChevronIconProps {
  className?: string;
  isOpen?: boolean;
}

export function ChevronIcon({ className = "w-4 h-4", isOpen = false }: ChevronIconProps) {
  return (
    <svg
      className={`${className} transition-transform ${isOpen ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}
