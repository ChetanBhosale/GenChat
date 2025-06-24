/*
  Warnings:

  - You are about to drop the column `Errors` on the `ScrappedStatus` table. All the data in the column will be lost.
  - Added the required column `errors` to the `ScrappedStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ScrappedStatus" DROP COLUMN "Errors",
ADD COLUMN     "errors" INTEGER NOT NULL;
