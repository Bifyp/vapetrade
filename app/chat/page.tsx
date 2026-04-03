import Link from "next/link";

export default function ChatPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Wiadomości</h1>
      <div className="rounded-xl border border-gray-200 p-6">
        <p className="text-gray-600">Tutaj pojawią się wiadomości od kupujących i sprzedających.</p>
      </div>
      <Link href="/" className="mt-4 inline-block rounded-lg bg-brand-500 px-4 py-2 text-white">Wróć do strony głównej</Link>
    </div>
  );
}
