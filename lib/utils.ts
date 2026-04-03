// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";
import { Category, Condition, PriceType } from "@prisma/client";

// shadcn/ui стандартная утилита
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Генерация уникального slug из заголовка объявления
export function generateAdSlug(title: string, id?: string): string {
  const base = slugify(title, {
    lower: true,
    strict: true,
    locale: "pl",
  });
  // Добавляем короткий случайный суффикс для уникальности
  const suffix = id
    ? id.slice(-6)
    : Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}

// Форматирование цены в польских злотых
export function formatPrice(
  price: number | string | { toString(): string; toNumber?: () => number },
  priceType: PriceType
): string {
  if (priceType === PriceType.FREE) return "Za darmo";

  let num: number;
  if (typeof price === "number") {
    num = price;
  } else if (typeof price === "string") {
    num = parseFloat(price);
  } else if (typeof price === "object" && price !== null && typeof price.toNumber === "function") {
    num = price.toNumber();
  } else {
    num = parseFloat(price.toString());
  }

  const formatted = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);

  if (priceType === PriceType.NEGOTIABLE) {
    return `${formatted} (do negocjacji)`;
  }

  return formatted;
}

// Относительное время на польском
export function timeAgo(date: Date | string): string {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: pl,
  });
}

// Метки категорий на польском
export const CATEGORY_LABELS: Record<Category, string> = {
  ZESTAWY: "Zestawy",
  ATOMIZERY: "Atomizery",
  ZASILANIA: "Zasilania",
  PODY: "PODy",
  GRZALKI: "Grzałki",
  AKCESORIA: "Akcesoria",
  POZOSTALE: "Pozostałe",
};

// Иконки категорий (emoji как placeholder, заменить на SVG иконки)
export const CATEGORY_ICONS: Record<Category, string> = {
  ZESTAWY: "🎁",
  ATOMIZERY: "💨",
  ZASILANIA: "🔋",
  PODY: "📦",
  GRZALKI: "🔥",
  AKCESORIA: "🔧",
  POZOSTALE: "📋",
};

// Метки состояния
export const CONDITION_LABELS: Record<Condition, string> = {
  NOWY: "Nowy",
  JAK_NOWY: "Jak nowy",
  DOBRY: "Dobry",
  UZYWANY: "Używany",
  DO_NAPRAWY: "Do naprawy",
};

// Цвета состояния (для Badge компонента)
export const CONDITION_COLORS: Record<
  Condition,
  "default" | "secondary" | "success" | "warning" | "destructive"
> = {
  NOWY: "success",
  JAK_NOWY: "success",
  DOBRY: "default",
  UZYWANY: "secondary",
  DO_NAPRAWY: "warning",
};

// Метки регионов Польши
export const REGIONS = [
  "Dolnośląskie",
  "Kujawsko-Pomorskie",
  "Lubelskie",
  "Lubuskie",
  "Łódzkie",
  "Małopolskie",
  "Mazowieckie",
  "Opolskie",
  "Podkarpackie",
  "Podlaskie",
  "Pomorskie",
  "Śląskie",
  "Świętokrzyskie",
  "Warmińsko-Mazurskie",
  "Wielkopolskie",
  "Zachodniopomorskie",
] as const;

export type Region = (typeof REGIONS)[number];

// Усечение текста
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}
