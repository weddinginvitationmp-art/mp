import type { ReactNode } from "react";

function LotusCorner({ className }: { className: string }) {
  return (
    <svg
      className={`absolute h-8 w-8 text-[#D4AF37]/40 ${className}`}
      viewBox="0 0 32 32"
      aria-hidden="true"
    >
      <path
        d="M16 4c2 5 6 8 6 13a6 6 0 01-12 0c0-5 4-8 6-13z"
        fill="currentColor"
      />
      <path
        d="M10 10c1 3 3 5 6 7-3-2-5-4-6-7z"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M22 10c-1 3-3 5-6 7 3-2 5-4 6-7z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}

export function InvitationFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto max-w-lg">
      {/* Outer border */}
      <div className="rounded-lg border-2 border-[#C41E3A]/40 p-1.5 dark:border-[#C41E3A]/25">
        {/* Inner border */}
        <div className="relative rounded-md border border-[#D4AF37]/30 bg-gradient-to-b from-[#FDF8F0]/80 to-[#F7F2EA]/60 px-6 py-10 sm:px-10 sm:py-14 dark:from-[#1A0808]/60 dark:to-[#0F0505]/80">
          {/* Corner ornaments */}
          <LotusCorner className="left-2 top-2" />
          <LotusCorner className="right-2 top-2 -scale-x-100" />
          <LotusCorner className="bottom-2 left-2 -scale-y-100" />
          <LotusCorner className="bottom-2 right-2 -scale-x-100 -scale-y-100" />

          {children}
        </div>
      </div>
    </div>
  );
}
