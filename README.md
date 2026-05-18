# Srivatsan Balaji — UM-AA Portfolio

Persona 3 Reload × Metaphor / Atlas × Gundam-inspired portfolio site (UM-AA branding).

## Run locally

```bash
npm install
npm run dev
```

Open **http://localhost:5173**

## Live HTTPS link (deploy)

### Option A — Vercel (recommended)

1. Push this folder to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Deploy — you get a URL like `https://your-project.vercel.app`

Or with CLI:

```bash
npx vercel
```

### Option B — Netlify

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

## Add your project images

Drop photos into `public/assets/projects/` and update paths in `src/data/resume.js`:

| File name | Project |
|-----------|---------|
| `sensor-logger.jpg` | Low-Power Sensor Logger |
| `bluetooth.jpg` | Bluetooth Hardware |
| `spectrum.jpg` | Audio Spectrum Visualizer |
| `atombot.jpg` | Atombot Lab |
| `spark.jpg` | SPARK Electric Racing |
| `cad-pen.jpg` | CAD Pen |

Resume PDF is at `public/Srivatsan_Balaji_Resume.pdf` (download link on site).

## Stack

- React + Vite
- Tailwind CSS
- Framer Motion
