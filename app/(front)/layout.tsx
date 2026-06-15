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
      <ChurchHeader settings={settings} />
      {/* pt-[92px] = top bar (44px) + main nav (~48px) — pushes content below fixed header */}
      <main className="pt-[92px]">
        {children}
      </main>
      <ChurchFooter settings={settings} />
    </>
  );
}
