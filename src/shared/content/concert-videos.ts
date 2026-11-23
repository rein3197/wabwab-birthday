export type ConcertVideo = {
  id: string;
  title: string;
  caption: string;
  /** Path under /public — drop your file in public/videos/ */
  src: string;
};

/**
 * Add your clips here after copying them into `public/videos/`.
 * Example: copy `portrait1.mp4` → set src to `/videos/portrait1.mp4`
 */
export const concertVideos: ConcertVideo[] = [
  {
    id: "portrait-1",
    title: "That smile first",
    caption: "The second I saw you — I already knew it was your night.",
    src: "/videos/portrait1.mp4",
  },
  {
    id: "portrait-2",
    title: "Lost in the music",
    caption: "You weren’t just in the crowd. You were the whole song.",
    src: "/videos/portrait2.mp4",
  },
  {
    id: "portrait-3",
    title: "Every lyric, you",
    caption: "You sang like you wrote them. I couldn’t stop watching.",
    src: "/videos/portrait3.mp4",
  },
  {
    id: "portrait-5",
    title: "Dancing with you",
    caption: "My favorite kind of chaos — you laughing, us swaying.",
    src: "/videos/portrait5.mp4",
  },
  {
    id: "portrait-4",
    title: "One I’ll keep",
    caption: "Still my favorite clip of you. Happy birthday, WAWAB.",
    src: "/videos/portrait4.mp4",
  },
];

export const HER_NAME = "Jessica";
/** Main hero name — how you want it on the big headline */
export const BIRTHDAY_DISPLAY_NAME = "WAWAB";
export const COUPLE_NAME = "wawab";
export const OUR_NICKNAMES = ["wawab", "bb", "wamby"] as const;