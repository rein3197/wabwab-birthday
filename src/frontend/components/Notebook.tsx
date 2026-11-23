"use client";

import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  BIRTHDAY_DISPLAY_NAME,
  COUPLE_NAME,
  HER_NAME,
  type ConcertVideo,
} from "@/shared/content/concert-videos";
import { photoSpreads, type PhotoSpread } from "@/shared/content/notebook-photos";
import { VIDEO_VOLUME } from "@/shared/content/site-audio";
import { NicknamePulse } from "./NicknamePulse";

type Props = {
  videos: ConcertVideo[];
  onVideoPageActive?: (active: boolean) => void;
};

const FLIP_COMMIT = 0.32;
const FLIP_DURATION = 0.58;
const DRAG_RANGE_MULTIPLIER = 1.85;

function isInteractiveTarget(target: EventTarget | null) {
  return Boolean(
    target &&
      (target as HTMLElement).closest(
        "button, a, video, input, textarea, select, [data-interactive]",
      ),
  );
}

export function Notebook({ videos, onVideoPageActive }: Props) {
  const [page, setPage] = useState(0);
  const [peek, setPeek] = useState(0);
  const [origin, setOrigin] = useState<"left center" | "right center">("left center");
  const [isDragging, setIsDragging] = useState(false);
  const [flipFrozenPage, setFlipFrozenPage] = useState<number | null>(null);
  const flipAnim = useRef<ReturnType<typeof animate> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(360);
  const dragX = useMotionValue(0);

  const pointerId = useRef<number | null>(null);
  const startClientX = useRef(0);
  const startOffsetX = useRef(0);

  const photoPageOffset = videos.length + 1;
  const letterPageIndex = 1 + videos.length + photoSpreads.length;
  const totalPages = letterPageIndex + 1;

  const pageKind = useCallback(
    (index: number) => {
      if (index === 0) return "cover" as const;
      if (index >= 1 && index <= videos.length) return "video" as const;
      if (index >= photoPageOffset && index < photoPageOffset + photoSpreads.length) {
        return "photo" as const;
      }
      if (index === letterPageIndex) return "letter" as const;
      return "cover" as const;
    },
    [letterPageIndex, photoPageOffset, videos.length],
  );

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth || 360);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const dragRange = width * DRAG_RANGE_MULTIPLIER;
  const rotateY = useTransform(dragX, (x) => {
    const progress = x / dragRange;
    return Math.max(-180, Math.min(180, progress * 180));
  });
  const shadowOpacity = useTransform(dragX, (x) => {
    const range = width * DRAG_RANGE_MULTIPLIER;
    return Math.min(0.45, (Math.abs(x) / range) * 0.5);
  });
  const lifting = useTransform(dragX, (x) => {
    const range = width * DRAG_RANGE_MULTIPLIER;
    return 1 + (Math.abs(x) / range) * 0.015;
  });

  const renderPage = useCallback(
    (index: number) => {
      const kind = pageKind(index);
      if (kind === "cover") return <CoverPage />;
      if (kind === "video") {
        return <VideoPageShell video={videos[index - 1]} />;
      }
      if (kind === "photo") {
        const spread = photoSpreads[index - photoPageOffset];
        return <PhotoSpreadPage spread={spread} />;
      }
      if (kind === "letter") return <LetterPage />;
      return null;
    },
    [pageKind, photoPageOffset, videos],
  );

  const clampDrag = useCallback(
    (x: number) => {
      if (page === 0) return Math.min(0, x);
      if (page === totalPages - 1) return Math.max(0, x);
      const limit = width * DRAG_RANGE_MULTIPLIER;
      return Math.max(-limit, Math.min(limit, x));
    },
    [page, totalPages, width],
  );

  const updatePeek = useCallback(
    (x: number) => {
      if (x < -8 && page < totalPages - 1) {
        setPeek(page + 1);
        setOrigin("left center");
      } else if (x > 8 && page > 0) {
        setPeek(page - 1);
        setOrigin("right center");
      } else {
        setPeek(page);
      }
    },
    [page, totalPages],
  );

  const finishFlip = useCallback(
    (targetX: number, nextPage: number) => {
      flipAnim.current?.stop();
      setFlipFrozenPage(page);
      setPage(nextPage);
      setPeek(nextPage);
      flipAnim.current = animate(dragX, targetX, {
        duration: FLIP_DURATION,
        ease: [0.33, 0.02, 0.12, 1],
      });
      void flipAnim.current.then(() => {
        dragX.set(0);
        setFlipFrozenPage(null);
        flipAnim.current = null;
      });
    },
    [dragX, page],
  );

  const releaseFlip = useCallback(
    (x: number, velocityX: number) => {
      const range = width * DRAG_RANGE_MULTIPLIER;
      const progress = Math.abs(x) / range;
      const next =
        (x < 0 && (progress > FLIP_COMMIT || velocityX < -220)) ||
        (velocityX < -300 && x < -24);
      const prev =
        (x > 0 && (progress > FLIP_COMMIT || velocityX > 220)) ||
        (velocityX > 300 && x > 24);

      if (next && page < totalPages - 1) {
        finishFlip(-range, page + 1);
        return;
      }
      if (prev && page > 0) {
        finishFlip(range, page - 1);
        return;
      }

      animate(dragX, 0, {
        type: "spring",
        stiffness: 200,
        damping: 28,
        mass: 1.05,
      });
      setPeek(page);
    },
    [dragX, finishFlip, page, totalPages, width],
  );

  const lastMoveX = useRef(0);
  const lastMoveTime = useRef(0);
  const velocityX = useRef(0);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isInteractiveTarget(e.target)) return;
      if (flipAnim.current) {
        flipAnim.current.stop();
        flipAnim.current = null;
        dragX.set(0);
        setFlipFrozenPage(null);
      }
      pointerId.current = e.pointerId;
      setIsDragging(true);
      startClientX.current = e.clientX;
      startOffsetX.current = dragX.get();
      lastMoveX.current = e.clientX;
      lastMoveTime.current = performance.now();
      velocityX.current = 0;
      flipRef.current?.setPointerCapture(e.pointerId);
    },
    [dragX],
  );

  const flipSheetPage = flipFrozenPage ?? page;

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (pointerId.current !== e.pointerId) return;
      const now = performance.now();
      const dt = now - lastMoveTime.current;
      if (dt > 0) {
        velocityX.current = ((e.clientX - lastMoveX.current) / dt) * 1000;
      }
      lastMoveX.current = e.clientX;
      lastMoveTime.current = now;

      const dx = e.clientX - startClientX.current;
      const x = clampDrag(startOffsetX.current + dx);
      dragX.set(x);
      updatePeek(x);
    },
    [clampDrag, dragX, updatePeek],
  );

  const endDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (pointerId.current !== e.pointerId) return;
      pointerId.current = null;
      setIsDragging(false);
      flipRef.current?.releasePointerCapture(e.pointerId);
      releaseFlip(dragX.get(), velocityX.current);
    },
    [dragX, releaseFlip],
  );

  const onPointerCancel = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (pointerId.current !== e.pointerId) return;
      pointerId.current = null;
      setIsDragging(false);
      animate(dragX, 0, { type: "spring", stiffness: 280, damping: 32 });
      setPeek(page);
    },
    [dragX, page],
  );

  const isPeeking = peek !== page;
  const isVideoPage = (index: number) => pageKind(index) === "video";
  const activeVideoIndex = isPeeking
    ? isVideoPage(peek)
      ? peek - 1
      : -1
    : isVideoPage(page)
      ? page - 1
      : -1;

  const sharedVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = sharedVideoRef.current;
    if (!el) return;
    if (activeVideoIndex < 0) {
      el.pause();
      return;
    }
    el.volume = VIDEO_VOLUME;
    void el.play().catch(() => {});
  }, [activeVideoIndex]);

  useEffect(() => {
    onVideoPageActive?.(activeVideoIndex >= 0);
  }, [activeVideoIndex, onVideoPageActive]);

  return (
    <div className="journal-stage flex min-h-[100dvh] items-center justify-center px-4 py-8 sm:px-6">
      <motion.div
        className="journal-book w-full max-w-lg"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          ref={containerRef}
          className="journal-pages journal-flip-host relative overflow-hidden"
        >
          <p className="journal-page-mark" aria-live="polite">
            {page + 1} / {totalPages}
          </p>

          <div className="absolute inset-0 z-0 journal-page-sheet">
            {renderPage(isPeeking ? peek : page)}
          </div>

          <motion.div
            ref={flipRef}
            className={`journal-page-sheet flip-page absolute inset-0 z-10 select-none ${isDragging ? "flip-page--dragging" : ""}`}
            style={{
              rotateY,
              scale: lifting,
              transformOrigin: origin,
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={onPointerCancel}
          >
            <div className="journal-page-content">{renderPage(flipSheetPage)}</div>
            <PageFoldShadow opacity={shadowOpacity} origin={origin} />
          </motion.div>

          <AnimatePresence>
            {activeVideoIndex >= 0 && (
              <motion.div
                key={videos[activeVideoIndex].id}
                className="notebook-video-stack pointer-events-none absolute inset-0 z-[20] flex items-center justify-center px-4 py-6 sm:px-6"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <article className="memory-card pointer-events-auto w-full max-w-[17rem] overflow-hidden">
                  <video
                    ref={sharedVideoRef}
                    data-interactive
                    className="video-inline aspect-[3/4] w-full bg-gradient-to-br from-sky-soft to-pink-soft object-cover"
                    src={videos[activeVideoIndex].src}
                    controls
                    playsInline
                  preload="auto"
                />
                  <div className="bg-white px-4 py-3 ring-1 ring-pink/15">
                    <p className="font-display text-xl font-semibold text-ink">
                      {videos[activeVideoIndex].title}
                    </p>
                    <p className="mt-1 text-sm text-ink-muted">
                      {videos[activeVideoIndex].caption}
                    </p>
                  </div>
                </article>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function PageFoldShadow({
  opacity,
  origin,
}: {
  opacity: MotionValue<number>;
  origin: "left center" | "right center";
}) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        opacity,
        background:
          origin === "left center"
            ? "linear-gradient(to right, rgba(236,72,153,0.22), transparent 48%)"
            : "linear-gradient(to left, rgba(56,189,248,0.2), transparent 48%)",
      }}
    />
  );
}

function CoverPage() {
  return (
    <div className="flex h-full min-h-[28rem] flex-col items-center justify-center px-6 py-10 text-center">
      <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
        <span className="sky-pink-gradient-text shimmer-text">Happy Birthday</span>
        <br />
        <span className="text-ink">{BIRTHDAY_DISPLAY_NAME}</span>
      </h1>
      <p className="mt-6 max-w-sm text-base leading-relaxed text-ink-muted sm:text-lg">
        A little book of moments I couldn&apos;t stop smiling about.
      </p>
    </div>
  );
}

/** Placeholder under the flip — real video is the single shared player above. */
function PhotoSpreadPage({ spread }: { spread: PhotoSpread }) {
  const isQuad = spread.layout === "quad";
  return (
    <div
      className={
        isQuad
          ? "pointer-events-none flex h-full min-h-0 touch-none select-none flex-col items-center justify-start gap-2 overflow-hidden px-3 pb-4 pt-6 sm:px-5"
          : "pointer-events-none flex h-full min-h-[28rem] touch-none select-none flex-col items-center justify-center px-4 py-6 sm:px-6"
      }
    >
      {spread.title && (
        <p
          className={`text-center font-display font-semibold text-ink ${isQuad ? "shrink-0 text-lg sm:text-xl" : "mb-4 text-xl sm:text-2xl"}`}
        >
          {spread.title}
        </p>
      )}
      {isQuad ? (
        <div className="grid w-full max-w-[15rem] shrink-0 grid-cols-2 gap-1.5 sm:gap-2">
          {spread.images.map((img) => (
            <figure key={img.src} className="memory-card overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full object-cover"
              />
            </figure>
          ))}
        </div>
      ) : spread.layout === "duo" ? (
        <div className="grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4">
          {spread.images.map((img, i) => (
            <figure
              key={img.src}
              className={`memory-card photo-tilt-${i} overflow-hidden ${i === 0 ? "-rotate-2" : "rotate-2"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                className="aspect-[3/4] w-full object-cover"
              />
            </figure>
          ))}
        </div>
      ) : (
        <figure className="memory-card w-full max-w-[17rem] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={spread.images[0].src}
            alt={spread.images[0].alt}
            className="aspect-[3/4] w-full object-cover"
          />
        </figure>
      )}
      {spread.caption && (
        <p
          className={`shrink-0 text-center text-ink-muted ${isQuad ? "max-w-[16rem] px-1 text-xs leading-snug sm:text-sm" : "mt-4 max-w-xs text-sm sm:max-w-sm sm:text-base"}`}
        >
          {spread.caption}
        </p>
      )}
    </div>
  );
}

function VideoPageShell({ video }: { video: ConcertVideo }) {
  return (
    <div className="flex h-full min-h-[28rem] flex-col items-center justify-center px-4 py-6 sm:px-6" aria-hidden>
      <article className="memory-card w-full max-w-[17rem] overflow-hidden opacity-0">
        <div className="aspect-[3/4] w-full bg-gradient-to-br from-sky-soft to-pink-soft" />
        <div className="bg-white px-4 py-3">
          <p className="font-display text-xl font-semibold text-ink">{video.title}</p>
        </div>
      </article>
    </div>
  );
}

function LetterPage() {
  return (
    <div className="flex h-full min-h-[28rem] flex-col justify-center px-7 py-10 sm:px-10">
      <p className="font-display text-2xl font-semibold text-ink sm:text-3xl">For {HER_NAME}</p>
      <p className="mt-1 font-display text-lg text-pink-deep">Love, {COUPLE_NAME}</p>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-muted sm:text-base">
        <p>
          Happy birthday, my love. I still think about that night — you laughing, singing back every
          line, dancing like the whole room was just for us.
        </p>
        <p>
          You make ordinary days feel like something out of a song. I&apos;m grateful for you, proud
          of you, and so excited to celebrate you today and every day after.
        </p>
        <p className="font-medium text-pink-deep">
          — always, <NicknamePulse />
        </p>
      </div>
      <p className="mt-8 text-center text-3xl text-pink-deep/80" aria-hidden>
        ♥
      </p>
    </div>
  );
}