// app/auth/register/page.tsx
"use client";
import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { registerAction } from "@/lib/actions/auth";
import { Input } from "@/components/ui/Input";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    const formData = new FormData(formRef.current!);

    startTransition(async () => {
      const result = await registerAction(formData);
      if (!result?.success) {
        setError(result?.error ?? "Błąd rejestracji");
        setFieldErrors(result?.fieldErrors ?? {});
      }
    });
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Utwórz konto</h1>
          <p className="mt-1 text-sm text-gray-500">
            Masz już konto?{" "}
            <Link href="/auth/login" className="text-brand-500 hover:underline font-medium">
              Zaloguj się
            </Link>
          </p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Input
            name="name"
            label="Imię i nazwisko"
            placeholder="Jan Kowalski"
            required
            error={fieldErrors.name?.[0]}
          />
          <Input
            name="email"
            type="email"
            label="Email"
            placeholder="twoj@email.com"
            required
            error={fieldErrors.email?.[0]}
          />
          <Input
            name="password"
            type="password"
            label="Hasło"
            placeholder="Min. 8 znaków"
            required
            error={fieldErrors.password?.[0]}
            hint="Min. 8 znaków, duża litera i cyfra"
          />
          <Input
            name="confirmPassword"
            type="password"
            label="Powtórz hasło"
            placeholder="••••••••"
            required
            error={fieldErrors.confirmPassword?.[0]}
          />

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? "Tworzenie konta..." : "Zarejestruj się"}
          </button>

          <p className="text-center text-xs text-gray-400">
            Rejestrując się, akceptujesz{" "}
            <Link href="/info/regulamin" className="underline">regulamin</Link>{" "}
            i{" "}
            <Link href="/info/prywatnosc" className="underline">politykę prywatności</Link>.
          </p>
        </form>
      </div>
    </div>
  );
}