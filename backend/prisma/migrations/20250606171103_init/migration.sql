/*
  Warnings:

  - You are about to drop the column `price` on the `Job` table. All the data in the column will be lost.
  - Added the required column `budget` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deadline` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "price",
ADD COLUMN     "budget" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "proposals" TEXT[];
