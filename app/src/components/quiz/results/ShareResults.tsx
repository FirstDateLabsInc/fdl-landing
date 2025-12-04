"use client";

import { useState, useCallback } from "react";
import { Link2, Check, Twitter, Linkedin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShareResultsProps {
  shareUrl: string;
  archetype: string;
  className?: string;
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
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
        Share Your Results
      </h3>

      <div className="flex flex-wrap gap-3">
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

        <Button variant="outline" asChild>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="mr-2 h-4 w-4" />
            LinkedIn
          </a>
        </Button>
      </div>
    </div>
  );
}
