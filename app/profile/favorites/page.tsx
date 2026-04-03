import Link from "next/link";

export default function FavoritesPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Obserwowane ogłoszenia</h1>
      <p className="text-gray-600 mb-6">Twoja lista ulubionych ofert jest pusta. Dodaj pierwsze ogłoszenia.</p>
      <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
        Brak obserwowanych ofert
      </div>
      <Link href="/ads" className="mt-6 inline-block rounded-lg bg-brand-500 px-4 py-2 text-white">Przeglądaj ogłoszenia</Link>
    </div>
  );
}
