// app/ads/new/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NewAdForm } from "@/components/ads/NewAdForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dodaj ogłoszenie" };

export default async function NewAdPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/ads/new");

  return (
    <div className="container mx-auto max-w-2xl py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Dodaj nowe ogłoszenie</h1>
      <NewAdForm />
    </div>
  );
}