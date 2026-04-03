"use client";
// components/ads/FavoriteButton.tsx
import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavoriteAction } from "@/lib/actions/ads";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  adId: string;
  isFavorited: boolean;
}

export function FavoriteButton({ adId, isFavorited: initial }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(initial);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!session) {
      router.push("/auth/login");
      return;
    }

    // Optimistic update
    setIsFavorited((prev) => !prev);

    startTransition(async () => {
      const result = await toggleFavoriteAction(adId);
      if (!result.success) {
        // Откатываем при ошибке
        setIsFavorited((prev) => !prev);
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label={isFavorited ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
      className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all ${
        isFavorited
          ? "bg-red-500 text-white"
          : "bg-white/80 text-gray-400 hover:text-red-500"
      } disabled:opacity-60`}
    >
      <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
    </button>
  );
}