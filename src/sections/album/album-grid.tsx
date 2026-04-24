import { wedding } from "@/config/wedding";
import { AlbumTile } from "./album-tile";

interface Props {
  onSelect: (index: number) => void;
  lang: "vi" | "en";
}

export function AlbumGrid({ onSelect, lang }: Props) {
  return (
    <div className="columns-2 gap-2 sm:columns-3 sm:gap-3 md:columns-4">
      {wedding.album.map((photo, i) => (
        <AlbumTile key={i} photo={photo} lang={lang} onClick={() => onSelect(i)} />
      ))}
    </div>
  );
}
