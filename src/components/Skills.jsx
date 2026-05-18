import { motion } from 'framer-motion'
import { skills, education } from '../data/resume'

function SkillBar({ label, delay, width = '85%' }) {
  return (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <div className="flex justify-between mb-1">
        <span className="font-ui text-sm text-ice/80 tracking-wider">{label}</span>
      </div>
      <div className="h-1.5 bg-panelLight rounded overflow-hidden border border-cyan/10">
        <motion.div
          className="h-full bg-gradient-to-r from-cyanDim to-cyan"
          initial={{ width: 0 }}
          whileInView={{ width }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: delay + 0.2 }}
        />
      </div>
    </motion.div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 md:px-12 lg:pl-32 max-w-5xl mx-auto">
      <motion.p className="hud-text text-gold mb-2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        SYSTEM DIAGNOSTICS
      </motion.p>
      <motion.h2 className="section-title mb-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        SKILLS
      </motion.h2>
      <motion.div className="metaphor-divider mb-12" />

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div className="p3-panel hover-pop p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="hud-text mb-6 text-cyan">LANGUAGES</p>
          <div className="flex flex-wrap gap-2">
            {skills.languages.map((s, i) => (
              <motion.span
                key={s}
                className="px-3 py-2 border border-cyan/30 font-ui text-sm text-ice tracking-wider hover:bg-cyan/10 transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, borderColor: 'rgba(61,232,255,0.8)' }}
              >
                {s}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div className="p3-panel hover-pop p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="hud-text mb-6 text-cyan">HARDWARE & TOOLS</p>
          <motion.div className="flex flex-wrap gap-2">
            {skills.hardware.map((s, i) => (
              <motion.span
                key={s}
                className="px-3 py-2 border border-atlas/40 font-ui text-sm text-ice/90 tracking-wider"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                {s}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div className="p3-panel hover-pop p-8 mt-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <p className="hud-text mb-4">COURSEWORK</p>
        <motion.div className="grid sm:grid-cols-2 gap-2">
          {education.coursework.map((c, i) => (
            <SkillBar key={c} label={c} delay={i * 0.05} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
