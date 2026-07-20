"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface TypewriterProps {
  words: string[];
}

const TYPE_SPEED_MS = 55;
const DELETE_SPEED_MS = 30;
const HOLD_MS = 1700;

/** Types and deletes each word in turn; shows the full list as static text for reduced motion. */
export function Typewriter({ words }: TypewriterProps) {
  const reduceMotion = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduceMotion || words.length === 0) return;
    const current = words[wordIndex];

    if (!deleting && charCount === current.length) {
      const timeout = setTimeout(() => setDeleting(true), HOLD_MS);
      return () => clearTimeout(timeout);
    }

    if (deleting && charCount === 0) {
      const timeout = setTimeout(() => {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      }, 0);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(
      () => setCharCount((c) => c + (deleting ? -1 : 1)),
      deleting ? DELETE_SPEED_MS : TYPE_SPEED_MS
    );
    return () => clearTimeout(timeout);
  }, [charCount, deleting, wordIndex, words, reduceMotion]);

  if (reduceMotion || words.length === 0) {
    return <span>{words.join(" · ")}</span>;
  }

  return (
    <span className="inline-flex min-h-[1.4em] items-center">
      <span aria-hidden="true">
        {words[wordIndex].slice(0, charCount)}
        <span className="cursor-blink ml-0.5 inline-block h-[0.9em] w-0.5 translate-y-[0.05em] bg-current align-middle" />
      </span>
      <span className="sr-only">{words.join(" — ")}</span>
    </span>
  );
}
