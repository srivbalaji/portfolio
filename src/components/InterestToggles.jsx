import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { profile } from '../data/resume'

const defaultChecked = Object.fromEntries(profile.interests.map((label) => [label, true]))

export default function InterestToggles() {
  const [checked, setChecked] = useState(defaultChecked)

  const toggle = (label) => {
    setChecked((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const activeCount = Object.values(checked).filter(Boolean).length

  return (
    <div className="p3-panel hover-pop p-6 border-l-4 border-l-gold">
      <div className="flex items-center justify-between mb-4">
        <p className="hud-text">INTERESTS</p>
        <span className="font-ui text-[10px] text-cyan/50 tracking-widest">
          {activeCount}/{profile.interests.length} ACTIVE
        </span>
      </div>
      <ul className="space-y-2">
        {profile.interests.map((item) => {
          const isOn = checked[item]
          return (
            <motion.li key={item} layout>
              <label
                className={`flex items-center gap-3 cursor-pointer group py-1.5 px-2 rounded-sm border transition-all duration-300 ${
                  isOn
                    ? 'border-cyan/30 bg-cyan/5 hover-pop-subtle'
                    : 'border-transparent bg-transparent opacity-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isOn}
                  onChange={() => toggle(item)}
                  className="sr-only"
                />
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-all ${
                    isOn
                      ? 'border-cyan bg-cyan/20 text-cyan'
                      : 'border-ice/30 bg-panelLight'
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
                    isOn ? 'text-ice/90' : 'text-ice/40 line-through'
                  }`}
                >
                  {item}
                </span>
              </label>
            </motion.li>
          )
        })}
      </ul>
      <p className="mt-4 text-xs text-ice/40 font-ui tracking-wide">
        Toggle off anything you don&apos;t want on display.
      </p>
    </div>
  )
}
