"use client";

import { useRef, useEffect, useState } from "react";
import { ArrowRight, MousePointer } from "lucide-react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const MOMOMascot = dynamic(() => import("@/components/3d/MOMOMascot").then(m => m.MOMOMascot), { ssr: false });
const ParticleField = dynamic(() => import("@/components/3d/ParticleField").then(m => m.ParticleField), { ssr: false });

export function Hero() {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted] = useState(() => typeof window !== "undefined");
  const heroRef = useRef<HTMLDivElement>(null);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const progress = Math.min(window.scrollY / heroHeight, 1);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    setMouseX(x);
    setMouseY(y);
  };

  if (!mounted) {
    return (
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 bg-background" />
      </section>
    );
  }

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setMouseX(0); setMouseY(0); }}
    >
      {/* Background Particle Field */}
      <div className="absolute inset-0 z-0">
        <ParticleField count={2000} size={60} colorA="#a855f7" colorB="#06b6d4" className="w-full h-full" />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(168,85,247,0.08)] blur-[200px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(6,182,212,0.06)] blur-[200px]" />
        <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* 3D Mascot Canvas */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <MOMOMascot 
          mouseX={mouseX} 
          mouseY={mouseY} 
          scrollProgress={scrollProgress}
          className="w-full h-full"
          autoRotate={true}
        />
      </div>

      {/* Content */}
      <div className="relative z-30 section-container px-6 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Label */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-widest uppercase text-accent-violet bg-[rgba(168,85,247,0.1)] border border-[rgba(168,85,247,0.2)] mb-8"
          >
            <span className="relative">
              THE DIGITAL FRONTIER
            </span>
          </motion.span>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-extrabold tracking-tight leading-[1.05] mb-8"
            style={{ fontSize: "clamp(3.5rem, 10vw, 9rem)" }}
          >
            <span className="block text-foreground">ENTER THE</span>
            <span className="block text-gradient">MOMO</span>
            <span className="block text-foreground">DIMENSION.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-[rgba(240,240,245,0.6)] max-w-2xl mx-auto mb-12 font-light leading-relaxed"
          >
            A fictional universe where digital collectibles, gaming and community collide.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <a
              href="#universe"
              className="btn-primary group px-8 py-4 text-base"
            >
              <span className="flex items-center gap-2">
                EXPLORE MOMO
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </span>
            </a>
            <a
              href="#ecosystem"
              className="btn-secondary px-8 py-4 text-base"
            >
              VIEW ECOSYSTEM
            </a>
          </motion.div>

          {/* Disclaimer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-xs text-[rgba(240,240,245,0.35)] tracking-wider uppercase"
          >
            DEMO CONCEPT — NOT A REAL TOKEN OFFER
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[rgba(240,240,245,0.4)]"
          aria-hidden="true"
        >
          <MousePointer size={24} className="animate-bounce" />
          <span className="text-xs tracking-widest uppercase">SCROLL</span>
        </motion.div>
      </div>
    </section>
  );
}