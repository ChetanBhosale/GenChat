/*
  Warnings:

  - Made the column `success` on table `ScrappedStatus` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ScrappedStatus" ALTER COLUMN "success" SET NOT NULL;
