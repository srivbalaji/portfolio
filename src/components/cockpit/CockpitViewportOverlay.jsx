import { motion, AnimatePresence } from 'framer-motion'
import {
  navLinks,
  resolveWorkEntry,
  relatedSelectionsForSkill,
  skillSelectionKey,
  experience,
  projects,
} from '../../data/resume'
import { ROOM_LAYOUTS } from '../../config/sectionRooms'
import SectionAuxPanels from './SectionAuxPanels'
import { HoloPanel } from '../HoloTransmission'
import InterestGallery from '../InterestGallery'
import WorkBayDetail from '../WorkBayDetail'

/** Semi-transparent cockpit interior overlaid on the Gundam viewport (right panel) */
export default function CockpitViewportOverlay({
  sectionId,
  visible,
  compact = false,
  onNavigate,
  onScrollToExperience,
  activeExperienceId,
  onActiveExperienceChange,
  holoChannel,
  onHoloClose,
  onHoloOpen,
  aboutInterestChecked,
  aboutFrameOverride,
  onToggleAboutInterest,
  onToggleAboutFrame,
  selectedWork,
  onSelectWork,
  selectedSkill,
  onSelectSkillRelated,
}) {
  const layout = ROOM_LAYOUTS[sectionId] ?? ROOM_LAYOUTS.hero
  const meta = navLinks.find((l) => l.id === sectionId)
  const showHolo = sectionId === 'contact' && holoChannel
  const showAboutArchive = sectionId === 'about' && aboutInterestChecked
  const showWorkBay = sectionId === 'work' || sectionId === 'experience' || sectionId === 'projects'
  const showSkillHolo = sectionId === 'skills'
  const workEntry = showWorkBay || showSkillHolo ? resolveWorkEntry(selectedWork) : null
  const skillRelated = showSkillHolo && selectedSkill ? relatedSelectionsForSkill(selectedSkill) : []
  const bayLayout = showWorkBay || showSkillHolo

  if (sectionId === 'hero') return null

  const gridClass = [
    'viewport-cockpit-grid flex-1 min-h-0',
    bayLayout ? 'work-bay-layout' : '',
    showHolo ? 'contact-holo-layout contact-holo-compact' : '',
    showAboutArchive ? 'about-holo-layout' : '',
    compact && !showHolo && !showAboutArchive && !bayLayout ? 'hidden' : '',
    compact && showAboutArchive ? 'about-holo-compact' : '',
    compact && bayLayout ? 'work-bay-compact' : '',
    showHolo && holoChannel === 'RESUME' ? 'contact-holo-resume' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const primaryLabel = showHolo
    ? 'HOLO TRANSMISSION'
    : showSkillHolo && selectedSkill
      ? `LINK · ${selectedSkill}`
      : layout.primaryLabel

  return (
    <motion.div
      className="absolute inset-0 z-20 overflow-hidden pointer-events-none"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 80% at 50% 45%, rgba(8,6,14,0.55) 0%, rgba(6,4,10,0.72) 100%), linear-gradient(180deg, rgba(196,30,58,0.08) 0%, transparent 40%)',
        }}
      />

      <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d="M 0 0 H 100 V 100 H 0 Z M 6 10 Q 50 2 94 10 L 92 90 Q 50 98 8 90 Z"
          fill="rgba(4,6,10,0.35)"
          fillRule="evenodd"
        />
        <line x1="6" y1="10" x2="94" y2="10" stroke="rgba(196,30,58,0.4)" strokeWidth="0.4" />
        <line x1="8" y1="90" x2="92" y2="90" stroke="rgba(61,232,255,0.25)" strokeWidth="0.3" />
        <ellipse cx="50" cy="48" rx="38" ry="36" fill="none" stroke="rgba(61,232,255,0.12)" strokeWidth="0.3" />
      </svg>

      <div className="absolute left-2 top-[12%] bottom-[18%] w-1 bg-gradient-to-b from-transparent via-gundam/30 to-transparent" />
      <div className="absolute right-2 top-[12%] bottom-[18%] w-1 bg-gradient-to-b from-transparent via-cyan/20 to-transparent" />

      <motion.div
        className={`relative z-10 h-full flex flex-col pointer-events-auto ${compact ? 'p-2' : 'p-3 md:p-4'}`}
        initial={false}
        animate={{ opacity: visible ? 0.92 : 0, y: visible ? 0 : 12 }}
        transition={{ duration: 0.5, delay: visible ? 0.1 : 0 }}
      >
        {!compact && (
          <div className="flex items-center justify-between mb-2 shrink-0">
            <p className="font-mono text-[8px] md:text-[9px] tracking-[0.28em] text-gundam/85">
              {layout.roomTitle}
            </p>
            <p className="font-mono text-[8px] text-cyan/55">
              {meta?.icon} {meta?.label}
            </p>
          </div>
        )}

        <div className={gridClass}>
          <motion.div
            className={`cockpit-monitor primary viewport-primary ${showHolo ? 'contact-holo-primary' : ''} ${
              showAboutArchive ? 'about-holo-primary' : ''
            } ${bayLayout ? 'work-bay-primary' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="monitor-label text-cyan/70">{primaryLabel}</p>
            <div
              className={`monitor-screen aux-screen flex flex-col min-h-0 ${
                showHolo || showAboutArchive || bayLayout ? 'flex-1 p-2' : 'items-center justify-center'
              }`}
            >
              <AnimatePresence mode="wait">
                {showHolo ? (
                  <HoloPanel
                    key={holoChannel}
                    channel={holoChannel}
                    onClose={onHoloClose}
                    onOpen={onHoloOpen}
                    compact
                  />
                ) : showAboutArchive ? (
                  <motion.div
                    key="about-archive"
                    className="flex-1 min-h-0 w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <InterestGallery
                      checked={aboutInterestChecked}
                      frameOverride={aboutFrameOverride}
                      onToggleFrame={onToggleAboutFrame}
                      variant="cockpit"
                    />
                  </motion.div>
                ) : showSkillHolo ? (
                  <motion.div
                    key={`skill-holo-${selectedSkill || 'idle'}`}
                    className="flex-1 min-h-0 w-full flex flex-col"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {!selectedSkill ? (
                      <div className="h-full flex flex-col items-center justify-center gap-2 px-3 text-center">
                        <p className="font-mono text-[9px] tracking-[0.22em] text-cyan/50 uppercase">
                          Awaiting skill link
                        </p>
                        <p className="font-mono text-[8px] text-ice/40 leading-relaxed max-w-[16rem]">
                          Tap a skill on the left to project related experience or projects here.
                        </p>
                      </div>
                    ) : (
                      <>
                        {skillRelated.length > 1 && (
                          <div className="flex flex-wrap gap-1 mb-1.5 shrink-0">
                            {skillRelated.map((sel) => {
                              const active = skillSelectionKey(sel) === skillSelectionKey(selectedWork)
                              const label = shortRelatedLabel(sel)
                              return (
                                <button
                                  key={skillSelectionKey(sel)}
                                  type="button"
                                  onClick={() => onSelectSkillRelated?.(sel)}
                                  className={`font-mono text-[7px] tracking-wide px-1.5 py-0.5 border transition-colors truncate max-w-[7.5rem] ${
                                    active
                                      ? 'border-cyan/60 text-cyan bg-cyan/15'
                                      : 'border-ice/20 text-ice/50 hover:border-cyan/40 hover:text-cyan/80'
                                  }`}
                                >
                                  {label}
                                </button>
                              )
                            })}
                          </div>
                        )}
                        <div className="flex-1 min-h-0">
                          <WorkBayDetail entry={workEntry} />
                        </div>
                      </>
                    )}
                  </motion.div>
                ) : showWorkBay ? (
                  <motion.div
                    key="work-bay"
                    className="flex-1 min-h-0 w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <WorkBayDetail entry={workEntry} />
                  </motion.div>
                ) : (
                  <motion.p
                    key="ext-view"
                    className="font-mono text-ice/50 text-center px-2 text-[10px] md:text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    External view active · {meta?.label} sector
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {!showHolo && !showAboutArchive && !(compact && bayLayout) && (
            <div className={`viewport-aux-grid ${bayLayout ? 'work-bay-aux' : ''} ${compact ? 'hidden' : ''}`}>
              <SectionAuxPanels
                sectionId={sectionId}
                layout={layout}
                onNavigate={onNavigate}
                onScrollToExperience={onScrollToExperience}
                activeExperienceId={activeExperienceId}
                onActiveExperienceChange={onActiveExperienceChange}
                onSelectWork={onSelectWork}
                selectedWork={selectedWork}
              />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function shortRelatedLabel(sel) {
  if (sel.kind === 'experience') {
    const job = experience.find((e) => e.id === sel.id)
    if (!job) return sel.id
    if (sel.subsectionId) {
      const sub = job.subsections?.find((s) => s.id === sel.subsectionId)
      return sub?.title || job.org
    }
    return job.org
  }
  const project = projects.find((p) => p.id === sel.id)
  return project?.title || sel.id
}
