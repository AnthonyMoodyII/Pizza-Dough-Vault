-- Baseline: existing Recipe table before Phase 4
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "doughBalls" INTEGER NOT NULL,
    "ballWeight" DOUBLE PRECISION NOT NULL,
    "hydration" DOUBLE PRECISION NOT NULL,
    "salt" DOUBLE PRECISION NOT NULL,
    "yeast" DOUBLE PRECISION NOT NULL,
    "oil" DOUBLE PRECISION,
    "poolish" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "flours" JSONB,
    "diastaticMalt" DOUBLE PRECISION,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);
