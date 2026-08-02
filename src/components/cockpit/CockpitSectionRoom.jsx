import { motion } from 'framer-motion'
import { navLinks } from '../../data/resume'
import { ROOM_LAYOUTS } from '../../config/sectionRooms'
import SectionAuxPanels from './SectionAuxPanels'

function CockpitInterior() {
  return (
    <div className="cockpit-interior absolute inset-0 pointer-events-none" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 40%, rgba(196,30,58,0.12) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 20% 80%, rgba(61,232,255,0.06) 0%, transparent 50%), linear-gradient(180deg, rgba(8,6,12,0.95) 0%, rgba(12,8,16,0.92) 100%)',
        }}
      />
      <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d="M 0 0 H 100 V 100 H 0 Z M 4 8 Q 50 0 96 8 L 94 92 Q 50 100 6 92 Z"
          fill="rgba(4,6,10,0.6)"
          fillRule="evenodd"
        />
        <line x1="4" y1="8" x2="96" y2="8" stroke="rgba(196,30,58,0.35)" strokeWidth="0.3" />
        <line x1="6" y1="92" x2="94" y2="92" stroke="rgba(61,232,255,0.2)" strokeWidth="0.2" />
      </svg>
      <div className="absolute left-0 top-[15%] bottom-[20%] w-3 bg-gradient-to-b from-transparent via-gundam/20 to-transparent" />
      <div className="absolute right-0 top-[15%] bottom-[20%] w-3 bg-gradient-to-b from-transparent via-cyan/15 to-transparent" />
      <div className="absolute top-0 left-[8%] right-[8%] h-8 border-b border-gundam/25 bg-gradient-to-b from-gundam/10 to-transparent" />
    </div>
  )
}

export default function CockpitSectionRoom({ sectionId, visible, children, onNavigate }) {
  const layout = ROOM_LAYOUTS[sectionId] ?? ROOM_LAYOUTS.hero
  const meta = navLinks.find((l) => l.id === sectionId)

  return (
    <motion.div
      className="cockpit-room absolute inset-0 overflow-hidden"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      <CockpitInterior />

      <motion.div
        className="relative z-10 h-full p-3 md:p-5 flex flex-col"
        initial={false}
        animate={{ opacity: visible ? 0.92 : 0, y: visible ? 0 : 16 }}
        transition={{ duration: 0.5, delay: visible ? 0.08 : 0 }}
      >
        <div className="flex items-center justify-between mb-2 md:mb-3 shrink-0">
          <p className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-gundam/80">
            {layout.roomTitle}
          </p>
          <p className="font-mono text-[9px] text-cyan/45">
            {meta?.icon} {meta?.label}
          </p>
        </div>

        <div className="cockpit-grid flex-1 min-h-0">
          <motion.div
            className="cockpit-monitor primary"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.97 }}
            transition={{ delay: visible ? 0.15 : 0, duration: 0.45 }}
          >
            <p className="monitor-label text-cyan/75">{layout.primaryLabel}</p>
            <div className="monitor-screen primary-screen cockpit-scroll cockpit-content">{children}</div>
          </motion.div>

          <SectionAuxPanels sectionId={sectionId} layout={layout} onNavigate={onNavigate} />
        </div>
      </motion.div>
    </motion.div>
  )
}
