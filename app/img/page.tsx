import Image from "next/image";
import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/utils";
import { Category } from "@prisma/client";

const categories: Category[] = [
  "ZESTAWY",
  "ATOMIZERY",
  "ZASILANIA",
  "PODY",
  "GRZALKI",
  "AKCESORIA",
  "POZOSTALE",
];

export default function ImgFiltersPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">Filtry obrazów VapeTrade</h1>
      <p className="text-gray-600 mb-6">Wybierz kategorię, aby zobaczyć stronę filtrów dla każdej sekcji. Strony są czyste i koncentrują się na ikonie/kategorii.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c}
            href={`/img/${c.toLowerCase()}`}
            className="rounded-xl border border-gray-200 p-5 text-center transition hover:border-brand-400 hover:bg-brand-50"
          >
            <div className="mx-auto mb-3 h-16 w-16 overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-brand-100 to-brand-300">
              <Image
                src={`/img/${c.toLowerCase()}.png`}
                alt={`${CATEGORY_LABELS[c]} logo`}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mb-3 text-xs uppercase tracking-wide text-gray-500">Logo</div>
            <h2 className="text-lg font-semibold">{CATEGORY_LABELS[c]}</h2>
            <p className="text-xs text-gray-500 mt-1">Filtr /img/{c.toLowerCase()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
