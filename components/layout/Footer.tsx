// components/layout/Footer.tsx
import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/utils";
import { Category } from "@prisma/client";

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
                <span className="text-sm font-bold text-white">VT</span>
              </div>
              <span className="font-bold text-gray-900">
                VapeTrade<span className="text-brand-500">.pl</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Największa giełda używanego sprzętu vape w Polsce. Kupuj i sprzedaj bezpiecznie.
            </p>
          </div>

          {/* Kategorie */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Kategorie</h3>
            <ul className="space-y-2">
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <li key={key}>
                  <Link
                    href={`/ads?category=${key}`}
                    className="text-sm text-gray-500 hover:text-brand-500 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Serwis */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Serwis</h3>
            <ul className="space-y-2">
              {[
                { href: "/ads/new", label: "Dodaj ogłoszenie" },
                { href: "/ads", label: "Wszystkie ogłoszenia" },
                { href: "/auth/register", label: "Rejestracja" },
                { href: "/auth/login", label: "Logowanie" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-500 hover:text-brand-500 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informacje */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Informacje</h3>
            <ul className="space-y-2">
              {[
                { href: "/info/regulamin", label: "Regulamin" },
                { href: "/info/prywatnosc", label: "Polityka prywatności" },
                { href: "/kontakt", label: "Kontakt" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-500 hover:text-brand-500 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} VapeTrade.pl — Wszelkie prawa zastrzeżone
          </p>
          <p className="text-xs text-gray-400">
            Zgodnie z prawem, serwis nie przyjmuje ogłoszeń dotyczących sprzedaży na odległość e-papierosów.
          </p>
        </div>
      </div>
    </footer>
  );
}