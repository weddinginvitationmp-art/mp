/**
 * Single source of truth for couple/event facts.
 * No env vars — these are intentionally public.
 */
export type EventKind = "ceremony" | "reception";

export interface TimelineItem {
  time: string;
  label: { vi: string; en: string };
}

export interface WeddingEvent {
  kind: EventKind;
  start: Date;
  end: Date;
  venue: { vi: string; en: string };
  address: { vi: string; en: string };
  mapQuery: string;
  dressCode?: string;
  parkingNote?: string;
  venueDetail?: string;
  note?: string;
  timeline?: TimelineItem[];
}

export interface StoryMilestone {
  date: Date;
  title: { vi: string; en: string };
  body: { vi: string; en: string };
}

export interface BackdropSlide {
  image: string;
  quote: { vi: string; en: string };
}

export interface InvitationConfig {
  groomParents: { father: string; mother: string };
  brideParents: { father: string; mother: string };
  lunarDate: { vi: string; en: string };
  invitationText: { vi: string; en: string };
}

export interface AlbumPhoto {
  src: string;
  width: number;
  height: number;
  alt: { vi: string; en: string };
}

export interface WeddingVideo {
  youtubeId: string;
  posterImage: string;
}

export interface BankAccount {
  name: { vi: string; en: string };
  bankName: string;
  bankBin: string; // NAPAS code (e.g. "970436" = Vietcombank)
  accountNumber: string;
  accountHolder: string; // ASCII only — VietQR requires it
}

export const wedding = {
  bride: { name: "Hà Phương" },
  groom: { name: "Hoàng Minh" },
  // Saigon time, ICT (UTC+7).
  date: new Date("2026-07-03T17:00:00+07:00"),
  dateDisplay: { vi: "03 · 07 · 2026", en: "12 · 12 · 2026" },
  city: { vi: "Hà Nội", en: "Hanoi" },
  venue: { vi: "TBD", en: "TBD" },
  hashtag: "#HaPhuongHoangMinh2026",

  events: [
    {
      kind: "ceremony",
      start: new Date("2026-12-12T10:00:00+07:00"),
      end: new Date("2026-12-12T11:30:00+07:00"),
      venue: { vi: "Khách sạn Petro", en: "Petro Hotel" },
      address: { vi: "Đường Lê Lợi, tỉnh Thái Bình", en: "Le Loi Street, Thai Binh" },
      mapQuery: "Notre+Dame+Saigon",
    },
    {
      kind: "reception",
      start: new Date("2026-12-12T17:00:00+07:00"),
      end: new Date("2026-12-12T21:00:00+07:00"),
      venue: { vi: "Nhà hàng TBD", en: "Venue TBD" },
      address: { vi: "Địa chỉ TBD, Sài Gòn", en: "Address TBD, Saigon" },
      mapQuery: "Notre+Dame+Saigon",
    },
  ] satisfies ReadonlyArray<WeddingEvent>,

  story: [
    {
      date: new Date("2021-06-01"),
      title: { vi: "Chạm mặt lần đầu", en: "First meeting" },
      body: {
        vi: "Một buổi chiều Sài Gòn, hai người lạ gặp nhau trong quán cà phê quen thuộc. Không ai biết đây là khởi đầu.",
        en: "A Saigon afternoon, two strangers crossing paths in a familiar café. Neither knew it was the beginning.",
      },
    },
    {
      date: new Date("2022-02-14"),
      title: { vi: "Hẹn hò chính thức", en: "Officially dating" },
      body: {
        vi: "Ngày Valentine đầu tiên cùng nhau. Một cái gật đầu, và câu chuyện bắt đầu thật.",
        en: "Our first Valentine's together. One yes, and the story truly began.",
      },
    },
    {
      date: new Date("2024-08-01"),
      title: { vi: "Về chung một nhà", en: "Moving in together" },
      body: {
        vi: "Căn hộ nhỏ giữa thành phố lớn. Bữa sáng chung, cà phê chung, tiếng cười chung.",
        en: "A small apartment in a big city. Shared breakfasts, shared coffee, shared laughter.",
      },
    },
    {
      date: new Date("2026-03-15"),
      title: { vi: "Ngỏ lời", en: "The proposal" },
      body: {
        vi: "Một buổi hoàng hôn, một chiếc nhẫn, một câu hỏi đã đợi rất lâu — và câu trả lời là mãi mãi.",
        en: "A sunset, a ring, a question long overdue — and an answer that means forever.",
      },
    },
  ] satisfies ReadonlyArray<StoryMilestone>,

  invitation: {
    groomParents: { father: "Ông [Tên cha chú rể]", mother: "Bà [Tên mẹ chú rể]" },
    brideParents: { father: "Ông [Tên cha cô dâu]", mother: "Bà [Tên mẹ cô dâu]" },
    lunarDate: { vi: "Ngày ... tháng ... năm Bính Ngọ", en: "... day, ... month, Year of the Horse" },
    invitationText: {
      vi: "Trân trọng kính mời quý khách đến dự buổi lễ Thành Hôn của con chúng tôi",
      en: "We cordially invite you to the wedding celebration of our children",
    },
  } satisfies InvitationConfig,

  // Cinematic horizontal scroll-snap deck (Phase 3.2).
  // Quotes intentionally short — they overlay full-bleed photography.
  backdropSlides: [
    {
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80",
      quote: { vi: "Trăm năm hạnh phúc.", en: "A hundred years of happiness." },
    },
    {
      image: "https://images.unsplash.com/photo-1525258801-c69ea2d57749?w=1920&q=80",
      quote: { vi: "Hai trái tim, một câu chuyện.", en: "Two hearts, one story." },
    },
    {
      image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1920&q=80",
      quote: { vi: "Mãi mãi bắt đầu từ hôm nay.", en: "Forever starts today." },
    },
  ] satisfies ReadonlyArray<BackdropSlide>,

  // Album masonry — Unsplash placeholders. Mix of aspect ratios for visual rhythm.
  // Replace `src`s with real wedding shots before launch.
  album: [
    { src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80", width: 1200, height: 1600, alt: { vi: "Khoảnh khắc 1", en: "Moment 1" } },
    { src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&q=80", width: 1200, height: 800, alt: { vi: "Khoảnh khắc 2", en: "Moment 2" } },
    { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80", width: 1200, height: 1200, alt: { vi: "Khoảnh khắc 3", en: "Moment 3" } },
    { src: "https://images.unsplash.com/photo-1525258801-c69ea2d57749?w=1200&q=80", width: 1200, height: 1500, alt: { vi: "Khoảnh khắc 4", en: "Moment 4" } },
    { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80", width: 1200, height: 800, alt: { vi: "Khoảnh khắc 5", en: "Moment 5" } },
    { src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80", width: 1200, height: 1200, alt: { vi: "Khoảnh khắc 6", en: "Moment 6" } },
    { src: "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=1200&q=80", width: 1200, height: 1600, alt: { vi: "Khoảnh khắc 7", en: "Moment 7" } },
    { src: "https://images.unsplash.com/photo-1513278974582-3e1b4a4fa21e?w=1200&q=80", width: 1200, height: 800, alt: { vi: "Khoảnh khắc 8", en: "Moment 8" } },
    { src: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200&q=80", width: 1200, height: 1500, alt: { vi: "Khoảnh khắc 9", en: "Moment 9" } },
    { src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80", width: 1200, height: 1200, alt: { vi: "Khoảnh khắc 10", en: "Moment 10" } },
    { src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80", width: 1200, height: 800, alt: { vi: "Khoảnh khắc 11", en: "Moment 11" } },
    { src: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=1200&q=80", width: 1200, height: 1600, alt: { vi: "Khoảnh khắc 12", en: "Moment 12" } },
  ] satisfies ReadonlyArray<AlbumPhoto>,

  // Wedding film — replace youtubeId with real video before launch.
  weddingVideo: {
    youtubeId: "dQw4w9WgXcQ",
    posterImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1920&q=80",
  } satisfies WeddingVideo,

  // Gift / Mừng cưới — TBD placeholders. Replace with real accounts before launch.
  // Account holder MUST be ASCII (no diacritics) for VietQR to scan correctly.
  gift: {
    bride: {
      name: { vi: "Cô dâu", en: "Bride" },
      bankName: "TBD",
      bankBin: "970436",
      accountNumber: "0000000000",
      accountHolder: "HA PHUONG",
    },
    groom: {
      name: { vi: "Chú rể", en: "Groom" },
      bankName: "TBD",
      bankBin: "970436",
      accountNumber: "0000000000",
      accountHolder: "HOANG MINH",
    },
  } satisfies { bride: BankAccount; groom: BankAccount },
} as const;
