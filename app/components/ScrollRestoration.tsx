"use client";

import { useEffect } from "react";

export default function ScrollRestoration() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    // On hard refresh: clean hash from URL and force scroll to top
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  return null;
}
