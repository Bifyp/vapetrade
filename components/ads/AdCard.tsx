import Link from "next/link";
import { formatPrice, timeAgo, CATEGORY_LABELS, CONDITION_LABELS } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { AdCard as AdCardType } from "@/types";

interface AdCardProps {
  ad: AdCardType;
}

export function AdCard({ ad }: AdCardProps) {
  const imageUrl = ad.images?.[0]?.url ?? "/placeholder.png";
  const location = [ad.city, ad.region].filter(Boolean).join(", ");

  return (
    <Link
      href={`/ads/${ad.slug}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative h-44 bg-gray-100">
        <img
          src={imageUrl}
          alt={ad.title}
          className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-2 top-2">
          <Badge variant={ad.status === "ACTIVE" ? "success" : "secondary"}>
            {ad.status.toLowerCase()}
          </Badge>
        </div>
      </div>
      <div className="p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <Badge variant="outline">{CATEGORY_LABELS[ad.category]}</Badge>
          <span className="text-xs text-gray-500">{timeAgo(ad.createdAt)}</span>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{ad.title}</h3>
        <p className="mt-1 text-sm text-gray-600">{location || "Polska"}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-bold text-brand-600">{formatPrice(ad.price, ad.priceType)}</span>
          <Badge variant={CONDITION_LABELS[ad.condition] ? "secondary" : "default"}>
            {CONDITION_LABELS[ad.condition] ?? ad.condition}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
