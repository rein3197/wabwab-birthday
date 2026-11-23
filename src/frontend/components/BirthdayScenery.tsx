"use client";

import { motion } from "framer-motion";
import { BalloonGraphic } from "@/shared/balloon-graphic";
import { RibbonGraphic } from "@/shared/ribbon-graphic";
import { TulipGraphic } from "@/shared/tulip-graphic";

function Tulip({
  className,
  scale = 1,
  flip = false,
  delay = 0,
}: {
  className?: string;
  scale?: number;
  flip?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      className={`pointer-events-none absolute ${className ?? ""}`}
      style={{ scale, scaleX: flip ? -1 : 1 }}
      animate={{ rotate: [-2.5, 2.5, -2.5], y: [0, -6, 0] }}
      transition={{ duration: 4.5 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      aria-hidden
    >
      <TulipGraphic
        width={72}
        height={72}
        gradientId={`tulip-${delay}`}
        className="drop-shadow-sm"
      />
    </motion.div>
  );
}

function Balloon({
  color,
  className,
  delay = 0,
}: {
  color: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`pointer-events-none absolute ${className ?? ""}`}
      animate={{ y: [0, -14, 0], x: [0, 4, 0] }}
      transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      aria-hidden
    >
      <BalloonGraphic width={52} height={52} color={color} className="drop-shadow-sm" />
    </motion.div>
  );
}

const CONFETTI = [
  { top: "12%", left: "18%", rotate: 12, color: "#f9a8d4" },
  { top: "8%", left: "72%", rotate: -18, color: "#7dd3fc" },
  { top: "78%", left: "8%", rotate: 45, color: "#ec4899" },
  { top: "85%", left: "88%", rotate: -30, color: "#38bdf8" },
  { top: "42%", left: "4%", rotate: 8, color: "#fbcfe8" },
  { top: "38%", left: "94%", rotate: -12, color: "#bae6fd" },
  { top: "22%", left: "48%", rotate: 22, color: "#f472b6" },
  { top: "68%", left: "22%", rotate: -8, color: "#7dd3fc" },
  { top: "62%", left: "78%", rotate: 15, color: "#f9a8d4" },
];

export function BirthdayScenery() {
  return (
    <div className="birthday-scenery pointer-events-none fixed inset-0 z-[5] overflow-hidden" aria-hidden>
      {CONFETTI.map((c, i) => (
        <motion.span
          key={i}
          className="confetti-piece absolute h-2 w-3 rounded-sm"
          style={{
            top: c.top,
            left: c.left,
            backgroundColor: c.color,
            rotate: c.rotate,
          }}
          animate={{
            y: [0, i % 2 === 0 ? 8 : -8, 0],
            opacity: [0.5, 0.9, 0.5],
          }}
          transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.15 }}
        />
      ))}

      <Tulip className="left-[2%] bottom-[6%] sm:left-[5%]" scale={1.15} delay={0} />
      <Tulip className="right-[3%] bottom-[10%] sm:right-[6%]" scale={1} flip delay={0.4} />
      <Tulip className="left-[4%] top-[14%] hidden sm:block" scale={0.85} flip delay={0.8} />
      <Tulip className="right-[5%] top-[18%] hidden sm:block" scale={0.9} delay={1.1} />

      <Balloon color="#f9a8d4" className="left-[10%] top-[8%]" delay={0.2} />
      <Balloon color="#7dd3fc" className="right-[12%] top-[12%]" delay={0.6} />
      <Balloon color="#ec4899" className="left-[6%] top-[55%] hidden md:block" delay={1} />
      <Balloon color="#38bdf8" className="right-[8%] top-[48%] hidden md:block" delay={0.3} />

      <motion.div
        className="absolute left-[2%] top-[40%] hidden opacity-55 sm:block"
        animate={{ rotate: [-6, 6, -6] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <RibbonGraphic width={64} height={64} color="#f9a8d4" accent="#ec4899" className="drop-shadow-sm" />
      </motion.div>
      <motion.div
        className="absolute right-[2%] top-[34%] hidden opacity-50 sm:block"
        animate={{ rotate: [6, -6, 6] }}
        transition={{ duration: 5.5, repeat: Infinity, delay: 0.5 }}
      >
        <RibbonGraphic width={56} height={56} color="#bae6fd" accent="#38bdf8" className="drop-shadow-sm" />
      </motion.div>

      <motion.span
        className="absolute bottom-[18%] left-[14%] text-2xl opacity-40 sm:text-3xl"
        animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        🎂
      </motion.span>
      <motion.span
        className="absolute bottom-[22%] right-[16%] text-xl opacity-40 sm:text-2xl"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 0.7 }}
      >
        ✨
      </motion.span>
      <motion.span
        className="absolute left-[42%] top-[4%] text-lg opacity-35 sm:text-xl"
        animate={{ opacity: [0.25, 0.65, 0.25] }}
        transition={{ duration: 2.8, repeat: Infinity }}
      >
        ✨
      </motion.span>
      <motion.span
        className="absolute right-[38%] bottom-[8%] text-lg opacity-35 sm:text-xl"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3.2, repeat: Infinity, delay: 0.4 }}
      >
        ♥
      </motion.span>

      <div className="birthday-glow absolute left-1/2 top-1/2 h-[min(90vw,32rem)] w-[min(90vw,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-full" />
    </div>
  );
}