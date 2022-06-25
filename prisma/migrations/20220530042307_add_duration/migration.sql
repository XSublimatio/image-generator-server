-- CreateEnum
CREATE TYPE "Type" AS ENUM ('MOLECULE', 'DRUG');

-- AlterTable
ALTER TABLE "Queue" ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "type" "Type";
