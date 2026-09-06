import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/** Deployment Bay primary monitor — selected experience or project detail */
export default function WorkBayDetail({ entry }) {
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    setLightbox(null)
  }, [entry?.kind, entry?.id, entry?.subsectionId])

  const closeLightbox = useCallback(() => setLightbox(null), [])

  useEffect(() => {
    if (!lightbox) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, closeLightbox])

  if (!entry) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 px-3 text-center">
        <p className="font-mono text-[9px] tracking-[0.22em] text-cyan/50 uppercase">Awaiting selection</p>
        <p className="font-mono text-[8px] text-ice/40 leading-relaxed max-w-[16rem]">
          Click any Projects & Experience entry to load it here.
        </p>
      </div>
    )
  }

  const isExp = entry.kind === 'experience'
  const isSub = Boolean(entry.subsectionId)
  const images = collectImages(entry)

  return (
    <div className="relative h-full min-h-0">
      <motion.div
        key={`${entry.kind}-${entry.id}-${entry.subsectionId || 'root'}`}
        className={`h-full min-h-0 overflow-y-auto shell-scroll pr-1 transition-[filter,opacity] duration-300 ${
          lightbox ? 'opacity-25 brightness-50 saturate-50 pointer-events-none select-none' : ''
        }`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: lightbox ? 0.25 : 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex items-start gap-2 mb-2">
          {entry.logo && (
            <img
              src={entry.logo}
              alt=""
              className="h-7 w-auto max-w-[72px] object-contain bg-white/90 rounded-sm px-1 py-0.5 shrink-0"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[7px] tracking-[0.2em] text-gundam/70 uppercase mb-0.5">
              {isExp ? (isSub ? `Mission · ${entry.org}` : 'Experience') : 'Project'}
              {entry.status ? ` · ${entry.status}` : ''}
            </p>
            <h3 className="font-display text-sm text-ice leading-tight tracking-wide truncate">{entry.title}</h3>
            <p className="font-mono text-[8px] text-cyan/70 truncate">
              {isExp
                ? isSub
                  ? `${entry.org}${entry.parentTitle ? ` · ${entry.parentTitle}` : ''}`
                  : entry.org
                : entry.tech?.slice(0, 3).join(' · ')}
            </p>
            {entry.period && (
              <p className="font-mono text-[7px] text-ice/40 mt-0.5 tracking-wide">{entry.period}</p>
            )}
            {entry.url && (
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-0.5 font-mono text-[7px] text-cyan/80 hover:text-cyan underline underline-offset-2"
              >
                {entry.url.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>

        {isExp && entry.summary && (
          <p className="text-[8px] leading-snug text-ice/65 mb-2">{entry.summary}</p>
        )}

        {isExp && entry.points?.length > 0 && (
          <ul className="space-y-1 mb-2">
            {entry.points.slice(0, isSub ? 6 : 4).map((pt) => (
              <li key={pt.slice(0, 36)} className="text-[8px] leading-snug text-ice/65 flex gap-1.5">
                <span className="text-gundam shrink-0">■</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        )}

        {!isExp && entry.description && (
          <p className="text-[8px] leading-snug text-ice/65 mb-2">{entry.description}</p>
        )}

        {!isExp && entry.details?.length > 0 && (
          <ul className="space-y-1 mb-2">
            {entry.details.map((d) => (
              <li key={d.slice(0, 36)} className="text-[8px] leading-snug text-ice/55 flex gap-1.5">
                <span className="text-cyan/60 shrink-0">›</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        )}

        {!isSub &&
          entry.subsections?.map((sub) => (
            <div key={sub.id} className="mb-2.5 border border-cyan/15 bg-void/40 p-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1">
                <p className="font-mono text-[8px] text-cyan tracking-wide">{sub.title}</p>
                {sub.period && <span className="font-mono text-[7px] text-ice/35">{sub.period}</span>}
              </div>
              {sub.summary && <p className="text-[7px] leading-snug text-ice/55 mb-1">{sub.summary}</p>}
              {sub.bullets?.length > 0 && (
                <ul className="space-y-0.5 mb-1.5">
                  {sub.bullets.map((b) => (
                    <li key={b.slice(0, 32)} className="text-[7px] leading-snug text-ice/60 flex gap-1">
                      <span className="text-gundam/80 shrink-0">·</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
              {sub.images?.length > 0 && (
                <div className="grid grid-cols-2 gap-1">
                  {sub.images.map((img) => (
                    <BayPhoto key={img.src} img={img} onOpen={setLightbox} />
                  ))}
                </div>
              )}
            </div>
          ))}

        {(isSub || !entry.subsections?.length) && images.length > 0 && (
          <div className="grid grid-cols-2 gap-1 mt-1">
            {images.map((img) => (
              <BayPhoto key={img.src} img={img} onOpen={setLightbox} />
            ))}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            key="bay-lightbox"
            className="absolute inset-0 z-20 flex flex-col cursor-zoom-out bg-void/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.caption || lightbox.alt || 'Expanded photo'}
            onClick={closeLightbox}
          >
            <div className="flex items-center justify-between gap-2 px-1.5 pt-1 shrink-0 pointer-events-none">
              <p className="font-mono text-[7px] tracking-[0.2em] text-cyan/70 uppercase truncate">
                Image · {lightbox.caption || 'Capture'}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  closeLightbox()
                }}
                className="pointer-events-auto font-mono text-[7px] tracking-wider text-ice/55 hover:text-ice border border-ice/20 hover:border-cyan/40 px-1.5 py-0.5 transition-colors cursor-pointer"
              >
                CLOSE
              </button>
            </div>

            <div className="flex-1 min-h-0 flex items-center justify-center p-2">
              <motion.img
                src={lightbox.src}
                alt={lightbox.alt || ''}
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-full max-h-full object-contain border border-cyan/30 shadow-[0_0_24px_rgba(0,0,0,0.55)] bg-void/80 cursor-default"
              />
            </div>

            {lightbox.caption && (
              <p className="shrink-0 px-2 pb-1.5 font-mono text-[7px] text-ice/60 text-center truncate pointer-events-none">
                {lightbox.caption}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function BayPhoto({ img, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(img)}
      className="relative overflow-hidden border border-cyan/15 aspect-[4/3] bg-void/50 text-left w-full group hover:border-cyan/45 focus-visible:border-cyan/60 focus-visible:outline-none transition-colors"
      aria-label={`Expand ${img.caption || img.alt || 'photo'}`}
    >
      <img src={img.src} alt={img.alt || ''} loading="lazy" className="w-full h-full object-cover" />
      {img.caption && (
        <span className="absolute bottom-0 inset-x-0 px-1 py-0.5 font-mono text-[6px] bg-void/80 text-ice/70 truncate">
          {img.caption}
        </span>
      )}
      <span className="absolute inset-0 bg-cyan/0 group-hover:bg-cyan/10 transition-colors pointer-events-none" />
    </button>
  )
}

function collectImages(entry) {
  if (entry.images?.length) return entry.images
  if (entry.image) {
    return [{ src: entry.image, alt: entry.imageAlt || entry.title, caption: entry.title }]
  }
  return []
}
