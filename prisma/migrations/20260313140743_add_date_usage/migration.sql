/*
  Warnings:

  - The `feedback` column on the `Speech` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Speech" DROP COLUMN "feedback",
ADD COLUMN     "feedback" JSONB;
