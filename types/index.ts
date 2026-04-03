// types/index.ts
import type { Ad, User, AdImage, Category, Condition, AdStatus, PriceType } from "@prisma/client";

// ─── Ad types ──────────────────────────────────────────────────────────────

// Объявление с изображениями и автором (для карточки и детальной страницы)
export type AdWithDetails = Ad & {
  images: AdImage[];
  user: Pick<User, "id" | "name" | "image" | "createdAt" | "city">;
  _count?: {
    favorites: number;
  };
  isFavorited?: boolean; // добавляется на уровне запроса
};

// Лёгкий тип для карточки в листинге
export type AdCard = Pick<
  Ad,
  "id" | "slug" | "title" | "price" | "priceType" | "category" | "condition" | "status" | "createdAt" | "city" | "region"
> & {
  images: Pick<AdImage, "url" | "publicId">[];
  isFavorited?: boolean;
};

// Результат пагинации
export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

// ─── Server Action result ──────────────────────────────────────────────────

// Стандартный результат Server Action
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

// ─── Chat types ────────────────────────────────────────────────────────────

export type ConversationWithDetails = {
  id: string;
  adId: string | null;
  ad?: Pick<Ad, "id" | "slug" | "title"> & {
    images: Pick<AdImage, "url">[];
  };
  otherUser: Pick<User, "id" | "name" | "image">;
  lastMessage?: {
    content: string;
    createdAt: Date;
    senderId: string;
  };
  unreadCount: number;
};

export type MessageWithSender = {
  id: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
  sender: Pick<User, "id" | "name" | "image">;
};

// ─── Filter types ──────────────────────────────────────────────────────────

export type AdFilters = {
  category?: Category;
  condition?: Condition;
  priceMin?: number;
  priceMax?: number;
  region?: string;
  q?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "popular";
  page?: number;
  limit?: number;
};

// ─── Auth ──────────────────────────────────────────────────────────────────

export type UserRole = "USER" | "ADMIN";
