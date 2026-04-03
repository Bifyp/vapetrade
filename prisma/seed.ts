// prisma/seed.ts
import { PrismaClient, Category, Condition, PriceType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Тестовый пользователь
  const user = await prisma.user.upsert({
    where: { email: "test@vapetrade.pl" },
    update: {},
    create: {
      email: "test@vapetrade.pl",
      name: "Jan Kowalski",
      username: "jankowalski",
      passwordHash: await bcrypt.hash("password123", 12),
      city: "Warszawa",
    },
  });

  // Тестовый admin
  await prisma.user.upsert({
    where: { email: "admin@vapetrade.pl" },
    update: {},
    create: {
      email: "admin@vapetrade.pl",
      name: "Admin",
      username: "admin",
      passwordHash: await bcrypt.hash("admin123", 12),
      role: "ADMIN",
    },
  });

  // Тестовые объявления
  const ads = [
    {
      title: "Vaporesso XROS Pro — stan idealny",
      description:
        "Sprzedaję Vaporesso XROS Pro w idealnym stanie. Używany przez 2 tygodnie. Komplet z pudełkiem i wszystkimi akcesoriami. Powód sprzedaży: zmiana systemu.",
      price: 150,
      category: Category.PODY,
      condition: Condition.JAK_NOWY,
      priceType: PriceType.FIXED,
      region: "Mazowieckie",
      city: "Warszawa",
      slug: "vaporesso-xros-pro-stan-idealny",
    },
    {
      title: "Lost Vape Centaurus Q200 MOD",
      description:
        "Lost Vape Centaurus Q200 w bardzo dobrym stanie. Kilka drobnych śladów użytkowania. Działa bez zarzutu. Do negocjacji.",
      price: 220,
      category: Category.ZASILANIA,
      condition: Condition.DOBRY,
      priceType: PriceType.NEGOTIABLE,
      region: "Śląskie",
      city: "Katowice",
      slug: "lost-vape-centaurus-q200-mod",
    },
    {
      title: "Kayfun Lite Plus 2021 — atomizer klasy premium",
      description:
        "Kayfun Lite Plus 2021 wykonany ze stali nierdzewnej. Stan bardzo dobry, regularnie czyszczony. Sprzedaję ze względu na zmianę upodobań.",
      price: 180,
      category: Category.ATOMIZERY,
      condition: Condition.DOBRY,
      priceType: PriceType.NEGOTIABLE,
      region: "Małopolskie",
      city: "Kraków",
      slug: "kayfun-lite-plus-2021-atomizer",
    },
  ];

  for (const ad of ads) {
    await prisma.ad.upsert({
      where: { slug: ad.slug },
      update: {},
      create: {
        ...ad,
        price: ad.price,
        userId: user.id,
      },
    });
  }

  console.log("✅ Seed complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());