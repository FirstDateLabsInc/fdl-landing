"use client";

import { Turnstile as TurnstileWidget } from "@marsidev/react-turnstile";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

export interface TurnstileRef {
  reset: () => void;
  getToken: () => string | undefined;
}

interface TurnstileProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  className?: string;
}

export const Turnstile = forwardRef<TurnstileRef, TurnstileProps>(
  function Turnstile({ onSuccess, onError, onExpire, className }, ref) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const widgetRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      reset: () => widgetRef.current?.reset(),
      getToken: () => widgetRef.current?.getResponse(),
    }));

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    if (!siteKey) {
      if (process.env.NODE_ENV === "development") {
        console.warn("NEXT_PUBLIC_TURNSTILE_SITE_KEY not configured");
      }
      return null;
    }

    return (
      <div className={cn("h-0 overflow-hidden", className)}>
        <TurnstileWidget
          ref={widgetRef}
          siteKey={siteKey}
          onSuccess={onSuccess}
          onError={onError}
          onExpire={onExpire}
          options={{
            theme: "light",
            size: "flexible",
            appearance: "interaction-only",
          }}
        />
      </div>
    );
  }
);
