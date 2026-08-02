import { useState } from 'react'
import { motion } from 'framer-motion'
import { profile, education, projects, experience, skills, navLinks } from '../../data/resume'

function AuxMonitor({ label, children, delay = 0.15, accent = 'cyan', className = '' }) {
  const border =
    accent === 'crimson' ? 'border-gundam/40' : accent === 'gold' ? 'border-gold/35' : 'border-cyan/30'
  const tag =
    accent === 'crimson' ? 'text-gundam/80' : accent === 'gold' ? 'text-gold/80' : 'text-cyan/70'

  return (
    <motion.div
      className={`cockpit-monitor aux ${border} ${className}`}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.45 }}
    >
      <p className={`monitor-label ${tag}`}>{label}</p>
      <div className="monitor-screen aux-screen">{children}</div>
    </motion.div>
  )
}

function StatusPanel() {
  return (
    <div className="space-y-1.5 font-mono text-[9px] md:text-[10px]">
      <p className="text-hud">● ONLINE</p>
      <p className="text-ice/60">GPA {profile.gpa}</p>
      <p className="text-ice/50">{profile.graduation}</p>
      <p className="text-gundam/70">{profile.tagline.split(' · ')[0]}</p>
    </div>
  )
}

function LinkPanel({ onNavigate }) {
  return (
    <div className="grid grid-cols-3 gap-1">
      {navLinks.slice(1, 4).map((l) => (
        <button
          key={l.id}
          type="button"
          onClick={() => onNavigate?.(l.id)}
          className="text-[8px] font-mono border border-gundam/25 text-ice/50 hover:text-gundam hover:border-gundam/50 py-1 transition-colors"
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}

function EducationPanel() {
  return (
    <div className="font-mono text-[9px] space-y-1 text-ice/60">
      <p>{education.school}</p>
      <p className="text-cyan/60">{education.degree}</p>
      <p>Minor: {education.minor}</p>
    </div>
  )
}

function InterestsPanel() {
  return (
    <ul className="font-mono text-[8px] text-ice/50 space-y-0.5">
      {profile.interests.slice(0, 4).map((i) => (
        <li key={i} className="text-gundam/60">› {i}</li>
      ))}
    </ul>
  )
}

function ActiveProjectsPanel() {
  const active = projects.filter((p) => p.status === 'ONGOING').length
  return (
    <div className="font-mono text-[9px]">
      <p className="text-gundam text-lg font-display">{active}</p>
      <p className="text-ice/50">ACTIVE OPS</p>
      <p className="text-ice/40 mt-1">{projects.length} total</p>
    </div>
  )
}

function TechPanel() {
  const tags = [...new Set(projects.flatMap((p) => p.tech))].slice(0, 6)
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((t) => (
        <span key={t} className="text-[7px] font-mono px-1 py-0.5 border border-gundam/25 text-gundam/70">
          {t}
        </span>
      ))}
    </div>
  )
}

function TimelinePanel({ onScrollToExperience, activeEntryId, onActiveEntryChange }) {
  return (
    <div className="experience-timeline h-full min-h-[120px] py-1">
      <div className="relative h-full pl-4">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan/70 via-gundam/50 to-cyan/20" />
        <ul className="relative flex flex-col justify-between h-full gap-2">
          {experience.map((job) => {
            const isActive = activeEntryId === job.id
            const year = job.period.match(/\d{4}/)?.[0] ?? ''
            return (
              <li key={job.id}>
                <button
                  type="button"
                  onClick={() => {
                    onActiveEntryChange?.(job.id)
                    onScrollToExperience?.(job.id)
                  }}
                  className={`group w-full text-left flex items-start gap-2 transition-colors ${
                    isActive ? 'text-cyan' : 'text-ice/55 hover:text-cyan/90'
                  }`}
                >
                  <span
                    className={`relative z-10 mt-0.5 shrink-0 w-4 h-4 rounded-full border-2 transition-all ${
                      isActive
                        ? 'border-cyan bg-cyan/30 shadow-[0_0_8px_rgba(61,232,255,0.55)]'
                        : 'border-gundam/50 bg-void group-hover:border-cyan/60'
                    }`}
                  />
                  <span className="min-w-0">
                    <span className="block font-mono text-[8px] tracking-wider text-gundam/70">{year}</span>
                    <span className="block font-mono text-[9px] leading-tight truncate">{job.org}</span>
                    <span className="block font-mono text-[8px] text-ice/40 truncate">{job.title}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

function RolesPanel() {
  return (
    <p className="font-mono text-[8px] text-ice/50 leading-snug">
      {experience.length} deployments · embedded & firmware
    </p>
  )
}

function LanguagesPanel() {
  return (
    <div className="flex flex-wrap gap-1">
      {skills.languages.slice(0, 5).map((l) => (
        <span key={l} className="text-[7px] font-mono text-cyan/70 border border-cyan/20 px-1">
          {l}
        </span>
      ))}
    </div>
  )
}

function HardwarePanel() {
  return (
    <div className="flex flex-wrap gap-1">
      {skills.hardware.slice(0, 6).map((h) => (
        <span key={h} className="text-[7px] font-mono text-gundam/65 border border-gundam/20 px-1">
          {h}
        </span>
      ))}
    </div>
  )
}

function ChannelsPanel() {
  return (
    <div className="font-mono text-[8px] space-y-1">
      <p className="text-gundam/80 truncate">{profile.email}</p>
      <p className="text-cyan/60">LinkedIn · GitHub</p>
    </div>
  )
}

function SignalPanel() {
  return (
    <motion.p
      className="font-mono text-[9px] text-hud text-center"
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      SIGNAL STRONG
    </motion.p>
  )
}

const AUX_MAP = {
  status: { label: 'SYS.STATUS', render: () => <StatusPanel /> },
  link: { label: 'QUICK NAV', render: (p) => <LinkPanel onNavigate={p.onNavigate} /> },
  education: { label: 'EDU.FILE', render: () => <EducationPanel /> },
  interests: { label: 'INTERESTS', render: () => <InterestsPanel /> },
  active: { label: 'OPS.COUNT', render: () => <ActiveProjectsPanel /> },
  tech: { label: 'TECH.STACK', render: () => <TechPanel /> },
  timeline: {
    label: 'TIMELINE',
    className: 'aux-timeline',
    render: (p) => (
      <TimelinePanel
        onScrollToExperience={p.onScrollToExperience}
        activeEntryId={p.activeExperienceId}
        onActiveEntryChange={p.onActiveExperienceChange}
      />
    ),
  },
  roles: { label: 'ROLE.SUM', className: 'aux-roles', render: () => <RolesPanel /> },
  languages: { label: 'LANG.MOD', render: () => <LanguagesPanel /> },
  hardware: { label: 'HW.MOD', render: () => <HardwarePanel /> },
  channels: { label: 'CHANNELS', render: () => <ChannelsPanel /> },
  signal: { label: 'SIGNAL', render: () => <SignalPanel /> },
}

export default function SectionAuxPanels({ sectionId, layout, onNavigate, onScrollToExperience, activeExperienceId, onActiveExperienceChange }) {
  if (!layout?.aux?.length) return null

  return (
    <>
      {layout.aux.map((key, i) => {
        const aux = AUX_MAP[key]
        if (!aux) return null
        return (
          <AuxMonitor
            key={key}
            label={aux.label}
            accent={layout.accent}
            delay={0.25 + i * 0.1}
            className={aux.className ?? ''}
          >
            {aux.render({
              onNavigate,
              onScrollToExperience,
              activeExperienceId,
              onActiveExperienceChange,
            })}
          </AuxMonitor>
        )
      })}
    </>
  )
}
