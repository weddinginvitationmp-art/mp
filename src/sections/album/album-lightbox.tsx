import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import { wedding } from "@/config/wedding";

interface Props {
  index: number;
  onClose: () => void;
}

/**
 * Dynamically imported so lightbox JS isn't in the initial bundle.
 * Zoom plugin: pinch-to-zoom on mobile, scroll-to-zoom on desktop.
 * Counter plugin: "3 / 12" indicator top-left.
 */
export default function AlbumLightbox({ index, onClose }: Props) {
  const slides = wedding.album.map((p) => ({
    src: p.src,
    width: p.width,
    height: p.height,
  }));

  return (
    <Lightbox
      open
      index={index}
      slides={slides}
      close={onClose}
      controller={{ closeOnBackdropClick: true }}
      plugins={[Zoom, Counter]}
      zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
    />
  );
}
