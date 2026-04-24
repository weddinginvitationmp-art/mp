import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { wedding } from "@/config/wedding";
import { BackdropSlide } from "./backdrop-slide";
import { SwipeHint } from "./swipe-hint";

/**
 * Full-bleed horizontal scroll-snap deck.
 * - scroll-snap-stop: always prevents multi-slide skips on fast flick.
 * - IntersectionObserver tracks active slide for pagination dots.
 * - SwipeHint shows on first visit only.
 */
export function Backdrop({ index }: { index?: number }) {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith("vi") ? "vi" : "en";
  const deckRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = deckRef.current;
    if (!root) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.5) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            if (!isNaN(idx)) setActive(idx);
          }
        });
      },
      { root, threshold: 0.5 },
    );

    slideRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="backdrop" aria-label="Cinematic backdrop" className="relative">
      {index !== undefined && (
        <div aria-hidden="true" className="mx-auto max-w-3xl px-6 pt-24 sm:pt-32">
          <div className="section-divider">
            <span className="section-divider__line" />
          </div>
        </div>
      )}
      <div
        ref={deckRef}
        className="film-grain flex snap-x snap-mandatory overflow-x-auto no-scrollbar overscroll-x-contain"
      >
        {wedding.backdropSlides.map((slide, i) => (
          <BackdropSlide
            key={i}
            slide={slide}
            lang={lang}
            idx={i}
            slideRef={(el) => { slideRefs.current[i] = el; }}
          />
        ))}
      </div>

      {/* Pagination dots */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5"
        aria-hidden="true"
      >
        {wedding.backdropSlides.map((_, i) => (
          <span
            key={i}
            className={`block h-1.5 rounded-pill transition-all duration-300 ${
              i === active ? "w-5 bg-muted-gold" : "w-1.5 bg-ivory/40"
            }`}
          />
        ))}
      </div>

      <SwipeHint deckRef={deckRef} />
    </section>
  );
}
