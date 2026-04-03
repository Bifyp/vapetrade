import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Mój profil</h1>
      <p className="text-gray-600 mb-4">Tutaj wyświetlą się Twoje dane oraz statystyki sprzedawcy.</p>
      <div className="rounded-lg border border-gray-200 p-4">
        <p>Imię: Jan Kowalski</p>
        <p>Email: przyklad@example.com</p>
        <p>Dodane ogłoszenia: 0</p>
      </div>
      <Link href="/" className="mt-4 inline-block rounded-lg  bg-brand-500 px-4 py-2 text-white">Wróć do strony głównej</Link>
    </div>
  );
}
