"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { OUR_NICKNAMES } from "@/shared/content/concert-videos";

export function NicknamePulse() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % OUR_NICKNAMES.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="inline-flex min-w-[5.5rem] justify-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={OUR_NICKNAMES[index]}
          initial={{ opacity: 0, y: 8, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.92 }}
          transition={{ duration: 0.35 }}
          className="font-semibold text-pink-deep"
        >
          {OUR_NICKNAMES[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}