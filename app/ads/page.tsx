import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdCard } from "@/components/ads/AdCard";
import { AdCard as AdCardType } from "@/types";
import { formatPrice } from "@/lib/utils";

interface SearchParams {
  q?: string;
  category?: string;
  sort?: "newest" | "price_asc" | "price_desc";
}

async function getAds(searchParams: SearchParams) {
  const where: any = { status: "ACTIVE" };

  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q, mode: "insensitive" } },
      { description: { contains: searchParams.q, mode: "insensitive" } },
      { city: { contains: searchParams.q, mode: "insensitive" } },
    ];
  }

  if (searchParams.category) {
    where.category = searchParams.category;
  }

  const orderBy: any = { createdAt: "desc" };
  if (searchParams.sort === "price_asc") orderBy.price = "asc";
  if (searchParams.sort === "price_desc") orderBy.price = "desc";

  return prisma.ad.findMany({
    where,
    orderBy,
    take: 24,
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

export default async function AdsPage({ searchParams }: { searchParams: SearchParams }) {
  const ads = await getAds(searchParams);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Ogłoszenia</h1>
        <div className="flex gap-2 text-sm">
          <Link href="/ads/new" className="rounded-lg bg-brand-500 px-3 py-2 text-white">Dodaj ogłoszenie</Link>
          <Link href="/" className="rounded-lg border border-gray-300 px-3 py-2">Powrót na główną</Link>
        </div>
      </div>

      {ads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
          Brak ogłoszeń spełniających kryteria. Spróbuj innych filtrów.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ads.map((ad: AdCardType) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      )}
    </div>
  );
}
