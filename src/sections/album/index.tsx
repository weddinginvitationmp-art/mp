import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/layout/section-heading";
import { SectionShell } from "@/components/layout/section-shell";
import { AlbumGrid } from "./album-grid";

const AlbumLightbox = lazy(() => import("./album-lightbox"));

export function Album({ index }: { index?: number }) {
  const { i18n } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const lang = i18n.language.startsWith("vi") ? "vi" : "en";

  return (
    <SectionShell id="album" index={index}>
      <SectionHeading eyebrowKey="album.eyebrow" titleKey="album.title" index={index} />
      <AlbumGrid onSelect={setOpenIndex} lang={lang} />
      <Suspense fallback={null}>
        {openIndex !== null && (
          <AlbumLightbox index={openIndex} onClose={() => setOpenIndex(null)} />
        )}
      </Suspense>
    </SectionShell>
  );
}
