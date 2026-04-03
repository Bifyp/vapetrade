"use client";
// components/ads/AdGallery.tsx
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: { url: string; publicId: string }[];
  title: string;
}

export function AdGallery({ images, title }: Props) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center bg-gray-100 text-5xl opacity-20">
        📷
      </div>
    );
  }

  const prev = () => setCurrent((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrent((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-2">
      {/* Главное изображение */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={images[current].url}
          alt={`${title} — zdjęcie ${current + 1}`}
          fill
          className="object-contain"
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition hover:bg-black/60"
              aria-label="Poprzednie zdjęcie"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition hover:bg-black/60"
              aria-label="Następne zdjęcie"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
              {current + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Превью */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto px-1 pb-1">
          {images.map((img, i) => (
            <button
              key={img.publicId}
              onClick={() => setCurrent(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === current ? "border-brand-500" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={`Miniatura ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}