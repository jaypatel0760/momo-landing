"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { TOKEN_INFO, DISCLAIMER } from "@/lib/constants";

const Token3D = dynamic(() => import("@/components/3d/Token3D").then(m => m.Token3D), { ssr: false });
const TokenMascot = dynamic(() => import("@/components/3d/TokenMascot").then(m => m.TokenMascot), { ssr: false });

export function Token() {
  return (
    <section id="token" className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(168,85,247,0.03)] via-transparent to-[rgba(6,182,212,0.03)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[rgba(168,85,247,0.04)] blur-[200px]" />
      </div>

      <div className="relative section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* 3D Token */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
            style={{ aspectRatio: "1/1", maxWidth: "500px", margin: "0 auto" }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Token3D className="w-full h-full" />
              {/* Companion mascot */}
              <div className="absolute bottom-0 right-0 w-[180px] h-[180px] translate-x-1/2 translate-y-1/2">
                <TokenMascot position={[2.5, -0.5, 0]} className="w-full h-full" />
              </div>
            </div>
            
            {/* Pulsing rings */}
            <motion.div
              className="absolute inset-0 border-2 border-accent-violet/30 rounded-full"
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />
            <motion.div
              className="absolute inset-0 border-2 border-accent-cyan/20 rounded-full"
              animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.05, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              aria-hidden="true"
            />
          </motion.div>

          {/* Token Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase text-accent-violet bg-[rgba(168,85,247,0.1)] border border-[rgba(168,85,247,0.2)] mb-6">
              TOKEN
            </span>
            <h2 className="font-display font-extrabold tracking-tight leading-[1.1] mb-4" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
              MEET <span className="text-gradient">{TOKEN_INFO.symbol}</span>
            </h2>
            <p className="text-xl text-accent-violet font-medium mb-10 tracking-wide uppercase">
              {TOKEN_INFO.description}
            </p>

            {/* Token Details */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {[
                { label: "SYMBOL", value: TOKEN_INFO.symbol },
                { label: "NETWORK", value: TOKEN_INFO.network },
                { label: "UTILITY", value: TOKEN_INFO.utility },
                { label: "STATUS", value: TOKEN_INFO.status },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  className="card p-6"
                >
                  <span className="text-xs font-medium tracking-widest uppercase text-[rgba(240,240,245,0.4)] mb-2 block">
                    {item.label}
                  </span>
                  <span className="font-display font-bold text-xl text-foreground">
                    {item.value}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="p-5 rounded-xl bg-[rgba(168,85,247,0.05)] border border-[rgba(168,85,247,0.15)]"
            >
              <p className="text-sm text-[rgba(240,240,245,0.6)] leading-relaxed">
                <strong className="text-accent-violet">Disclaimer:</strong> {DISCLAIMER}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}