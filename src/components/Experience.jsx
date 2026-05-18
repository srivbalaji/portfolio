import { motion } from 'framer-motion'
import { experience } from '../data/resume'

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6 md:px-12 lg:pl-32 max-w-4xl mx-auto">
      <motion.p className="hud-text text-gold mb-2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        COMBAT LOG
      </motion.p>
      <motion.h2 className="section-title mb-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        EXPERIENCE
      </motion.h2>
      <motion.div className="metaphor-divider mb-12" />

      <motion.div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-cyan via-atlas to-transparent" />
        <div className="space-y-8">
          {experience.map((job, i) => (
            <motion.div
              key={job.id}
              className="relative pl-12"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="absolute left-2 top-2 w-4 h-4 border-2 border-cyan bg-void rotate-45" />
              <motion.div className="p3-panel hover-pop p-6 md:p-8">
                <div className="flex flex-wrap justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-display text-lg text-ice tracking-wide">{job.title}</h3>
                    <p className="font-ui text-cyan text-sm tracking-wider">{job.org}</p>
                  </div>
                  <span className="hud-text text-ice/50">{job.period}</span>
                </div>
                <p className="text-xs text-ice/40 mb-4 font-ui tracking-wide">{job.location}</p>
                <ul className="space-y-2">
                  {job.points.map((pt) => (
                    <li key={pt.slice(0, 40)} className="text-sm text-ice/70 flex gap-2">
                      <span className="text-gundam shrink-0">■</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
