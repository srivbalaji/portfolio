/** Per-section cockpit monitor layout + theming */

export const ROOM_LAYOUTS = {
  hero: {
    roomTitle: 'PRIMARY COCKPIT',
    primaryLabel: 'PILOT REGISTRY',
    accent: 'cyan',
    aux: ['status', 'link'],
  },
  about: {
    roomTitle: 'PROFILE BAY',
    primaryLabel: 'BIOGRAPHICAL DATA',
    accent: 'gold',
    aux: ['education', 'interests'],
  },
  projects: {
    roomTitle: 'MISSION BAY',
    primaryLabel: 'PROJECT ARCHIVE',
    accent: 'crimson',
    aux: ['active', 'tech'],
  },
  experience: {
    roomTitle: 'LOG ROOM',
    primaryLabel: 'EXPERIENCE LOG',
    accent: 'crimson',
    aux: ['roles', 'timeline'],
  },
  skills: {
    roomTitle: 'SYSTEMS DECK',
    primaryLabel: 'SKILL DIAGNOSTICS',
    accent: 'cyan',
    aux: ['languages', 'hardware'],
  },
  contact: {
    roomTitle: 'COMMS BAY',
    primaryLabel: 'COMMUNICATIONS',
    accent: 'crimson',
    aux: ['channels', 'signal'],
  },
}
