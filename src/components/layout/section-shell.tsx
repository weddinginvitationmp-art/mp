import type { ReactNode } from "react";

interface Props {
  id: string;
  children: ReactNode;
  className?: string;
  /** Optional scroll-order index. When set, renders a subtle top hairline divider for visual wayfinding. */
  index?: number;
}

/**
 * Standard section wrapper: scroll anchor id, consistent vertical rhythm,
 * max-width content area centered in the viewport.
 *
 * When `index` is provided, a hairline divider appears at the top of the section,
 * giving each block a clear start boundary without introducing heavy card borders.
 */
export function SectionShell({ id, children, className = "", index }: Props) {
  return (
    <section id={id} className={`relative scroll-mt-20 px-6 py-24 sm:py-32 ${className}`}>
      <div className="mx-auto max-w-3xl">
        {index !== undefined && (
          <div aria-hidden="true" className="section-divider">
            <span className="section-divider__line" />
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
