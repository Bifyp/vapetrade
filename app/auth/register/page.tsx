import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Rejestracja</h1>
      <p className="text-gray-600 mb-6">Utwórz konto i zacznij sprzedawać lub kupować używany sprzęt vape.</p>
      <form className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Imię</span>
          <input type="text" className="mt-1 w-full rounded-lg border border-gray-300 p-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Email</span>
          <input type="email" className="mt-1 w-full rounded-lg border border-gray-300 p-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Hasło</span>
          <input type="password" className="mt-1 w-full rounded-lg border border-gray-300 p-2" />
        </label>
        <button type="submit" className="w-full rounded-lg bg-brand-500 py-2 text-white">Zarejestruj się</button>
      </form>
      <p className="mt-4 text-sm text-gray-600">Masz już konto? <Link href="/auth/login" className="text-brand-600 hover:underline">Zaloguj się</Link></p>
    </div>
  );
}
