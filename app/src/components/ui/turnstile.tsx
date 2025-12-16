"use client";

import { Turnstile as TurnstileWidget } from "@marsidev/react-turnstile";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
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
    const widgetRef = useRef<React.ComponentRef<typeof TurnstileWidget>>(null);

    // Dynamic visibility: hidden by default, shown when Cloudflare requires interaction
    const [needsInteraction, setNeedsInteraction] = useState(false);

    useImperativeHandle(ref, () => ({
      reset: () => {
        widgetRef.current?.reset();
        setNeedsInteraction(false);
      },
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
      <div
        className={cn(
          // Dynamic height: hidden by default, visible when interaction needed
          needsInteraction ? "h-auto" : "h-0 overflow-hidden",
          // Smooth transition for better UX
          "transition-[height] duration-200",
          className
        )}
      >
        <TurnstileWidget
          ref={widgetRef}
          siteKey={siteKey}
          onSuccess={(token) => {
            setNeedsInteraction(false);
            onSuccess(token);
          }}
          onError={() => {
            setNeedsInteraction(false);
            onError?.();
          }}
          onExpire={() => {
            setNeedsInteraction(false);
            onExpire?.();
          }}
          // Cloudflare calls this when interactive challenge is required
          // (VPN, Tor, datacenter IPs, suspicious fingerprints, etc.)
          onBeforeInteractive={() => {
            setNeedsInteraction(true);
          }}
          onAfterInteractive={() => {
            // Don't hide here - wait for onSuccess to ensure token received
          }}
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
