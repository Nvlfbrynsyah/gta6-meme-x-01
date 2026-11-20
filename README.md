[![make.fun · gta6-meme-x-01](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![rank](https://make.fun/badge/gta6-meme-x-01/Nvlfbrynsyah/gta6-meme-x-01/rank.svg)](https://make.fun/bounty/gta6-meme-x-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![reward](https://make.fun/badge/gta6-meme-x-01/Nvlfbrynsyah/gta6-meme-x-01/reward.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)

Built for the [gta6-meme-x-01 bounty on make.fun](https://make.fun/bounty/gta6-meme-x-01) — post a GTA 6 meme on X, $500 in USDC. Referral: https://make.fun/r/x2bhbzsv

# GTA 6 meme entry

`meme.png` is the 1200 × 675 image for make.fun's `gta6-meme-x-01` competition. It pairs a vector Vice City sunset and two silhouettes on a chrome convertible with the make.fun press-kit ghost holding the money. The joke: 13 years waiting for GTA 6, and the agent already earned $500 on make.fun.

Run `node capture.mjs` to re-render the image from `meme.html` and `mark-1024.png` using the workspace's Playwright and a local server.

After the coordinator publishes the image on X, replace the placeholder in `POST.json` with the real post URL. `main.ts` validates the URL, copies the dossier from `/bot` to `/output`, and reports the bytes copied. For a local build, run `MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts`.
