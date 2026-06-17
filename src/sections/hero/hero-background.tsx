// No runtime hooks needed for poster-only variant

const POSTER = "/media/hero-poster.jpg";

/**
 * Cinematic full-bleed background.
 * - Mobile (≤768px) or reduced-motion: poster only (saves data + battery).
 * - Desktop: video layered above poster, video fades in once it can play.
 * - Glass overlay: radial darkening keeps text legible without dimming the whole frame.
 *
 * Note: hero-poster.jpg / hero.mp4 / hero.webm are placeholders.
 * If absent, the gradient overlay still renders (graceful degrade for dev).
 */
export function HeroBackground() {

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-ink">
      <img
        src={POSTER}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover "
        style={{ objectPosition: "60% 20%" }}
        // Tell the browser this is the LCP — already preloaded in index.html.
        // React 18 doesn't recognize camelCase `fetchPriority`; lowercase lands as the real HTML attr.
        {...({ fetchpriority: "high" } as Record<string, string>)}
        decoding="async"
        onError={(e) => {
          // Hide if the placeholder file is missing in dev.
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />

      {/* Cinematic darken — gradient + subtle blur on the bottom band where text sits */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/40 to-ink/80" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 backdrop-blur-[2px]" />
    </div>
  );
}
