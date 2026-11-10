/*
  Warnings:

  - The `account_id` column on the `transactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `account_id` on the `bills` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `account_id` on the `debts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `payment_method_id` on the `transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TransactionKind" AS ENUM ('normal', 'invoice_payment', 'bill_payment', 'adjustment');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('checking', 'savings', 'cash', 'digital_wallet');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('pix', 'cash', 'debit_card', 'credit_card', 'bank_transfer', 'boleto', 'other');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('open', 'closed', 'paid', 'overdue');

-- AlterTable
ALTER TABLE "bills" ALTER COLUMN "account_id" TYPE UUID USING "account_id"::uuid;

-- AlterTable
ALTER TABLE "debts" ALTER COLUMN "account_id" TYPE UUID USING "account_id"::uuid;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "credit_card_id" UUID,
ADD COLUMN     "invoice_id" UUID,
ADD COLUMN     "kind" "TransactionKind" NOT NULL DEFAULT 'normal',
ALTER COLUMN "account_id" TYPE UUID USING "account_id"::uuid,
ALTER COLUMN "payment_method_id" TYPE "PaymentMethod" USING "payment_method_id"::"PaymentMethod";

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AccountType" NOT NULL,
    "initial_balance_cents" INTEGER NOT NULL DEFAULT 0,
    "institution" TEXT,
    "color" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_cards" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "last_four_digits" TEXT,
    "credit_limit_cents" INTEGER NOT NULL,
    "closing_day" INTEGER NOT NULL,
    "due_day" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "credit_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_card_invoices" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "credit_card_id" UUID NOT NULL,
    "reference_month" INTEGER NOT NULL,
    "reference_year" INTEGER NOT NULL,
    "closing_date" DATE NOT NULL,
    "due_date" DATE NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'open',
    "paid_at" DATE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "credit_card_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");

-- CreateIndex
CREATE INDEX "accounts_user_id_is_active_idx" ON "accounts"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "credit_cards_user_id_idx" ON "credit_cards"("user_id");

-- CreateIndex
CREATE INDEX "credit_cards_user_id_is_active_idx" ON "credit_cards"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "credit_card_invoices_user_id_idx" ON "credit_card_invoices"("user_id");

-- CreateIndex
CREATE INDEX "credit_card_invoices_credit_card_id_status_idx" ON "credit_card_invoices"("credit_card_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "credit_card_invoices_credit_card_id_reference_month_referen_key" ON "credit_card_invoices"("credit_card_id", "reference_month", "reference_year");

-- CreateIndex
CREATE INDEX "bills_account_id_idx" ON "bills"("account_id");

-- CreateIndex
CREATE INDEX "debts_account_id_idx" ON "debts"("account_id");

-- CreateIndex
CREATE INDEX "transactions_account_id_idx" ON "transactions"("account_id");

-- CreateIndex
CREATE INDEX "transactions_credit_card_id_idx" ON "transactions"("credit_card_id");

-- CreateIndex
CREATE INDEX "transactions_invoice_id_idx" ON "transactions"("invoice_id");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_cards" ADD CONSTRAINT "credit_cards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_card_invoices" ADD CONSTRAINT "credit_card_invoices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_card_invoices" ADD CONSTRAINT "credit_card_invoices_credit_card_id_fkey" FOREIGN KEY ("credit_card_id") REFERENCES "credit_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_credit_card_id_fkey" FOREIGN KEY ("credit_card_id") REFERENCES "credit_cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "credit_card_invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "debts" ADD CONSTRAINT "debts_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
