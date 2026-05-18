import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProjectCard({ project, index }) {
  const [expanded, setExpanded] = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    <motion.article
      className="p3-panel hover-pop overflow-hidden group"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
    >
      <motion.div className="relative h-48 bg-panelLight overflow-hidden border-b border-cyan/20">
        {!imgError ? (
          <img
            src={project.image}
            alt={project.imageAlt}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center grid-bg gundam-stripe">
            <span className="font-display text-4xl text-cyan/30 mb-2">▣</span>
            <p className="hud-text text-cyan/40">AWAITING IMAGE</p>
            <p className="text-xs text-ice/30 mt-1 px-4 text-center font-mono">
              public{project.image}
            </p>
          </div>
        )}
        <span className="absolute top-3 right-3 px-2 py-0.5 font-ui text-xs tracking-widest bg-void/80 border border-cyan/40 text-cyan">
          {project.status}
        </span>
      </motion.div>

      <motion.div className="p-6">
        <h3 className="font-display text-xl text-ice mb-2 tracking-wide">{project.title}</h3>
        <p className="text-ice/70 text-sm leading-relaxed mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 text-xs font-ui tracking-wider border border-cyan/25 text-cyan/90"
            >
              {t}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="font-ui text-sm tracking-widest text-gold hover:text-ice transition-colors"
        >
          {expanded ? '▼ COLLAPSE' : '▶ TECHNICAL READOUT'}
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.ul
              className="mt-4 pt-4 border-t border-cyan/15 space-y-2"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {project.details.map((d) => (
                <li key={d} className="text-sm text-ice/60 flex gap-2">
                  <span className="text-hud shrink-0">›</span> {d}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.article>
  )
}
