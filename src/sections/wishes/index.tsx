import { SectionHeading } from "@/components/layout/section-heading";
import { SectionShell } from "@/components/layout/section-shell";
import { useWishesFeed } from "@/hooks/use-wishes-feed";
import { WishFeed } from "./wish-feed";
import { WishForm } from "./wish-form";

/**
 * Wishes section.
 * Mobile: form sticks to section top while feed scrolls beneath.
 * Desktop: form sits above feed (static).
 */
export function Wishes({ index }: { index?: number }) {
  const { wishes, loading, addOptimistic } = useWishesFeed();

  return (
    <SectionShell id="wishes" index={index}>
      <SectionHeading eyebrowKey="wishes.eyebrow" titleKey="wishes.title" index={index} />
      {/* Sticky on mobile, static on md+ */}
      <div className="sticky top-0 z-10 mb-6 bg-ivory/5 backdrop-blur-md md:static md:bg-transparent md:backdrop-blur-none">
        <WishForm onSubmitted={addOptimistic} />
      </div>
      <WishFeed wishes={wishes} loading={loading} />
    </SectionShell>
  );
}
