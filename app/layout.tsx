import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { getPageMetadata } from "@/lib/metadata";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./icon-fonts.css";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...await getPageMetadata('/'),
    metadataBase: new URL(SITE_URL),
    // Pre-launch only; review together with X-Robots-Tag before SEO-L.
    robots: { index: false, follow: true },
    keywords: ["церква", "євангельська церква", "Борислав", "Нове Життя", "богослужіння"],
  };
}

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
