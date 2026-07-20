"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/** Thin fixed bar at the very top of the viewport tracking scroll position. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: reduceMotion ? 1000 : 300,
    damping: reduceMotion ? 100 : 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.75 origin-left bg-accent"
    />
  );
}
