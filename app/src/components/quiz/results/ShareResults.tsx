"use client";

import { useState, useCallback } from "react";
import { Link2, Check, Twitter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShareResultsProps {
  shareUrl: string;
  archetype: string;
  className?: string;
}

// Custom TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

// Custom Instagram icon component
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export function ShareResults({
  shareUrl,
  archetype,
  className,
}: ShareResultsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  }, [shareUrl]);

  const shareText = `I just discovered I'm "${archetype}" on the Juliet Dating Personality Quiz! 💝 Take the quiz to find your type:`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  
  // TikTok doesn't have a direct share URL, so we open TikTok with the link copied
  // Instagram also doesn't have a direct web share API, so we provide copy functionality
  const handleTikTokShare = useCallback(() => {
    // Copy the share text to clipboard for TikTok
    const tiktokText = `${shareText} ${shareUrl}`;
    navigator.clipboard.writeText(tiktokText).then(() => {
      // Open TikTok (mobile) or show message
      window.open('https://www.tiktok.com/upload', '_blank');
    });
  }, [shareText, shareUrl]);

  const handleInstagramShare = useCallback(() => {
    // Copy the share text to clipboard for Instagram
    const instagramText = `${shareText}\n\n${shareUrl}`;
    navigator.clipboard.writeText(instagramText).then(() => {
      // Open Instagram (mobile) or show message
      window.open('https://www.instagram.com/', '_blank');
    });
  }, [shareText, shareUrl]);

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-center text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
        Share Your Results
      </h3>

      <div className="flex flex-wrap justify-center gap-3">
        <Button
          variant="outline"
          onClick={handleCopyLink}
          className={cn(
            "transition-colors",
            copied && "border-green-500 text-green-600"
          )}
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Link2 className="mr-2 h-4 w-4" />
              Copy Link
            </>
          )}
        </Button>

        <Button variant="outline" asChild>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Twitter"
          >
            <Twitter className="mr-2 h-4 w-4" />
            Twitter
          </a>
        </Button>

        <Button 
          variant="outline" 
          onClick={handleTikTokShare}
          className="hover:border-[#ff0050]/50 hover:text-[#ff0050]"
        >
          <TikTokIcon className="mr-2 h-4 w-4" />
          TikTok
        </Button>

        <Button 
          variant="outline" 
          onClick={handleInstagramShare}
          className="hover:border-[#E4405F]/50 hover:text-[#E4405F]"
        >
          <InstagramIcon className="mr-2 h-4 w-4" />
          Instagram
        </Button>
      </div>

      <p className="text-center text-xs text-slate-400">
        Link will be copied to clipboard when sharing to TikTok or Instagram
      </p>
    </div>
  );
}
