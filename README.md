# MoodyCrust 🍕

Your pocket-sized weapon for pizza perfection.

A baker's-math dough calculator and recipe vault that handles five pizza styles end-to-end — from formula to fermentation schedule to bake log.

## Styles supported

| Style | Editions |
|---|---|
| **Neapolitan** | Home Edition, Classic AVPN |
| **New York** | Classic Slice, Thin & Crispy |
| **Roma** | Teglia (pan), Tonda (thin round) |
| **New Haven** | Apizza (Classic) |
| **Chicago Thin** | Tavern (party cut) |

Each edition ships with style-appropriate defaults for hydration, salt, oil, sugar, fermentation window, ball weight, and bake diameter.

## Modes

- **Bake It Easy** — pick a style, pick a pizza time, pick a fermentation chip. Three controls, real numbers out.
- **Moody-CrustMode** — full control over preferments (poolish / biga), autolyse, stretch & folds, additional ingredients, and start-time vs. pizza-time anchor. (Lands in Phase 3.)

## Stack

- **Next.js 16** (App Router, React 19)
- **Prisma + Postgres** for the recipe vault and bake log
- **Docker / Docker Compose** for local dev and remote deploy
- **GitHub Actions** → **Docker Hub** (`moodyplex/moodycrust`) for image releases

## Local development

```sh
docker compose -f docker-compose.dev.yml up --build
```

Open <http://localhost:4000>. Hot reload is on; Postgres is exposed on `5432` for inspection.

To run without Docker:

```sh
npm install
npx prisma migrate dev
npm run dev
```

## Remote deploy (single VPS)

The production [`docker-compose.yml`](docker-compose.yml) pulls the latest image from Docker Hub and runs migrations on container boot.

On the VPS:

```sh
./deploy.sh
```

which is equivalent to:

```sh
docker compose pull
docker compose up -d
docker image prune -f
```

(The Dockerfile + CI workflow that produce the published image land in Phase 6.)

## Repository

- Source: [github.com/AnthonyMoodyII/Pizza-Dough-Vault](https://github.com/AnthonyMoodyII/Pizza-Dough-Vault)
- Image: [hub.docker.com/r/moodyplex/moodycrust](https://hub.docker.com/repositories/moodyplex)

## Status

Phased rebuild in progress. See the [project plan](https://github.com/AnthonyMoodyII/Pizza-Dough-Vault/pulls) for current phase and verification checklists.

- ✅ Phase 1 — pure calculation & schedule engine
- 🚧 Phase 2 — UI shell + Bake It Easy mode
- ⏳ Phase 3 — Moody-CrustMode (preferments, autolyse, S&F)
- ⏳ Phase 4 — Vault rewrite (recipes + bakes, tasting notes, photos)
- ⏳ Phase 5 — Step-by-step instructions, timers, notifications
- ⏳ Phase 6 — Production Docker image + CI to Docker Hub
