// app/ads/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatPrice, timeAgo, CATEGORY_LABELS, CONDITION_LABELS } from "@/lib/utils";
import { AdGallery } from "@/components/ads/AdGallery";
import { ContactButton } from "@/components/ads/ContactButton";
import { MapPin, Clock, Tag, Eye } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getAd(slug: string) {
  // Инкремент просмотров + получение данных — атомарно
  const ad = await prisma.ad.findFirst({
    where: { slug, status: "ACTIVE" },
    include: {
      images: { orderBy: { order: "asc" } },
      user: {
        select: { id: true, name: true, image: true, city: true, createdAt: true },
      },
      _count: { select: { favorites: true } },
    },
  });

  if (ad) {
    // Инкремент просмотров без ожидания
    prisma.ad.update({ where: { id: ad.id }, data: { views: { increment: 1 } } }).catch(() => {});
  }

  return ad;
}

// Динамические метаданные для SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ad = await prisma.ad.findFirst({
    where: { slug, status: "ACTIVE" },
    select: { title: true, description: true, images: { take: 1, select: { url: true } } },
  });

  if (!ad) return { title: "Ogłoszenie nie znalezione" };

  return {
    title: ad.title,
    description: ad.description?.slice(0, 160),
    openGraph: {
      title: ad.title,
      description: ad.description?.slice(0, 160) ?? "",
      images: ad.images[0] ? [{ url: ad.images[0].url, width: 1200, height: 900 }] : [],
    },
  };
}

export default async function AdDetailPage({ params }: Props) {
  const { slug } = await params;
  const [ad, session] = await Promise.all([getAd(slug), auth()]);

  if (!ad) return notFound();

  const isOwner = session?.user?.id === ad.user.id;

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand-500">Strona główna</Link>
        <span>/</span>
        <Link href="/ads" className="hover:text-brand-500">Ogłoszenia</Link>
        <span>/</span>
        <Link href={`/ads?category=${ad.category}`} className="hover:text-brand-500">
          {CATEGORY_LABELS[ad.category]}
        </Link>
        <span>/</span>
        <span className="text-gray-800 truncate max-w-[200px]">{ad.title}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Левая колонка — галерея + описание */}
        <div className="lg:col-span-2 space-y-6">
          {/* Галерея */}
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <AdGallery images={ad.images} title={ad.title} />
          </div>

          {/* Заголовок и мета */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{ad.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" />
                {CATEGORY_LABELS[ad.category]}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {timeAgo(ad.createdAt)}
              </span>
              {ad.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {[ad.city, ad.region].filter(Boolean).join(", ")}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {ad.views} wyświetleń
              </span>
            </div>
          </div>

          {/* Описание */}
          <div className="rounded-xl border border-gray-100 p-5">
            <h2 className="mb-3 font-semibold text-gray-900">Opis</h2>
            <p className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
              {ad.description}
            </p>
          </div>
        </div>

        {/* Правая колонка — цена, продавец, действия */}
        <div className="space-y-4">
          {/* Цена */}
          <div className="rounded-xl border border-gray-100 p-5">
            <p className="text-3xl font-bold text-brand-600">
              {formatPrice(Number(ad.price), ad.priceType)}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                {CONDITION_LABELS[ad.condition]}
              </span>
            </div>

            {/* Кнопки действий */}
            <div className="mt-4 space-y-2">
              {isOwner ? (
                <>
                  <Link
                    href={`/ads/${ad.slug}/edit`}
                    className="flex w-full items-center justify-center rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Edytuj ogłoszenie
                  </Link>
                </>
              ) : (
                <ContactButton
                  adId={ad.id}
                  sellerId={ad.user.id}
                  sellerName={ad.user.name ?? "Sprzedający"}
                />
              )}
            </div>
          </div>

          {/* Продавец */}
          <div className="rounded-xl border border-gray-100 p-5">
            <h2 className="mb-3 font-semibold text-gray-900">Sprzedający</h2>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600">
                {ad.user.name?.charAt(0).toUpperCase() ?? "U"}
              </div>
              <div>
                <p className="font-medium text-gray-900">{ad.user.name}</p>
                <p className="text-xs text-gray-500">
                  {ad.user.city && `${ad.user.city} · `}
                  Na VapeTrade od {new Date(ad.user.createdAt).getFullYear()}
                </p>
              </div>
            </div>
          </div>

          {/* Bezpieczeństwo */}
          <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-xs text-amber-800">
            <p className="font-semibold mb-1">⚠️ Bezpieczeństwo transakcji</p>
            <p>Zgodnie z prawem, serwis nie przyjmuje ogłoszeń dotyczących sprzedaży e-papierosów na odległość. Umawiaj się na spotkania lokalne.</p>
          </div>
        </div>
      </div>
    </div>
  );
}