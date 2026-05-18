import { motion } from 'framer-motion'
import { projects } from '../data/resume'
import ProjectCard from './ProjectCard'

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 md:px-12 lg:pl-32">
      <div className="max-w-6xl mx-auto">
        <motion.p className="hud-text text-gold mb-2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          MISSION ARCHIVE
        </motion.p>
        <motion.h2 className="section-title mb-4" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          PROJECTS
        </motion.h2>
        <motion.div className="metaphor-divider mb-12" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
