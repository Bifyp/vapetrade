import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CATEGORY_LABELS, formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";
import type { Category } from "@prisma/client";

const categorySlugToType: Record<string, Category> = {
  zestawy: "ZESTAWY",
  atomizery: "ATOMIZERY",
  zasilania: "ZASILANIA",
  pody: "PODY",
  grzalki: "GRZALKI",
  akcesoria: "AKCESORIA",
  pozostale: "POZOSTALE",
};

async function getAdsByCategory(category: Category) {
  return prisma.ad.findMany({
    where: { category, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      slug: true,
      title: true,
      price: true,
      priceType: true,
      city: true,
      region: true,
    },
  });
}

export default async function CategoryImagesPage({ params }: { params: { category: string } }) {
  const categoryParam = params.category.toLowerCase();
  const category = categorySlugToType[categoryParam];

  if (!category) {
    return notFound();
  }

  const ads = await getAdsByCategory(category);

  return (
    <div className="container mx-auto py-10 px-4">
      <Link href="/img" className="text-brand-600 hover:underline">← Powrót do filtrów</Link>
      <div className="mt-5 flex items-center gap-3">
        <div className="h-16 w-16 overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-brand-100 to-brand-300">
          <Image
            src={`/img/${category.toLowerCase()}.png`}
            alt={`${CATEGORY_LABELS[category]} logo`}
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-gray-500">Logo</div>
          <h1 className="text-3xl font-bold">{CATEGORY_LABELS[category]}</h1>
        </div>
      </div>
      <p className="mt-2 text-gray-600">Strona filtru obrazu dla kategorii, pokazuje ostatnie ogłoszenia.</p>

      <div className="mt-6 rounded-xl border border-gray-200 p-5 bg-gray-50">
        <div className="text-sm text-gray-700">Liczba ogłoszeń: {ads.length}</div>
        {ads.length === 0 ? (
          <p className="mt-3 text-gray-500">Brak aktywnych ogłoszeń w tej kategorii.</p>
        ) : (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {ads.map((ad) => (
              <li key={ad.id} className="rounded-lg border border-gray-200 bg-white p-3">
                <Link href={`/ads/${ad.slug}`} className="font-medium text-brand-600 hover:underline">
                  {ad.title}
                </Link>
                <p className="text-sm text-gray-500">{ad.city}, {ad.region}</p>
                <p className="text-sm text-gray-800">{formatPrice(ad.price, ad.priceType)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
