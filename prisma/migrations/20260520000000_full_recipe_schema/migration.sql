-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "diastaticMalt",
DROP COLUMN "oil",
DROP COLUMN "poolish",
DROP COLUMN "salt",
DROP COLUMN "yeast",
ADD COLUMN     "additional" JSONB,
ADD COLUMN     "anchor" JSONB,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "editionId" TEXT NOT NULL DEFAULT 'neapolitan-home',
ADD COLUMN     "fermentationHours" DOUBLE PRECISION NOT NULL DEFAULT 12,
ADD COLUMN     "fermentationTempC" DOUBLE PRECISION NOT NULL DEFAULT 22,
ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mode" TEXT NOT NULL DEFAULT 'easy',
ADD COLUMN     "oilPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "preferment" JSONB,
ADD COLUMN     "saltPercent" DOUBLE PRECISION NOT NULL DEFAULT 2.8,
ADD COLUMN     "stretchAndFolds" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "styleId" TEXT NOT NULL DEFAULT 'neapolitan',
ADD COLUMN     "sugarPercent" DOUBLE PRECISION,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "useAutolyse" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "useColdFerment" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "yeastPercent" DOUBLE PRECISION,
ADD COLUMN     "yeastType" TEXT NOT NULL DEFAULT 'idy';

-- CreateTable
CREATE TABLE "Bake" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "bakedAt" TIMESTAMP(3) NOT NULL,
    "ingredients" JSONB NOT NULL,
    "schedule" JSONB NOT NULL,
    "rating" INTEGER,
    "tastingNotes" TEXT,
    "whatChanged" TEXT,
    "photoUrls" TEXT[],
    "ovenType" TEXT,
    "ovenTempC" DOUBLE PRECISION,
    "bakeTimeSec" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bake_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bake" ADD CONSTRAINT "Bake_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
