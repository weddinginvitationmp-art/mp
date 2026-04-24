import { SectionHeading } from "@/components/layout/section-heading";
import { SectionShell } from "@/components/layout/section-shell";
import { wedding } from "@/config/wedding";
import { StoryEntry } from "./story-entry";

/**
 * Our Story: vertical timeline of milestones.
 * Desktop shows alternating left/right entries against a central spine;
 * mobile collapses to a single left-aligned column.
 */
export function Story({ index }: { index?: number }) {
  return (
    <SectionShell id="story" index={index}>
      <SectionHeading eyebrowKey="story.eyebrow" titleKey="story.title" index={index} />
      <div className="relative mx-auto max-w-3xl">
        {/* Center spine — desktop only */}
        <div
          aria-hidden="true"
          className="absolute left-5 top-0 bottom-0 w-px bg-accent/20 md:left-1/2"
        />
        <div className="space-y-12 md:space-y-16">
          {wedding.story.map((milestone, i) => (
            <StoryEntry
              key={milestone.date.toISOString()}
              milestone={milestone}
              side={i % 2 === 0 ? "left" : "right"}
            />
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
