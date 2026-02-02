import type { Metadata } from "next";
import { Poppins, Roboto, Playfair_Display } from "next/font/google";
import "./globals.css";
import ChurchHeader from "@/components/ChurchHeader";
import ChurchFooter from "@/components/ChurchFooter";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
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
      <head>
        {/* Font Awesome */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
      </head>
      <body
        className={`${roboto.variable} ${poppins.variable} ${playfair.variable} antialiased`}
      >
        <ChurchHeader />
        <main>
          {children}
        </main>
        <ChurchFooter />
      </body>
    </html>
  );
}
