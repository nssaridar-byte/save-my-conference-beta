/*
  Warnings:

  - You are about to drop the column `Committee` on the `Conference` table. All the data in the column will be lost.
  - You are about to drop the column `Country` on the `Conference` table. All the data in the column will be lost.
  - You are about to drop the column `Location` on the `Conference` table. All the data in the column will be lost.
  - Added the required column `committee` to the `Conference` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Conference` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Conference` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conference" DROP COLUMN "Committee",
DROP COLUMN "Country",
DROP COLUMN "Location",
ADD COLUMN     "committee" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL;
