import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { GallerySlide } from "./gallery-slide";

const AlbumLightbox = lazy(() => import("./album-lightbox"));

export function Album({ index }: { index?: number }) {
  const { i18n } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const lang = i18n.language.startsWith("vi") ? "vi" : "en";

  return (
    <>
      <GallerySlide index={index} onSelect={setOpenIndex} lang={lang} />
      <Suspense fallback={null}>
        {openIndex !== null && (
          <AlbumLightbox index={openIndex} onClose={() => setOpenIndex(null)} />
        )}
      </Suspense>
    </>
  );
}
