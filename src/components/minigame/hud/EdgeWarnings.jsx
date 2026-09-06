import { COLOR } from '../constants'

/** DOM edge warning frame — four independently pulsed borders. Spec §9 / §13 */
export default function EdgeWarnings({ warnings }) {
  const edges = { north: false, south: false, east: false, west: false }
  for (const w of warnings || []) {
    if (w.alive) edges[w.edge] = true
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-[15]">
      <div
        className={`absolute left-3 right-3 top-0 h-1.5 transition-opacity duration-100 ${edges.north ? 'animate-pulse' : ''}`}
        style={{
          opacity: edges.north ? 0.9 : 0.08,
          boxShadow: edges.north ? `0 0 18px 4px ${COLOR.WARN}` : 'none',
          background: COLOR.WARN,
        }}
      />
      <div
        className={`absolute left-3 right-3 bottom-0 h-1.5 transition-opacity duration-100 ${edges.south ? 'animate-pulse' : ''}`}
        style={{
          opacity: edges.south ? 0.9 : 0.08,
          boxShadow: edges.south ? `0 0 18px 4px ${COLOR.WARN}` : 'none',
          background: COLOR.WARN,
        }}
      />
      <div
        className={`absolute top-3 bottom-3 left-0 w-1.5 transition-opacity duration-100 ${edges.west ? 'animate-pulse' : ''}`}
        style={{
          opacity: edges.west ? 0.9 : 0.08,
          boxShadow: edges.west ? `0 0 18px 4px ${COLOR.WARN}` : 'none',
          background: COLOR.WARN,
        }}
      />
      <div
        className={`absolute top-3 bottom-3 right-0 w-1.5 transition-opacity duration-100 ${edges.east ? 'animate-pulse' : ''}`}
        style={{
          opacity: edges.east ? 0.9 : 0.08,
          boxShadow: edges.east ? `0 0 18px 4px ${COLOR.WARN}` : 'none',
          background: COLOR.WARN,
        }}
      />
    </div>
  )
}
