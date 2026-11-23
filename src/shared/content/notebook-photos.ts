export type NotebookPhoto = {
  src: string;
  alt: string;
};

export type PhotoSpread = {
  id: string;
  layout: "single" | "duo" | "quad";
  images: NotebookPhoto[];
  title?: string;
  caption?: string;
};

/** Photo pages — files live in `public/images/`. */
export const photoSpreads: PhotoSpread[] = [
  {
    id: "arena-night",
    layout: "quad",
    title: "That night",
    caption:
      "Inside the lights, outside in the air — same grin, same us. I’d relive every second.",
    images: [
      { src: "/images/inside_arena.jpg", alt: "Inside the arena" },
      { src: "/images/outside_arena.jpg", alt: "Outside the arena" },
      { src: "/images/outside_arena_2.jpg", alt: "Outside the venue" },
      { src: "/images/outside_arena_3.jpg", alt: "Another moment outside" },
    ],
  },
  {
    id: "us",
    layout: "single",
    title: "Us",
    caption: "Not a perfect pose — just us. That’s the frame I’d pick every time.",
    images: [{ src: "/images/us.jpg", alt: "Us together" }],
  },
  {
    id: "flowers",
    layout: "duo",
    title: "Flowers & you",
    caption: "Your favorites, and you holding them like the world could wait.",
    images: [
      { src: "/images/her_favorite_flowers.jpg", alt: "Her favorite flowers" },
      { src: "/images/her_with_flowers.jpg", alt: "Her with flowers" },
    ],
  },
  {
    id: "best-version",
    layout: "single",
    title: "The best version",
    images: [{ src: "/images/best_version.jpg", alt: "Best version of you" }],
    caption: "This one stopped me in my tracks.",
  },
];