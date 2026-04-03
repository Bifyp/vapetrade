// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { auth } from "@/lib/auth";
import "@/app/globals.css";

const geistSans = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

// Базовые метаданные — переопределяются на каждой странице
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://vapetrade.pl"),
  title: {
    default: "VapeTrade.pl — Giełda e-papierosów używanych",
    template: "%s | VapeTrade.pl",
  },
  description:
    "Kup i sprzedaj używane e-papierosy, atomizery, zasilania, PODy i akcesoria. Największa giełda vape w Polsce.",
  keywords: [
    "e-papierosy używane",
    "vape trade",
    "atomizery",
    "zasilania",
    "pody",
    "grzałki",
    "ogłoszenia vape",
  ],
  authors: [{ name: "VapeTrade.pl" }],
  creator: "VapeTrade.pl",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://vapetrade.pl",
    siteName: "VapeTrade.pl",
    title: "VapeTrade.pl — Giełda e-papierosów używanych",
    description: "Kup i sprzedaj używane e-papierosy w Polsce",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VapeTrade.pl",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VapeTrade.pl",
    description: "Giełda e-papierosów używanych",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f97316",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Серверная сессия — передаём в SessionProvider для клиентских компонентов
  const session = await auth();

  return (
    <html lang="pl" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <SessionProvider session={session}>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
