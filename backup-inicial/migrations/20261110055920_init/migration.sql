-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('income', 'expense');

-- CreateEnum
CREATE TYPE "BillType" AS ENUM ('payable', 'receivable');

-- CreateEnum
CREATE TYPE "BillStatus" AS ENUM ('pending', 'paid');

-- CreateEnum
CREATE TYPE "DebtStatus" AS ENUM ('active', 'settled', 'cancelled');

-- CreateEnum
CREATE TYPE "ProfileTheme" AS ENUM ('light', 'dark', 'system');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "display_name" TEXT NOT NULL DEFAULT 'Usuário',
    "avatar_url" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "language" TEXT NOT NULL DEFAULT 'pt-BR',
    "theme" "ProfileTheme" NOT NULL DEFAULT 'system',
    "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "is_custom" BOOLEAN NOT NULL DEFAULT false,
    "user_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount_cents" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "account_id" TEXT NOT NULL,
    "payment_method_id" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "debts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "creditor" TEXT NOT NULL,
    "total_original_cents" INTEGER,
    "installment_cents" INTEGER NOT NULL,
    "total_installments" INTEGER NOT NULL,
    "initial_paid_installments" INTEGER NOT NULL DEFAULT 0,
    "first_pending_due_date" DATE NOT NULL,
    "periodicity" TEXT NOT NULL DEFAULT 'monthly',
    "category_id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "notes" TEXT,
    "status" "DebtStatus" NOT NULL DEFAULT 'active',
    "closed_at" DATE,
    "settled_early" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "debts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bills" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "BillType" NOT NULL,
    "description" TEXT NOT NULL,
    "amount_cents" INTEGER NOT NULL,
    "category_id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "due_date" DATE NOT NULL,
    "status" "BillStatus" NOT NULL DEFAULT 'pending',
    "installment_number" INTEGER NOT NULL DEFAULT 1,
    "total_installments" INTEGER NOT NULL DEFAULT 1,
    "bill_group_id" UUID,
    "debt_id" UUID,
    "notes" TEXT,
    "paid_at" DATE,
    "linked_transaction_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "bills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "transactions_user_id_date_idx" ON "transactions"("user_id", "date" DESC);

-- CreateIndex
CREATE INDEX "debts_user_id_status_idx" ON "debts"("user_id", "status");

-- CreateIndex
CREATE INDEX "debts_user_id_first_pending_due_date_idx" ON "debts"("user_id", "first_pending_due_date");

-- CreateIndex
CREATE INDEX "bills_user_id_due_date_idx" ON "bills"("user_id", "due_date");

-- CreateIndex
CREATE INDEX "bills_user_id_status_idx" ON "bills"("user_id", "status");

-- CreateIndex
CREATE INDEX "bills_debt_id_idx" ON "bills"("debt_id");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "debts" ADD CONSTRAINT "debts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "debts" ADD CONSTRAINT "debts_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_debt_id_fkey" FOREIGN KEY ("debt_id") REFERENCES "debts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_linked_transaction_id_fkey" FOREIGN KEY ("linked_transaction_id") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
