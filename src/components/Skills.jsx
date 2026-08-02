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

function SkillTags({ items, borderClass }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((s, i) => (
        <motion.span
          key={s}
          className={`px-3 py-2 border font-ui text-sm text-ice tracking-wider transition-colors ${borderClass}`}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04 }}
        >
          {s}
        </motion.span>
      ))}
    </div>
  )
}

export default function Skills({ embedded }) {
  return (
    <section id="skills" className={embedded ? 'pb-8' : 'py-24 px-6 md:px-12 lg:pl-32 max-w-5xl mx-auto'}>
      <motion.p className="hud-text text-gold mb-2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        SYSTEM DIAGNOSTICS
      </motion.p>
      <motion.h2 className="section-title mb-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        SKILLS
      </motion.h2>
      <motion.div className="metaphor-divider mb-12" />

      <div className={`grid gap-6 ${embedded ? 'grid-cols-1' : 'md:grid-cols-2 gap-8'}`}>
        <motion.div className="p3-panel hover-pop p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="hud-text mb-6 text-cyan">LANGUAGES</p>
          <SkillTags items={skills.languages} borderClass="border-cyan/30 hover:bg-cyan/10" />
        </motion.div>

        <motion.div className="p3-panel hover-pop p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="hud-text mb-6 text-cyan">SYSTEMS & FIRMWARE</p>
          <SkillTags items={skills.systems} borderClass="border-gundam/35 text-ice/90" />
        </motion.div>

        <motion.div className="p3-panel hover-pop p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="hud-text mb-6 text-cyan">HARDWARE</p>
          <SkillTags items={skills.hardware} borderClass="border-accent/40 text-ice/90" />
        </motion.div>

        <motion.div className="p3-panel hover-pop p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="hud-text mb-6 text-cyan">TOOLS</p>
          <SkillTags items={skills.tools} borderClass="border-cyan/25 text-ice/80" />
        </motion.div>
      </div>

      <motion.div className="p3-panel hover-pop p-8 mt-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <p className="hud-text mb-4">COURSEWORK</p>
        <motion.div className="grid sm:grid-cols-2 gap-2 mb-6">
          {education.coursework.map((c, i) => (
            <SkillBar key={c} label={c} delay={i * 0.05} />
          ))}
        </motion.div>
        {education.inProgress?.length > 0 && (
          <>
            <p className="hud-text mb-3 text-gold/80">IN PROGRESS</p>
            <ul className="space-y-2 text-sm text-ice/65">
              {education.inProgress.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="text-gundam shrink-0">›</span>
                  {c}
                </li>
              ))}
            </ul>
          </>
        )}
      </motion.div>
    </section>
  )
}
