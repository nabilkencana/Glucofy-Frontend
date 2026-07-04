"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface FlagProps {
  className?: string;
}

export function USFlag({ className }: FlagProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 78 52"
      className={cn("inline-block shrink-0", className)}
      aria-hidden="true"
    >
      <defs>
        <g id="us-star">
          <polygon points="0,-1.2 0.35,-0.35 1.2,-0.35 0.5,0.2 0.76,1.05 0,0.5 -0.76,1.05 -0.5,0.2 -1.2,-0.35 -0.35,-0.35" fill="#ffffff" />
        </g>
      </defs>
      {/* 13 stripes alternating red and white */}
      <rect width="78" height="52" fill="#B22234" />
      <rect y="4" width="78" height="4" fill="#FFFFFF" />
      <rect y="12" width="78" height="4" fill="#FFFFFF" />
      <rect y="20" width="78" height="4" fill="#FFFFFF" />
      <rect y="28" width="78" height="4" fill="#FFFFFF" />
      <rect y="36" width="78" height="4" fill="#FFFFFF" />
      <rect y="44" width="78" height="4" fill="#FFFFFF" />
      {/* Canton (blue box) */}
      <rect width="34" height="28" fill="#3C3B6E" />
      {/* Stars Grid */}
      {/* Row 1 */}
      <use href="#us-star" x="4.25" y="4.6" />
      <use href="#us-star" x="9.25" y="4.6" />
      <use href="#us-star" x="14.25" y="4.6" />
      <use href="#us-star" x="19.25" y="4.6" />
      <use href="#us-star" x="24.25" y="4.6" />
      <use href="#us-star" x="29.25" y="4.6" />
      {/* Row 2 */}
      <use href="#us-star" x="6.75" y="9.2" />
      <use href="#us-star" x="11.75" y="9.2" />
      <use href="#us-star" x="16.75" y="9.2" />
      <use href="#us-star" x="21.75" y="9.2" />
      <use href="#us-star" x="26.75" y="9.2" />
      {/* Row 3 */}
      <use href="#us-star" x="4.25" y="13.8" />
      <use href="#us-star" x="9.25" y="13.8" />
      <use href="#us-star" x="14.25" y="13.8" />
      <use href="#us-star" x="19.25" y="13.8" />
      <use href="#us-star" x="24.25" y="13.8" />
      <use href="#us-star" x="29.25" y="13.8" />
      {/* Row 4 */}
      <use href="#us-star" x="6.75" y="18.4" />
      <use href="#us-star" x="11.75" y="18.4" />
      <use href="#us-star" x="16.75" y="18.4" />
      <use href="#us-star" x="21.75" y="18.4" />
      <use href="#us-star" x="26.75" y="18.4" />
      {/* Row 5 */}
      <use href="#us-star" x="4.25" y="23" />
      <use href="#us-star" x="9.25" y="23" />
      <use href="#us-star" x="14.25" y="23" />
      <use href="#us-star" x="19.25" y="23" />
      <use href="#us-star" x="24.25" y="23" />
      <use href="#us-star" x="29.25" y="23" />
    </svg>
  );
}

export function IDFlag({ className }: FlagProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3 2"
      className={cn("inline-block shrink-0", className)}
      aria-hidden="true"
    >
      <rect width="3" height="1" fill="#E70012" />
      <rect width="3" height="1" y="1" fill="#FFFFFF" />
    </svg>
  );
}
