# srivatsanbalaji.com

Hey — I'm Srivatsan Balaji. This is the source for my personal portfolio.

I'm a Computer Engineering student at the University of Michigan (Math minor). I work on embedded firmware, robotics, and systems that actually ship — Atombot Lab, SPARK Electric Racing, and a handful of hardware projects I've documented here.

The intro uses a **3D mecha model** in the hangar. Default target is **Freedom Gundam** (CC BY, cosmos28 on Sketchfab). Until you fetch it, the site falls back to **RX-78-2** from Icosa Gallery.

```bash
# Freedom Gundam (recommended — looks like ZGMF-X10A, textured)
# 1. Free Sketchfab account → https://sketchfab.com/settings/password → copy API token
# 2. PowerShell:
$env:SKETCHFAB_TOKEN="YOUR_TOKEN"
npm run fetch-model

# RX-78 fallback only (no token):
npm run fetch-model -- --variant rx78
```

Open-source picks (verified):
| Model | License | Source |
|-------|---------|--------|
| **gundam freedom** (cosmos28) | CC BY 4.0 | [Sketchfab](https://sketchfab.com/3d-models/gundam-freedom-02042775eda240c09d8a39ecc989ad29) |
| ZGMF-X10A Freedom OG textures (Risingprime250) | CC BY | `--variant freedom-lite` |
| RX-78-2 with weapons (Tipatat) | CC BY 3.0 | `--variant rx78` |

Credits live in each model folder’s `CREDITS.txt`.

## Run locally

```bash
npm install
npm run dev
```

Open **http://localhost:5173**

The intro is an interactive cockpit — pick a sector and hit **ENGAGE**, or skip with the top-right link.

## Deploy

I host this on Vercel:

```bash
npm run build
npx vercel
```

Or connect the repo on [vercel.com](https://vercel.com).

## Project images

Drop photos into `public/assets/projects/`:

| File | Project |
|------|---------|
| `sensor-logger.jpg` | Low-Power Embedded Sensor Logger |
| `bluetooth-hw.jpg` | Embedded Bluetooth Hardware |
| `spectrum.jpg` | Audio Spectrum Visualizer |
| `atombot.jpg` | Atombot Lab |
| `spark.jpg` | SPARK Electric Racing |
| `cad-pen.jpg` | CAD Reverse Engineering |

Paths live in `src/data/resume.js`. Resume PDF: `public/Srivatsan_Balaji_Resume.pdf`

## Stack

React, Vite, Tailwind, Framer Motion.

## Contact

- [LinkedIn](https://linkedin.com/in/srivb70)
- [GitHub](https://github.com/srivbalaji)
- sribalaj@umich.edu
