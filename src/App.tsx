import { lazy, Suspense, useState } from "react";
import { SiteLayout } from "@/components/layout/site-layout";
import { OpeningOverlay, OPENING_SESSION_KEY } from "@/components/opening/opening-overlay";
import { GuestProvider } from "@/contexts/guest-context";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Hero } from "@/sections/hero";

// Admin console — separate chunk; only loaded when visiting /admin*
const AdminApp = lazy(() => import("@/admin"));

// Below-fold sections: lazy-loaded so initial bundle ships only the hero.
const Story = lazy(() => import("@/sections/story").then((m) => ({ default: m.Story })));
const Backdrop = lazy(() =>
  import("@/sections/backdrop").then((m) => ({ default: m.Backdrop })),
);
const Album = lazy(() => import("@/sections/album").then((m) => ({ default: m.Album })));
const Video = lazy(() => import("@/sections/video").then((m) => ({ default: m.Video })));
const Events = lazy(() => import("@/sections/events").then((m) => ({ default: m.Events })));
const Rsvp = lazy(() => import("@/sections/rsvp").then((m) => ({ default: m.Rsvp })));
const Wishes = lazy(() => import("@/sections/wishes").then((m) => ({ default: m.Wishes })));
const Gift = lazy(() => import("@/sections/gift").then((m) => ({ default: m.Gift })));
const Games = lazy(() => import("@/sections/games").then((m) => ({ default: m.Games })));

const SectionSkeleton = () => <div className="min-h-[60dvh]" aria-hidden="true" />;

export function App() {
  const [opened, setOpened] = useState(() => {
    if (typeof window === "undefined") return true;
    return sessionStorage.getItem(OPENING_SESSION_KEY) === "1";
  });

  if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
    return (
      <Suspense fallback={<div className="min-h-dvh" />}>
        <AdminApp />
      </Suspense>
    );
  }

  return (
    <GuestProvider>
      {!opened && (
        <OpeningOverlay
          onComplete={() => setOpened(true)}
        />
      )}
      <AppShell />
    </GuestProvider>
  );
}

function AppShell() {
  useDocumentMeta();
  return (
    <SiteLayout>
      <Hero />
      <Suspense fallback={<SectionSkeleton />}>
        <Story index={1} />
        <Backdrop index={2} />
        <Album index={3} />
        <Video index={4} />
        <Events index={5} />
        <Rsvp index={6} />
        <Wishes index={7} />
        <Gift index={8} />
        <Games index={9} />
      </Suspense>
    </SiteLayout>
  );
}
