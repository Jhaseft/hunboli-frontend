export function Logo() {
  return (
    <div className="flex justify-center mb-8">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1a2942] to-[#0f1922] border-2 border-cyan-500/30 flex items-center justify-center">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-cyan-400"
        >
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
          <circle cx="20" cy="20" r="4" stroke="currentColor" strokeWidth="2" />
          <path
            d="M15 10L17 22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
