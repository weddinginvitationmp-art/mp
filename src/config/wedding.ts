/**
 * Single source of truth for couple/event facts.
 * No env vars — these are intentionally public.
 */
export type EventKind =
  | "ceremony"
  | "reception"
  | "an_hoi"
  | "tiec_nha_gai"
  | "vu_quy"
  | "thanh_hon"
  | "tiec_nha_trai";

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
  image: { src: string; alt: { vi: string; en: string } };
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
  position?: string;
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
  date: new Date("2026-07-05T08:00:00+07:00"),
  dateDisplay: { vi: "05 · 07 · 2026", en: "05 · 07 · 2026" },
  city: { vi: "Thái Bình", en: "Thai Binh" },
  venue: { vi: "Nam Định", en: "Nam Dinh" },
  hashtag: "#HaPhuongHoangMinh2026",

  events: [
    {
      kind: "an_hoi",
      start: new Date("2026-07-04T08:30:00+07:00"),
      end: new Date("2026-07-04T10:00:00+07:00"),
      venue: { vi: "Tư gia nhà gái", en: "Bride's Residence" },
      address: { vi: "6/161 Trường Chinh, Nam Định", en: "161 Truong Chinh, Nam Dinh" },
      mapQuery: "161+Truong+Chinh+Nam+Dinh",
    },
    {
      kind: "tiec_nha_gai",
      start: new Date("2026-07-04T10:30:00+07:00"),
      end: new Date("2026-07-04T14:00:00+07:00"),
      venue: { vi: "Lễ vu quy", en: "Bride's Reception" },
      address: { vi: "Khách sạn Sơn Nam - 26 Lê Hồng Phong, phường Nam Định, tỉnh Ninh Bình", en: "Son Nam Hotel - 26 Le Hong Phong, Nam Dinh, Ninh Binh Province" },
      mapQuery: "Son+Nam+Hotel",
    },
    {
      kind: "thanh_hon",
      start: new Date("2026-07-05T08:00:00+07:00"),
      end: new Date("2026-07-05T10:00:00+07:00"),
      venue: { vi: "Tư gia nhà trai", en: "Groom's Residence" },
      address: { vi: "06 ngõ 555 Lý Thái Tổ, phường Trần Hưng Đạo, tỉnh Hưng Yên", en: "06 Ngõ 555 Ly Thai To, Tran Hung Dao Ward, Hung Yen Province" },
      mapQuery: "555+Ly+Thai+To+Hung+Yen",
    },
    {
      kind: "tiec_nha_trai",
      start: new Date("2026-07-05T10:30:00+07:00"),
      end: new Date("2026-07-05T14:00:00+07:00"),
      venue: { vi: "Lễ thành hôn", en: "Wedding Ceremony" },
      address: { vi: "Khách sạn Petro - 458 Lý Bôn, Trần Hưng Đạo, Hưng Yên", en: "Petro Hotel - 458 Ly Bon, Tran Hung Dao, Hung Yen" },
      mapQuery: "Petro+Hotel+Thai+Binh",
    },
  ] satisfies ReadonlyArray<WeddingEvent>,

  story: [
  {
    date: new Date("2018-08-30"),
    title: { vi: "Lần đầu gặp gỡ", en: "First Meeting" },
    body: {
      vi: "Mình đã gặp Phương lần đầu trên giảng đường đại học",
      en: "I first met Phuong on the university campus.",
    },
    image: {
      src: "../../public/media/university-story.jpg",
      alt: { vi: "Kỷ niệm gặp gỡ", en: "First meeting moment" },
    },
  },

  {
    date: new Date("2022-09-20"),
    title: { vi: "Bắt đầu hẹn hò", en: "Officially Dating" },
    body: {
      vi: "Sau một thời gian tìm hiểu, chúng mình quyết định đồng hành cùng nhau. Không có điều gì quá đặc biệt, chỉ là cảm thấy phù hợp và muốn dành nhiều thời gian hơn cho đối phương.",
      en: "After getting to know each other, we decided to start this journey together. Nothing dramatic—just a feeling that we were right for one another.",
    },
    image: {
      src: "../../public/media/story-2.jpg",
      alt: { vi: "Khoảnh khắc hẹn hò", en: "Dating together" },
    },
  },

  {
    date: new Date("2023-08-01"),
    title: { vi: "Cùng xây dựng tổ ấm", en: "Building a Home Together" },
    body: {
      vi: "Chúng mình bước vào cuộc sống của nhau, học cách chia sẻ từ những điều nhỏ nhất trong cuộc sống hằng ngày và dần trở thành một phần quen thuộc của nhau.",
      en: "We moved in together, learning to share everyday moments and becoming an important part of each other's daily life.",
    },
    image: {
      src: "../../public/media/story-1.jpg",
      alt: { vi: "Tổ ấm mới", en: "Building a home" },
    },
  },

  {
    date: new Date("2026-03-14"),
    title: { vi: "Lời cầu hôn", en: "The Proposal" },
    body: {
      vi: "Sau những năm tháng đồng hành, chúng mình quyết định bước sang một chặng đường mới. Một lời hỏi, một lời đồng ý, và một kế hoạch cho tương lai chung.",
      en: "After years of growing together, we decided to take the next step. One question, one answer, and a shared future ahead.",
    },
    image: {
      src: "../../public/media/story-3.jpg",
      alt: { vi: "Lời cầu hôn", en: "The proposal" },
    },
  },

  ] satisfies ReadonlyArray<StoryMilestone>,

  invitation: {
    groomParents: { father: "Ông Nguyễn Xuân Toàn", mother: "Bà Hoàng Thị Hoa" },
    brideParents: { father: "Ông Nguyễn Ngọc Tuấn", mother: "Bà Đào Thị Thu Hà" },
    lunarDate: { vi: "Ngày 20 tháng 5 năm Bính Ngọ", en: "May 20, Year of the Horse" },
    invitationText: {
      vi: "Trân trọng kính mời quý khách đến dự buổi lễ Thành Hôn của con chúng tôi",
      en: "We cordially invite you to the wedding celebration of our children",
    },
  } satisfies InvitationConfig,

  backdropSlides: [
    {
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80",
      quote: { vi: "Tháng năm hạnh phúc.", en: "A time of happiness." },
    },
    {
      image: "https://images.unsplash.com/photo-1525258801-c69ea2d57749?w=1920&q=80",
      quote: { vi: "Hai trái tim, một câu chuyện.", en: "Two hearts, one story." },
    },
    {
      image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1920&q=80",
      quote: { vi: "Bắt đầu từ hôm nay.", en: "Forever starts today." },
    },
  ] satisfies ReadonlyArray<BackdropSlide>,

  album : [
  {
    src: "https://drive.google.com/thumbnail?id=1FsWjndkL-3TtqR1prOJwGP-QvTx9xwL4&sz=w2000",
    width: 1200,
    height: 1600,
    alt: { vi: "Ảnh cưới 1", en: "Wedding Photo 1" },
    position: "40% 10%",
  },
  {
    src: "https://drive.google.com/thumbnail?id=1x0irydiCp4JOA_E10wy2RJ2tRdvFcsb-&sz=w2000",
    width: 1200,
    height: 1600,
    alt: { vi: "Ảnh cưới 2", en: "Wedding Photo 2" },
  },
  {
    src: "https://drive.google.com/thumbnail?id=1MVTpoOfXEAi7UXwNoz6gkxr1DDIrHOZt&sz=w2000",
    width: 1200,
    height: 1600,
    alt: { vi: "Ảnh cưới 3", en: "Wedding Photo 3" },
    position: "40% 40%",
  },
  {
    src: "https://drive.google.com/thumbnail?id=1OiepwcIXfHu2iQPYwDcW76pMuyCX1etI&sz=w2000",
    width: 1200,
    height: 1600,
    alt: { vi: "Ảnh cưới 4", en: "Wedding Photo 4" },
  },
  {
    src: "https://drive.google.com/thumbnail?id=1sCDngxKXOrgxXS97-wXGq1F_48MvMnpb&sz=w2000",
    width: 1200,
    height: 1600,
    alt: { vi: "Ảnh cưới 5", en: "Wedding Photo 5" },
  },
  {
    src: "https://drive.google.com/thumbnail?id=1FdTU0RLKEXzofZT_Fg4uc8qoJllt2NNp&sz=w2000",
    width: 1200,
    height: 1600,
    alt: { vi: "Ảnh cưới 6", en: "Wedding Photo 6" },
  },
  {
    src: "https://drive.google.com/thumbnail?id=19mqRW_pd5nofaFfC0y-Ub0VS3XMsOO8_&sz=w2000",
    width: 1200,
    height: 1600,
    alt: { vi: "Ảnh cưới 7", en: "Wedding Photo 7" },
    position: "40% 30%",
  },
  {
    src: "https://drive.google.com/thumbnail?id=1hVBlJH7xtZCf1Fm972Q2D7XjnjaCZXwJ&sz=w2000",
    width: 1200,
    height: 1600,
    alt: { vi: "Ảnh cưới 8", en: "Wedding Photo 8" },
    position: "40% 30%",
  },
  {
    src: "https://drive.google.com/thumbnail?id=16NpN16y8jGL5Yr8Hied09wolNGbwXoBp&sz=w2000",
    width: 1200,
    height: 1600,
    alt: { vi: "Ảnh cưới 9", en: "Wedding Photo 9" },
    position: "50% 10%",
  },
  {
    src: "https://drive.google.com/thumbnail?id=1DYY0o-xNofyXZEVXCzHJ3mlCwXclO09C&sz=w2000",
    width: 1200,
    height: 1600,
    alt: { vi: "Ảnh cưới 10", en: "Wedding Photo 10" },
    position: "50% 10%",
  },
  {
    src: "https://drive.google.com/thumbnail?id=1Z5mAVVLKSzJsAhcZIKnAlFFwE0ZARYw5&sz=w2000",
    width: 1200,
    height: 1600,
    alt: { vi: "Ảnh cưới 11", en: "Wedding Photo 11" },
    position: "50% 10%",
  },
  {
    src: "https://drive.google.com/thumbnail?id=1XViA8457g6PSdng65y9F0dGr5af42dNB&sz=w2000",
    width: 1200,
    height: 1600,
    alt: { vi: "Ảnh cưới 12", en: "Wedding Photo 12" },
    position: "50% 10%",
  },
] satisfies ReadonlyArray<AlbumPhoto>,

  weddingVideo: {
    youtubeId: "dQw4w9WgXcQ",
    posterImage: "../../public/media/story-4.jpg",
  } satisfies WeddingVideo,
  
  gift: {
    bride: {
      name: { vi: "Cô dâu", en: "Bride" },
      bankName: "BIDV",
      bankBin: "970418",
      accountNumber: "2225398840",
      accountHolder: "NGUYEN HA PHUONG",
    },
    groom: {
      name: { vi: "Chú rể", en: "Groom" },
      bankName: "VIETCOMBANK",
      bankBin: "970436",
      accountNumber: "1024046233",
      accountHolder: "NGUYEN HOANG MINH",
    },
  } satisfies { bride: BankAccount; groom: BankAccount },
} as const;
