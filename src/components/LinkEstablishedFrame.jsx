import { motion } from 'framer-motion'

/** Minimal PCB-style frame around LINK ESTABLISHED */
export default function LinkEstablishedFrame({ children }) {
  return (
    <div className="relative px-4 sm:px-0">
      <svg
        className="absolute -inset-x-6 sm:-inset-x-10 -inset-y-6 sm:-inset-y-8 w-[calc(100%+3rem)] sm:w-[calc(100%+5rem)] h-[calc(100%+3rem)] sm:h-[calc(100%+4rem)] pointer-events-none"
        viewBox="0 0 420 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id="linkTrace" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(61,232,255,0)" />
            <stop offset="35%" stopColor="rgba(61,232,255,0.45)" />
            <stop offset="65%" stopColor="rgba(61,232,255,0.45)" />
            <stop offset="100%" stopColor="rgba(61,232,255,0)" />
          </linearGradient>
        </defs>

        {/* Corner brackets */}
        <path d="M24 18 H52 V34" stroke="rgba(61,232,255,0.35)" strokeWidth="1" />
        <path d="M396 18 H368 V34" stroke="rgba(61,232,255,0.35)" strokeWidth="1" />
        <path d="M24 102 H52 V86" stroke="rgba(61,232,255,0.35)" strokeWidth="1" />
        <path d="M396 102 H368 V86" stroke="rgba(61,232,255,0.35)" strokeWidth="1" />

        {/* Horizontal traces */}
        <path d="M52 26 H130 M290 26 H368" stroke="url(#linkTrace)" strokeWidth="1" />
        <path d="M52 94 H118 M302 94 H368" stroke="url(#linkTrace)" strokeWidth="1" />

        {/* Vertical feed lines */}
        <path
          d="M130 26 V46 M290 26 V46 M118 94 V74 M302 94 V74"
          stroke="rgba(61,232,255,0.18)"
          strokeWidth="1"
          strokeDasharray="3 5"
        />

        {/* Pad nodes */}
        <circle cx="130" cy="26" r="2.5" fill="rgba(61,232,255,0.5)" />
        <circle cx="290" cy="26" r="2.5" fill="rgba(61,232,255,0.5)" />
        <circle cx="118" cy="94" r="2.5" fill="rgba(107,255,184,0.4)" />
        <circle cx="302" cy="94" r="2.5" fill="rgba(107,255,184,0.4)" />

        {/* Center bus */}
        <path
          d="M148 60 H272"
          stroke="rgba(61,232,255,0.12)"
          strokeWidth="1"
          strokeDasharray="6 8"
        />
      </svg>

      <motion.div
        className="absolute -inset-x-6 -inset-y-4 border border-cyan/15 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  )
}
