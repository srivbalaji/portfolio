import { motion } from 'framer-motion'
import { profile } from '../data/resume'
import HeroRadar from './Radar'

export default function Hero({ active, onNavigate }) {
  return (
    <section
      id="hero"
      className="relative min-h-screen pt-24 pb-16 px-6 md:px-12 lg:pl-32"
    >
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute top-1/4 -right-20 w-96 h-96 border border-cyan/10 rotate-45"
          animate={{ rotate: [45, 48, 45] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-10 w-64 h-64 border border-gundam/20"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-12 items-center min-h-[calc(100vh-8rem)]">
        {/* Left: intro copy */}
        <div className="w-full">
          <motion.p
            className="hud-text mb-4 text-gold"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            PILOT REGISTRY — UM-AA
          </motion.p>

          <motion.h1
            className="font-display text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-bold text-ice leading-none mb-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, type: 'spring', stiffness: 60 }}
          >
            {profile.name.split(' ').map((word, i) => (
              <motion.span
                key={word}
                className="inline-block mr-4 last:mr-0"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.div
            className="flex flex-wrap gap-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {profile.tagline.split(' · ').map((t) => (
              <span
                key={t}
                className="px-4 py-1.5 font-ui text-sm tracking-widest border border-cyan/40 text-cyan bg-cyan/5"
              >
                {t}
              </span>
            ))}
          </motion.div>

          <motion.p
            className="text-lg md:text-xl text-ice/70 max-w-2xl font-light leading-relaxed mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
          >
            {profile.statement}
          </motion.p>

          <motion.div
            className="p3-panel hover-pop p-6 md:p-8 max-w-xl gundam-stripe"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
          >
            <p className="hud-text mb-2">STATUS</p>
            <p className="font-ui text-ice/90 text-lg tracking-wide">
              {profile.subtitle} · GPA {profile.gpa}
            </p>
            <p className="font-ui text-cyan/70 text-sm mt-1">{profile.graduation}</p>
          </motion.div>

          <motion.div
            className="mt-12 flex flex-wrap gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <button
              type="button"
              onClick={() => onNavigate?.('projects')}
              className="px-8 py-3 font-ui font-semibold tracking-widest bg-cyan text-void hover:bg-ice transition-colors"
            >
              VIEW MISSIONS
            </button>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 font-ui font-semibold tracking-widest border border-cyan/50 text-cyan hover:bg-cyan/10 transition-colors"
            >
              LINKEDIN
            </a>
          </motion.div>
        </div>

        {/* Right: interactive spinning radar */}
        <motion.div
          className="flex items-center justify-center lg:justify-end"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <HeroRadar active={active} onNavigate={onNavigate} />
        </motion.div>
      </div>
    </section>
  )
}
