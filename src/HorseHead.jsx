import React from "react";
export function HorseHead({ size = 24, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M7 21h12c-1-3-1-5 0-8 1-4-1-7-5-8l-1-3-3 3-3-1 1 4-5 6 2 3 5-2c2 2 0 4-3 6Z" />
      <path d="m8 8 4 2M5 14h2m7-9c4 3 2 6 2 9" />
      <circle cx="11.5" cy="10.5" r=".7" fill="currentColor" stroke="none" />
    </svg>
  );
}
