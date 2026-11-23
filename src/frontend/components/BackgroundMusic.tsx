"use client";

import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BACKGROUND_MUSIC_SRC,
  BACKGROUND_MUSIC_VOLUME,
} from "@/shared/content/site-audio";

type Props = {
  /** Set true after the user taps Click me (needed for autoplay). */
  armed: boolean;
  /** True while a video notebook page is showing — bg music volume goes to 0. */
  videoPageActive?: boolean;
};

export function BackgroundMusic({ armed, videoPageActive = false }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);

  const applyVolume = useCallback(
    (el: HTMLAudioElement) => {
      if (muted || videoPageActive) {
        el.volume = 0;
      } else {
        el.volume = BACKGROUND_MUSIC_VOLUME;
      }
    },
    [muted, videoPageActive],
  );

  const tryPlay = useCallback(async () => {
    const el = audioRef.current;
    if (!el) return;
    applyVolume(el);
    el.muted = muted;
    try {
      await el.play();
    } catch {
      /* playing state follows audio element events */
    }
  }, [applyVolume, muted]);

  useEffect(() => {
    if (!armed) return;
    void tryPlay();
  }, [armed, tryPlay]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.muted = muted;
    applyVolume(el);
    if (!muted && armed && !videoPageActive && el.paused) {
      void tryPlay();
    }
  }, [applyVolume, armed, muted, tryPlay, videoPageActive]);

  const toggleMute = useCallback(() => {
    setMuted((m) => !m);
  }, []);

  if (!armed) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={BACKGROUND_MUSIC_SRC}
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        onClick={toggleMute}
        className="bg-music-toggle fixed bottom-5 right-5 z-[90] flex h-11 w-11 items-center justify-center rounded-full shadow-md transition hover:scale-105 active:scale-95"
        aria-label={muted ? "Turn music on" : "Turn music off"}
        aria-pressed={muted}
        title={muted ? "Music off" : "Music on"}
      >
        {muted || !playing ? (
          <SpeakerXMarkIcon className="h-5 w-5 text-ink-muted" />
        ) : (
          <SpeakerWaveIcon className="h-5 w-5 text-pink-deep" />
        )}
      </button>
    </>
  );
}