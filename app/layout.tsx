import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Церква «Нове Життя» | Євангельська церква в Бориславі",
  description: "Ласкаво просимо до церкви «Нове Життя»! Ми — спільнота віруючих людей, які прагнуть жити за Божим Словом та ділитися любов'ю Христа.",
  keywords: ["церква", "євангельська церква", "Борислав", "Нове Життя", "богослужіння"],
  openGraph: {
    title: "Церква «Нове Життя»",
    description: "Євангельська церква в Бориславі",
    url: SITE_URL,
    siteName: "Церква «Нове Життя»",
    locale: "uk_UA",
    type: "website",
    images: [
      {
        url: "/images/hero-church-1.jpg",
        width: 1920,
        height: 1080,
        alt: "Церква «Нове Життя», Борислав",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Церква «Нове Життя»",
    description: "Євангельська церква в Бориславі",
    images: ["/images/hero-church-1.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <head>
        <link rel="preload" href="/fonts/roboto-normal-400-700-cyrillic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/roboto-normal-400-700-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
