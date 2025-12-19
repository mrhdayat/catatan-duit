"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { hash } from "bcryptjs";

// Validation Schemas
const TransactionSchema = z.object({
  description: z.string().min(1, "Wajib diisi, bro!"),
  amount: z.coerce.number().min(0.01, "Minimal cepek lah!"),
  category: z.string().min(1, "Kategori apa nih?"),
  type: z.enum(["DEBIT", "CREDIT"]),
  essential: z.boolean().default(false),
  userId: z.string(),
});

const RegisterSchema = z.object({
  email: z.string().email("Email gak valid bro"),
  password: z.string().min(6, "Password kependekan, minimal 6 karakter"),
  name: z.string().optional(),
});

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const valid = RegisterSchema.safeParse({ email, password, name });

  if (!valid.success) {
    return { error: valid.error.flatten().fieldErrors };
  }

  const hashedPassword = await hash(password, 12);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    return { success: true, user };
  } catch {
    return { error: "Email udah kepake bro!" };
  }
}

export async function createTransaction(prevState: unknown, formData: FormData) {
  const userId = formData.get("userId") as string; // Ideally get from session on server

  const rawData = {
    description: formData.get("description"),
    amount: formData.get("amount"),
    category: formData.get("category"),
    type: formData.get("type"),
    essential: formData.get("essential") === "on",
    userId,
  };

  const valid = TransactionSchema.safeParse(rawData);

  if (!valid.success) {
    return { error: "Data gak valid, cek lagi bro!" };
  }

  try {
    await prisma.transaction.create({
      data: {
        description: valid.data.description,
        amount: valid.data.amount,
        category: valid.data.category,
        type: valid.data.type,
        essential: valid.data.essential,
        date: new Date(),
        userId: valid.data.userId,
      },
    });
    revalidatePath("/dashboard");
    return { success: "Transaksi berhasil, aman sulaiman!" };
  } catch {
    return { error: "Gagal nyimpen ke database, server lagi mumet." };
  }
}

export async function deleteTransaction(formdata: FormData) {
  const id = formdata.get("id") as string;
  try {
    await prisma.transaction.delete({
      where: { id },
    });
    revalidatePath("/dashboard");
    return { success: "Data hangus terbakar!" };
  } catch {
    return { error: "Gagal hapus, datanya ngumpet." };
  }
}

export async function updateTransaction(formData: FormData) {
  const id = formData.get("id") as string;

  // Construct update data dynamically
  const data: Record<string, any> = {};

  const description = formData.get("description");
  if (description !== null) data.description = description;

  const amount = formData.get("amount");
  if (amount !== null) data.amount = Number(amount);

  const category = formData.get("category");
  if (category !== null) data.category = category;

  const type = formData.get("type");
  if (type !== null) data.type = type;

  // Only update essential if explicit field is present (to avoid resetting on simple edit)
  // Note: HTML forms don't send unchecked checkboxes. 
  // We assume if 'essential_touched' or similar key isn't there, we might skip.
  // But for now, let's only update if input is present. 
  // Actually, our current Edit Form doesn't send essential at all, so we shouldn't touch it.
  const essential = formData.get("essential");
  if (essential !== null) {
    data.essential = essential === "on";
  }

  try {
    await prisma.transaction.update({
      where: { id },
      data,
    });
    revalidatePath("/dashboard");
    return { success: "Data berhasil di-update, makin rapi!" };
  } catch (e) {
    console.error("Update Error:", e);
    return { error: "Gagal update, server nolak." };
  }
}

const BudgetSchema = z.object({
  limit: z.coerce.number().min(0, "Masa budget minus?"),
  userId: z.string(),
});

export async function upsertBudget(formData: FormData) {
  const limit = formData.get("limit");
  const userId = formData.get("userId") as string;

  const valid = BudgetSchema.safeParse({ limit, userId });

  if (!valid.success) {
    return { error: "Angka gak valid bro!" };
  }

  try {
    // Check existing global budget
    const existing = await prisma.budget.findFirst({
      where: { userId, category: 'GLOBAL' }
    });

    if (existing) {
      await prisma.budget.update({
        where: { id: existing.id },
        data: { limit: valid.data.limit }
      });
    } else {
      await prisma.budget.create({
        data: {
          category: 'GLOBAL',
          limit: valid.data.limit,
          userId: valid.data.userId
        }
      });
    }
    revalidatePath("/dashboard");
    return { success: "Budget di-lock! Jangan boros!" };
  } catch {
    return { error: "Gagal set budget, sistem error." };
  }
}
