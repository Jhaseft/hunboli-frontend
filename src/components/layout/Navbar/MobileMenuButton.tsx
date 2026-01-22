interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function MobileMenuButton({ isOpen, onClick }: MobileMenuButtonProps) {
  return (
    <button
      className="flex flex-col items-end gap-1 z-60"
      onClick={onClick}
      aria-label="Menú"
    >
      <span
        className={`h-0.5 w-8 bg-gray-300 transition ${
          isOpen && 'rotate-45 translate-y-2'
        }`}
      />
      <span
        className={`h-0.5 w-5 bg-gray-300 transition ${isOpen && 'opacity-0'}`}
      />
      <span
        className={`h-0.5 w-3 bg-gray-300 transition ${
          isOpen && '-rotate-45 -translate-y-2'
        }`}
      />
    </button>
  );
}
