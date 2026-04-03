// components/ads/AdCard.tsx
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import { FavoriteButton } from "./FavoriteButton";
import {
  formatPrice,
  timeAgo,
  CATEGORY_LABELS,
  CONDITION_LABELS,
  CONDITION_COLORS,
  truncate,
} from "@/lib/utils";
import type { AdCard as AdCardType } from "@/types";

interface AdCardProps {
  ad: AdCardType;
  priority?: boolean;
}

export function AdCard({ ad, priority = false }: AdCardProps) {
  const firstImage = ad.images?.[0];
  const location = [ad.city, ad.region].filter(Boolean).join(", ");

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      {/* Изображение */}
      <Link href={`/ads/${ad.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-gray-100">
        {firstImage ? (
          <Image
            src={firstImage.url}
            alt={ad.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl opacity-20">📷</div>
        )}

        {/* Кнопка избранного */}
        <div className="absolute right-2 top-2" onClick={(e) => e.preventDefault()}>
          <FavoriteButton adId={ad.id} isFavorited={ad.isFavorited ?? false} />
        </div>

        {/* Бейдж категории */}
        <div className="absolute left-2 bottom-2">
          <span className="rounded-md bg-black/60 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
            {CATEGORY_LABELS[ad.category]}
          </span>
        </div>
      </Link>

      {/* Контент */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-base font-bold text-gray-900">
            {formatPrice(Number(ad.price), ad.priceType)}
          </p>
          <span className={`shrink-0 mt-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${
            ad.condition === "NOWY" || ad.condition === "JAK_NOWY"
              ? "bg-green-100 text-green-700"
              : ad.condition === "DO_NAPRAWY"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-600"
          }`}>
            {CONDITION_LABELS[ad.condition]}
          </span>
        </div>

        <Link href={`/ads/${ad.slug}`}>
          <h2 className="text-sm font-medium text-gray-800 leading-snug hover:text-brand-500 transition-colors line-clamp-2">
            {ad.title}
          </h2>
        </Link>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          {location && (
            <span className="flex items-center gap-1 text-xs text-gray-400 truncate">
              <MapPin className="h-3 w-3 shrink-0" />
              {truncate(location, 25)}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-gray-400 shrink-0 ml-auto">
            <Clock className="h-3 w-3" />
            {timeAgo(ad.createdAt)}
          </span>
        </div>
      </div>
    </article>
  );
}