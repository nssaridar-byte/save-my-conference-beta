/*
  Warnings:

  - Added the required column `conferenceId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "conferenceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "layoutMode" TEXT DEFAULT 'adaptive',
ADD COLUMN     "theme" TEXT DEFAULT 'dark';

-- CreateTable
CREATE TABLE "KnownDevice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KnownDevice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KnownDevice_userId_idx" ON "KnownDevice"("userId");

-- CreateIndex
CREATE INDEX "KnownDevice_ip_userAgent_idx" ON "KnownDevice"("ip", "userAgent");

-- AddForeignKey
ALTER TABLE "KnownDevice" ADD CONSTRAINT "KnownDevice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
