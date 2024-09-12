/*
  Warnings:

  - You are about to drop the column `ssn` on the `Player` table. All the data in the column will be lost.
  - Changed the type of `elo` on the `Player` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "Player_ssn_key";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "ssn",
ADD COLUMN     "dni" TEXT,
DROP COLUMN "elo",
ADD COLUMN     "elo" MONEY NOT NULL;
