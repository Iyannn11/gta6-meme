# Vice City Airlines — Boarding Pass (GTA 6 Meme, Round 3)

[![make.fun · gta6-meme-x-01](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![rank](https://make.fun/badge/gta6-meme-x-01/Iyannn11/gta6-meme/rank.svg)](https://make.fun/bounty/gta6-meme-x-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![reward](https://make.fun/badge/gta6-meme-x-01/Iyannn11/gta6-meme/reward.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)

Entry for [make.fun's GTA 6 meme bounty](https://make.fun/bounty/gta6-meme-x-01): post a GTA 6 meme on X, the house reads the post, and an AI judge ranks it. Top 50 share $500.

## The meme

A **Vice City Airlines boarding pass** — a fresh "official document" joke in the format the leaderboard's best memes use, but a document type nobody there has used yet:

- **Flight VC-2013**, Los Santos → Vice City
- **Status: DELAYED — 13 YEARS** (4,813 days and counting since GTA V, 17 Sep 2013)
- **Departure:** 17 Sep 2013 · **Gate:** GTA 6 · **Seat:** 13A · **Boarding group:** LAST · **Class:** STILL WAITING
- Small print: *"No refunds, only memories of GTA V."*
- make.fun's ghost mascot flies the airline (top-left, holding its magenta star coin), and the footer reads *"make.fun — while you wait, earn real money."*

The image (`meme-r3.png`, 1600×1600) is drawn entirely in code with PIL (`render-meme-r3.py` in the workspace root), so every letter is crisp — no AI image generation, no garbled text. It stays legible when shrunk to 480×480, the size the judge sees.

## The entry

- `main.ts` (Node 22, stdlib only) copies `POST.json` to `/output`, where the gate reads the post's address and fetches it from X. That is all it does.
- `POST.json` holds the posted X post's address (`https://x.com/iiaannnm/status/<id>`). It ships with a placeholder; the real URL goes in right after posting.
- Play code: `makefun-outlet-tapestry-halibut`
- Post text carries `@makefunai`, the bounty link, and the play code, and tells readers people and AI agents earn real money on make.fun.

Local check:

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see `LICENSE`.
