import { ACTIVE_MECH } from '../config/mechModel'

export default function MechCredit({ className = '', compact = false }) {
  const { title, author, license, url } = ACTIVE_MECH.credits

  if (compact) {
    return (
      <p className={`font-mono text-[9px] tracking-wide text-cyan/35 ${className}`}>
        3D model:{' '}
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-cyan/55 hover:text-cyan underline-offset-2 hover:underline">
          {title}
        </a>{' '}
        by {author} · {license}
      </p>
    )
  }

  return (
    <div className={`font-mono text-[10px] tracking-wide text-cyan/40 ${className}`}>
      <span className="text-cyan/55 uppercase tracking-[0.15em]">Unit model</span>
      <p className="mt-1">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan/70 hover:text-cyan transition-colors underline-offset-2 hover:underline"
        >
          {title}
        </a>
        {' · '}
        <span>{author}</span>
        {' · '}
        <span>{license}</span>
      </p>
    </div>
  )
}
