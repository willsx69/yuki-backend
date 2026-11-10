/*
  Warnings:

  - Added the required column `updated_at` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('pending', 'posted', 'cancelled', 'reversed');

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "color" TEXT,
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'posted',
ALTER COLUMN "account_id" DROP NOT NULL;
