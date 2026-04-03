import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Logowanie</h1>
      <p className="text-gray-600 mb-6">Użyj konta, by dodać ogłoszenia i kontaktować się ze sprzedawcami.</p>
      <form className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Email</span>
          <input type="email" className="mt-1 w-full rounded-lg border border-gray-300 p-2" placeholder="twoj@email.com" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Hasło</span>
          <input type="password" className="mt-1 w-full rounded-lg border border-gray-300 p-2" />
        </label>
        <button type="submit" className="w-full rounded-lg bg-brand-500 py-2 text-white">Zaloguj</button>
      </form>
      <p className="mt-4 text-sm text-gray-600">Nie masz konta? <Link href="/auth/register" className="text-brand-600 hover:underline">Zarejestruj się</Link></p>
    </div>
  );
}
