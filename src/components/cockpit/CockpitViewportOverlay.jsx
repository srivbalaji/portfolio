import { motion, AnimatePresence } from 'framer-motion'
import { navLinks } from '../../data/resume'
import { ROOM_LAYOUTS } from '../../config/sectionRooms'
import SectionAuxPanels from './SectionAuxPanels'
import { HoloPanel } from '../HoloTransmission'

/** Semi-transparent cockpit interior overlaid on the Gundam viewport (right panel) */
export default function CockpitViewportOverlay({
  sectionId,
  visible,
  onNavigate,
  onScrollToExperience,
  activeExperienceId,
  onActiveExperienceChange,
  holoChannel,
  onHoloClose,
  onHoloOpen,
}) {
  const layout = ROOM_LAYOUTS[sectionId] ?? ROOM_LAYOUTS.hero
  const meta = navLinks.find((l) => l.id === sectionId)
  const showHolo = sectionId === 'contact' && holoChannel

  if (sectionId === 'hero') return null

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
        className="relative z-10 h-full p-3 md:p-4 flex flex-col pointer-events-auto"
        initial={false}
        animate={{ opacity: visible ? 0.88 : 0, y: visible ? 0 : 12 }}
        transition={{ duration: 0.5, delay: visible ? 0.1 : 0 }}
      >
        <div className="flex items-center justify-between mb-2 shrink-0">
          <p className="font-mono text-[8px] md:text-[9px] tracking-[0.28em] text-gundam/85">
            {layout.roomTitle}
          </p>
          <p className="font-mono text-[8px] text-cyan/55">
            {meta?.icon} {meta?.label}
          </p>
        </div>

        <div
          className={`viewport-cockpit-grid flex-1 min-h-0 ${sectionId === 'experience' ? 'experience-layout' : ''} ${showHolo ? 'contact-holo-layout' : ''}`}
        >
          <motion.div
            className={`cockpit-monitor primary viewport-primary ${sectionId === 'experience' ? 'experience-primary' : ''} ${showHolo ? 'contact-holo-primary' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="monitor-label text-cyan/70">
              {showHolo ? 'HOLO TRANSMISSION' : layout.primaryLabel}
            </p>
            <div className={`monitor-screen aux-screen flex flex-col ${showHolo ? 'min-h-[120px] p-2' : 'items-center justify-center'}`}>
              <AnimatePresence mode="wait">
                {showHolo ? (
                  <HoloPanel
                    key={holoChannel}
                    channel={holoChannel}
                    onClose={onHoloClose}
                    onOpen={onHoloOpen}
                    compact
                  />
                ) : (
                  <motion.p
                    key="ext-view"
                    className={`font-mono text-ice/50 text-center px-2 ${sectionId === 'experience' ? 'text-[8px] leading-tight' : 'text-[10px] md:text-xs'}`}
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

          <div className={`viewport-aux-grid ${sectionId === 'experience' ? 'experience-aux' : ''}`}>
            <SectionAuxPanels
              sectionId={sectionId}
              layout={layout}
              onNavigate={onNavigate}
              onScrollToExperience={onScrollToExperience}
              activeExperienceId={activeExperienceId}
              onActiveExperienceChange={onActiveExperienceChange}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
