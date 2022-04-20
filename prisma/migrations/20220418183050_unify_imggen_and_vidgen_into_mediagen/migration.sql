/*
  Warnings:

  - You are about to drop the column `imgDone` on the `Queue` table. All the data in the column will be lost.
  - You are about to drop the column `vidDone` on the `Queue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Queue" DROP COLUMN "imgDone",
DROP COLUMN "vidDone",
ADD COLUMN     "mediaDone" BOOLEAN NOT NULL DEFAULT false;
