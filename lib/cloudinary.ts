// lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

/**
 * Загружает изображение из base64 или URL в Cloudinary
 * Применяет трансформации: ресайз, webp, оптимизация качества
 */
export async function uploadAdImage(
  source: string, // base64 data URL или внешний URL
  adSlug: string
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(source, {
    folder: `vapetrade/ads/${adSlug}`,
    transformation: [
      { width: 1200, height: 900, crop: "limit" }, // максимум 1200x900
      { quality: "auto:good" },                     // авто-качество
      { fetch_format: "auto" },                     // webp/avif где поддерживается
    ],
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  };
}

/**
 * Удаляет изображение из Cloudinary по public_id
 */
export async function deleteAdImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

/**
 * Получает оптимизированный URL с трансформациями
 * Используется для генерации thumbnail
 */
export function getOptimizedUrl(
  publicId: string,
  options: { width?: number; height?: number; crop?: string } = {}
): string {
  const { width = 400, height = 300, crop = "fill" } = options;
  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality: "auto",
    fetch_format: "auto",
    secure: true,
  });
}
