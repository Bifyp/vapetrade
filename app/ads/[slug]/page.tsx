import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, timeAgo, CATEGORY_LABELS, CONDITION_LABELS } from "@/lib/utils";
import { AdCard } from "@/components/ads/AdCard";
import type { AdWithDetails } from "@/types";

async function getAd(slug: string) {
  return prisma.ad.findFirst({
    where: { slug, status: "ACTIVE" },
    include: {
      images: { orderBy: { order: "asc" } },
      user: { select: { id: true, name: true, image: true, city: true } },
    },
  });
}

export default async function AdDetailPage({ params }: { params: { slug: string } }) {
  const ad = await getAd(params.slug);
  if (!ad) return notFound();

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/ads" className="text-brand-600 hover:underline mb-4 inline-block">← Powrót do listy</Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 p-4">
          <h1 className="text-2xl font-bold mb-2">{ad.title}</h1>
          <p className="text-sm text-gray-500 mb-4">{CATEGORY_LABELS[ad.category]} • {CONDITION_LABELS[ad.condition]} • {timeAgo(ad.createdAt)}</p>
          {ad.images.length > 0 ? (
            <img src={ad.images[0].url} alt={ad.title} className="h-72 w-full rounded-lg object-cover" />
          ) : (
            <div className="h-72 w-full rounded-lg bg-gray-100" />
          )}
          <div className="mt-4 text-sm text-gray-700">{ad.description ?? "Brak dodatkowego opisu"}</div>
        </div>

        <div className="rounded-xl border border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-2">Cena</h2>
          <p className="text-3xl font-bold text-brand-600">{formatPrice(ad.price, ad.priceType)}</p>
          <h2 className="mt-6 text-lg font-semibold mb-2">Sprzedawca</h2>
          <p className="text-sm text-gray-700">{ad.user?.name ?? "Użytkownik"}</p>
          <p className="text-sm text-gray-500">{ad.user?.city ?? "Polska"}</p>
        </div>
      </div>
    </div>
  );
}
