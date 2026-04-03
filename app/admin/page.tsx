import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Panel administracyjny</h1>
      <p className="text-gray-600 mb-6">Dostęp tylko dla użytkowników z rolą ADMIN.</p>
      <div className="rounded-xl border border-gray-200 p-4 space-y-2">
        <div className="rounded-lg bg-gray-50 p-3">– Zarządzanie ogłoszeniami</div>
        <div className="rounded-lg bg-gray-50 p-3">– Użytkownicy i role</div>
        <div className="rounded-lg bg-gray-50 p-3">– Raporty i statystyki</div>
      </div>
      <Link href="/" className="mt-4 inline-block rounded-lg bg-brand-500 px-4 py-2 text-white">Wróć na główną</Link>
    </div>
  );
}
