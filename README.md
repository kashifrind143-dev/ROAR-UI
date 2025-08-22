# ROAR — First Mockup UI (Animated, Dark Theme) + Mock APIs

This project reproduces the **first mockup** UI exactly (dark, glowing orbit background, circular dial, solid blue Claim button) with **subtle animations** and **mock backend API routes**.

## Features
- Exact first-mockup styling (dark galaxy, glowing dial, orbit accents)
- Subtle animations: dial micro-rotation, floating planets
- Solid **Claim ROAR** button (tap feedback)
- Bottom nav order: Profile • Leaderboard • Mining (center) • Challenges • Wallet
- Profile (username + avatar) + Total ROAR
- Mock APIs: `/api/user`, `/api/leaderboard`, `/api/claim`
- 4-hour cooldown demo (client `localStorage`)

## Run
```bash
npm i
npm run dev
```

## Deploy (Vercel)
- Push to GitHub → Import to Vercel → Deploy with Next.js defaults.

## Next steps (MongoDB)
- Replace mock APIs with DB logic under `/app/api/*` (Edge or Node runtimes).
- Store and verify last claim server-side to enforce cooldown securely.
