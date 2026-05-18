import { motion } from 'framer-motion'
import { education } from '../data/resume'
import InterestToggles from './InterestToggles'

const fade = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
}

export default function About() {
  return (
    <section id="about" className="py-24 px-6 md:px-12 lg:pl-32 max-w-5xl mx-auto">
      <motion.p className="hud-text text-gold mb-2" variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
        PROFILE DATA
      </motion.p>
      <motion.h2 className="section-title mb-4" variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
        ABOUT
      </motion.h2>
      <motion.div className="metaphor-divider" variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2} />

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div className="p3-panel hover-pop p-8" variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3}>
          <p className="text-ice/80 leading-relaxed mb-6">
            I'm a {education.degree} student at {education.school} with a minor in {education.minor}.
            My work sits at the intersection of firmware, robotics, and systems that have to work under real
            constraints — power budgets, timing, and hardware that doesn't forgive mistakes.
          </p>
          <p className="text-ice/70 leading-relaxed">
            From swarm robotics at Atombot Lab to high-voltage EV systems at SPARK, I care about building
            things that are reliable, measurable, and worth deploying.
          </p>
        </motion.div>

        <motion.div className="space-y-4" variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={4}>
          <InterestToggles />
          <motion.div className="p3-panel hover-pop p-6">
            <p className="hud-text mb-2">AWARDS</p>
            <ul className="space-y-1 text-sm text-ice/70">
              {education.awards.slice(0, 3).map((a) => (
                <li key={a}>· {a}</li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
