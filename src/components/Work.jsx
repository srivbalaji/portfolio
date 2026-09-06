import { motion } from 'framer-motion'
import { resolveWorkFeed } from '../data/resume'
import ProjectCard from './ProjectCard'

export default function Work({ embedded, selectedWork, onSelectWork }) {
  const feed = resolveWorkFeed()

  return (
    <section id="work" className={embedded ? 'pb-8' : 'py-24 px-6 md:px-12 lg:pl-32 max-w-4xl mx-auto'}>
      <motion.p
        className="hud-text text-gold mb-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        DEPLOYMENT LOG
      </motion.p>
      <motion.h2
        className="section-title mb-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        PROJECTS & EXPERIENCE
      </motion.h2>
      <motion.p
        className="font-mono text-[10px] tracking-[0.18em] text-ice/45 mb-4 uppercase"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Click an entry · loads Deployment Bay
      </motion.p>
      <motion.div className="metaphor-divider mb-10" />

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-cyan via-accent to-transparent" />
        <div className="space-y-8">
          {feed.map((item, i) =>
            item.kind === 'experience' ? (
              <ExperienceBlock
                key={`exp-${item.id}`}
                job={item}
                index={i}
                selectedWork={selectedWork}
                onSelectWork={onSelectWork}
              />
            ) : (
              <ProjectBlock
                key={`proj-${item.id}`}
                project={item}
                index={i}
                selected={selectedWork?.kind === 'project' && selectedWork?.id === item.id}
                onSelect={() => onSelectWork?.({ kind: 'project', id: item.id })}
              />
            )
          )}
        </div>
      </div>
    </section>
  )
}

function ExperienceBlock({ job, index, selectedWork, onSelectWork }) {
  const parentSelected =
    selectedWork?.kind === 'experience' &&
    selectedWork?.id === job.id &&
    !selectedWork?.subsectionId
  const anySelected = selectedWork?.kind === 'experience' && selectedWork?.id === job.id

  return (
    <motion.div
      id={`exp-${job.id}`}
      className="relative pl-12 scroll-mt-6"
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.06, 0.35) }}
    >
      <span
        className={`absolute left-2 top-2 w-4 h-4 border-2 bg-void rotate-45 transition-colors ${
          anySelected ? 'border-cyan shadow-[0_0_10px_rgba(61,232,255,0.45)]' : 'border-cyan'
        }`}
      />
      <div
        className={`w-full text-left p3-panel hover-pop p-5 md:p-7 transition-all ${
          anySelected ? 'ring-1 ring-cyan/50 bg-cyan/5' : ''
        }`}
      >
        <button
          type="button"
          onClick={() => onSelectWork?.({ kind: 'experience', id: job.id })}
          className={`w-full text-left rounded-sm transition-colors ${
            parentSelected ? 'bg-cyan/5' : 'hover:bg-cyan/[0.03]'
          }`}
        >
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-mono text-[9px] tracking-[0.2em] text-cyan/70 border border-cyan/30 px-1.5 py-0.5">
              EXPERIENCE
            </span>
            <span className="hud-text text-ice/45">{job.period}</span>
            {parentSelected && (
              <span className="ml-auto font-mono text-[8px] tracking-wider text-cyan/70 uppercase">In bay</span>
            )}
          </div>
          <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-lg text-ice tracking-wide">{job.title}</h3>
              <p className="font-ui text-cyan text-sm tracking-wider">{job.org}</p>
            </div>
            {job.logo && (
              <img
                src={job.logo}
                alt={`${job.org} logo`}
                className="h-10 w-auto max-w-[120px] object-contain bg-white/95 rounded-sm px-2 py-1 shrink-0 border border-ice/10"
              />
            )}
          </div>
          <p className="text-xs text-ice/40 mb-4 font-ui tracking-wide">{job.location}</p>

          {job.images?.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {job.images.map((img) => (
                <figure
                  key={img.src}
                  className="relative overflow-hidden border border-cyan/20 bg-void/50 aspect-[4/3]"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-90"
                  />
                  {img.caption && (
                    <figcaption className="absolute bottom-0 left-0 right-0 px-1.5 py-1 font-mono text-[7px] sm:text-[8px] tracking-wide truncate bg-void/75 text-ice/75">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </button>

        {job.subsections?.length > 0 && (
          <div className="space-y-3 mb-4">
            {job.subsections.map((sub) => {
              const subSelected =
                selectedWork?.kind === 'experience' &&
                selectedWork?.id === job.id &&
                selectedWork?.subsectionId === sub.id
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() =>
                    onSelectWork?.({ kind: 'experience', id: job.id, subsectionId: sub.id })
                  }
                  className={`w-full text-left border p-3 transition-all ${
                    subSelected
                      ? 'border-cyan/50 bg-cyan/10 ring-1 ring-cyan/40'
                      : 'border-cyan/15 bg-void/30 hover:border-cyan/35 hover:bg-cyan/5'
                  }`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
                    <p className="font-mono text-[10px] tracking-wide text-cyan">{sub.title}</p>
                    <div className="flex items-center gap-2">
                      {sub.period && <span className="font-mono text-[9px] text-ice/40">{sub.period}</span>}
                      {subSelected && (
                        <span className="font-mono text-[7px] tracking-wider text-cyan/70 uppercase">In bay</span>
                      )}
                    </div>
                  </div>
                  {sub.summary && <p className="text-xs text-ice/60 leading-relaxed mb-2">{sub.summary}</p>}
                  {sub.images?.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-2">
                      {sub.images.map((img) => (
                        <figure
                          key={img.src}
                          className="relative overflow-hidden border border-cyan/15 aspect-[4/3] bg-void/50"
                        >
                          <img src={img.src} alt={img.alt} loading="lazy" className="w-full h-full object-cover" />
                          {img.caption && (
                            <figcaption className="absolute bottom-0 inset-x-0 px-1 py-0.5 font-mono text-[6px] sm:text-[7px] bg-void/80 text-ice/70 truncate">
                              {img.caption}
                            </figcaption>
                          )}
                        </figure>
                      ))}
                    </div>
                  )}
                  {sub.bullets?.length > 0 && (
                    <ul className="space-y-1">
                      {sub.bullets.map((b) => (
                        <li key={b.slice(0, 40)} className="text-xs text-ice/65 flex gap-2">
                          <span className="text-gundam shrink-0">·</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </button>
              )
            })}
          </div>
        )}

        <button
          type="button"
          onClick={() => onSelectWork?.({ kind: 'experience', id: job.id })}
          className="w-full text-left"
        >
          {job.points?.length > 0 && (
            <ul className="space-y-2">
              {job.points.map((pt) => (
                <li key={pt.slice(0, 40)} className="text-sm text-ice/70 flex gap-2">
                  <span className="text-gundam shrink-0">■</span>
                  {pt}
                </li>
              ))}
            </ul>
          )}
        </button>
      </div>
    </motion.div>
  )
}

function ProjectBlock({ project, index, selected, onSelect }) {
  return (
    <motion.div
      id={`proj-${project.id}`}
      className="relative pl-12 scroll-mt-6"
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.06, 0.35) }}
    >
      <span
        className={`absolute left-2 top-3 w-4 h-4 border-2 bg-void rotate-45 transition-colors ${
          selected ? 'border-gundam shadow-[0_0_10px_rgba(196,30,58,0.45)]' : 'border-gundam'
        }`}
      />
      <div className="mb-2 flex items-center gap-2 flex-wrap">
        <span className="font-mono text-[9px] tracking-[0.2em] text-gundam/80 border border-gundam/35 px-1.5 py-0.5">
          PROJECT
        </span>
        {project.period && <span className="hud-text text-ice/45">{project.period}</span>}
        {selected && (
          <span className="font-mono text-[8px] tracking-wider text-cyan/70 uppercase">In bay</span>
        )}
      </div>
      <button type="button" onClick={onSelect} className={`w-full text-left block ${selected ? 'ring-1 ring-gundam/40' : ''}`}>
        <ProjectCard project={project} index={index} />
      </button>
    </motion.div>
  )
}
