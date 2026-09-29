"use client";

import { motion } from "framer-motion";
import { ABOUT_CARDS } from "@/lib/constants";

export function About() {
  return (
    <section id="about" className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] -translate-x-1/4 translate-y-1/4 rounded-full bg-[rgba(168,85,247,0.05)] blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] translate-x-1/4 -translate-y-1/4 rounded-full bg-[rgba(6,182,212,0.04)] blur-[200px]" />
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
            ABOUT MOMO
          </span>
          <h2 className="font-display font-extrabold tracking-tight leading-[1.1] text-gradient mb-6" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
            NOT JUST A TOKEN.<br />
            A DIGITAL UNIVERSE.
          </h2>
          <p className="text-lg text-[rgba(240,240,245,0.6)] leading-relaxed">
            MOMO is a fictional next-generation digital universe combining crypto, digital collectibles, 
            gaming, and community into a cohesive futuristic experience.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {ABOUT_CARDS.map((card, index) => (
            <motion.article
              key={card.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
              className="card group p-8 relative overflow-hidden"
            >
              {/* Number */}
              <span className="font-display font-extrabold text-5xl text-[rgba(168,85,247,0.15)] absolute top-6 right-6" aria-hidden="true">
                {card.number}
              </span>

              {/* Glow effect on hover */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-accent-violet/0 via-transparent to-accent-cyan/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                aria-hidden="true"
              />

              <div className="relative z-10">
                <h3 className="font-display font-bold text-2xl tracking-tight mb-4 text-foreground group-hover:text-accent-violet transition-colors">
                  {card.title}
                </h3>
                <p className="text-[rgba(240,240,245,0.7)] leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-accent-violet/50 group-hover:border-accent-violet transition-colors" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-accent-cyan/50 group-hover:border-accent-cyan transition-colors" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}