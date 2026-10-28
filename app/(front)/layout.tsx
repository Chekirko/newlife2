import ChurchHeader from "@/components/ChurchHeader";
import ChurchFooter from "@/components/ChurchFooter";
import { getSiteSettings } from "@/lib/site-settings";
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { getPageMetadata, HOME_TITLE, SITE_TITLE } from '@/lib/metadata';
import { siteGraph } from '@/lib/structured-data';
import { jsonLdHtml } from '@/lib/utils';
import { bodyFont, headingFont, accentFont } from '../site-fonts';
import '../globals.css';

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...await getPageMetadata('/'),
    metadataBase: new URL(SITE_URL),
    title: { default: HOME_TITLE, template: `%s | ${SITE_TITLE}` },
  };
}

export default async function FrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <html lang="uk" className={`${bodyFont.variable} ${headingFont.variable} ${accentFont.variable}`}>
    <body className="antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(siteGraph(settings)) }} />
      {/* Skip-link — first focusable element, lets keyboard users jump past the header */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[2000] focus:bg-white focus:text-gray-800 focus:px-4 focus:py-2 focus:rounded focus:shadow-lg"
      >
        Перейти до вмісту
      </a>
      <ChurchHeader settings={settings} />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <ChurchFooter settings={settings} />
    </body>
    </html>
  );
}
