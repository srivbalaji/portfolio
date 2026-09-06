import { motion, AnimatePresence } from 'framer-motion'

export default function InterestToggles({ interests, checked, onToggle }) {
  const activeCount = Object.values(checked).filter(Boolean).length

  return (
    <div className="p3-panel hover-pop p-5 sm:p-6 border-l-4 border-l-gold">
      <div className="flex items-center justify-between mb-4 gap-2">
        <p className="hud-text">INTERESTS</p>
        <span className="font-ui text-[10px] text-cyan/50 tracking-widest shrink-0">
          {activeCount}/{interests.length} FULL POWER
        </span>
      </div>
      <ul className="space-y-1.5">
        {interests.map((item) => {
          const isOn = checked[item]
          return (
            <motion.li key={item} layout>
              <button
                type="button"
                onClick={() => onToggle(item)}
                className={`w-full flex items-center gap-3 cursor-pointer group py-1.5 px-2 rounded-sm border transition-all duration-300 text-left ${
                  isOn
                    ? 'border-cyan/30 bg-cyan/5 hover-pop-subtle'
                    : 'border-transparent bg-transparent opacity-70'
                }`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-all ${
                    isOn ? 'border-cyan bg-cyan/20 text-cyan' : 'border-ice/30 bg-panelLight'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isOn && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="text-[10px] font-bold"
                      >
                        ✓
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                <span
                  className={`font-ui text-sm tracking-wide transition-all ${
                    isOn ? 'text-ice/90' : 'text-ice/45'
                  }`}
                >
                  {item}
                </span>
                {!isOn && (
                  <span className="ml-auto font-mono text-[8px] tracking-wider text-ice/30 uppercase">
                    low power
                  </span>
                )}
              </button>
            </motion.li>
          )
        })}
      </ul>
      <p className="mt-4 text-xs text-ice/40 font-ui tracking-wide">
        Toggle an interest to dim its hologram feed — never fully offline.
      </p>
    </div>
  )
}
