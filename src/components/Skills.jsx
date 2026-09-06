import { motion } from 'framer-motion'
import { skills, education, relatedSelectionsForSkill } from '../data/resume'

function SkillTags({ items, borderClass, selectedSkill, onSelectSkill }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((s, i) => {
        const linked = relatedSelectionsForSkill(s).length > 0
        const selected = selectedSkill === s
        return (
          <motion.button
            key={s}
            type="button"
            disabled={!linked}
            onClick={() => onSelectSkill?.(s)}
            className={`px-3 py-2 border font-ui text-sm tracking-wider transition-all ${borderClass} ${
              selected
                ? 'bg-cyan/20 border-cyan text-ice ring-1 ring-cyan/50'
                : linked
                  ? 'text-ice cursor-pointer hover:bg-cyan/10'
                  : 'text-ice/50 cursor-default opacity-70'
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            title={linked ? `Show related work for ${s}` : undefined}
          >
            {s}
          </motion.button>
        )
      })}
    </div>
  )
}

function CourseList({ items, accentClass = 'text-gundam' }) {
  return (
    <ul className="space-y-2 text-sm text-ice/65">
      {items.map((c) => (
        <li key={c} className="flex gap-2">
          <span className={`${accentClass} shrink-0`}>›</span>
          {c}
        </li>
      ))}
    </ul>
  )
}

export default function Skills({ embedded, selectedSkill, onSelectSkill }) {
  return (
    <section id="skills" className={embedded ? 'pb-8' : 'py-24 px-6 md:px-12 lg:pl-32 max-w-5xl mx-auto'}>
      <motion.p className="hud-text text-gold mb-2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        SYSTEM DIAGNOSTICS
      </motion.p>
      <motion.h2 className="section-title mb-2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        SKILLS
      </motion.h2>
      <motion.p
        className="font-mono text-[10px] tracking-[0.18em] text-ice/45 mb-4 uppercase"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Tap a skill · loads related hologram
      </motion.p>
      <motion.div className="metaphor-divider mb-12" />

      <div className={`grid gap-6 ${embedded ? 'grid-cols-1' : 'md:grid-cols-2 gap-8'}`}>
        <motion.div className="p3-panel hover-pop p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="hud-text mb-6 text-cyan">LANGUAGES</p>
          <SkillTags
            items={skills.languages}
            borderClass="border-cyan/30"
            selectedSkill={selectedSkill}
            onSelectSkill={onSelectSkill}
          />
        </motion.div>

        <motion.div className="p3-panel hover-pop p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="hud-text mb-6 text-cyan">SYSTEMS & FIRMWARE</p>
          <SkillTags
            items={skills.systems}
            borderClass="border-gundam/35"
            selectedSkill={selectedSkill}
            onSelectSkill={onSelectSkill}
          />
        </motion.div>

        <motion.div className="p3-panel hover-pop p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="hud-text mb-6 text-cyan">HARDWARE</p>
          <SkillTags
            items={skills.hardware}
            borderClass="border-accent/40"
            selectedSkill={selectedSkill}
            onSelectSkill={onSelectSkill}
          />
        </motion.div>

        <motion.div className="p3-panel hover-pop p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="hud-text mb-6 text-cyan">TOOLS</p>
          <SkillTags
            items={skills.tools}
            borderClass="border-cyan/25"
            selectedSkill={selectedSkill}
            onSelectSkill={onSelectSkill}
          />
        </motion.div>
      </div>

      <motion.div className="p3-panel hover-pop p-8 mt-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <p className="hud-text mb-4">COURSEWORK</p>

        {education.coursework?.length > 0 && (
          <div className="mb-6">
            <p className="hud-text mb-3 text-ice/70">COMPLETED</p>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
              {education.coursework.map((c) => (
                <div key={c} className="flex gap-2 text-sm text-ice/65">
                  <span className="text-gundam shrink-0">›</span>
                  {c}
                </div>
              ))}
            </div>
          </div>
        )}

        {education.inProgress?.length > 0 && (
          <div className="mb-6">
            <p className="hud-text mb-3 text-gold/80">IN PROGRESS</p>
            <CourseList items={education.inProgress} />
          </div>
        )}

        {education.planned?.length > 0 && (
          <div>
            <p className="hud-text mb-3 text-cyan/70">PLANNED</p>
            <CourseList items={education.planned} accentClass="text-cyan/60" />
          </div>
        )}
      </motion.div>
    </section>
  )
}
