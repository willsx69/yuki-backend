-- CreateEnum
CREATE TYPE "RecurrenceFrequency" AS ENUM ('weekly', 'monthly', 'yearly');

-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "updated_at" DROP DEFAULT;

-- CreateTable
CREATE TABLE "installments" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "debt_id" UUID NOT NULL,
    "number" INTEGER NOT NULL,
    "amount_cents" INTEGER NOT NULL,
    "due_date" DATE NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paid_at" DATE,
    "transaction_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "installments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recurrences" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "amount_cents" INTEGER NOT NULL,
    "frequency" "RecurrenceFrequency" NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "next_occurrence" DATE NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "category_id" TEXT,
    "account_id" UUID,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "recurrences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "installments_user_id_idx" ON "installments"("user_id");

-- CreateIndex
CREATE INDEX "installments_debt_id_idx" ON "installments"("debt_id");

-- CreateIndex
CREATE UNIQUE INDEX "installments_debt_id_number_key" ON "installments"("debt_id", "number");

-- CreateIndex
CREATE INDEX "recurrences_user_id_idx" ON "recurrences"("user_id");

-- CreateIndex
CREATE INDEX "recurrences_user_id_is_active_idx" ON "recurrences"("user_id", "is_active");

-- AddForeignKey
ALTER TABLE "installments" ADD CONSTRAINT "installments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installments" ADD CONSTRAINT "installments_debt_id_fkey" FOREIGN KEY ("debt_id") REFERENCES "debts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurrences" ADD CONSTRAINT "recurrences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
