"use client";

import { motion } from "framer-motion";
import { ECOSYSTEM_CARDS } from "@/lib/constants";
import { Diamond, Gamepad2, PenTool, Users } from "lucide-react";

const IconMap = {
  diamond: Diamond,
  gamepad: Gamepad2,
  "pen-tool": PenTool,
  users: Users,
};

function getIcon(name: string) {
  return IconMap[name as keyof typeof IconMap] || Diamond;
}

export function Ecosystem() {
  return (
    <section id="ecosystem" className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-[rgba(168,85,247,0.05)] blur-[200px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-[rgba(6,182,212,0.04)] blur-[200px]" />
      </div>

      <div className="relative section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase text-accent-cyan bg-[rgba(6,182,212,0.1)] border border-[rgba(6,182,212,0.2)] mb-6">
            ECOSYSTEM
          </span>
          <h2 className="font-display font-extrabold tracking-tight leading-[1.1] text-gradient mb-6" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
            FOUR PILLARS.<br />
            ONE UNIVERSE.
          </h2>
          <p className="text-lg text-[rgba(240,240,245,0.6)] leading-relaxed">
            Each pillar represents a core pillar of the MOMO experience.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ECOSYSTEM_CARDS.map((card, index) => (
            <motion.article
              key={card.id}
              initial={{ opacity: 0, y: 40, rotateX: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
              className="card group relative p-8 overflow-hidden"
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
            >
              {/* Animated background glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-accent-violet/0 via-transparent to-accent-cyan/0"
                animate={{ 
                  opacity: [0, 0.1, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              />
              
              {/* Hover glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-accent-violet/20 via-transparent to-accent-cyan/20 opacity-0"
                animate={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                aria-hidden="true"
              />

              <div className="relative z-10 flex flex-col h-full">
                {/* Icon */}
                <motion.div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-[rgba(168,85,247,0.1)] border border-[rgba(168,85,247,0.2)] group-hover:border-accent-violet group-hover:bg-[rgba(168,85,247,0.2)] transition-all duration-300"
                  whileHover={{ rotate: 12, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {(() => {
                    const IconComponent = getIcon(card.icon);
                    return <IconComponent size={28} className="text-accent-violet" aria-hidden="true" />;
                  })()}
                </motion.div>

                <h3 className="font-display font-bold text-xl tracking-tight mb-3 text-foreground">
                  {card.title}
                </h3>
                <p className="text-[rgba(240,240,245,0.65)] leading-relaxed flex-1 mb-6">
                  {card.description}
                </p>

                {/* Arrow indicator */}
                <motion.div
                  className="flex items-center gap-2 text-sm font-medium text-accent-violet opacity-0 group-hover:opacity-100 transition-all duration-300"
                  whileHover={{ x: 8 }}
                >
                  <span>Explore</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </div>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-accent-violet/50" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-accent-cyan/50" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}