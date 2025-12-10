import Link from "next/link";
import { Instagram, Linkedin, Twitter } from "lucide-react";

import { footerContent, navigation } from "@/lib/constants";

const iconMap = {
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
} as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-foreground/5 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 py-12 sm:gap-12 sm:py-16 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <Link
              href="/#hero"
              className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-sm font-bold uppercase tracking-[0.18em] text-background shadow-[0_10px_30px_-15px_rgba(15,23,42,0.45)]">
                {navigation.logoText[0] ?? "J"}
              </span>
              <span>{footerContent.brandName}</span>
            </Link>
            <p className="max-w-sm text-sm text-muted-foreground">
              {footerContent.tagline}
            </p>
            <div className="flex items-center gap-4">
              {footerContent.social.map((item) => {
                const Icon = iconMap[item.icon];
                return (
                  <Link
                    key={item.platform}
                    href={item.href}
                    aria-label={item.platform}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Icon className="size-5" aria-hidden />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3 lg:grid-cols-3">
            {footerContent.columns.map((column) => (
              <div key={column.title} className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-foreground">
                  {column.title}
                </p>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
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

        <div className="border-t border-foreground/5 py-6 sm:py-8">
          <div className="flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© {year} {footerContent.brandName}</p>
            <p>{footerContent.contact}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
