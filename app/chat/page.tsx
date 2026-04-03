// app/chat/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { timeAgo, truncate } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Wiadomości" };

export default async function ChatPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: { some: { userId: session.user.id } },
    },
    orderBy: { updatedAt: "desc" },
    include: {
      ad: { select: { title: true, slug: true, images: { take: 1 } } },
      participants: {
        where: { userId: { not: session.user.id } },
        include: { user: { select: { id: true, name: true, image: true } } },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { content: true, createdAt: true, senderId: true },
      },
      _count: {
        select: {
          // Непрочитанные — через participant
        },
      },
    },
  });

  // Получаем unread count для текущего пользователя
  const unreadCounts = await prisma.conversationParticipant.findMany({
    where: { userId: session.user.id },
    select: { conversationId: true, unreadCount: true },
  });
  const unreadMap = Object.fromEntries(
    unreadCounts.map((p) => [p.conversationId, p.unreadCount])
  );

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Wiadomości</h1>

      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-16 text-center">
          <MessageCircle className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500">Brak wiadomości</p>
          <p className="text-sm text-gray-400 mt-1">
            Skontaktuj się ze sprzedawcą z poziomu ogłoszenia
          </p>
          <Link href="/ads" className="mt-4 text-sm text-brand-500 hover:underline">
            Przeglądaj ogłoszenia
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white overflow-hidden">
          {conversations.map((conv) => {
            const other = conv.participants[0]?.user;
            const lastMsg = conv.messages[0];
            const unread = unreadMap[conv.id] ?? 0;

            return (
              <Link
                key={conv.id}
                href={`/chat/${conv.id}`}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition"
              >
                {/* Аватар */}
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-brand-100">
                  {other?.image ? (
                    <Image src={other.image} alt={other.name ?? ""} fill className="object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-sm font-bold text-brand-600">
                      {other?.name?.charAt(0).toUpperCase() ?? "?"}
                    </span>
                  )}
                </div>

                {/* Контент */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-gray-900 truncate">
                      {other?.name ?? "Użytkownik"}
                    </p>
                    {lastMsg && (
                      <span className="text-xs text-gray-400 shrink-0">
                        {timeAgo(lastMsg.createdAt)}
                      </span>
                    )}
                  </div>
                  {conv.ad && (
                    <p className="text-xs text-brand-500 truncate">{conv.ad.title}</p>
                  )}
                  {lastMsg && (
                    <p className="text-sm text-gray-500 truncate">
                      {lastMsg.senderId === session.user.id ? "Ty: " : ""}
                      {truncate(lastMsg.content, 50)}
                    </p>
                  )}
                </div>

                {/* Счётчик непрочитанных */}
                {unread > 0 && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}