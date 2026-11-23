"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";

type Props = {
  onRevealed: () => void;
  onInteract?: () => void;
};

export function RevealOverlay({ onRevealed, onInteract }: Props) {
  const [phase, setPhase] = useState<"idle" | "burst">("idle");

  const startBurst = useCallback(() => {
    if (phase !== "idle") return;
    onInteract?.();
    setPhase("burst");
  }, [onInteract, phase]);

  const handleClipDone = useCallback(() => {
    if (phase === "burst") onRevealed();
  }, [phase, onRevealed]);

  return (
    <motion.div
      className="reveal-overlay fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ clipPath: "circle(150% at 50% 50%)" }}
        animate={
          phase === "burst"
            ? { clipPath: "circle(0% at 50% 50%)" }
            : { clipPath: "circle(150% at 50% 50%)" }
        }
        transition={{ duration: 0.75, ease: [0.33, 0.02, 0.12, 1] }}
        onAnimationComplete={() => {
          if (phase === "burst") handleClipDone();
        }}
        style={{ background: "var(--reveal-overlay-bg, linear-gradient(145deg, #fce7f3, #e0f2fe))" }}
      />

      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div
            key="click-layer"
            className="relative z-20"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
          >
            <motion.button
              type="button"
              onClick={startBurst}
              className="reveal-click-me relative rounded-full px-12 py-5 text-lg font-bold tracking-wide outline-none focus-visible:ring-4 focus-visible:ring-pink/40"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
            >
              Click me
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "burst" && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 bg-[#fffef9]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      )}
    </motion.div>
  );
}