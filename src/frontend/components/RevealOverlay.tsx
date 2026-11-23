"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import { BirthdayScenery } from "./BirthdayScenery";

type Props = {
  onRevealed: () => void;
  onInteract?: () => void;
};

const FEATHERS = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  angle: (i / 32) * 360 + (i % 3) * 8,
  dist: 120 + (i % 5) * 40,
  delay: (i % 8) * 0.02,
  w: 8 + (i % 4) * 3,
  h: 22 + (i % 5) * 4,
  color: i % 3 === 0 ? "#f9a8d4" : i % 3 === 1 ? "#7dd3fc" : "#fffef9",
}));

const RINGS = [0, 1, 2, 3, 4];

export function RevealOverlay({ onRevealed, onInteract }: Props) {
  const [phase, setPhase] = useState<"idle" | "burst">("idle");

  const startBurst = useCallback(() => {
    if (phase !== "idle") return;
    onInteract?.();
    setPhase("burst");
  }, [onInteract, phase]);

  const handleBurstComplete = useCallback(() => {
    if (phase === "burst") onRevealed();
  }, [phase, onRevealed]);

  return (
    <motion.div
      className="reveal-overlay fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1, clipPath: "circle(150% at 50% 50%)" }}
      animate={
        phase === "burst"
          ? {
              clipPath: [
                "circle(150% at 50% 50%)",
                "circle(150% at 50% 50%)",
                "circle(0% at 50% 50%)",
              ],
            }
          : { clipPath: "circle(150% at 50% 50%)" }
      }
      transition={
        phase === "burst"
          ? { duration: 2.5, times: [0, 0.58, 1], ease: "easeInOut" }
          : undefined
      }
      onAnimationComplete={handleBurstComplete}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <BirthdayScenery />

      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span
          key={`mote-${i}`}
          className="absolute rounded-full"
          style={{
            top: `${(i * 37) % 100}%`,
            left: `${(i * 31 + 9) % 100}%`,
            width: 5 + (i % 3),
            height: 5 + (i % 3),
            background: i % 2 === 0 ? "var(--color-pink)" : "var(--color-sky)",
          }}
          animate={{
            opacity: [0.15, 0.55, 0.15],
            scale: [0.7, 1.15, 0.7],
          }}
          transition={{
            duration: 2.5 + (i % 4) * 0.4,
            repeat: Infinity,
            delay: i * 0.12,
          }}
        />
      ))}

      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div
            key="click-layer"
            className="relative z-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, filter: "blur(8px)" }}
            transition={{ duration: 0.35 }}
          >
            <motion.button
              type="button"
              onClick={startBurst}
              className="reveal-click-me relative rounded-full px-12 py-5 text-lg font-bold tracking-wide outline-none focus-visible:ring-4 focus-visible:ring-pink/40"
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 8px 28px rgba(236,72,153,0.22), 0 4px 14px rgba(56,189,248,0.15)",
                  "0 12px 36px rgba(236,72,153,0.32), 0 6px 20px rgba(56,189,248,0.22)",
                  "0 8px 28px rgba(236,72,153,0.22), 0 4px 14px rgba(56,189,248,0.15)",
                ],
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
            >
              Click me
              <motion.span
                className="pointer-events-none absolute inset-0 rounded-full border border-pink-deep/25"
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "burst" && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          <motion.div
            className="absolute h-[120vmax] w-[120vmax] rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, transparent, rgba(249,168,212,0.25), transparent, rgba(125,211,252,0.3), transparent, rgba(255,247,251,0.4), transparent)",
            }}
            initial={{ rotate: 0, scale: 0.2, opacity: 0 }}
            animate={{ rotate: 420, scale: 1, opacity: [0, 1, 0.7, 0] }}
            transition={{ duration: 2.4, ease: "easeOut" }}
          />

          {RINGS.map((ring) => (
            <motion.span
              key={ring}
              className="absolute rounded-full border-2"
              style={{
                borderColor: ring % 2 === 0 ? "rgba(236,72,153,0.55)" : "rgba(56,189,248,0.5)",
                boxShadow:
                  "0 0 24px rgba(249,168,212,0.45), inset 0 0 16px rgba(125,211,252,0.25)",
              }}
              initial={{ width: 0, height: 0, opacity: 0.9 }}
              animate={{
                width: [0, 120 + ring * 180, 800 + ring * 120],
                height: [0, 120 + ring * 180, 800 + ring * 120],
                opacity: [0.9, 0.6, 0],
                borderWidth: [4, 2, 0],
              }}
              transition={{
                duration: 2.2,
                delay: ring * 0.12,
                ease: [0.2, 0.8, 0.2, 1],
              }}
            />
          ))}

          {FEATHERS.map((f) => {
            const rad = (f.angle * Math.PI) / 180;
            const tx = Math.cos(rad) * f.dist;
            const ty = Math.sin(rad) * f.dist;
            return (
              <motion.span
                key={f.id}
                className="absolute rounded-full shadow-md"
                style={{
                  width: f.w,
                  height: f.h,
                  backgroundColor: f.color,
                  borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                }}
                initial={{ x: 0, y: 0, rotate: f.angle, opacity: 0, scale: 0.3 }}
                animate={{
                  x: [0, tx * 0.3, tx * 2.8],
                  y: [0, ty * 0.3, ty * 2.8],
                  rotate: [f.angle, f.angle + 180, f.angle + 720],
                  opacity: [0, 1, 0.8, 0],
                  scale: [0.3, 1.2, 0.6],
                }}
                transition={{
                  duration: 2.1,
                  delay: 0.15 + f.delay,
                  ease: [0.15, 1, 0.35, 1],
                }}
              />
            );
          })}

          <motion.div
            className="absolute h-32 w-32 rounded-full bg-[#fffef9]"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 2.5, 6],
              opacity: [0, 0.95, 0],
            }}
            transition={{ duration: 0.55, delay: 0.05, ease: "easeOut" }}
            style={{ filter: "blur(8px)" }}
          />

          <motion.div
            className="absolute inset-0 bg-[#fff7fb]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.85, 0] }}
            transition={{ duration: 0.35, delay: 0.12 }}
          />
        </div>
      )}
    </motion.div>
  );
}