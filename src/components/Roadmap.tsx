"use client";

import { motion } from "framer-motion";
import { ROADMAP_STAGES } from "@/lib/constants";

export function Roadmap() {
  return (
    <section id="roadmap" className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
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
            ROADMAP
          </span>
          <h2 className="font-display font-extrabold tracking-tight leading-[1.1] text-gradient mb-6" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
            THE JOURNEY
          </h2>
          <p className="text-lg text-[rgba(240,240,245,0.6)] leading-relaxed">
            A fictional roadmap for the MOMO universe development.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-accent-violet/40 to-transparent"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            style={{ transformOrigin: "top center" }}
            aria-hidden="true"
          />

          {/* Glow on line */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-accent-violet to-transparent opacity-30 blur-[2px]"
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          />

          <div className="relative space-y-16 md:space-y-20">
            {ROADMAP_STAGES.map((stage, index) => (
              <motion.div
                key={stage.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 + index * 0.15 }}
                className="relative flex items-start gap-8 md:gap-12"
                style={{ 
                  flexDirection: index % 2 === 0 ? "row" : "row-reverse",
                }}
              >
                {/* Left side */}
                <div className={`flex-1 ${index % 2 === 0 ? "text-right pr-8" : "pl-8"}`}>
                  <div className="card p-8 relative">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="font-display font-extrabold text-3xl text-accent-violet">
                        {stage.number}
                      </span>
                      <h3 className="font-display font-bold text-2xl tracking-tight text-foreground">
                        {stage.title}
                      </h3>
                    </div>
                    <p className="text-[rgba(240,240,245,0.7)] leading-relaxed">
                      {stage.description}
                    </p>
                    
                    {/* Progress indicator */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-accent-violet to-accent-cyan"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 + index * 0.15 }}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Center dot */}
                <motion.div
                  className="relative flex-shrink-0 w-16 h-16 flex items-center justify-center z-10"
                  style={{ marginTop: "8px" }}
                >
                  <motion.div
                    className="w-4 h-4 rounded-full bg-accent-violet border-4 border-background"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(168,85,247,0.4)",
                        "0 0 20px 5px rgba(168,85,247,0.6)",
                        "0 0 0 0 rgba(168,85,247,0.4)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
                    aria-hidden="true"
                  />
                  
                  {/* Outer pulse rings */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="w-16 h-16 rounded-full border-2 border-accent-violet/30"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: index * 0.3 }}
                      aria-hidden="true"
                    />
                    <motion.div
                      className="w-20 h-20 rounded-full border-1 border-accent-cyan/20"
                      animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 0.5 + index * 0.3 }}
                      aria-hidden="true"
                    />
                  </div>
                </motion.div>

                {/* Right side - visual element */}
                <div className={`flex-1 ${index % 2 === 0 ? "pl-8" : "text-right pr-8"}`}>
                  <div className="relative aspect-square max-w-xs mx-auto md:mx-0" style={{ 
                    marginLeft: index % 2 === 0 ? 0 : "auto",
                    marginRight: index % 2 === 0 ? "auto" : 0,
                  }}>
                    <StageVisual stageNumber={stage.number} index={index} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StageVisual({ stageNumber, index }: { stageNumber: string; index: number }) {
  const colors = ["#a855f7", "#06b6d4", "#a855f7", "#06b6d4"];
  const color = colors[index % colors.length];

  return (
    <div className="relative rounded-2xl overflow-hidden bg-[rgba(15,15,25,0.5)] border border-[rgba(168,85,247,0.1)]">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[rgba(168,85,247,0.05)] to-transparent" />
      
      {/* Geometric shapes */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 300 300" aria-hidden="true">
        <defs>
          <linearGradient id={`grad-${stageNumber}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color === "#a855f7" ? "#06b6d4" : "#a855f7"} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Animated geometric pattern */}
        <g className="stage-pattern">
          {Array.from({ length: 6 }).map((_, i) => (
            <polygon
              key={i}
              points="150,30 270,100 270,200 150,270 30,200 30,100"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              strokeDasharray="10,10"
              transform={`rotate(${i * 60} 150 150) scale(${0.3 + i * 0.1})`}
              style={{ transformOrigin: "150 150" }}
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={`0 150 150`}
                to={`360 150 150`}
                dur={`${20 + i * 3}s`}
                repeatCount="indefinite"
              />
            </polygon>
          ))}
        </g>
        
        {/* Center symbol */}
        <circle cx="150" cy="150" r="40" fill="url(#grad-{stageNumber})" opacity="0.3" />
        <text x="150" y="155" textAnchor="middle" fill={color} fontSize="48" fontWeight="bold" fontFamily="monospace">
          {stageNumber}
        </text>
      </svg>

      {/* Stage label overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/90 to-transparent">
        <span className="text-xs font-medium tracking-widest uppercase text-[rgba(168,85,247,0.6)]">
          STAGE {stageNumber}
        </span>
      </div>
    </div>
  );
}