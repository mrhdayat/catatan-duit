import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      date: 'desc',
    },
  });

  // Convert for client component
  // We pass dates as Date objects (Server Components serialize them automatically in Next.js 13+ if simple)
  // or we can map them. Prisma returns Date objects.
  const formattedTransactions = transactions.map((t) => ({
    ...t,
    type: t.type as "DEBIT" | "CREDIT",
  }));

  const budget = await prisma.budget.findFirst({
    where: {
      userId: session.user.id,
      category: 'GLOBAL'
    }
  });

  return <DashboardClient transactions={formattedTransactions} userId={session.user.id} budget={budget ? { ...budget, limit: budget.limit } : null} />;
}
