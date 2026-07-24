-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "priceOmr" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Discount" (
    "id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "percentOff" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "titleEn" TEXT,
    "titleAr" TEXT,
    "bodyEn" TEXT,
    "bodyAr" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Discount_scope_targetId_idx" ON "Discount"("scope", "targetId");

-- CreateIndex
CREATE INDEX "Discount_active_idx" ON "Discount"("active");

