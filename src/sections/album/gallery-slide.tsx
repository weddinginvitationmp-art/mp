import { motion } from "framer-motion";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { wedding } from "@/config/wedding";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { formatTime } from "@/lib/format-date";
import { revealViewport, staggerParent } from "@/lib/motion-presets";
import { SectionHeading } from "@/components/layout/section-heading";

interface Props {
  onSelect: (index: number) => void;
  lang: "vi" | "en";
  index?: number;
}

export function GallerySlide({ onSelect, lang, index }: Props) {
  const reduced = useReducedMotion();
  const ceremony = wedding.events.find((event) => event.kind === "tiec_nha_trai") ?? wedding.events[0]!;

  return (
    <section id="album" className="relative min-h-screen overflow-hidden section-sys-bg px-6 py-24 sm:py-32">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
        <SectionHeading eyebrowKey="album.eyebrow" titleKey="album.title" subtitleKey={undefined} index={index} />

        <motion.div
          className="mt-14 w-full"
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? undefined : "show"}
          viewport={revealViewport}
          variants={staggerParent}
        >
          <Swiper
            modules={[Autoplay, EffectCoverflow, Pagination]}
            effect="coverflow"
            centeredSlides
            slidesPerView="auto"
            grabCursor
            loop
            speed={900}
            spaceBetween={24}
            autoplay={
              reduced
                ? false
                : {
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }
            }
            pagination={{ clickable: true }}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1.2,
              slideShadows: false,
            }}
            className="gallery-swiper w-full"
          >
            {wedding.album.map((photo, index) => (
              <SwiperSlide key={`${photo.src}-${index}`} className="!w-[90vw] sm:!w-[600px]">
                <button
                  type="button"
                  onClick={() => onSelect(index)}
                  className="group block w-full text-left"
                  aria-label={photo.alt[lang]}
                >
                  <div className="relative overflow-hidden rounded-[28px] bg-white shadow-2xl shadow-black/20">
                    <img
                      src={photo.src}
                      alt={photo.alt[lang]}
                      width={photo.width}
                      height={photo.height}
                      loading={index < 2 ? "eager" : "lazy"}
                      decoding="async"
                      style={{ objectPosition: photo.position ?? "center" }}
                      className="aspect-[4/3] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white opacity-0 transition duration-500 group-hover:opacity-100 sm:p-6">
                      <p className="font-display text-lg tracking-[0.18em] text-white/90">
                        {formatTime(ceremony.start, lang === "vi" ? "vi-VN" : "en-US")}
                      </p>
                      <p className="mt-1 text-sm uppercase tracking-[0.32em] text-white/70">
                        {photo.alt[lang]}
                      </p>
                    </div>
                  </div>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        <div className="mt-14 flex w-full max-w-2xl justify-center">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#B22234]/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}