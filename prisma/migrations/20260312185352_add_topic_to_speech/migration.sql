/*
  Warnings:

  - Added the required column `topic` to the `Speech` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Speech" ADD COLUMN     "topic" TEXT NOT NULL;
