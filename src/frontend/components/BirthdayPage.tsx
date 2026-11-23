"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { concertVideos } from "@/shared/content/concert-videos";
import { BackgroundMusic } from "./BackgroundMusic";
import { BirthdayScenery } from "./BirthdayScenery";
import { Notebook } from "./Notebook";
import { RevealOverlay } from "./RevealOverlay";

export function BirthdayPage() {
  const [revealed, setRevealed] = useState(false);
  const [musicArmed, setMusicArmed] = useState(false);
  const [videoPageActive, setVideoPageActive] = useState(false);

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden">
      <BirthdayScenery />
      <BackgroundMusic armed={musicArmed} videoPageActive={videoPageActive} />

      <AnimatePresence>
        {!revealed && (
          <RevealOverlay
            onRevealed={() => setRevealed(true)}
            onInteract={() => setMusicArmed(true)}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="relative z-10"
        initial={false}
        animate={{
          opacity: revealed ? 1 : 0,
          pointerEvents: revealed ? "auto" : "none",
        }}
        transition={{ duration: 0.5 }}
      >
        {revealed && (
          <Notebook videos={concertVideos} onVideoPageActive={setVideoPageActive} />
        )}
      </motion.div>
    </div>
  );
}