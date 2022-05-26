/*
  Warnings:

  - Added the required column `duration` to the `Queue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Queue` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('MOLECULE', 'DRUG');

-- AlterTable
ALTER TABLE "Queue" ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "type" "Type" NOT NULL;
