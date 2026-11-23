# wawab-birthday

Private birthday notebook for **Jessica** — **wawab**’s gift.

Stack: **Next.js 16**, **React 19**, **Tailwind 4**, **Framer Motion**, **pnpm**.

## Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3025](http://localhost:3025).

## Notebook pages (order)

1. Cover  
2. One page per entry in `concert-videos.ts` (videos in `public/videos/`)  
3. One page per entry in `notebook-photos.ts` (images in `public/images/`)  
4. Letter (copy in `Notebook.tsx` → `LetterPage`)

Drag left/right to turn pages. Tap **Click me** first (audio autoplay).

## Files

| What | Where | Config |
|------|--------|--------|
| Videos | `public/videos/*.mp4` | `src/shared/content/concert-videos.ts` |
| Photos | `public/images/*` | `src/shared/content/notebook-photos.ts` |
| Background music | `public/audio/bg-music.mp3` | `src/shared/content/site-audio.ts` |
| Names & nicknames | — | `src/shared/content/concert-videos.ts` |

## Audio

- Background music loops after **Click me** (speaker button bottom-right).
- On video pages, bg music volume is **0**; clips play at **50%** (`VIDEO_VOLUME`).

## Deploy

`pnpm build` then host the output over **HTTPS** (required for “Add to Home Screen” on a real phone). `robots: noindex` is set in `layout.tsx`.

## Add to Home Screen (PWA-style)

This is a **home screen shortcut** that opens the site like a small app (`display: standalone`). It is **not** an iOS/Android widget — just an icon that opens your deployed URL.

- **iPhone (Safari):** open the site → **Share** → **Add to Home Screen**
- **Android (Chrome):** open the site → menu → **Install app** or **Add to Home screen**

Manifest: `src/app/manifest.ts`. Icons: `apple-icon`, `/pwa-icon/192`, `/pwa-icon/512`.