interface Props {
  current: number;
  total: number;
}

/**
 * Pill row showing current step. When the user picks "not attending"
 * we collapse to a 2-pill view (start + confirm) — handled by parent
 * passing total=2 in that case.
 */
export function RsvpProgress({ current, total }: Props) {
  return (
    <div className="mb-10 flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const active = i === current;
        const done = i < current;
        return (
          <span
            key={i}
            aria-hidden="true"
            className={`rounded-pill transition-all ${
              active
                ? "h-1 sm:h-1 w-10 bg-accent sm:w-10"
                : done
                  ? "h-1 w-6 bg-accent/60"
                  : "h-1 w-6 bg-surface-muted"
            }`}
          />
        );
      })}
    </div>
  );
}
