import { motion } from 'framer-motion'
import { navLinks } from '../data/resume'

export default function SideNav({ active, onNavigate }) {
  return (
    <motion.nav
      className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-stretch pl-3"
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {navLinks.map((link, i) => {
        const isActive = active === link.id
        const isLast = i === navLinks.length - 1
        return (
          <motion.div key={link.id} className="flex flex-col items-stretch">
            <motion.button
              type="button"
              onClick={() => onNavigate(link.id)}
              className={`nav-block group relative flex items-center gap-3 py-3 px-4 text-left rounded-sm border backdrop-blur-md transition-colors ${
                isActive
                  ? 'border-alert/50 bg-panel/95 text-alert shadow-[0_0_20px_rgba(255,77,106,0.25)]'
                  : 'border-cyan/15 bg-panel/70 text-ice/40 hover:text-ice/90 hover:border-cyan/35'
              }`}
              whileHover={{
                scale: 1.06,
                y: -6,
                x: 8,
                boxShadow: '0 12px 40px rgba(61, 232, 255, 0.2), 0 0 0 1px rgba(61, 232, 255, 0.3)',
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.05, type: 'spring', stiffness: 300, damping: 22 }}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute left-0 top-2 bottom-2 w-0.5 bg-alert shadow-[0_0_12px_#ff4d6a] rounded-full"
                />
              )}
              <span className="font-display text-lg">{link.icon}</span>
              <span className="font-ui text-xs tracking-[0.25em]">{link.label}</span>
            </motion.button>
            {!isLast && (
              <div
                className="nav-divider my-1 mx-2 h-px bg-gradient-to-r from-transparent via-cyan/35 to-transparent"
                aria-hidden
              />
            )}
          </motion.div>
        )
      })}
    </motion.nav>
  )
}
