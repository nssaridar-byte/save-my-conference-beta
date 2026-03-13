/*
  Warnings:

  - Added the required column `conferenceId` to the `Speech` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Speech" ADD COLUMN     "conferenceId" TEXT NOT NULL,
ADD COLUMN     "time" INTEGER;

-- AddForeignKey
ALTER TABLE "Speech" ADD CONSTRAINT "Speech_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE CASCADE ON UPDATE CASCADE;
