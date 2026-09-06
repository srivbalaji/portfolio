import { motion } from 'framer-motion'
import { aboutMedia } from '../data/aboutMedia'

/**
 * Interest photo holograms — full power when interest is on,
 * greyscale / dimmed (low power) when toggled off. Never fully hidden.
 * variant="cockpit" fills the right viewport primary monitor.
 */
export default function InterestGallery({ checked, onToggle, variant = 'panel' }) {
  const isCockpit = variant === 'cockpit'

  return (
    <div className={isCockpit ? 'flex flex-col h-full min-h-0 w-full' : 'p3-panel p-3 sm:p-4 h-full'}>
      <div className={`flex items-center justify-between shrink-0 ${isCockpit ? 'mb-2 px-0.5' : 'mb-3 px-1'}`}>
        {!isCockpit && <p className="hud-text">HOLO ARCHIVE</p>}
        {isCockpit && (
          <p className="font-mono text-[8px] tracking-[0.2em] text-cyan/55 uppercase">Personal feed</p>
        )}
        <span className="font-mono text-[8px] text-cyan/40 tracking-widest uppercase ml-auto">
          {aboutMedia.length} frames
        </span>
      </div>
      <div
        className={`grid grid-cols-2 gap-1.5 sm:gap-2 overflow-y-auto shell-scroll pr-0.5 min-h-0 ${
          isCockpit
            ? 'flex-1 content-start sm:grid-cols-2 lg:grid-cols-3'
            : 'sm:grid-cols-3 max-h-[min(52vh,420px)] lg:max-h-[min(68vh,560px)]'
        }`}
      >
        {aboutMedia.map((item, i) => {
          const powered = checked[item.interest] !== false
          return (
            <motion.figure
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.4) }}
              className="relative group overflow-hidden border border-cyan/15 bg-void/60 aspect-[4/3] cursor-pointer"
              title={`${item.caption} · tap to ${powered ? 'dim' : 'restore'}`}
              onClick={() => onToggle?.(item.interest)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onToggle?.(item.interest)
                }
              }}
              role="button"
              tabIndex={0}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className={`w-full h-full object-cover transition-[filter,opacity,transform] duration-500 ${
                  powered
                    ? 'opacity-100 grayscale-0 brightness-100 saturate-100 group-hover:scale-[1.03]'
                    : 'opacity-55 grayscale brightness-[0.55] contrast-90 saturate-50'
                }`}
              />
              <div
                className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                  powered
                    ? 'opacity-20 bg-gradient-to-t from-cyan/25 via-transparent to-transparent'
                    : 'opacity-60 bg-[linear-gradient(180deg,rgba(8,20,32,0.55),rgba(8,20,32,0.35))]'
                }`}
              />
              {!powered && (
                <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(61,232,255,0.06)_4px)]" />
              )}
              <figcaption
                className={`absolute bottom-0 left-0 right-0 px-1.5 py-1 font-mono text-[7px] sm:text-[8px] tracking-wide truncate transition-colors ${
                  powered ? 'bg-void/75 text-ice/80' : 'bg-void/85 text-ice/35'
                }`}
              >
                {item.caption}
              </figcaption>
              <span
                className={`absolute top-1 right-1 font-mono text-[6px] sm:text-[7px] tracking-wider uppercase px-1 py-0.5 border transition-colors ${
                  powered
                    ? 'border-cyan/40 text-cyan/70 bg-void/50'
                    : 'border-ice/20 text-ice/30 bg-void/60'
                }`}
              >
                {powered ? 'PWR' : 'LOW'}
              </span>
            </motion.figure>
          )
        })}
      </div>
      {!aboutMedia.some((m) => m.interest === 'Fantasy novels') && (
        <p className="mt-1.5 px-0.5 font-mono text-[7px] sm:text-[8px] text-ice/30 tracking-wide shrink-0">
          Fantasy novels · archive pending
        </p>
      )}
    </div>
  )
}
