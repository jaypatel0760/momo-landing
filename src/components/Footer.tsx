"use client";

import Link from "next/link";
import { FOOTER_LINKS, SOCIAL_LINKS, FOOTER_DISCLAIMER } from "@/lib/constants";
import { MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative py-16 md:py-24 border-t border-[rgba(168,85,247,0.1)]">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(168,85,247,0.03)] blur-[200px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(6,182,212,0.03)] blur-[200px]" />
      </div>

      <div className="relative section-container">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="#" className="flex items-center gap-2 mb-6">
              <span className="font-display font-bold text-2xl tracking-tight text-foreground">
                $MOMO
              </span>
            </Link>
            <p className="text-[rgba(240,240,245,0.5)] leading-relaxed mb-6 max-w-xs">
              Enter the MOMO dimension. A fictional universe where digital collectibles, gaming and community collide.
            </p>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(168,85,247,0.1)] border border-[rgba(168,85,247,0.2)] text-[rgba(240,240,245,0.6)] hover:border-accent-violet hover:text-accent-violet hover:bg-[rgba(168,85,247,0.15)] transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.icon === "x" ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 9.721H18.33l-6.94-8.077-7.152 8.077H1.318l8.173-9.338L1.357 2.25h2.997l2.485 2.897 6.749-7.823 6.75 7.823 2.482-2.897Z" />
                    </svg>
                  ) : (
                    <MessageCircle size={18} aria-hidden="true" />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <nav>
            <h4 className="font-display font-bold text-lg tracking-tight mb-6 text-foreground">
              NAVIGATION
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[rgba(240,240,245,0.6)] hover:text-accent-violet transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Empty columns for spacing */}
          <div />
          <div />
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[rgba(168,85,247,0.1)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[rgba(240,240,245,0.4)]">
              {FOOTER_DISCLAIMER}
            </p>
            <p className="text-sm text-[rgba(240,240,245,0.3)]">
              Built with Next.js, Three.js & Framer Motion
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}