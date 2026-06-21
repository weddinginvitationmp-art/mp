import { lazy, Suspense, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SiteLayout } from "@/components/layout/site-layout";
import { OpeningOverlay } from "@/components/opening/opening-overlay";
import { GuestProvider } from "@/contexts/guest-context";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { playBackgroundMusic } from "@/hooks/use-background-music";
import { Hero } from "@/sections/hero";
import { GoldenDustParticles } from "@/components/floating/golden-dust-particles";
import { SeatSearchFloating } from "@/components/floating/seat-search-floating";
import { SeatSearchModal } from "@/components/floating/seat-search-modal";
import { useSeatMap } from "@/hooks/use-seat-map";

// Admin console — separate chunk; only loaded when visiting /admin*


const AdminApp = lazy(() => import("@/admin"));

// Below-fold sections: lazy-loaded so initial bundle ships only the hero.
const Invitation = lazy(() => import("@/sections/invitation").then((m) => ({ default: m.Invitation })));
const Story = lazy(() => import("@/sections/story").then((m) => ({ default: m.Story })));
// const Backdrop = lazy(() =>
//   import("@/sections/backdrop").then((m) => ({ default: m.Backdrop })),
// );
const Album = lazy(() => import("@/sections/album").then((m) => ({ default: m.Album })));
const Video = lazy(() => import("@/sections/video").then((m) => ({ default: m.Video })));
const Events = lazy(() => import("@/sections/events").then((m) => ({ default: m.Events })));
const Rsvp = lazy(() => import("@/sections/rsvp").then((m) => ({ default: m.Rsvp })));
const Wishes = lazy(() => import("@/sections/wishes").then((m) => ({ default: m.Wishes })));
const Gift = lazy(() => import("@/sections/gift").then((m) => ({ default: m.Gift })));
// const Games = lazy(() => import("@/sections/games").then((m) => ({ default: m.Games })));

const SectionSkeleton = () => <div className="min-h-[60dvh]" aria-hidden="true" />;

export function App() {
  const [opened, setOpened] = useState(false);
  const reducedMotion = useReducedMotion();

  if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
    return (
      <Suspense fallback={<div className="min-h-dvh" />}>
        <AdminApp />
      </Suspense>
    );
  }

  return (
    <GuestProvider>
      <OpeningOverlay onOpen={() => setOpened(true)} onOpenMusic={() => playBackgroundMusic()} />
      <GoldenDustParticles />
      <motion.div
        initial={false}
        animate={opened ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={reducedMotion ? { duration: 0.2, ease: "easeOut" } : { duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: opened ? "auto" : "none" }}
      >
        <AppShell />
      </motion.div>
    </GuestProvider>
  );
}


function AppShell() {
  useDocumentMeta();

  const [seatSearchOpen, setSeatSearchOpen] = useState(false);
  const [selectedMapId, setSelectedMapId] = useState<string>(() => {
    // Load from localStorage if available
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedSeatMapId") || "";
    }
    return "";
  });
  const showStorySection = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("story") === "show";
  
  const { seatMap, allMaps } = useSeatMap(selectedMapId || undefined);

  const handleSelectMap = (mapId: string) => {
    setSelectedMapId(mapId);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedSeatMapId", mapId);
    }
  };

  return (
    <SiteLayout>
      <Hero />
      <SeatSearchFloating onOpen={() => setSeatSearchOpen(true)} />
      <SeatSearchModal 
        isOpen={seatSearchOpen} 
        onClose={() => setSeatSearchOpen(false)} 
        seatMap={seatMap} 
        allMaps={allMaps}
        selectedMapId={selectedMapId || undefined}
        onSelectMap={handleSelectMap}
      />
      <Suspense fallback={<SectionSkeleton />}>
        <Invitation index={1} />
        {showStorySection && <Story index={2} />}

        {/* <Backdrop index={3} /> */}
        <Album index={3} />
        <Video index={4} />
        <Events index={5} />
        <Rsvp index={6} />
        <Wishes index={7} />
        <Gift index={8} />
        {/* <Games index={9} /> */}
      </Suspense>
    </SiteLayout>
  );
}
