import { useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../data/resume'
import SectorHub from './SectorHub'

export default function Hero({ embedded, onNavigate }) {
  const [selectedId, setSelectedId] = useState('hero')

  const handleEngage = (id) => {
    if (id && id !== 'hero') onNavigate?.(id)
  }

  return (
    <section id="hero" className={embedded ? 'pb-6' : 'relative min-h-screen pt-24 pb-16 px-6 md:px-12 lg:pl-32'}>
      {!embedded && (
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
        </motion.div>
      )}

      <div className={embedded ? '' : 'relative z-10 max-w-6xl mx-auto min-h-[calc(100vh-8rem)] flex items-center'}>
        <div className="w-full">
          <motion.p
            className="hud-text mb-3 text-gold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            PILOT REGISTRY — UM-AA
          </motion.p>

          <motion.h1
            className={`font-display font-bold text-ice leading-none mb-4 ${
              embedded ? 'text-3xl sm:text-4xl md:text-6xl' : 'text-5xl sm:text-6xl md:text-7xl xl:text-8xl'
            }`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 70 }}
          >
            {profile.name.split(' ').map((word) => (
              <span key={word} className="inline-block mr-3 last:mr-0">
                {word}
              </span>
            ))}
          </motion.h1>

          <motion.div
            className="flex flex-wrap gap-2 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            {profile.tagline.split(' · ').map((t) => (
              <span
                key={t}
                className="px-3 py-1 font-mono text-xs tracking-widest border border-cyan/35 text-cyan bg-cyan/5"
              >
                {t}
              </span>
            ))}
          </motion.div>

          <motion.p
            className={`text-ice/70 font-light leading-relaxed mb-6 ${embedded ? 'text-base max-w-lg' : 'text-lg md:text-xl max-w-2xl'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            {profile.statement}
          </motion.p>

          <motion.div
            className="p3-panel p-5 md:p-6 max-w-md mb-2"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55 }}
          >
            <p className="hud-text mb-1.5 text-[10px]">STATUS</p>
            <p className="font-mono text-ice/90 text-sm tracking-wide">
              {profile.subtitle} · GPA {profile.gpa}
            </p>
            <p className="font-mono text-cyan/60 text-xs mt-1">{profile.graduation}</p>
          </motion.div>

          {embedded && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              <SectorHub
                selectedId={selectedId}
                onSelect={setSelectedId}
                onEngage={handleEngage}
              />
            </motion.div>
          )}

          {!embedded && (
            <motion.div
              className="flex flex-wrap gap-3 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              <button
                type="button"
                onClick={() => onNavigate?.('projects')}
                className="px-6 py-2.5 font-mono text-xs tracking-widest bg-cyan text-void hover:bg-ice transition-colors"
              >
                VIEW PROJECTS
              </button>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 font-mono text-xs tracking-widest border border-cyan/45 text-cyan hover:bg-cyan/10 transition-colors"
              >
                LINKEDIN
              </a>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
