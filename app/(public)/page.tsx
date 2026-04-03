// app/(public)/page.tsx
// Server Component  главная страница с новыми улучшениями

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdCard } from "@/components/ads/AdCard";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/utils";
import { Category } from "@prisma/client";
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VapeTrade 2.0  Największa platforma vape w Polsce",
  description:
    "Nowa, ulepszona giełda VapeTrade  jeszcze szybsze wyszukiwanie i bezpieczne transakcje.",
};

async function getLatestAds() {
  return prisma.ad.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: 12,
    select: {
      id: true,
      slug: true,
      title: true,
      price: true,
      priceType: true,
      category: true,
      condition: true,
      status: true,
      createdAt: true,
      city: true,
      region: true,
      images: {
        orderBy: { order: "asc" },
        take: 1,
        select: { url: true, publicId: true },
      },
    },
  });
}

async function getCategoryCounts() {
  const counts = await prisma.ad.groupBy({
    by: ["category"],
    where: { status: "ACTIVE" },
    _count: { id: true },
  });
  return Object.fromEntries(counts.map((c) => [c.category, c._count.id]));
}

export default async function HomePage() {
  const [ads, categoryCounts] = await Promise.all([
    getLatestAds(),
    getCategoryCounts(),
  ]);

  const featuredCategories = [
    "ZESTAWY",
    "ATOMIZERY",
    "ZASILANIA",
    "PODY",
    "GRZALKI",
  ] as Category[];

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-500 to-brand-700 text-white">
        <div className="container mx-auto py-16 px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            VapeTrade.pl  teraz szybciej i bezpieczniej
          </h1>
          <p className="mx-auto max-w-3xl text-lg sm:text-xl text-brand-100 mb-8">
            Znajdź używane atomizery, zasilania, PODY i akcesoria z dostawą lokalną, opiniami sprzedawców i gwarancją bezpieczeństwa.
          </p>
          <div className="grid gap-4 px-5 sm:grid-cols-3 md:px-0">
            <Link
              href="/ads/new"
              className="rounded-xl bg-white/20 py-3 px-4 text-sm font-semibold transition hover:bg-white/30"
            >
              Dodaj ogłoszenie za darmo
            </Link>
            <Link
              href="/ads"
              className="rounded-xl bg-white/20 py-3 px-4 text-sm font-semibold transition hover:bg-white/30"
            >
              Przeglądaj wszystkie ogłoszenia
            </Link>
            <Link
              href="/ads?sort=price_desc"
              className="rounded-xl bg-white/20 py-3 px-4 text-sm font-semibold transition hover:bg-white/30"
            >
              Najdroższe oferty
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { icon: <Zap className="h-5 w-5" />, title: "Szybko", desc: "Filtruj w sekundach" },
              { icon: <Shield className="h-5 w-5" />, title: "Bezpiecznie", desc: "Weryfikowani sprzedający" },
              { icon: <TrendingUp className="h-5 w-5" />, title: "Pełna kontrola", desc: "Oceny i historię transakcji" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl bg-white/10 p-4">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                  {item.icon}
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-white/80">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto py-10 px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Popularne kategorie</h2>
          <Link href="/ads" className="text-brand-600 hover:underline">
            Zobacz wszystkie
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-3">
          {featuredCategories.map((category) => (
            <Link
              key={category}
              href={`/ads?category=${category}`}
              className="rounded-xl border border-gray-200 p-3 text-center hover:border-brand-400 hover:bg-brand-50"
            >
              <div className="text-3xl">{CATEGORY_ICONS[category]}</div>
              <div className="mt-2 text-xs font-medium text-gray-700">{CATEGORY_LABELS[category]}</div>
              <div className="mt-1 text-[11px] text-gray-500">{categoryCounts[category] ?? 0} ogłoszeń</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto py-10 px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Najnowsze ogłoszenia</h2>
          <Link href="/ads" className="inline-flex items-center gap-1 text-brand-600 hover:underline">
            Zobacz wszystkie
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {ads.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">Brak ogłoszeń</p>
            <Link href="/ads/new" className="text-brand-500 hover:underline mt-2 block">
              Dodaj pierwsze ogłoszenie
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad as any} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-gray-100 py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-lg font-bold mb-2">Jak to działa?</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4">
              <h3 className="font-semibold">1. Znajdź</h3>
              <p className="text-sm text-gray-600">Przeglądaj kategorie lub użyj wyszukiwarki.</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <h3 className="font-semibold">2. Skontaktuj się</h3>
              <p className="text-sm text-gray-600">Wysyłaj wiadomości wewnętrzne lub dzwoń.</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <h3 className="font-semibold">3. Kupuj bezpiecznie</h3>
              <p className="text-sm text-gray-600">Spotkania lokalne, płatność przy odbiorze.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
