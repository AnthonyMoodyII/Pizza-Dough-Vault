# MoodyCrust 🍕

**Web-portal guide to pizza perfection.**

MoodyCrust is a full-stack baker's-math dough calculator and recipe vault. It handles five classic pizza styles end-to-end — from ingredient formula and yeast estimation to fermentation schedule and bake logging — all inside a clean dark-mode web app deployable anywhere with Docker.

---

## Screenshots

### Header & Style Selection
![MoodyCrust header with style pills and mode selector](docs/screenshots/01-header.png)

### Bake It Easy Mode
![Bake It Easy — pizza time, fermentation chips, dough weight slider](docs/screenshots/02-bake-it-easy.png)

### Moody-CrustMode — Advanced Controls
![Moody-CrustMode — hydration, salt, yeast, preferment, process](docs/screenshots/03-crustmode.png)

### Calculated Formula & Save Recipe
![Calculated formula table with Save Recipe button](docs/screenshots/04-formula.png)

### Recipe Vault
![Recipe Vault with style filter chips and saved recipe card](docs/screenshots/05-vault.png)

---

## What It Does

Most dough calculators just multiply percentages. MoodyCrust goes further:

- **Correct baker's math** — every ingredient is a true `%` of total flour. No off-ratio shortcuts.
- **Auto yeast estimation** — yeast % is derived from your fermentation time and temperature using a calibrated formula (IDY, ADY, or Fresh). Edit it to override; a single tap resets it to auto.
- **Fermentation schedule** — working backwards from your pizza time (or forwards from dough start), MoodyCrust builds a step-by-step timeline: mix → bulk → fold → cold retard → proof → bake.
- **Recipe Vault** — save any formula, log every bake, record tasting notes, ratings, and oven settings. Build a personal history of what actually worked.

---

## Pizza Styles

| Style | Editions | Typical Ball Weight | Diameter |
|---|---|---|---|
| **Neapolitan** | Home Edition, Classic AVPN | 180–280 g | 11–12 in |
| **New York** | Classic Slice, Thin & Crispy | 250–350 g | 12–14 in |
| **Roma** | Teglia (pan), Tonda (thin round) | 210–320 g | 12–14 in |
| **New Haven** | Apizza (Classic) | 320–450 g | 12–14 in |
| **Chicago Thin** | Tavern (party cut) | 280–420 g | 12–14 in |

Each edition ships with style-appropriate defaults for hydration, salt, oil, sugar, fermentation window, cold-ferment flag, and bake diameter. Switching styles resets all fields to those defaults.

---

## Two Modes

### Bake It Easy
The beginner-friendly path. Three controls get you to real gram weights in seconds:

1. **Pizza Time** — pick the date and time you want to eat.
2. **Fermentation chips** — tap 8 h, 12 h, 24 h, etc. Chips are clamped to the selected edition's valid range.
3. **Number of pizzas + weight per pizza** — a slider shows the estimated finished diameter as you drag.

The Total Time panel at the top shows the full schedule (start time, bulk end, cold end if applicable, pizza time) and updates live.

### Moody-CrustMode
Full professional control. All fields are editable:

| Section | Controls |
|---|---|
| **Planning** | Anchor by pizza time *or* start time |
| **Basics** | # pizzas, ball weight, fermentation duration |
| **Flour** | Multi-flour blend with preset catalogue (Caputo 00, KA Bread, AP, etc.) — blend ratios auto-normalise to 100 % |
| **Hydration / Salt / Oil / Sugar** | Stepped number inputs |
| **Yeast** | IDY / ADY / Fresh; auto-estimated from temp + time; manual override with one-tap reset |
| **Fermentation** | Cold or room temp, temperature (°F), total hours |
| **Preferment** | None / Poolish / Biga — configure inoculation %, preferment hydration, duration, temp, and yeast % |
| **Process** | Autolyse toggle, number of stretch & folds |
| **Additional ingredients** | Open list — sugar, malt, milk powder, honey, etc. as % of flour |

---

## Calculated Formula

Every change triggers a live recalculation. The output table shows:

- **Total** (including preferment) — Flour, Water, Yeast
- **Preferment** (if enabled) — Flour, Water, Yeast
- **Final Dough** — Flour, Water, Salt, Yeast, Oil, Sugar, any additionals, Total dough weight, Single ball weight

A yeast footnote shows the exact auto-estimate: `0.185 % IDY at 72 °F for 12 h`.

---

## Recipe Vault

Hit **Save Recipe** on any formula to capture it. The Vault stores the full formula — style, edition, mode, all percentages, preferment config, flour blend, and schedule anchor.

**Bake logging** — after you bake, click **Log This Bake** on any saved recipe to record:
- Date baked
- Star rating (1–5)
- Oven type and temperature (°F)
- Bake time
- What you changed from last time
- Tasting notes (crumb, char, flavour)

The Vault card shows bake count and average star rating. Filter by style with the chips at the top.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, React 19) |
| **Language** | TypeScript throughout |
| **Database** | PostgreSQL via Prisma ORM |
| **Validation** | Zod on all API boundaries |
| **Styling** | Plain CSS custom properties (dark / light theme toggle) |
| **Container** | Docker + Docker Compose |
| **CI / Registry** | GitHub → Docker Hub (`moodyplex/moodycrust`) |

---

## Running Locally (without Docker)

```sh
# 1. Install dependencies
npm install

# 2. Set your database URL
cp .env.example .env
# edit .env → set DATABASE_URL

# 3. Apply migrations
npx prisma migrate deploy

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Running with Docker Compose

```sh
docker compose up --build
```

Open [http://localhost:4000](http://localhost:4000).

On every container start, the entrypoint automatically:
1. Waits for Postgres to pass its healthcheck (`pg_isready`)
2. Runs `prisma migrate deploy` (applies any pending migrations, safe to run repeatedly)
3. Starts the Next.js server

No manual database steps are ever needed.

---

## Deploying to a Remote Host (Portainer / VPS)

On your server, in the directory containing `docker-compose.yml` and `.env`:

```sh
docker compose pull && docker compose up -d
```

Migrations run automatically on startup. The app is served on port `4000`.

### Environment variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | Postgres connection string | `postgresql://user:pass@db:5432/pizzavault` |

---

## Repository

- **Source:** [github.com/AnthonyMoodyII/Pizza-Dough-Vault](https://github.com/AnthonyMoodyII/Pizza-Dough-Vault)
- **Docker image:** [hub.docker.com/r/moodyplex/moodycrust](https://hub.docker.com/repositories/moodyplex)
