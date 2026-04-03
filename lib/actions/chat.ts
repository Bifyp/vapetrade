"use server";
// lib/actions/chat.ts
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer, PUSHER_CHANNELS, PUSHER_EVENTS } from "@/lib/pusher";
import { sendMessageSchema } from "@/lib/validations";
import type { ActionResult } from "@/types";

// ─── Начать чат / найти существующий ──────────────────────────────────────

export async function startConversationAction(
  adId: string,
  sellerId: string
): Promise<ActionResult<{ conversationId: string }>> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Musisz być zalogowany" };

  if (session.user.id === sellerId) {
    return { success: false, error: "Nie możesz napisać do siebie" };
  }

  // Ищем существующий чат между этими двумя пользователями для этого объявления
  const existing = await prisma.conversation.findFirst({
    where: {
      adId,
      participants: {
        every: {
          userId: { in: [session.user.id, sellerId] },
        },
      },
    },
    select: { id: true },
  });

  if (existing) {
    return { success: true, data: { conversationId: existing.id } };
  }

  // Создаём новый чат
  const conversation = await prisma.conversation.create({
    data: {
      adId,
      participants: {
        create: [
          { userId: session.user.id },
          { userId: sellerId },
        ],
      },
    },
  });

  return { success: true, data: { conversationId: conversation.id } };
}

// ─── Отправить сообщение ───────────────────────────────────────────────────

export async function sendMessageAction(
  conversationId: string,
  content: string
): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Musisz być zalogowany" };

  // Валидация
  const parsed = sendMessageSchema.safeParse({ conversationId, content });
  if (!parsed.success) {
    return { success: false, error: "Nieprawidłowe dane" };
  }

  // Проверяем что пользователь — участник чата
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: { conversationId, userId: session.user.id },
    },
  });

  if (!participant) return { success: false, error: "Brak dostępu" };

  // Сохраняем сообщение
  const message = await prisma.message.create({
    data: {
      content,
      conversationId,
      senderId: session.user.id,
    },
    include: {
      sender: { select: { id: true, name: true, image: true } },
    },
  });

  // Обновляем unreadCount для других участников
  await prisma.conversationParticipant.updateMany({
    where: {
      conversationId,
      userId: { not: session.user.id },
    },
    data: { unreadCount: { increment: 1 } },
  });

  // Обновляем updatedAt чата
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  // Pusher — real-time уведомление
  await pusherServer.trigger(
    PUSHER_CHANNELS.conversation(conversationId),
    PUSHER_EVENTS.newMessage,
    {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      sender: message.sender,
    }
  );

  return { success: true, data: undefined };
}

// ─── Получить сообщения чата ───────────────────────────────────────────────

export async function getConversationMessages(conversationId: string) {
  const session = await auth();
  if (!session?.user) return null;

  // Проверяем доступ
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: { conversationId, userId: session.user.id },
    },
  });

  if (!participant) return null;

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { id: true, name: true, image: true } },
    },
  });

  // Сбрасываем счётчик непрочитанных
  await prisma.conversationParticipant.update({
    where: {
      conversationId_userId: { conversationId, userId: session.user.id },
    },
    data: { unreadCount: 0, lastReadAt: new Date() },
  });

  return messages;
}