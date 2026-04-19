# Pizza Dough Calculator & Recipe Vault 🍕

The development of the Dockerized Pizza Dough Calculator and Recipe Vault is complete! The system is structured with a Next.js (React) full-stack capability and powered by a local PostgreSQL database orchestrating via Docker Compose.

## What Was Developed

### Full-Stack Architecture
- **Next.js 16**: Powers both the UI and RESTful API backend (`/api/recipes`).
- **Prisma ORM**: Defines the `Recipe` schema and ensures perfectly-typed database management.
- **Docker Compose Setup**: Spans a `postgres` container and a `node` frontend container, making development completely portable.
- **Automated Pull Updates**: Added an `update-and-run.sh` script to pull any upstream code updates from GitHub and automatically redeploy the Docker setup, giving you constant ease-of-mind versioning.

### Calculator Features
We accurately mimic advanced calculators (like Dough Guy and Brad's) using direct Baker's Math with advanced logic additions.
- **Dynamic Calculation**: Users enter total Dough Balls, Ball Weight, Hydration (%), Salt (%), Yeast (%), and Oil (Optional).
- **Multiple Flour Support**: You can now define a dynamic list of specific flours (e.g., Tipo 00, Whole Wheat, Bread) and assign specific ratios. The UI mathematically auto-adjusts your percentages whenever you change a value to guarantee they always perfectly reflect 100% of your Main Flour limits without throwing errors!
- **Instant Result Panel**: Calculates exactly how much Water, Salt, Yeast, and proportional mix of specific Flours you will need.
- **Fixed Poolish Preferment**: Input a specific total Poolish grams amount. The system automatically subtracts exactly 100% hydration flour and water evenly from your main dough limits. Because your Poolish is a fixed quantity, your poolish calculation will never dynamically shift when you increase or decrease your total dough ball volume!

### Premium UI Theme
- Created a beautiful vanilla CSS framework directly loaded into `app/globals.css`. 
- **Glassmorphism**: Modals layered cleanly with subtle backdrops and gradients.
- **Theme Support**: Provides dynamic variable toggling at `<button>` click between **🌙 Dark** and **☀️ Light** modes seamlessly.

## How to Test and Run

Access your vault via:

> [!TIP]
> Open your browser to [http://localhost:4000](http://localhost:4000).

Your application will remain alive as long as `docker compose` stays running.

**To auto-update and run in the future**:
```bash
cd "/Users/amoody/Documents/Personal Coding/Pizza-Dough"
sh ./update-and-run.sh
```

## Repository Sync
This code is seamlessly tracked and versioned from the remote repository setup at:  
[https://github.com/AnthonyMoodyII/Pizza-Dough-Vault](https://github.com/AnthonyMoodyII/Pizza-Dough-Vault)
