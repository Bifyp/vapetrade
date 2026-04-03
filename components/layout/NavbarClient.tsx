"use client";
// components/layout/NavbarClient.tsx
// Клиентский компонент — только поиск и мобильное меню
// Весь остальной Navbar — Server Component

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

interface NavbarClientProps {
  user: { id: string; name?: string | null } | null;
}

export function NavbarClient({ user }: NavbarClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Debounce — поиск срабатывает через 400ms после последнего символа
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (query.trim()) {
        startTransition(() => {
          router.push(`/ads?q=${encodeURIComponent(query.trim())}`);
        });
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearTimeout(debounceRef.current);
    if (query.trim()) {
      startTransition(() => {
        router.push(`/ads?q=${encodeURIComponent(query.trim())}`);
      });
    }
  }

  function handleClear() {
    setQuery("");
    router.push("/ads");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 max-w-xl"
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Szukaj ogłoszeń..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-8 text-sm outline-none transition-all focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
        />
        {/* Индикатор загрузки / кнопка очистки */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {isPending && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          </div>
        )}
      </div>
    </form>
  );
}