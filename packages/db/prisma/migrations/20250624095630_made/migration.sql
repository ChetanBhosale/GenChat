/*
  Warnings:

  - You are about to drop the column `status` on the `ScrappedStatus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ScrappedStatus" DROP COLUMN "status",
ALTER COLUMN "success" DROP NOT NULL;
