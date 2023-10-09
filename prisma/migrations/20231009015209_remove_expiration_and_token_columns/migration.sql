/*
  Warnings:

  - You are about to drop the column `expiration` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `Token` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Token_token_key";

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "expiration",
DROP COLUMN "token";
