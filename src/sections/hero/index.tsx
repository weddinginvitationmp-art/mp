import { HeroBackground } from "./hero-background";
import { HeroContent } from "./hero-content";
import { CountdownTimer } from "./countdown-timer";
import { ScrollCue } from "./scroll-cue";

/**
 * Hero composes background, foreground, countdown, and scroll cue into a
 * full-viewport cinematic landing.
 */
export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-dvh flex-col items-center justify-center px-6 py-20"
    >
      <HeroBackground />
      <HeroContent />
      <div className="relative z-10 mt-12">
        <CountdownTimer />
      </div>
      <ScrollCue />
    </section>
  );
}
