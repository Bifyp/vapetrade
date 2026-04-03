"use client";
// components/layout/NavbarAvatarMenu.tsx

import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  User,
  MessageCircle,
  Heart,
  PlusCircle,
  LogOut,
  Shield,
  ChevronDown,
} from "lucide-react";

interface Props {
  user: {
    id: string;
    name?: string | null;
    image?: string | null;
    role: string;
  };
}

export function NavbarAvatarMenu({ user }: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
          {/* Аватар */}
          <div className="relative h-6 w-6 overflow-hidden rounded-full bg-brand-100">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name ?? ""}
                fill
                className="object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs font-bold text-brand-600">
                {user.name?.charAt(0).toUpperCase() ?? "U"}
              </span>
            )}
          </div>
          <span className="hidden sm:inline max-w-[100px] truncate">
            {user.name ?? "Konto"}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-[180px] overflow-hidden rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg animate-fade-in"
        >
          {/* Заголовок */}
          <div className="px-2.5 py-2 border-b border-gray-100 mb-1">
            <p className="text-xs font-medium text-gray-900 truncate">
              {user.name}
            </p>
          </div>

          <DropdownMenu.Item asChild>
            <Link href="/profile" className="menu-item">
              <User className="h-4 w-4" />
              Mój profil
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Link href="/ads/new" className="menu-item">
              <PlusCircle className="h-4 w-4" />
              Dodaj ogłoszenie
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Link href="/chat" className="menu-item">
              <MessageCircle className="h-4 w-4" />
              Wiadomości
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Link href="/profile/favorites" className="menu-item">
              <Heart className="h-4 w-4" />
              Obserwowane
            </Link>
          </DropdownMenu.Item>

          {/* Только для ADMIN */}
          {user.role === "ADMIN" && (
            <>
              <DropdownMenu.Separator className="my-1 h-px bg-gray-100" />
              <DropdownMenu.Item asChild>
                <Link href="/admin" className="menu-item text-brand-600">
                  <Shield className="h-4 w-4" />
                  Panel admina
                </Link>
              </DropdownMenu.Item>
            </>
          )}

          <DropdownMenu.Separator className="my-1 h-px bg-gray-100" />

          <DropdownMenu.Item
            onSelect={() => signOut({ callbackUrl: "/" })}
            className="menu-item text-red-500 focus:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Wyloguj się
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}