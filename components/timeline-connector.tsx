"use client";

import { motion, useReducedMotion } from "framer-motion";

/** The vertical line joining two experience entries; grows downward as it scrolls into view. */
export function TimelineConnector() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <span aria-hidden="true" className="absolute bottom-0 left-1.25 top-6 w-px bg-line" />;
  }

  return (
    <motion.span
      aria-hidden="true"
      className="absolute bottom-0 left-1.25 top-6 w-px origin-top bg-line"
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true, margin: "0px 0px -30% 0px" }}
      transition={{ duration: 0.7, ease: [0.21, 0.6, 0.35, 1] }}
    />
  );
}
