import ChurchHeader from "@/components/ChurchHeader";
import ChurchFooter from "@/components/ChurchFooter";
import { getSiteSettings } from "@/lib/site-settings";

export default async function FrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch the church settings once here (server) and pass down — ChurchHeader is
  // a client component and cannot fetch, ChurchFooter avoids a second round-trip.
  const settings = await getSiteSettings();

  return (
    <>
      {/* Skip-link — first focusable element, lets keyboard users jump past the header */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[2000] focus:bg-white focus:text-gray-800 focus:px-4 focus:py-2 focus:rounded focus:shadow-lg"
      >
        Перейти до вмісту
      </a>
      <ChurchHeader settings={settings} />
      {/* Top bar (44px) + header: logo (56px) / desktop nav (96px) + vertical padding (24px). */}
      <main id="main-content" tabIndex={-1} className="pt-[124px] lg:pt-[164px]">
        {children}
      </main>
      <ChurchFooter settings={settings} />
    </>
  );
}
