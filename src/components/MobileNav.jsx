import { motion } from 'framer-motion'
import { navLinks } from '../data/resume'

export default function MobileNav({ active, onNavigate }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden flex items-stretch justify-center gap-0 py-2 px-1 bg-panel/95 backdrop-blur-xl border-t border-cyan/20">
      {navLinks.map((link, i) => {
        const isActive = active === link.id
        const isLast = i === navLinks.length - 1
        return (
          <div key={link.id} className="flex items-stretch flex-1 min-w-0">
            <motion.button
              type="button"
              onClick={() => onNavigate(link.id)}
              className={`nav-block flex-1 flex flex-col items-center justify-center gap-0.5 py-2 px-1 mx-0.5 rounded border font-ui text-[10px] tracking-wider ${
                isActive
                  ? 'text-alert border-alert/50 bg-alert/15'
                  : 'text-ice/40 border-transparent'
              }`}
              whileHover={{
                scale: 1.08,
                y: -4,
                borderColor: 'rgba(61, 232, 255, 0.4)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-display text-base">{link.icon}</span>
              <span>{link.label.slice(0, 4)}</span>
            </motion.button>
            {!isLast && (
              <div
                className="w-px self-center h-8 bg-gradient-to-b from-transparent via-cyan/30 to-transparent shrink-0"
                aria-hidden
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}
