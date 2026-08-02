# sbalaji.vercel.app

Hey — I'm Srivatsan Balaji. This is the source for my personal portfolio.

**Live site:** [https://sbalaji.vercel.app](https://sbalaji.vercel.app)

I'm a Computer Engineering student at the University of Michigan (Math minor). I work on embedded firmware, robotics, and systems that actually ship — Atombot Lab, SPARK Electric Racing, and Trackonomy.

The intro uses a **3D mecha model** in the hangar. Default target is **Freedom Gundam** (CC BY, cosmos28 on Sketchfab). The bundled `model.glb` is included in-repo; re-fetch only if you need to refresh it.

```bash
# Optional re-download (requires local token — never commit this)
cp .env.example .env.local
# set SKETCHFAB_TOKEN in .env.local, then:
npm run fetch-model
```

Open-source picks (verified):
| Model | License | Source |
|-------|---------|--------|
| **gundam freedom** (cosmos28) | CC BY 4.0 | [Sketchfab](https://sketchfab.com/3d-models/gundam-freedom-02042775eda240c09d8a39ecc989ad29) |
| RX-78-2 with weapons (Tipatat) | CC BY 3.0 | `--variant rx78` |

Credits live in each model folder’s `CREDITS.txt`.

## Security

- **No API keys in the repo.** Sketchfab tokens are read from `SKETCHFAB_TOKEN` at script runtime only.
- `.env`, `.env.local`, and credentials are gitignored. Use `.env.example` as a template.
- Safe to deploy on Vercel — static React build, no server-side secrets.

## Run locally

```bash
npm install
npm run dev
```

Open **http://localhost:5173**

## Deploy

Connected to Vercel from [github.com/srivbalaji/portfolio](https://github.com/srivbalaji/portfolio):

```bash
npm run build
npx vercel
```

## Project images

Drop photos into `public/assets/projects/` (optional). Paths live in `src/data/resume.js`.

Resume PDF: `public/Srivatsan_Balaji_Resume.pdf`

Holo comm placeholders: `public/assets/holo/*.svg` (swap for JPG screenshots anytime)

## Stack

React, Vite, Tailwind, Framer Motion, Three.js.

## Contact

- [LinkedIn](https://linkedin.com/in/srivb70)
- [GitHub](https://github.com/srivbalaji)
- sribalaj@umich.edu
