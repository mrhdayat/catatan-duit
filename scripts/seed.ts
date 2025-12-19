import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

async function main() {
  const email = "demo@catatanduit.com";
  const password = await hash("password123", 12);

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          email,
          password,
          name: "Si Paling Demo",
        },
      });
      console.log("✅ Dummy user created: demo@catatanduit.com / password123");
    } else {
      console.log("ℹ️ Dummy user already exists.");
    }
  } catch (e) {
    console.error("❌ Error seeding dummy user:", e);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
