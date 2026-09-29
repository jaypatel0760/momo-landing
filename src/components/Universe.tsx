"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { UNIVERSE_HOTSPOTS } from "@/lib/constants";

const UniverseScene = dynamic(() => import("@/components/3d/UniverseScene").then(m => m.UniverseScene), { ssr: false });

export function Universe() {
  return (
    <section id="universe" className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(168,85,247,0.03)] via-transparent to-[rgba(6,182,212,0.03)]" />
      </div>

      <div className="relative section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase text-accent-violet bg-[rgba(168,85,247,0.1)] border border-[rgba(168,85,247,0.2)] mb-6">
            MOMO UNIVERSE
          </span>
          <h2 className="font-display font-extrabold tracking-tight leading-[1.1] text-gradient mb-6" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
            THE UNIVERSE<br />
            IS ALIVE.
          </h2>
          <p className="text-lg text-[rgba(240,240,245,0.6)] leading-relaxed">
            Explore the living dimension. Click on hotspots to discover key locations.
          </p>
        </motion.div>

        {/* 3D Scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden"
          style={{ 
            aspectRatio: "16/9",
            minHeight: "500px",
            maxHeight: "700px",
          }}
        >
          <UniverseScene />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
          
          {/* Hotspot legend */}
          <div className="absolute bottom-6 left-6 right-6 pointer-events-none md:left-8 md:bottom-8">
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {UNIVERSE_HOTSPOTS.map((hotspot, i) => (
                <motion.span
                  key={hotspot.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase bg-[rgba(15,15,25,0.8)] backdrop-blur border border-[rgba(168,85,247,0.2)] text-[rgba(240,240,245,0.7)] hover:border-accent-violet hover:text-accent-violet transition-all cursor-pointer"
                >
                  {hotspot.name}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}