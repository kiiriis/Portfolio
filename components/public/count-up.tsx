"use client";

import * as React from "react";
import { animate, useInView } from "framer-motion";

/**
 * Animates the numeric part of a stat string ("526K", "1.2 TB", "50+")
 * from 0 to its value when scrolled into view. Non-numeric values render as-is.
 */
export function CountUp({
  value,
  duration = 1.8,
}: {
  value: string;
  duration?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const match = value.match(/^([^\d]*)([\d.]+)(.*)$/);

  React.useEffect(() => {
    if (!inView || !match || !ref.current) return;
    const target = parseFloat(match[2]);
    const decimals = (match[2].split(".")[1] ?? "").length;
    const node = ref.current;
    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = `${match[1]}${v.toFixed(decimals)}${match[3]}`;
      },
    });
    return () => controls.stop();
  }, [inView, duration]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!match) return <span>{value}</span>;
  return (
    <span ref={ref}>
      {match[1]}0{match[3]}
    </span>
  );
}
