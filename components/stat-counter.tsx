"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";

interface StatCounterProps {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/** Counts up from 0 to `target` once scrolled into view; jumps straight to the value for reduced motion. */
export function StatCounter({ target, decimals = 0, prefix = "", suffix = "", className }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(0);
  const formatted = useTransform(count, (v) => `${prefix}${v.toFixed(decimals)}${suffix}`);

  useEffect(() => {
    if (reduceMotion) {
      count.set(target);
      return;
    }
    if (isInView) {
      const controls = animate(count, target, { duration: 1.4, ease: [0.16, 1, 0.3, 1] });
      return () => controls.stop();
    }
  }, [isInView, reduceMotion, count, target]);

  return (
    <motion.span ref={ref} className={className}>
      {formatted}
    </motion.span>
  );
}
