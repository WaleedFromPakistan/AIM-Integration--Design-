"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function parseCounterValue(value) {
  const raw = String(value ?? "0");
  const match = raw.match(/-?\d+/);
  if (!match) {
    return { prefix: "", target: 0, suffix: raw };
  }
  const numberText = match[0];
  const startIndex = match.index ?? 0;
  const endIndex = startIndex + numberText.length;
  return {
    prefix: raw.slice(0, startIndex),
    target: Number.parseInt(numberText, 10) || 0,
    suffix: raw.slice(endIndex),
  };
}

export default function StatCounter({ value, start }) {
  const { prefix, target, suffix } = useMemo(
    () => parseCounterValue(value),
    [value],
  );
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!start || hasAnimated.current) return;
    hasAnimated.current = true;

    if (typeof window !== "undefined") {
      const reduceMotion = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)",
      )?.matches;
      if (reduceMotion) {
        setCount(target);
        return;
      }
    }

    const durationMs = 1450;
    const startedAt = performance.now();
    let rafId = 0;

    const tick = (now) => {
      const t = Math.min((now - startedAt) / durationMs, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(target * eased));
      if (t < 1) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [start, target]);

  return (
    <span>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}
