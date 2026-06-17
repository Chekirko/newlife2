import type { Metadata } from "next";
import { Poppins, Roboto, Playfair_Display } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Церква «Нове Життя» | Євангельська церква в Бориславі",
  description: "Ласкаво просимо до церкви «Нове Життя»! Ми — спільнота віруючих людей, які прагнуть жити за Божим Словом та ділитися любов'ю Христа.",
  keywords: ["церква", "євангельська церква", "Борислав", "Нове Життя", "богослужіння"],
  openGraph: {
    title: "Церква «Нове Життя»",
    description: "Євангельська церква в Бориславі",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body
        className={`${roboto.variable} ${poppins.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
