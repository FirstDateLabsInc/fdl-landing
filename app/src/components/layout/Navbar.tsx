"use client";

import { useCallback, useEffect, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import cloudflareLoader from "@/lib/cloudflare-image-loader";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { navigation } from "@/lib/constants";
import { cn, smoothScrollToHash } from "@/lib/utils";
import { trackCtaClick, getPageType } from "@/lib/analytics";

const normalizePath = (href: string) => {
  const url = new URL(href, "http://placeholder");
  const cleanedPath = url.pathname.replace(/\/$/, "");
  return cleanedPath === "" ? "/" : cleanedPath;
};

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const normalizedPathname = normalizePath(pathname);

  const handleCtaClick = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>) => {
      trackCtaClick({
        ctaId: "navbar_cta",
        ctaText: navigation.cta.label,
        ctaLocation: "navbar",
        pageType: getPageType(pathname),
      });
      smoothScrollToHash(event);
      setIsMenuOpen(false);
    },
    [pathname]
  );

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((previous) => !previous);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleMediaChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMenuOpen(false);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-white/10 transition-shadow duration-300",
        "bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60",
        scrolled
          ? "shadow-[0_12px_40px_-20px_rgba(15,23,42,0.35)]"
          : "shadow-none"
      )}
    >
      <nav className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:gap-6 md:py-3 lg:px-8">
        <div className="flex items-center justify-between">
          <Link
            href="/#hero"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-900 transition-colors hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none"
            onClick={closeMenu}
          >
            <Image
              loader={cloudflareLoader}
              src="/logos/icon.png"
              alt="First Date Labs logo"
              width={28}
              height={28}
              className="h-7 w-7"
              priority
            />
            <span className="leading-tight">{navigation.logoText}</span>
          </Link>

          <button
            type="button"
            onClick={toggleMenu}
            className="inline-flex h-10 w-10 items-center justify-center text-slate-900 transition-colors hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none md:hidden"
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div
          id="primary-navigation"
          className={cn(
            "text-base font-semibold text-slate-700 md:col-start-2 md:row-start-1 md:flex md:flex-row md:items-center md:justify-center md:gap-9",
            isMenuOpen
              ? "flex flex-col items-start gap-3 border-t border-white/10 pt-4 md:border-none md:pt-0"
              : "hidden md:flex"
          )}
        >
          {navigation.links.map((link) => {
            const isActive = normalizedPathname === normalizePath(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-slate-900 focus-visible:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none",
                  isActive && "text-slate-900"
                )}
                aria-current={isActive ? "page" : undefined}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div
          className={cn(
            "flex w-full justify-start md:col-start-3 md:row-start-1 md:w-auto md:justify-end",
            isMenuOpen ? "pt-2" : "hidden md:flex"
          )}
        >
          <Button
            asChild
            className="min-w-[160px]"
            aria-label={navigation.cta.label}
          >
            <Link href={navigation.cta.href} onClick={handleCtaClick}>
              {navigation.cta.label}
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
