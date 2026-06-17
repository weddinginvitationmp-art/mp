import type { ReactNode } from "react";

export function InvitationFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-4xl">
      <div className="rounded-2xl border border-[#B22234]/10 bg-surface p-8 shadow-2xl shadow-[#B22234]/10 dark:shadow-[#B22234]/5 sm:p-12 lg:p-16">
        {children}
      </div>
    </div>
  );
}
