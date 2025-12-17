import type { SVGProps } from "react";

export function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={26}
      height={26}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      <path
        fill="currentColor"
        d="M9.5 4h3a5.5 5.5 0 005.5 5.5V12A8.5 8.5 0 0112 8v8.25a4.75 4.75 0 11-4.75-4.75h.75v2.5h-.75a2.25 2.25 0 102.25 2.25V4Z"
      />
    </svg>
  );
}

