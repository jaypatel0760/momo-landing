"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-[rgba(3,3,7,0.9)] backdrop-blur-md border-b border-[rgba(168,85,247,0.15)]" 
          : "bg-transparent"
      }`}
      style={{ height: "72px" }}
    >
      <div className="section-container flex items-center justify-between h-full">
        {/* Logo */}
        <Link href="#" className="flex items-center gap-2 z-10">
          <span className="font-display font-bold text-2xl tracking-tight text-foreground">
            $MOMO
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-[rgba(240,240,245,0.7)] hover:text-accent-violet transition-colors duration-300 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-accent-violet after:to-accent-cyan after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="#universe"
            className="btn-primary text-sm px-6 py-3"
          >
            <span>EXPLORE</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 z-10"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-[rgba(3,3,7,0.98)] backdrop-blur-md flex flex-col items-center gap-6 py-12 px-6 border-t border-[rgba(168,85,247,0.1)] animate-slideDown">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg font-medium text-foreground hover:text-accent-violet transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#universe"
            className="btn-primary text-sm px-8 py-3 w-full text-center mt-4"
            onClick={() => setMobileOpen(false)}
          >
            <span>EXPLORE</span>
          </Link>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </nav>
  );
}