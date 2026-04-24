/**
 * Single source of truth for the in-page section anchor list.
 * Order matches scroll order; ids match the `id` prop passed to SectionShell.
 */
export interface NavSection {
  id: string;
  labelKey: string; // i18n key for visible label
}

export const NAV_SECTIONS: NavSection[] = [
  { id: "hero", labelKey: "nav.hero" },
  { id: "story", labelKey: "story.eyebrow" },
  { id: "backdrop", labelKey: "nav.backdrop" },
  { id: "album", labelKey: "album.eyebrow" },
  { id: "video", labelKey: "video.eyebrow" },
  { id: "events", labelKey: "events.eyebrow" },
  { id: "rsvp", labelKey: "rsvp.eyebrow" },
  { id: "wishes", labelKey: "wishes.eyebrow" },
  { id: "gift", labelKey: "gift.eyebrow" },
  { id: "games", labelKey: "games.eyebrow" },
];
