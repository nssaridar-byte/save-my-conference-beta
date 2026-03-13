/*
  Warnings:

  - You are about to drop the column `limitHit` on the `Usage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Usage" DROP COLUMN "limitHit",
ADD COLUMN     "crisisLimitHitAt" TIMESTAMP(3),
ADD COLUMN     "debatesLimitHitAt" TIMESTAMP(3),
ADD COLUMN     "quizzesLimitHitAt" TIMESTAMP(3),
ADD COLUMN     "speechesLimitHitAt" TIMESTAMP(3);
