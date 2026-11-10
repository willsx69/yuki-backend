import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultCategories = [
  { id: "salary", label: "Salário", type: "income" },
  { id: "freelance", label: "Freelance", type: "income" },
  { id: "sales", label: "Vendas", type: "income" },
  { id: "investments", label: "Rendimentos", type: "income" },
  { id: "other-income", label: "Outros", type: "income" },
  { id: "food", label: "Alimentação", type: "expense" },
  { id: "housing", label: "Moradia", type: "expense" },
  { id: "transport", label: "Transporte", type: "expense" },
  { id: "health", label: "Saúde", type: "expense" },
  { id: "education", label: "Educação", type: "expense" },
  { id: "leisure", label: "Lazer", type: "expense" },
  { id: "subscriptions", label: "Assinaturas", type: "expense" },
  { id: "shopping", label: "Compras", type: "expense" },
  { id: "other-expense", label: "Outros", type: "expense" },
] as const;

async function main() {
  for (const c of defaultCategories) {
    await prisma.category.upsert({
      where: { id: c.id },
      update: { label: c.label, type: c.type as any },
      create: { id: c.id, label: c.label, type: c.type as any, isCustom: false, userId: null },
    });
  }
  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });