import { motion } from 'framer-motion'
import { navLinks } from '../data/resume'

function SectorButton({ sector, active, onSelect }) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(sector.id)}
      className={`flex flex-col items-center justify-center p-2 border transition-all min-h-[52px] ${
        active
          ? 'border-cyan bg-cyan/12 shadow-[0_0_16px_rgba(61,232,255,0.15)]'
          : 'border-cyan/20 bg-[#080f18] hover:border-cyan/45 hover:bg-cyan/5'
      }`}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="font-display text-sm text-cyan">{sector.icon}</span>
      <span className="font-mono text-[7px] tracking-[0.18em] text-cyan/60 mt-0.5">{sector.label}</span>
    </motion.button>
  )
}

/** Destination picker — lives on Home, replaces separate cockpit boot screen */
export default function SectorHub({ selectedId = 'hero', onSelect, onEngage }) {
  const active = navLinks.find((s) => s.id === selectedId)

  return (
    <div className="p3-panel p-4 md:p-5 mt-6">
      <div className="flex items-center justify-between mb-3 gap-2">
        <div>
          <p className="hud-text text-[10px] mb-1">SELECT DESTINATION</p>
          <p className="font-mono text-xs text-cyan/55">
            Route locked · <span className="text-cyan">{active?.label ?? 'Home'}</span>
          </p>
        </div>
        <motion.button
          type="button"
          onClick={() => onEngage?.(selectedId)}
          disabled={selectedId === 'hero'}
          className={`shrink-0 px-5 py-2 font-mono text-[10px] tracking-[0.28em] border transition-all ${
            selectedId === 'hero'
              ? 'border-cyan/20 text-cyan/30 cursor-default'
              : 'border-hud text-hud bg-hud/10 hover:bg-hud/20 hover:shadow-[0_0_16px_rgba(107,255,184,0.2)]'
          }`}
          whileHover={selectedId !== 'hero' ? { scale: 1.02 } : undefined}
          whileTap={selectedId !== 'hero' ? { scale: 0.98 } : undefined}
        >
          ENGAGE
        </motion.button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
        {navLinks.map((sector) => (
          <SectorButton
            key={sector.id}
            sector={sector}
            active={selectedId === sector.id}
            onSelect={onSelect}
          />
        ))}
      </div>

      <p className="mt-3 font-mono text-[9px] text-cyan/35 tracking-wide">
        {selectedId === 'hero'
          ? 'You are on Home. Pick a sector above, then confirm with ENGAGE.'
          : `Confirm to jump to ${active?.label}.`}
      </p>
    </div>
  )
}
