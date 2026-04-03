"use client";
// components/ads/NewAdForm.tsx
import { useRef, useState, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { createAdAction } from "@/lib/actions/ads";
import { CATEGORY_LABELS, CONDITION_LABELS, REGIONS } from "@/lib/utils";
import { Category, Condition, PriceType } from "@prisma/client";
import { Upload, X, Loader2 } from "lucide-react";

export function NewAdForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [previews, setPreviews] = useState<string[]>([]);
  const [priceType, setPriceType] = useState<PriceType>("FIXED");

  function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const urls = files.slice(0, 8).map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  }

  function removePreview(index: number) {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const form = formRef.current!;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await createAdAction(formData);
      if (!result?.success) {
        setError(result?.error ?? "Wystąpił błąd");
        setFieldErrors(result?.fieldErrors ?? {});
      }
      // При успехе — redirect в Server Action
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      {/* Ошибка */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Tytuł */}
      <Input
        name="title"
        label="Tytuł ogłoszenia"
        placeholder="np. Vaporesso XROS Pro — stan idealny"
        required
        error={fieldErrors.title?.[0]}
      />

      {/* Kategoria + Kondycja */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Kategoria <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            required
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          >
            <option value="">Wybierz...</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          {fieldErrors.category && <p className="text-xs text-red-500">{fieldErrors.category[0]}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Stan <span className="text-red-500">*</span>
          </label>
          <select
            name="condition"
            required
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          >
            <option value="">Wybierz...</option>
            {Object.entries(CONDITION_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          {fieldErrors.condition && <p className="text-xs text-red-500">{fieldErrors.condition[0]}</p>}
        </div>
      </div>

      {/* Cena */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">
          Cena <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              name="price"
              type="number"
              placeholder="0"
              min="0"
              step="0.01"
              disabled={priceType === "FREE"}
              error={fieldErrors.price?.[0]}
            />
          </div>
          <select
            name="priceType"
            value={priceType}
            onChange={(e) => setPriceType(e.target.value as PriceType)}
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-brand-400"
          >
            <option value="FIXED">Stała cena</option>
            <option value="NEGOTIABLE">Do negocjacji</option>
            <option value="FREE">Za darmo</option>
          </select>
        </div>
      </div>

      {/* Opis */}
      <Textarea
        name="description"
        label="Opis"
        placeholder="Opisz szczegółowo stan sprzętu, czas użytkowania, ewentualne usterki..."
        rows={5}
        required
        error={fieldErrors.description?.[0]}
      />

      {/* Lokalizacja */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Województwo</label>
          <select
            name="region"
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          >
            <option value="">Wybierz...</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <Input name="city" label="Miasto" placeholder="np. Warszawa" />
      </div>

      {/* Zdjęcia */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">
          Zdjęcia (max. 8)
        </label>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-6 transition hover:border-brand-400 hover:bg-brand-50">
          <Upload className="h-6 w-6 text-gray-400" />
          <span className="text-sm text-gray-500">Kliknij aby dodać zdjęcia</span>
          <input
            name="images"
            type="file"
            multiple
            accept="image/*"
            className="sr-only"
            onChange={handleImages}
          />
        </label>

        {/* Превью */}
        {previews.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {previews.map((url, i) => (
              <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePreview(i)}
                  className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {isPending ? "Dodawanie..." : "Dodaj ogłoszenie"}
      </button>
    </form>
  );
}