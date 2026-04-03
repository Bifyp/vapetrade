// app/profile/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AdCard } from "@/components/ads/AdCard";
import { deleteAdAction, markAsSoldAction } from "@/lib/actions/ads";
import { PlusCircle, Settings } from "lucide-react";
import type { Metadata } from "next";
import type { AdCard as AdCardType } from "@/types";

export const metadata: Metadata = { title: "Mój profil" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      city: true,
      createdAt: true,
      ads: {
        orderBy: { createdAt: "desc" },
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
          views: true,
          images: { take: 1, select: { url: true, publicId: true } },
        },
      },
      _count: { select: { ads: true, favorites: true } },
    },
  });

  if (!user) redirect("/auth/login");

  const activeAds = user.ads.filter((a) => a.status === "ACTIVE");
  const soldAds = user.ads.filter((a) => a.status === "SOLD");

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      {/* Header profilu */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-600">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
            {user.city && <p className="text-sm text-gray-500">{user.city}</p>}
            <p className="text-xs text-gray-400 mt-1">
              Na VapeTrade od {new Date(user.createdAt).toLocaleDateString("pl-PL", { year: "numeric", month: "long" })}
            </p>
          </div>
        </div>
        <Link
          href="/profile/settings"
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
        >
          <Settings className="h-4 w-4" />
          Ustawienia
        </Link>
      </div>

      {/* Statystyki */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {[
          { label: "Aktywne ogłoszenia", value: activeAds.length },
          { label: "Sprzedane", value: soldAds.length },
          { label: "Obserwowane", value: user._count.favorites },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-100 bg-white p-4 text-center">
            <p className="text-2xl font-bold text-brand-600">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Przycisk dodawania */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Moje ogłoszenia</h2>
        <Link
          href="/ads/new"
          className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white hover:bg-brand-600 transition"
        >
          <PlusCircle className="h-4 w-4" />
          Dodaj ogłoszenie
        </Link>
      </div>

      {user.ads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-500">Nie masz jeszcze żadnych ogłoszeń.</p>
          <Link href="/ads/new" className="mt-4 inline-block text-brand-500 hover:underline text-sm">
            Dodaj pierwsze ogłoszenie →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {user.ads.map((ad) => (
            <div key={ad.id} className="relative">
              <AdCard ad={{ ...ad, price: Number(ad.price) } as AdCardType} />

              {/* Akcje właściciela */}
              <div className="mt-1 flex gap-2 px-1">
                <Link
                  href={`/ads/${ad.slug}/edit`}
                  className="flex-1 rounded-lg border border-gray-200 py-1 text-center text-xs text-gray-600 hover:bg-gray-50 transition"
                >
                  Edytuj
                </Link>
                {ad.status === "ACTIVE" && (
                  <form action={markAsSoldAction.bind(null, ad.id)}>
                    <button
                      type="submit"
                      className="flex-1 rounded-lg border border-green-200 py-1 px-3 text-xs text-green-700 hover:bg-green-50 transition"
                    >
                      Sprzedane
                    </button>
                  </form>
                )}
                <form action={deleteAdAction.bind(null, ad.id)}>
                  <button
                    type="submit"
                    className="rounded-lg border border-red-200 py-1 px-3 text-xs text-red-600 hover:bg-red-50 transition"
                    onClick={(e) => {
                      if (!confirm("Na pewno usunąć to ogłoszenie?")) e.preventDefault();
                    }}
                  >
                    Usuń
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}