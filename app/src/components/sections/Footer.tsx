import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin, Twitter } from "lucide-react";

import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { footerContent, navigation } from "@/lib/constants";

const iconMap = {
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
  tiktok: TikTokIcon,
} as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 py-12 sm:gap-12 sm:py-16 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <Link
              href="/#hero"
              className="text-foreground inline-flex items-center gap-2 text-lg font-semibold tracking-tight"
            >
              <Image
                src="/logos/icon.png"
                alt="First Date Labs logo"
                width={28}
                height={28}
                className="h-7 w-7"
              />
              <span>{footerContent.brandName}</span>
            </Link>
            <p className="text-muted-foreground max-w-sm text-sm">
              {footerContent.tagline}
            </p>
            <div className="flex items-center gap-4">
              {footerContent.social.map((item) => {
                const Icon = iconMap[item.icon];
                const iconSize = item.icon === "tiktok" ? "size-6" : "size-5";
                return (
                  <Link
                    key={item.platform}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.platform}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Icon className={iconSize} aria-hidden />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3 lg:grid-cols-3">
            {footerContent.columns.map((column) => (
              <div key={column.title} className="space-y-4">
                <p className="text-foreground text-xs font-semibold tracking-[0.25em] uppercase">
                  {column.title}
                </p>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-primary text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="py-6 sm:py-8">
          <div className="text-muted-foreground flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {footerContent.brandName}
            </p>
            <p>{footerContent.contact}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
