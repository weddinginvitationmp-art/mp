import type { BackdropSlide as SlideType } from "@/config/wedding";

interface Props {
  slide: SlideType;
  lang: "vi" | "en";
  idx: number;
  slideRef: (el: HTMLElement | null) => void;
}

export function BackdropSlide({ slide, lang, idx, slideRef }: Props) {
  return (
    <article
      ref={slideRef}
      data-idx={idx}
      className="relative h-[70dvh] min-w-full snap-center snap-always md:h-[80dvh]"
    >
      <img
        src={slide.image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/40 to-ink/70" />
      <div className="relative z-10 mx-auto flex h-full max-w-2xl items-center px-8">
        <p className="font-display text-3xl leading-tight text-ivory sm:text-5xl">
          &ldquo;{slide.quote[lang]}&rdquo;
        </p>
      </div>
    </article>
  );
}
