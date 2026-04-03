import Link from "next/link";

export default function NewAdPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Dodaj nowe ogłoszenie</h1>
      <p className="mb-4 text-gray-600">
        Formularz tworzenia ogłoszenia jest jeszcze w fazie rozwoju.
        Jeśli chcesz, mogę dodać pełny CRUD w kolejnym kroku.
      </p>
      <div className="rounded-xl border border-dashed border-gray-300 p-6 bg-gray-50">
        <p className="text-gray-500">Przykładowe pola:</p>
        <ul className="ml-4 list-disc text-gray-600">
          <li>Tytuł</li>
          <li>Opis</li>
          <li>Kategoria</li>
          <li>Cena</li>
          <li>Region</li>
          <li>Zdjęcia</li>
        </ul>
      </div>
      <Link href="/ads" className="mt-6 inline-block rounded-lg bg-brand-500 px-4 py-2 text-white">
        Wróć do ogłoszeń
      </Link>
    </div>
  );
}
