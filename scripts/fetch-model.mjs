/**
 * Download open-license mecha models for the portfolio intro.
 *
 * Freedom Gundam (recommended — CC BY, textured, ~115k tris):
 *   SKETCHFAB_TOKEN=your_token npm run fetch-model
 *
 * RX-78 fallback (CC BY, Icosa Gallery — no token):
 *   npm run fetch-model -- --variant rx78
 *
 * Get a free Sketchfab API token: https://sketchfab.com/settings/password
 */
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = join(ROOT, 'public', 'assets', 'models')

const VARIANTS = {
  freedom: {
    source: 'sketchfab',
    uid: '02042775eda240c09d8a39ecc989ad29',
    outDir: join(PUBLIC, 'freedom'),
    credits: `# Freedom Gundam (ZGMF-X10A)

- **Title:** gundam freedom
- **Author:** cosmos28
- **License:** Creative Commons Attribution 4.0 (CC BY 4.0)
- **Source:** https://sketchfab.com/3d-models/gundam-freedom-02042775eda240c09d8a39ecc989ad29

Attribution required when redistributing.`,
  },
  'freedom-lite': {
    source: 'sketchfab',
    uid: '55e08465b4b6434381bcc8579e761855',
    outDir: join(PUBLIC, 'freedom'),
    credits: `# ZGMF-X10A Freedom Gundam (OG textures)

- **Author:** Risingprime250
- **License:** Creative Commons Attribution (CC BY)
- **Source:** https://sketchfab.com/3d-models/og-texturezgmf-x10a-freedom-gundam-55e08465b4b6434381bcc8579e761855`,
  },
  rx78: {
    source: 'icosa',
    assetId: 'fHalccv7ORh',
    outDir: join(PUBLIC, 'rx78'),
    credits: `# MS Gundam RX-78-2 with weapons

- **Author:** Tipatat Chennavasin
- **License:** CC BY 3.0
- **Source:** https://icosa.gallery/view/fHalccv7ORh`,
  },
}

function parseArgs() {
  const args = process.argv.slice(2)
  const idx = args.indexOf('--variant')
  const variant = idx >= 0 ? args[idx + 1] : 'freedom'
  if (!VARIANTS[variant]) {
    throw new Error(`Unknown variant "${variant}". Use: ${Object.keys(VARIANTS).join(', ')}`)
  }
  return { variant, config: VARIANTS[variant] }
}

async function downloadIcosa({ assetId, outDir, credits }) {
  const meta = await fetch(`https://api.icosa.gallery/v1/assets/${assetId}`).then(async (r) => {
    if (!r.ok) throw new Error(`Icosa API ${r.status}`)
    return r.json()
  })

  const gltf = meta.formats?.find(
    (f) => f.formatType === 'GLTF1' && f.role === 'POLYGONE_GLTF_FORMAT' && f.isCorsAllowed,
  )
  if (!gltf?.root?.url) throw new Error('No CORS-enabled GLTF on Icosa')

  await rm(outDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })

  const gltfBuf = await fetch(gltf.root.url).then((r) => {
    if (!r.ok) throw new Error(`GLTF ${r.status}`)
    return r.arrayBuffer()
  })
  await writeFile(join(outDir, 'model.gltf'), Buffer.from(gltfBuf))

  for (const res of gltf.resources ?? []) {
    const buf = await fetch(res.url).then((r) => {
      if (!r.ok) throw new Error(`Resource ${res.relativePath} ${r.status}`)
      return r.arrayBuffer()
    })
    await writeFile(join(outDir, res.relativePath), Buffer.from(buf))
  }

  await writeFile(join(outDir, 'CREDITS.txt'), `${credits}\n\nDownloaded: ${meta.displayName} — ${meta.authorName}\n`)
  console.log(`Saved Icosa model → ${outDir}`)
}

async function downloadSketchfab({ uid, outDir, credits }) {
  const token = process.env.SKETCHFAB_TOKEN
  if (!token) {
    console.error(`
SKETCHFAB_TOKEN is required for Freedom Gundam downloads.

1. Create a free account at https://sketchfab.com
2. Open https://sketchfab.com/settings/password → copy your API token
3. Run:
   PowerShell:  $env:SKETCHFAB_TOKEN="YOUR_TOKEN"; npm run fetch-model
   bash:        SKETCHFAB_TOKEN=YOUR_TOKEN npm run fetch-model

Recommended model: https://sketchfab.com/3d-models/gundam-freedom-02042775eda240c09d8a39ecc989ad29
License: CC BY 4.0 (cosmos28)
`)
    process.exit(1)
  }

  const meta = await fetch(`https://api.sketchfab.com/v3/models/${uid}`, {
    headers: { Authorization: `Token ${token}` },
  }).then(async (r) => {
    if (!r.ok) throw new Error(`Sketchfab model ${r.status}`)
    return r.json()
  })

  if (!meta.isDownloadable) {
    throw new Error(`Model "${meta.name}" is not downloadable`)
  }

  const dlInfo = await fetch(`https://api.sketchfab.com/v3/models/${uid}/download`, {
    headers: { Authorization: `Token ${token}` },
  }).then(async (r) => {
    if (!r.ok) throw new Error(`Sketchfab download ${r.status}: ${await r.text()}`)
    return r.json()
  })

  const fileInfo = dlInfo.glb ?? dlInfo.gltf
  if (!fileInfo?.url) throw new Error('No GLB/GLTF in download response')

  await rm(outDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })

  const buf = Buffer.from(await fetch(fileInfo.url).then((r) => {
    if (!r.ok) throw new Error(`File download ${r.status}`)
    return r.arrayBuffer()
  }))

  const isGlb = buf[0] === 0x67 && buf[1] === 0x6c && buf[2] === 0x54 && buf[3] === 0x46
  const filename = isGlb ? 'model.glb' : 'model.gltf'
  await writeFile(join(outDir, filename), buf)

  await writeFile(
    join(outDir, 'CREDITS.txt'),
    `${credits}\n\nDownloaded: ${meta.name} — ${meta.user?.displayName ?? 'unknown'}\nLicense: ${meta.license?.label ?? 'see Sketchfab'}\n`,
  )
  console.log(`Saved Sketchfab model → ${join(outDir, filename)} (${(buf.length / 1024 / 1024).toFixed(2)} MB)`)
}

async function main() {
  const { variant, config } = parseArgs()
  console.log(`Fetching variant: ${variant}`)

  if (config.source === 'icosa') await downloadIcosa(config)
  else if (config.source === 'sketchfab') await downloadSketchfab(config)
  else throw new Error(`Unknown source: ${config.source}`)
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
