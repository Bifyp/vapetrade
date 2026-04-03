// components/layout/Navbar.tsx
import Link from "next/link";
import { auth } from "@/lib/auth";
import { NavbarClient } from "./NavbarClient";
import { NavbarAvatarMenu } from "./NavbarAvatarMenu";
import { Button } from "@/components/ui/Button";
import { PlusCircle } from "lucide-react";

export async function Navbar() {
  const session = await auth();
  const user = session?.user ?? null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container flex h-16 items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
            <span className="text-sm font-bold text-white">VT</span>
          </div>
          <span className="hidden font-bold text-gray-900 sm:inline">
            VapeTrade<span className="text-brand-500">.pl</span>
          </span>
        </Link>

        {/* Поиск — клиентский компонент для debounce */}
        <NavbarClient user={user} />

        {/* Правая часть */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/ads/new">
            <Button
              size="sm"
              className="gap-1.5 hidden sm:flex bg-brand-500 hover:bg-brand-600 text-white"
            >
              <PlusCircle className="h-4 w-4" />
              Dodaj ogłoszenie
            </Button>
            <Button
              size="icon"
              className="sm:hidden bg-brand-500 hover:bg-brand-600 text-white"
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </Link>

          {user ? (
            <NavbarAvatarMenu user={user} />
          ) : (
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Zaloguj się
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}