// lib/validations.ts
import { z } from "zod";
import { Category, Condition, PriceType } from "@prisma/client";

// ─── Auth ──────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Nieprawidłowy adres email"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Imię musi mieć co najmniej 2 znaki").max(50),
    email: z.string().email("Nieprawidłowy adres email"),
    password: z
      .string()
      .min(8, "Hasło musi mieć co najmniej 8 znaków")
      .regex(/[A-Z]/, "Hasło musi zawierać dużą literę")
      .regex(/[0-9]/, "Hasło musi zawierać cyfrę"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są zgodne",
    path: ["confirmPassword"],
  });

// ─── Ad ────────────────────────────────────────────────────────────────────

export const createAdSchema = z.object({
  title: z
    .string()
    .min(5, "Tytuł musi mieć co najmniej 5 znaków")
    .max(100, "Tytuł może mieć maksymalnie 100 znaków"),
  description: z
    .string()
    .min(20, "Opis musi mieć co najmniej 20 znaków")
    .max(3000, "Opis może mieć maksymalnie 3000 znaków"),
  price: z
    .number({ invalid_type_error: "Podaj prawidłową cenę" })
    .min(0, "Cena nie może być ujemna")
    .max(99999, "Zbyt wysoka cena"),
  priceType: z.nativeEnum(PriceType),
  category: z.nativeEnum(Category),
  condition: z.nativeEnum(Condition),
  region: z.string().optional(),
  city: z.string().max(100).optional(),
  // Изображения передаются отдельно через FormData
});

export const updateAdSchema = createAdSchema.partial();

export const filterAdsSchema = z.object({
  category: z.nativeEnum(Category).optional(),
  condition: z.nativeEnum(Condition).optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().max(99999).optional(),
  region: z.string().optional(),
  q: z.string().max(100).optional(),          // поиск
  sort: z.enum(["newest", "price_asc", "price_desc", "popular"]).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(48).default(24),
});

// ─── Chat ──────────────────────────────────────────────────────────────────

export const sendMessageSchema = z.object({
  conversationId: z.string().cuid(),
  content: z
    .string()
    .min(1, "Wiadomość nie może być pusta")
    .max(2000, "Wiadomość jest zbyt długa"),
});

// ─── Report ────────────────────────────────────────────────────────────────

export const reportSchema = z.object({
  adId: z.string().cuid().optional(),
  reportedUserId: z.string().cuid().optional(),
  reason: z.enum(["SPAM", "FAKE", "PROHIBITED", "WRONG_CATEGORY", "OTHER"]),
  details: z.string().max(500).optional(),
});

// ─── Profile ───────────────────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_]+$/, "Tylko małe litery, cyfry i podkreślenia")
    .optional(),
  bio: z.string().max(300).optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9\s-]{9,15}$/, "Nieprawidłowy numer telefonu")
    .optional()
    .or(z.literal("")),
  city: z.string().max(100).optional(),
  region: z.string().optional(),
});

// ─── Types ─────────────────────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateAdInput = z.infer<typeof createAdSchema>;
export type UpdateAdInput = z.infer<typeof updateAdSchema>;
export type FilterAdsInput = z.infer<typeof filterAdsSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
