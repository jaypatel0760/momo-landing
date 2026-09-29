"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { SOCIAL_LINKS } from "@/lib/constants";
import { Send, Users, Globe, MessageCircle } from "lucide-react";

const ParticleField = dynamic(() => import("@/components/3d/ParticleField").then(m => m.ParticleField), { ssr: false });

function SocialIcon({ name }: { name: string }) {
  if (name === "X / TWITTER") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 9.721H18.33l-6.94-8.077-7.152 8.077H1.318l8.173-9.338L1.357 2.25h2.997l2.485 2.897 6.749-7.823 6.75 7.823 2.482-2.897Z" />
      </svg>
    );
  }
  return <MessageCircle size={18} aria-hidden="true" />;
}

export function Community() {
  return (
    <section id="community" className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      {/* Background Particle Field */}
      <div className="absolute inset-0 z-0">
        <ParticleField count={1200} size={50} colorA="#a855f7" colorB="#06b6d4" className="w-full h-full" />
      </div>

      <div className="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
        <div className="absolute top-0 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(168,85,247,0.03)] blur-[200px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-[rgba(6,182,212,0.03)] blur-[200px]" />
      </div>

      <div className="relative section-container z-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase text-accent-cyan bg-[rgba(6,182,212,0.1)] border border-[rgba(6,182,212,0.2)] mb-6">
            COMMUNITY
          </span>
          <h2 className="font-display font-extrabold tracking-tight leading-[1.1] text-gradient mb-6" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
            THE UNIVERSE<br />
            NEEDS YOU.
          </h2>
          <p className="text-lg text-[rgba(240,240,245,0.6)] leading-relaxed">
            Join the fictional community shaping the future of the MOMO dimension.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {[
            { label: "EXPLORERS", value: "∞", icon: Users },
            { label: "WORLDS", value: "∞", icon: Globe },
            { label: "COLLECTIBLES", value: "∞", icon: MessageCircle },
            { label: "DIMENSIONS", value: "∞", icon: Send },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
              className="card p-6 text-center"
            >
              <stat.icon size={24} className="mx-auto mb-3 text-accent-violet" aria-hidden="true" />
              <div className="font-display font-extrabold text-4xl md:text-5xl text-gradient mb-1">
                {stat.value}
              </div>
              <div className="text-xs font-medium tracking-widest uppercase text-[rgba(240,240,245,0.4)]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          {SOCIAL_LINKS.map((social, i) => (
            <motion.a
              key={social.name}
              href={social.href}
              className="btn-secondary flex items-center gap-2 px-6 py-3 min-w-[160px] justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.08 }}
            >
              {/*
              <social.icon === "x" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 9.721H18.33l-6.94-8.077-7.152 8.077H1.318l8.173-9.338L1.357 2.25h2.997l2.485 2.897 6.749-7.823 6.75 7.823 2.482-2.897Z" />
                </svg>
              ) : (
                <MessageCircle size={18} aria-hidden="true" />
              )}
*/}
              <SocialIcon name={social.name} />
              <span>{social.name}</span>
            </motion.a>
          ))}
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="text-center"
        >
          <a href="#universe" className="btn-primary inline-flex items-center gap-3 px-10 py-4 text-lg">
            <span>JOIN THE COMMUNITY</span>
            <Send size={20} aria-hidden="true" />
          </a>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center text-xs text-[rgba(240,240,245,0.3)] tracking-wider uppercase mt-12"
        >
          DEMO LINKS — PLACEHOLDERS ONLY
        </motion.p>
      </div>
    </section>
  );
}