import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LaporanClient from "./laporan-client";

export const metadata = {
  title: "Laporan Keuangan | Catatan Duit",
};

export default async function LaporanPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      date: "desc",
    },
  });

  // Convert Date objects to strings or pass directly if client component handles it.
  // Serialization warning: passing Date objects from Server to Client component works in recent Next.js but sometimes causes warnings.
  // Best practice: Convert to ISO string or number.
  // My LaporanClient expects Date | string.

  // Actually, let's keep it simple. If Next.js warns, we fix it.

  // Fix type mismatch and date serialization
  const formattedTransactions = transactions.map(t => ({
    ...t,
    type: t.type as "DEBIT" | "CREDIT",
    date: t.date.toISOString(),
  }));

  return <LaporanClient transactions={formattedTransactions} />;
}
