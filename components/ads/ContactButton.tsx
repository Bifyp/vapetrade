"use client";
// components/ads/ContactButton.tsx
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MessageCircle } from "lucide-react";
import { startConversationAction } from "@/lib/actions/chat";

interface Props {
  adId: string;
  sellerId: string;
  sellerName: string;
}

export function ContactButton({ adId, sellerId, sellerName }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (!session) {
      router.push("/auth/login");
      return;
    }

    startTransition(async () => {
      const result = await startConversationAction(adId, sellerId);
      if (result.success) {
        router.push(`/chat/${result.data.conversationId}`);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
      >
        <MessageCircle className="h-4 w-4" />
        {isPending ? "Otwieranie czatu..." : `Napisz do ${sellerName}`}
      </button>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}