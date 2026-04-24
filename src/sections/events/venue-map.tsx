import { useTranslation } from "react-i18next";

interface Props {
  query: string;
  label: string;
}

/**
 * Keyless Google Maps embed via iframe. Lazy-loaded by the browser.
 * aspect-video reserves space so there's no CLS when the iframe boots.
 */
export function VenueMap({ query, label }: Props) {
  const { t } = useTranslation();
  const embed = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  const view = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <div className="mt-12">
      <div className="aspect-[4/3] overflow-hidden rounded-soft ring-1 ring-ivory/10 md:aspect-video">
        <iframe
          src={embed}
          title={label}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="size-full border-0"
        />
      </div>
      <a
        href={view}
        target="_blank"
        rel="noreferrer"
        className="mt-3 block text-center text-xs uppercase tracking-[0.3em] text-muted-gold underline-offset-4 hover:underline"
      >
        {t("events.openInMaps")}
      </a>
    </div>
  );
}
