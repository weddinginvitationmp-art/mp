import { SectionHeading } from "@/components/layout/section-heading";
import { SectionShell } from "@/components/layout/section-shell";
import { wedding } from "@/config/wedding";
import { VideoPlayer } from "./video-player";

export function Video({ index }: { index?: number }) {
  return (
    <SectionShell id="video" index={index}>
      <SectionHeading eyebrowKey="video.eyebrow" titleKey="video.title" index={index} />
      <div className="relative aspect-video overflow-hidden rounded-soft ring-1 ring-ivory/10">
        <VideoPlayer video={wedding.weddingVideo} />
      </div>
    </SectionShell>
  );
}
