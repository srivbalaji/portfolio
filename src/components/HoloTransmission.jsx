import { motion, AnimatePresence } from 'framer-motion'

export const CHANNELS = {
  EMAIL: {
    label: 'MAIL CHANNEL',
    image: '/assets/holo/email.svg',
    fallback: 'EMAIL · sribalaj@umich.edu',
  },
  LINKEDIN: {
    label: 'LINKEDIN FEED',
    image: '/assets/holo/linkedin.svg',
    fallback: 'LINKEDIN · /in/srivb70',
  },
  GITHUB: {
    label: 'GITHUB REPO SCAN',
    image: '/assets/holo/github.svg',
    fallback: 'GITHUB · srivbalaji',
  },
  RESUME: {
    label: 'RESUME DOCUMENT',
    image: '/assets/holo/resume.svg',
    fallback: 'RESUME · PDF TRANSMISSION',
  },
}

export function HoloPanel({ channel, onClose, onOpen, compact = false }) {
  const meta = CHANNELS[channel]
  if (!meta) return null

  return (
    <motion.div
      className={`holo-transmission-frame h-full flex flex-col ${compact ? 'min-h-0' : ''}`}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35 }}
    >
      <p className={`font-mono tracking-[0.28em] text-cyan/80 mb-1.5 px-0.5 shrink-0 ${compact ? 'text-[7px]' : 'text-[9px]'}`}>
        ◈ {meta.label} · INCOMING
      </p>

      <div className="holo-transmission-screen relative overflow-hidden border border-cyan/35 bg-[#060a12] flex-1 min-h-0">
        <img
          src={meta.image}
          alt=""
          className="holo-transmission-image w-full h-full min-h-[80px] object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.nextElementSibling?.classList.remove('hidden')
          }}
        />
        <div className="hidden w-full h-full min-h-[80px] flex items-center justify-center bg-gradient-to-br from-[#0a1420] to-[#101828]">
          <p className={`font-mono text-cyan/60 tracking-widest text-center px-3 ${compact ? 'text-[8px]' : 'text-xs'}`}>
            {meta.fallback}
            <span className="block mt-1 text-[7px] text-ice/35">PLACEHOLDER · REPLACE JPG</span>
          </p>
        </div>
        <div className="holo-transmission-scanlines absolute inset-0 pointer-events-none" />
        <div className="holo-transmission-glitch absolute inset-0 pointer-events-none" />
      </div>

      <div className={`flex gap-1.5 shrink-0 ${compact ? 'mt-1.5' : 'mt-3'}`}>
        <button
          type="button"
          onClick={onOpen}
          className={`flex-1 font-mono tracking-[0.18em] border border-cyan/40 text-cyan hover:bg-cyan/10 transition-colors ${compact ? 'text-[7px] py-1' : 'text-[10px] py-2'}`}
        >
          OPEN CHANNEL
        </button>
        <button
          type="button"
          onClick={onClose}
          className={`font-mono tracking-[0.18em] border border-gundam/30 text-ice/50 hover:text-ice transition-colors ${compact ? 'text-[7px] py-1 px-2' : 'text-[10px] py-2 px-4'}`}
        >
          DISMISS
        </button>
      </div>
    </motion.div>
  )
}

/** Full-screen holo (legacy) — prefer cockpit embed via HoloPanel */
export default function HoloTransmission({ channel, onClose, onOpen }) {
  return (
    <AnimatePresence>
      {channel && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="presentation"
        >
          <div className="absolute inset-0 bg-void/80 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-lg" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <HoloPanel channel={channel} onClose={onClose} onOpen={onOpen} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
