"use client";

import { useState, useEffect } from "react";
import GradualBlur from "./GradualBlur";

/**
 * PageBlur — fixed bottom blur overlay.
 * Automatically hides when the footer enters the viewport so it
 * never covers footer content.
 */
export default function PageBlur() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.05 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <GradualBlur
      target="page"
      position="bottom"
      height="8rem"
      strength={1.5}
      divCount={10}
      curve="bezier"
      exponential
      opacity={0.85}
      zIndex={1}
    />
  );
}
